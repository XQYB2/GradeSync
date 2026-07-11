function PrivacyPolicyPage() {
  return (
    <div className="app legal-page">
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: July 2026</p>

      <section>
        <h2>What GradeSync is</h2>
        <p>
          GradeSync is a GWA (grade weighted average) calculator for college students. This
          policy explains what information the app collects and how it's used.
        </p>
      </section>

      <section>
        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Account information:</strong> if you sign in with email/password or with
            Google, we receive your email address (and, for Google sign-in, your name and
            profile picture) to create and identify your account. Authentication is handled by
            Supabase.
          </li>
          <li>
            <strong>Grade data:</strong> the subjects, units, and grades you enter or upload are
            stored under your account so you can access them again later and track your GWA
            over time.
          </li>
        </ul>
      </section>

      <section>
        <h2>Photo uploads and OCR</h2>
        <p>
          When you upload a photo of your grades, the image is processed entirely in your
          browser (using on-device OCR) to extract subject names, units, and grades. The image
          itself is never uploaded to or stored on any server — only the extracted text values
          you choose to keep are saved to your account.
        </p>
      </section>

      <section>
        <h2>How your data is used</h2>
        <p>
          Your grade data is used solely to calculate your GWA and display it back to you. We do
          not sell, share, or use your data for advertising. There is no third-party analytics or
          ad tracking in this app.
        </p>
      </section>

      <section>
        <h2>Data storage and security</h2>
        <p>
          Your data is stored in a Supabase-hosted database with row-level security, meaning
          only you can access your own saved records.
        </p>
      </section>

      <section>
        <h2>Deleting your data</h2>
        <p>
          You can remove individual semesters or subjects at any time from within the app. To
          delete your account and all associated data entirely, contact us at the email below.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Questions about this policy can be sent to the app developer.</p>
      </section>
    </div>
  )
}

export default PrivacyPolicyPage
