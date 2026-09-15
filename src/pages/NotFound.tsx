import { Link } from 'react-router-dom'
import { FiCompass, FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <section className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shadow-inner">
        <FiCompass className="h-10 w-10" />
      </div>
      <span className="mb-2 text-sm font-semibold tracking-wider text-primary-600 uppercase">404 Error</span>
      <h1 className="mb-4 text-3xl font-extrabold text-slate-900 md:text-4xl">Page Not Found</h1>
      <p className="mb-8 max-w-md text-slate-600">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 active:scale-95"
        >
          <FiArrowLeft />
          <span>Back to Home</span>
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <span>Explore Catalog</span>
        </Link>
      </div>
    </section>
  )
}
