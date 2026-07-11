export function computeGWA(subjects) {
  const totalUnits = subjects.reduce((sum, s) => sum + (Number(s.units) || 0), 0)
  if (totalUnits === 0) return 0
  const totalPoints = subjects.reduce(
    (sum, s) => sum + (Number(s.units) || 0) * (Number(s.grade) || 0),
    0
  )
  return totalPoints / totalUnits
}

export function computeCumulativeGWA(semesters) {
  const allSubjects = semesters.flatMap((sem) => sem.subjects)
  return computeGWA(allSubjects)
}

export function semesterRemark(gwa) {
  if (!gwa) return ''
  if (gwa >= 1.0 && gwa <= 1.5) return 'University Scholar'
  if (gwa > 1.5 && gwa <= 1.75) return 'College Scholar'
  if (gwa > 1.75 && gwa <= 2.0) return "Dean's Lister"
  return ''
}

export function latinHonor(gwa) {
  if (!gwa) return ''
  if (gwa >= 1.0 && gwa <= 1.2) return 'Summa Cum Laude'
  if (gwa > 1.2 && gwa <= 1.45) return 'Magna Cum Laude'
  if (gwa > 1.45 && gwa <= 1.75) return 'Cum Laude'
  return ''
}

// Lower GWA is better on the 1.0-5.0 Philippine scale.
export function gwaTone(gwa) {
  if (!gwa) return 'neutral'
  if (gwa <= 1.75) return 'excellent'
  if (gwa <= 2.5) return 'good'
  if (gwa <= 3.0) return 'okay'
  return 'poor'
}

export function emptySubject() {
  return { id: crypto.randomUUID(), name: '', units: '', grade: '' }
}

export function emptySemester(label = '') {
  return { id: crypto.randomUUID(), label, subjects: [emptySubject()] }
}
