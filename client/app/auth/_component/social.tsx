import {} from 'react'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import { Button } from '@/components/ui/button'

const Social = () => {
  return (
    <div className='grid grid-cols-2 w-full gap-1'>
      <Button variant='outline'>
        <span>Sign up with google</span>
        <FaGoogle />
      </Button>
      <Button variant='secondary'>
        <span>Sign up with github</span>
        <FaGithub />
      </Button>
    </div>
  )
}

export default Social
