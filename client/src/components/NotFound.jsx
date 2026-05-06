import { useNavigate } from 'react-router-dom'
import Button from './ui/Button.jsx'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-600">404</h1>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Page not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sorry, we couldn't find the page you're looking for. The page might have been removed, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={() => navigate(-1)} className="w-full">
            Go Back
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="w-full"
          >
            Go to Homepage
          </Button>
        </div>

        <div className="mt-12">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            If you believe this is an error, please contact our support team.
          </div>
        </div>
      </div>
    </div>
  )
}
