import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignupPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    navigate('/app/dashboard')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
        <p className="text-sm text-muted-foreground">Start your free 14-day trial. No credit card required.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="first-name" className="text-sm font-medium">First name</Label>
            <Input id="first-name" placeholder="Sarah" className="h-10 bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name" className="text-sm font-medium">Last name</Label>
            <Input id="last-name" placeholder="Lee" className="h-10 bg-background" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Work email</Label>
          <Input id="email" type="email" placeholder="sarah@touchland.com" className="h-10 bg-background" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company" className="text-sm font-medium">Company name</Label>
          <Input id="company" placeholder="Touchland" className="h-10 bg-background" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <Input id="password" type="password" placeholder="Min. 8 characters" className="h-10 bg-background" />
        </div>

        <Button type="submit" className="w-full h-10 gap-2" disabled={loading}>
          {loading ? (
            <div className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              Create account
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        By creating an account, you agree to our{' '}
        <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
        and{' '}
        <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}
