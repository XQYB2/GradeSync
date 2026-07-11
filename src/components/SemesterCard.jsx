import SubjectTable from './SubjectTable'
import PhotoUpload from './PhotoUpload'
import { computeGWA, semesterRemark, gwaTone } from '../lib/gwa'

function SemesterCard({ semester, onUpdateLabel, onUpdateSubject, onRemoveSubject, onAddSubject, onExtracted, onRemoveSemester }) {
  const gwa = computeGWA(semester.subjects)
  const remark = semesterRemark(gwa)
  const tone = gwaTone(gwa)

  return (
    <section className="card semester-card">
      <div className="semester-header">
        <input
          type="text"
          className="semester-label"
          placeholder="Semester label (e.g. 1st Sem 2025-2026)"
          value={semester.label}
          onChange={(e) => onUpdateLabel(semester.id, e.target.value)}
        />
        <button type="button" className="remove-semester-btn" onClick={() => onRemoveSemester(semester.id)}>
          Remove semester
        </button>
      </div>

      <PhotoUpload onExtracted={(rows, text) => onExtracted(semester.id, rows, text)} />

      <SubjectTable
        subjects={semester.subjects}
        onChange={(subjectId, field, value) => onUpdateSubject(semester.id, subjectId, field, value)}
        onRemove={(subjectId) => onRemoveSubject(semester.id, subjectId)}
      />

      <button type="button" className="add-btn" onClick={() => onAddSubject(semester.id)}>
        + Add subject
      </button>

      <div className="semester-gwa">
        <span>Semester GWA</span>
        <div className="semester-gwa-value">
          <strong className={`tone-${tone}`}>{gwa ? gwa.toFixed(4) : '—'}</strong>
          {remark && <div className="remark-badge">{remark}</div>}
        </div>
      </div>
    </section>
  )
}

export default SemesterCard
