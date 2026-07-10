import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {!sent ? (
        <>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset your password</h1>
            <p className="text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input id="email" type="email" placeholder="sarah@touchland.com" className="h-10 bg-background" />
            </div>
            <Button type="submit" className="w-full h-10" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center space-y-4">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Mail className="size-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Check your inbox</h2>
          <p className="text-sm text-muted-foreground">We've sent a password reset link to your email address.</p>
        </div>
      )}
      <Link to="/auth/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-4" />
        Back to sign in
      </Link>
    </motion.div>
  )
}
