function SubjectTable({ subjects, onChange, onRemove }) {
  return (
    <div className="subject-table-wrap">
      <table className="subject-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Units</th>
            <th>Grade</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((s) => (
            <tr key={s.id}>
              <td>
                <input
                  type="text"
                  value={s.name}
                  placeholder="Subject name"
                  onChange={(e) => onChange(s.id, 'name', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={s.units}
                  placeholder="Units"
                  onChange={(e) => onChange(s.id, 'units', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max="5"
                  value={s.grade}
                  placeholder="Grade"
                  onChange={(e) => onChange(s.id, 'grade', e.target.value)}
                />
              </td>
              <td>
                <button type="button" className="remove-btn" onClick={() => onRemove(s.id)}>
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SubjectTable
