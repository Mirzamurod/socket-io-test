import {} from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { confirmTextSchema } from '@/lib/validation'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

const DangerZoneForm = () => {
  const form = useForm<z.infer<typeof confirmTextSchema>>({
    resolver: zodResolver(confirmTextSchema),
    defaultValues: { confirmText: '' },
  })
  const onSubmit = (values: z.infer<typeof confirmTextSchema>) => {
    console.log(values)
  }

  return (
    <>
      <p>Are you sure you want to delete your account? This action cannot be undone.</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='mt-2 w-full font-bold' variant='destructive'>
            Delete permenantly
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove
              your data from our servers
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
              <FormField
                name='confirmText'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormDescription>
                      Please type <span className='font-bold'>DELETE</span> to confirm
                    </FormDescription>
                    <FormControl>
                      <Input className='bg-secondary' {...field} />
                    </FormControl>
                    <FormMessage className='text-xs text-red-500' />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full font-bold'>
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DangerZoneForm
