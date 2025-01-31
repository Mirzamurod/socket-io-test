import {} from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useSession } from 'next-auth/react'
import { useMutation } from '@tanstack/react-query'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { profileSchema } from '@/lib/validation'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { axiosClient } from '@/http/axios'
import { toast } from '@/hooks/use-toast'
import { generateToken } from '@/lib/generate-token'

const InformationForm = () => {
  const { data: session, update } = useSession()
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: session?.currentUser?.firstName,
      lastName: session?.currentUser?.lastName,
      bio: session?.currentUser?.bio,
    },
  })

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (payload: z.infer<typeof profileSchema>) => {
      const token = await generateToken(session?.currentUser?._id)
      const { data } = await axiosClient.patch('/user/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return data
    },
    onSuccess: () => {
      toast({ description: 'Profile updates successfully' })
      update()
    },
  })

  const onSubmit = (data: z.infer<typeof profileSchema>) => mutate(data)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
        {[
          { name: 'firstName', label: 'First name', placeholder: 'Enter your first name' },
          { name: 'lastName', label: 'Last name', placeholder: 'Enter your last name' },
          { name: 'bio', label: 'Bio', placeholder: 'Enter anything about yourself' },
        ].map(item => (
          <FormField
            key={item.name}
            control={form.control}
            name={item.name as 'bio'}
            render={({ field }) => (
              <FormItem>
                <Label>{item.label}</Label>
                <FormControl>
                  {item.name === 'bio' ? (
                    <Textarea
                      placeholder={item.placeholder}
                      className='bg-secondary'
                      disabled={isPending}
                      {...field}
                    />
                  ) : (
                    <Input
                      placeholder={item.placeholder}
                      className='bg-secondary'
                      disabled={isPending}
                      {...field}
                    />
                  )}
                </FormControl>
                <FormMessage className='text-xs text-red-500' />
              </FormItem>
            )}
          />
        ))}
        <Button type='submit' className='w-full' disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default InformationForm
