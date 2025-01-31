import { FC } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { ChildProps } from '@/types'

// @ts-ignore
const Layout: FC<ChildProps> = async ({ children }) => {
  const session = await getServerSession(authOptions)
  if (!session) return redirect('/auth')

  return <div>{children}</div>
}

export default Layout
