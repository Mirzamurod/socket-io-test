'use client'

import { FC } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChildProps, IError } from '@/types'
import { toast } from '@/hooks/use-toast'

const onError = (error: IError) => {
  if (error.response?.data?.message) {
    return toast({ description: error.response.data.message, variant: 'destructive' })
  }
  return toast({ description: 'Something went wrong', variant: 'destructive' })
}

const queryClient = new QueryClient({ defaultOptions: { mutations: { onError } } })

const QueryProvider: FC<ChildProps> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default QueryProvider
