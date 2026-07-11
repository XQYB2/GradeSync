// Parses raw OCR text from a grade sheet into { name, units, grade } rows.
// Targets the common school-portal layout:
//   No.  SUBJECTS         UNITS  GRADE  REMARKS      STATUS
//   1    COMSCI 2200      3      1.50   PASSED       FINAL GRADE
//
// Strategy: the grade is always a decimal like 1.00-5.00 (or 1-5 with less
// OCR luck). The units value is the plain integer immediately before it.
// Everything before that units number (after stripping a leading row number)
// is the subject name.
const GRADE_RE = /\b[1-5](?:\.\d{1,2})?\b/
const ROW_NUM_RE = /^\d{1,3}[.)]?\s+/

export function parseGradeSheet(rawText) {
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 3)

  const results = []

  for (const line of lines) {
    if (/subjects?|remarks|status|grade\s+details|verification/i.test(line)) continue

    const withoutRowNum = line.replace(ROW_NUM_RE, '')

    const tokens = [...withoutRowNum.matchAll(/\d+(?:\.\d+)?/g)]
    if (tokens.length < 2) continue

    // OCR sometimes drops the decimal point on grades like "1.75" -> "175".
    // A bare 3-digit token starting with 1-5 in a plausible grade spot is
    // almost certainly that: reinterpret as X.XX.
    const normalizedValue = (t) =>
      /^[1-5]\d{2}$/.test(t[0]) ? t[0][0] + '.' + t[0].slice(1) : t[0]

    const gradeToken = tokens.find((t) => {
      const v = parseFloat(t[0])
      return v >= 1.0 && v <= 5.0 && t[0].includes('.')
    }) || tokens.find((t) => /^[1-5]\d{2}$/.test(t[0])) || tokens.find((t) => {
      const v = parseFloat(t[0])
      return v >= 1.0 && v <= 5.0
    })
    if (!gradeToken) continue

    const unitsToken = [...tokens]
      .reverse()
      .find((t) => t.index < gradeToken.index && parseFloat(t[0]) >= 0.5 && parseFloat(t[0]) <= 6)
    if (!unitsToken) continue

    let name = withoutRowNum.slice(0, unitsToken.index).trim()
    name = name.replace(/[|_\-]+/g, ' ').replace(/\s{2,}/g, ' ').trim()

    // Subject codes start with a run of 2+ letters (e.g. "COMSCI 2200").
    // Drop any stray single-character noise OCR picked up before that.
    const codeStart = name.search(/[A-Za-z]{2,}/)
    if (codeStart > 0) name = name.slice(codeStart).trim()

    // Subject codes end in digits (e.g. "COMSCI 2200", "PATHFIT 4"). Drop
    // a trailing single stray letter/character OCR tacked on after that.
    name = name.replace(/\d+\s+[A-Za-z]$/, (m) => m.split(/\s+/)[0])

    if (!name) continue
    if (/nstp/i.test(name)) continue

    results.push({
      id: crypto.randomUUID(),
      name,
      units: unitsToken[0],
      grade: normalizedValue(gradeToken),
    })
  }

  return results
}

// Looks for a header line like "2ND SEMESTER 2025-2026" or "1ST SEMESTER 2024-2025".
// OCR often garbles the second year (dropped/misread digits, stray letters),
// so only the start year is trusted — the end year is always start+1.
export function parseSemesterLabel(rawText) {
  const match = rawText.match(/\b(1ST|2ND|3RD|[1-3](?:ST|ND|RD))\s+SEMESTER\s+(\d{4})\s*-/i)
  if (!match) return null
  const ordinal = match[1].toUpperCase()
  const startYear = parseInt(match[2], 10)
  return `${ordinal} Semester ${startYear}-${startYear + 1}`
}
