'use client'

import { useState } from 'react'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

const Social = () => {
  const [isLoading, setIsLoading] = useState(false)

  const onSignIn = async (provider: string) => {
    setIsLoading(true)
    await signIn(provider, { callbackUrl: '/' })
  }

  return (
    <div className='grid grid-cols-2 w-full gap-1'>
      <Button variant='outline' onClick={() => onSignIn('google')} disabled={isLoading}>
        <span>Sign up with google</span>
        <FaGoogle />
      </Button>
      <Button variant='secondary' onClick={() => onSignIn('github')} disabled={isLoading}>
        <span>Sign up with github</span>
        <FaGithub />
      </Button>
    </div>
  )
}

export default Social
