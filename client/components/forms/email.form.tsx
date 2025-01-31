import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { useMutation } from '@tanstack/react-query'
import { signOut, useSession } from 'next-auth/react'
import { oldEmailSchema, otpSchema } from '@/lib/validation'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp'
import { axiosClient } from '@/http/axios'
import { toast } from '@/hooks/use-toast'
import { generateToken } from '@/lib/generate-token'

const EmailForm = () => {
  const { data: session } = useSession()
  const [verify, setVerify] = useState(false)

  const emailForm = useForm<z.infer<typeof oldEmailSchema>>({
    resolver: zodResolver(oldEmailSchema),
    defaultValues: { email: '', oldEmail: session?.currentUser?.email },
  })

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '', email: '' },
  })

  const otpMutation = useMutation({
    mutationFn: async (email: string) => {
      const token = await generateToken(session?.currentUser?._id)
      const { data } = await axiosClient.post<{ email: string }>(
        '/user/send-otp',
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return data
    },
    onSuccess: ({ email }) => {
      otpForm.setValue('email', email)
      setVerify(true)
    },
  })

  const verifyMutation = useMutation({
    mutationFn: async (otp: string) => {
      const token = await generateToken(session?.currentUser?._id)
      const { data } = await axiosClient.patch<{ email: string }>(
        '/user/email',
        { email: otpForm.getValues('email'), otp },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return data
    },
    onSuccess: () => {
      toast({ description: 'Email updated successfully' })
      signOut()
    },
  })

  const onEmailSubmit = (values: z.infer<typeof oldEmailSchema>) => otpMutation.mutate(values.email)

  const onVerifySubmit = (values: z.infer<typeof otpSchema>) => verifyMutation.mutate(values.otp)

  return verify ? (
    <Form {...otpForm}>
      <form onSubmit={otpForm.handleSubmit(onVerifySubmit)} className='space-y-2'>
        <Label>New email</Label>
        <Input className='bg-secondary' disabled value={emailForm.watch('email')} />
        <FormField
          name='otp'
          control={otpForm.control}
          render={({ field }) => (
            <FormItem>
              <Label>One-Item password</Label>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  className='w-full'
                  pattern={REGEXP_ONLY_DIGITS}
                  disabled={verifyMutation.isPending}
                  {...field}
                >
                  <InputOTPGroup className='w-full'>
                    {[...new Array(3)].map((_, index) => (
                      <InputOTPSlot
                        index={index}
                        key={index}
                        className='w-full dark:bg-primary-foreground bg-secondary'
                      />
                    ))}
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className='w-full'>
                    {[...new Array(3)].map((_, index) => (
                      <InputOTPSlot
                        index={index + 3}
                        key={index + 3}
                        className='w-full dark:bg-primary-foreground bg-secondary'
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage className='text-xs text-red-500' />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={verifyMutation.isPending}>
          Submit
        </Button>
      </form>
    </Form>
  ) : (
    <Form {...emailForm}>
      <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className='space-y-2'>
        {[
          { name: 'oldEmail', label: 'Current email' },
          { name: 'email', label: 'New email', placeholder: 'Enter a new email' },
        ].map(item => (
          <FormField
            key={item.name}
            control={emailForm.control}
            name={item.name as 'email'}
            render={({ field }) => (
              <FormItem>
                <Label>{item.label}</Label>
                <FormControl>
                  <Input
                    className='bg-secondary'
                    placeholder={item.placeholder}
                    disabled={item.name === 'oldEmail' ? true : otpMutation.isPaused ? true : false}
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs text-red-500' />
              </FormItem>
            )}
          />
        ))}
        <Button type='submit' className='w-full' disabled={otpMutation.isPending}>
          Verify email
        </Button>
      </form>
    </Form>
  )
}

export default EmailForm
