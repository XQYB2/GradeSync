import { useRef, useState } from 'react'
import { createWorker, PSM } from 'tesseract.js'
import { parseGradeSheet, parseSemesterLabel } from '../lib/ocrParser'
import { preprocessImage } from '../lib/imagePreprocess'

function PhotoUpload({ onExtracted }) {
  const [status, setStatus] = useState('idle') // idle | reading | done | error
  const [stage, setStage] = useState('')
  const [progress, setProgress] = useState(0)
  const [rowCount, setRowCount] = useState(null)
  const fileInputRef = useRef(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setStatus('reading')
    setStage('preprocessing image')
    setProgress(0)

    let worker
    let timedOut = false
    const timeoutId = setTimeout(() => {
      timedOut = true
      setStatus('error')
      if (worker) worker.terminate()
    }, 60000)

    try {
      const canvas = await preprocessImage(file)

      worker = await createWorker('eng', undefined, {
        workerPath: '/tesseract/worker.min.js',
        corePath: '/tesseract/tesseract-core-simd-lstm.wasm.js',
        langPath: '/tesseract',
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setStage('recognizing text')
            setProgress(Math.round(m.progress * 100))
          } else {
            setStage(m.status)
          }
        },
      })
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
        tessedit_char_whitelist:
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,-',
      })

      const {
        data: { text },
      } = await worker.recognize(canvas)

      if (timedOut) return

      const rows = parseGradeSheet(text)
      const detectedLabel = parseSemesterLabel(text)
      setStatus('done')
      setRowCount(rows.length)
      onExtracted(rows, detectedLabel)
    } catch (err) {
      console.error(err)
      if (!timedOut) setStatus('error')
    } finally {
      clearTimeout(timeoutId)
      if (worker) await worker.terminate()
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="photo-upload">
      <label className="upload-btn">
        Upload photo of grades
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFile}
          hidden
        />
      </label>
      {status === 'reading' && (
        <p className="upload-status">
          {stage === 'recognizing text' ? `Reading image… ${progress}%` : `${stage}…`}
        </p>
      )}
      {status === 'done' && rowCount > 0 && (
        <p className="upload-status success">Extracted {rowCount} subject(s)! Review the rows below.</p>
      )}
      {status === 'done' && rowCount === 0 && (
        <p className="upload-status error">No subjects detected from the image text.</p>
      )}
      {status === 'error' && <p className="upload-status error">Couldn't read that image, try again or enter manually.</p>}
    </div>
  )
}

export default PhotoUpload
