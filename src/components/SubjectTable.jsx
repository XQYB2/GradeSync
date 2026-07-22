function SubjectTable({ subjects, onChange, onRemove }) {
  return (
    <div className="subject-grid">
      <div className="subject-grid-header">
        <span>Subject</span>
        <span>Units</span>
        <span>Grade</span>
        <span></span>
      </div>
      {subjects.map((s) => (
        <div className="subject-grid-row" key={s.id}>
          <input
            type="text"
            className="subject-name-input"
            value={s.name}
            placeholder="Subject name"
            onChange={(e) => onChange(s.id, 'name', e.target.value)}
          />
          <input
            type="number"
            className="subject-units-input"
            step="0.5"
            min="0"
            value={s.units}
            placeholder="Units"
            onChange={(e) => onChange(s.id, 'units', e.target.value)}
          />
          <input
            type="number"
            className="subject-grade-input"
            step="0.01"
            min="1"
            max="5"
            value={s.grade}
            placeholder="Grade"
            onChange={(e) => onChange(s.id, 'grade', e.target.value)}
          />
          <button type="button" className="remove-btn" onClick={() => onRemove(s.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export default SubjectTable
