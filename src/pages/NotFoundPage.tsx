import { BackToEmployeesLink } from '../components/BackToEmployeesLink'

export function NotFoundPage() {
  return (
    <main className="app">
      <section className="not-found-card" aria-labelledby="not-found-title">
        <p>404</p>
        <h1 id="not-found-title">Page not found</h1>
        <span>
          The page you are looking for does not exist or has moved.
        </span>
        <BackToEmployeesLink />
      </section>
    </main>
  )
}
