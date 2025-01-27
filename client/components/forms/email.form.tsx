import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { oldEmailSchema, otpSchema } from '@/lib/validation'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'

const EmailForm = () => {
  const [verify, setVerify] = useState(false)

  const emailForm = useForm<z.infer<typeof oldEmailSchema>>({
    resolver: zodResolver(oldEmailSchema),
    defaultValues: { email: '', oldEmail: 'test@gmail.com' },
  })

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '', email: '' },
  })

  const onEmailSubmit = (values: z.infer<typeof oldEmailSchema>) => {
    console.log(values)
    otpForm.setValue('email', values.email)
    setVerify(true)
  }

  const onVerifySubmit = (values: z.infer<typeof otpSchema>) => {
    console.log(values)
  }

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
                <InputOTP maxLength={6} {...field} className='w-full' pattern={REGEXP_ONLY_DIGITS}>
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
        <Button type='submit' className='w-full'>
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
                    disabled={item.name === 'oldEmail' ? true : false}
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs text-red-500' />
              </FormItem>
            )}
          />
        ))}
        <Button type='submit' className='w-full'>
          Verify email
        </Button>
      </form>
    </Form>
  )
}

export default EmailForm
