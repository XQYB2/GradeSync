function TermsPage() {
  return (
    <div className="app legal-page">
      <h1>Terms and Conditions</h1>
      <p className="legal-updated">Last updated: July 2026</p>

      <section>
        <h2>Acceptance of terms</h2>
        <p>
          By using GradeSync, you agree to these terms. If you don't agree, please don't use the
          app.
        </p>
      </section>

      <section>
        <h2>What GradeSync does</h2>
        <p>
          GradeSync is a tool for calculating your GWA (grade weighted average) based on the
          subjects, units, and grades you enter or extract from an uploaded photo. It's provided
          as a convenience tool for personal use.
        </p>
      </section>

      <section>
        <h2>Accuracy of results</h2>
        <p>
          GradeSync calculates your GWA based on the data you provide. Photo-based grade
          extraction uses on-device OCR and may misread text, especially on low-quality or
          unclear images — always review extracted subjects, units, and grades for accuracy
          before relying on them. GradeSync is not affiliated with any school or university, and
          your official GWA should always be verified against your school's own records.
        </p>
      </section>

      <section>
        <h2>Your account</h2>
        <p>
          You're responsible for keeping your account credentials secure. You may sign in with
          email/password or with Google. You can stop using the app and remove your saved data
          at any time.
        </p>
      </section>

      <section>
        <h2>No warranty</h2>
        <p>
          GradeSync is provided "as is" without warranties of any kind. We do our best to keep
          calculations accurate and the service available, but we don't guarantee uninterrupted
          or error-free operation.
        </p>
      </section>

      <section>
        <h2>Changes to these terms</h2>
        <p>
          These terms may be updated from time to time. Continued use of the app after changes
          means you accept the updated terms.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Questions about these terms can be sent to the app developer.</p>
      </section>
    </div>
  )
}

export default TermsPage
