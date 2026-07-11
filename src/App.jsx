import { useEffect, useRef, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import SemesterCard from './components/SemesterCard'
import ConfirmModal from './components/ConfirmModal'
import LoginPage from './pages/LoginPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import { computeCumulativeGWA, emptySemester, emptySubject, latinHonor, gwaTone } from './lib/gwa'
import { supabase } from './lib/supabaseClient'
import logo from './assets/logo.png'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CalculatorPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Routes>
  )
}

function CalculatorPage() {
  const navigate = useNavigate()
  const [semesters, setSemesters] = useState([emptySemester('1st Sem')])
  const [session, setSession] = useState(null)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const [semesterToRemove, setSemesterToRemove] = useState(null)
  const skipNextAutosave = useRef(false)
  const hasLoadedForSession = useRef(false)

  const cumulativeGwa = computeCumulativeGWA(semesters)
  const honor = latinHonor(cumulativeGwa)
  const tone = gwaTone(cumulativeGwa)
  const isEmptyState =
    semesters.length === 1 &&
    semesters[0].subjects.length === 1 &&
    !semesters[0].subjects[0].name &&
    !semesters[0].subjects[0].units &&
    !semesters[0].subjects[0].grade

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!supabase || !session) return
    hasLoadedForSession.current = false
    loadSavedRecord()
  }, [session])

  async function loadSavedRecord() {
    const { data, error } = await supabase
      .from('gwa_records')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle()
    if (!error && data) {
      skipNextAutosave.current = true
      setSemesters(data.semesters)
      setLastSavedAt(data.updated_at)
    }
    hasLoadedForSession.current = true
  }

  useEffect(() => {
    if (!supabase || !session) return
    if (!hasLoadedForSession.current) return
    if (skipNextAutosave.current) {
      skipNextAutosave.current = false
      return
    }
    const timer = setTimeout(() => saveRecord(), 1500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesters, session])

  async function handleLogout() {
    await supabase.auth.signOut()
    hasLoadedForSession.current = false
    setSemesters([emptySemester('1st Sem')])
    setLastSavedAt(null)
  }

  function updateSemesterLabel(semesterId, label) {
    setSemesters((prev) => prev.map((sem) => (sem.id === semesterId ? { ...sem, label } : sem)))
  }

  function updateSubject(semesterId, subjectId, field, value) {
    setSemesters((prev) =>
      prev.map((sem) =>
        sem.id !== semesterId
          ? sem
          : {
              ...sem,
              subjects: sem.subjects.map((s) => (s.id === subjectId ? { ...s, [field]: value } : s)),
            }
      )
    )
  }

  function removeSubject(semesterId, subjectId) {
    setSemesters((prev) =>
      prev.map((sem) =>
        sem.id !== semesterId ? sem : { ...sem, subjects: sem.subjects.filter((s) => s.id !== subjectId) }
      )
    )
  }

  function addSubject(semesterId) {
    setSemesters((prev) =>
      prev.map((sem) => (sem.id !== semesterId ? sem : { ...sem, subjects: [...sem.subjects, emptySubject()] }))
    )
  }

  function addSemester() {
    setSemesters((prev) => [...prev, emptySemester(`Sem ${prev.length + 1}`)])
  }

  function removeSemester(semesterId) {
    setSemesters((prev) => {
      const target = prev.find((sem) => sem.id === semesterId)
      setSemesterToRemove({ id: semesterId, label: target?.label || 'this semester' })
      return prev
    })
  }

  function confirmRemoveSemester() {
    if (!semesterToRemove) return
    setSemesters((prev) => {
      const remaining = prev.filter((sem) => sem.id !== semesterToRemove.id)
      return remaining.length > 0 ? remaining : [emptySemester('1st Sem')]
    })
    setSemesterToRemove(null)
  }

  function handleExtracted(semesterId, rows, detectedLabel) {
    if (rows.length === 0) return
    setSemesters((prev) =>
      prev.map((sem) => {
        if (sem.id !== semesterId) return sem
        const cleaned = sem.subjects.filter((s) => s.name || s.units || s.grade)
        const isDefaultLabel = !sem.label.trim() || /^(1st|2nd|3rd|4th)?\s*sem(\s+\d+)?$/i.test(sem.label.trim())
        const label = detectedLabel && isDefaultLabel ? detectedLabel : sem.label
        return { ...sem, label, subjects: [...cleaned, ...rows] }
      })
    )
  }

  async function saveRecord() {
    if (!supabase || !session) return
    setSaveStatus('saving')
    const { data, error } = await supabase
      .from('gwa_records')
      .upsert(
        { user_id: session.user.id, semesters, gwa: cumulativeGwa, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
      .select()
      .maybeSingle()
    setSaveStatus(error ? 'error' : 'saved')
    if (!error && data) setLastSavedAt(data.updated_at)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <img src={logo} alt="" className="brand-logo" />
          <div>
            <h1>GradeSync</h1>
            {isEmptyState && (
              <p className="app-subtitle">Upload a photo of your grades or add subjects manually below.</p>
            )}
          </div>
        </div>
        {supabase ? (
          session ? (
            <div className="auth-bar">
              {saveStatus === 'error' && (
                <span className="save-error-badge" title="Your latest changes couldn't be saved. Check your connection.">
                  ⚠ Save failed
                </span>
              )}
              <span>{session.user.email}</span>
              <button onClick={handleLogout}>Log out</button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')}>Sign in</button>
          )
        ) : null}
      </header>

      {semesters.length > 1 && (
        <div className={`sticky-gwa tone-${tone}`}>
          <span>Cumulative GWA</span>
          <strong>{cumulativeGwa ? cumulativeGwa.toFixed(4) : '—'}</strong>
        </div>
      )}

      {semesters.map((sem) => (
        <SemesterCard
          key={sem.id}
          semester={sem}
          onUpdateLabel={updateSemesterLabel}
          onUpdateSubject={updateSubject}
          onRemoveSubject={removeSubject}
          onAddSubject={addSubject}
          onExtracted={handleExtracted}
          onRemoveSemester={removeSemester}
        />
      ))}

      <button type="button" className="add-semester-btn" onClick={addSemester}>
        + Add semester
      </button>

      <section className={`card result-card tone-${tone}`}>
        <div className="result-main">
          <span>Cumulative GWA</span>
          <strong>{cumulativeGwa ? cumulativeGwa.toFixed(4) : '—'}</strong>
          {honor && <div className="remark-badge honor-badge">{honor}</div>}
        </div>
      </section>

      {semesterToRemove && (
        <ConfirmModal
          title="Remove semester?"
          message={`Remove "${semesterToRemove.label}" and all its subjects? This can't be undone.`}
          onConfirm={confirmRemoveSemester}
          onCancel={() => setSemesterToRemove(null)}
        />
      )}

      <footer className="app-footer">
        <div className="footer-links">
          <a href="/terms">Terms and Conditions</a>
          <span aria-hidden="true">·</span>
          <a href="/privacy">Privacy Policy</a>
        </div>
        © 2026 GradeSync. Made by{' '}
        <a href="https://github.com/XQYB2/" target="_blank" rel="noopener noreferrer">
          XQYB2
        </a>
      </footer>
    </div>
  )
}

export default App
