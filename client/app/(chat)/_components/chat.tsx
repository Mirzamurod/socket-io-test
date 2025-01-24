import { FC } from 'react'
import { z } from 'zod'
import { UseFormReturn } from 'react-hook-form'
import ChatLoading from '@/components/loadings/chat.loading'
import MessageCart from '@/components/carts/message.cart'
import { messageSchema } from '@/lib/validation'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Paperclip, Send, Smile } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface IProps {
  messageForm: UseFormReturn<z.infer<typeof messageSchema>>
  onSendMessage: (values: z.infer<typeof messageSchema>) => void
  messages: any
}

const Chat: FC<IProps> = props => {
  const { messageForm, onSendMessage, messages } = props

  return (
    <div className='flex flex-col justify-end z-40 min-h-[92vh]'>
      {/* Loading */}
      {/* <ChatLoading /> */}
      {/* Message */}
      <MessageCart isReceived />
      {/* Message Input */}
      <Form {...messageForm}>
        <form onSubmit={messageForm.handleSubmit(onSendMessage)} className='w-full flex relative'>
          <Button size='icon' type='button' variant='secondary' className='rounded-none'>
            <Paperclip />
          </Button>
          <FormField
            control={messageForm.control}
            name='text'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input
                    value={field.value}
                    placeholder='Type a message'
                    onBlur={() => field.onBlur()}
                    onChange={e => field.onChange(e.target.value)}
                    className='bg-secondary border-1 border-1-muted-foreground border-r border-r-muted-foreground h-9 rounded-none'
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button size='icon' type='button' variant='secondary' className='rounded-none'>
            <Smile />
          </Button>
          <Button type='submit' size='icon' className='rounded-none'>
            <Send />
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Chat
