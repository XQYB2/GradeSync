// Upscales and binarizes an image client-side to improve OCR accuracy on
// small/compressed table screenshots. Returns a canvas Tesseract can read directly.
export async function preprocessImage(file) {
  const img = await loadImage(file)

  const scale = img.width < 1200 ? 3 : img.width < 2000 ? 2 : 1
  const canvas = document.createElement('canvas')
  canvas.width = img.width * scale
  canvas.height = img.height * scale

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Grayscale + Otsu-ish fixed threshold binarization.
  const gray = new Uint8ClampedArray(data.length / 4)
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    gray[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
  }

  let sum = 0
  for (let i = 0; i < gray.length; i++) sum += gray[i]
  const mean = sum / gray.length
  const threshold = mean * 0.9

  const w = canvas.width
  const h = canvas.height
  const bw = new Uint8Array(w * h) // 1 = black (ink), 0 = white

  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    bw[j] = gray[j] > threshold ? 0 : 1
  }

  removeGridLines(bw, w, h)

  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    const v = bw[j] ? 0 : 255
    data[i] = data[i + 1] = data[i + 2] = v
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas
}

// Table borders are long straight runs of black pixels — much longer than
// any character stroke. Erase rows/columns that are mostly black across a
// wide span, which strips grid lines while leaving text intact.
function removeGridLines(bw, w, h) {
  const rowMinRun = w * 0.5
  for (let y = 0; y < h; y++) {
    let blackCount = 0
    for (let x = 0; x < w; x++) blackCount += bw[y * w + x]
    if (blackCount > rowMinRun) {
      for (let x = 0; x < w; x++) bw[y * w + x] = 0
    }
  }

  const colMinRun = h * 0.5
  for (let x = 0; x < w; x++) {
    let blackCount = 0
    for (let y = 0; y < h; y++) blackCount += bw[y * w + x]
    if (blackCount > colMinRun) {
      for (let y = 0; y < h; y++) bw[y * w + x] = 0
    }
  }
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
