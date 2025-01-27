import {} from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { profileSchema } from '@/lib/validation'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

const InformationForm = () => {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: '', lastName: '', bio: '' },
  })

  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
        {[
          { name: 'firstName', label: 'First name', placeholder: 'Enter your first name' },
          { name: 'lastName', label: 'Last name', placeholder: 'Enter your last name' },
          { name: 'bio', label: 'First name', placeholder: 'Enter anything about yourself' },
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
                    <Textarea placeholder={item.placeholder} className='bg-secondary' {...field} />
                  ) : (
                    <Input placeholder={item.placeholder} className='bg-secondary' {...field} />
                  )}
                </FormControl>
                <FormMessage className='text-xs text-red-500' />
              </FormItem>
            )}
          />
        ))}
        <Button type='submit' className='w-full'>
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default InformationForm
