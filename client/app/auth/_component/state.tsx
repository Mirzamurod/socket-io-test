'use client'

import {} from 'react'
import SignIn from './sign-in'
import Verify from './verify'
import { useAuth } from '@/hooks/use-auth'

const State = () => {
  const { step } = useAuth()

  return step === 'login' ? <SignIn /> : <Verify />
}

export default State
