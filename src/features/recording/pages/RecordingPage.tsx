import { BackToEmployeesLink } from '../../../components/BackToEmployeesLink'
import { ScreenRecorder } from '../components/ScreenRecorder'

export function RecordingPage() {
  return (
    <main className="app">
      <div className="app-page-nav">
        <BackToEmployeesLink />
      </div>

      <section className="app-header recording-page-header" aria-labelledby="page-title">
        <div>
          <h1 id="page-title">Screen recorder</h1>
          <p>
            Share your screen and record walkthroughs locally in your
            browser. Recordings are not uploaded to the server.
          </p>
        </div>
      </section>

      <ScreenRecorder />
    </main>
  )
}
