import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'

export default function NotFound() {
  return (
    <div className="min-h-full flex items-center">
      <div className="app-container py-10">
        <div className="mx-auto max-w-lg">
          <Card>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">404</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
              Page not found
            </div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              The page you’re looking for doesn’t exist or has moved.
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button as={Link} to="/" variant="secondary">
                Go to landing
              </Button>
              <Button as={Link} to="/dashboard">
                Go to dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

