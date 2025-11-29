import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function Homepage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-primary py-5 flex items-center px-10">
        <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold! text-primary-foreground">Next-Hire</h1>
          <Button
            onClick={() => navigate('/login')}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-6 py-2 h-auto rounded-md font-semibold text-sm"
          >
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center px-10 py-16">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <div className="flex flex-col justify-start">
            <h2 className="text-4xl font-bold! text-primary mb-6 leading-tight">
              Find Your Dream Job Today
            </h2>
            <p className="text-base text-gray-700 font-semibold! mb-8 leading-relaxed">
              Welcome to Next-Hire Job Board — your platform for discovering job opportunities. Browse jobs, apply easily, or post job openings for qualified candidates.
            </p>
            <div>
              <Button
                onClick={() => navigate('/register')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 h-auto rounded-md font-semibold text-sm"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="flex items-center justify-center">
            <img 
              src="https://next-job-board-2025.vercel.app/hero.png" 
              alt="Job search illustration"
              className="object-contain h-96 max-w-md"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Homepage