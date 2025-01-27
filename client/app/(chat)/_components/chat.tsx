import { FC, useRef } from 'react'
import { useTheme } from 'next-themes'
import { z } from 'zod'
import { UseFormReturn } from 'react-hook-form'
import { Paperclip, Send, Smile } from 'lucide-react'
import emojies from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import ChatLoading from '@/components/loadings/chat.loading'
import MessageCart from '@/components/carts/message.cart'
import { messageSchema } from '@/lib/validation'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface IProps {
  messageForm: UseFormReturn<z.infer<typeof messageSchema>>
  onSendMessage: (values: z.infer<typeof messageSchema>) => void
  messages: any
}

const Chat: FC<IProps> = props => {
  const { messageForm, onSendMessage, messages } = props
  const { resolvedTheme } = useTheme()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleEmojiSelect = (emoji: string) => {
    const input = inputRef.current
    if (!input) return

    const text = messageForm.getValues('text')
    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? 0

    const newText = text.slice(0, start) + emoji + text.slice(end)
    messageForm.setValue('text', newText)

    setTimeout(() => {
      input.setSelectionRange(start + emoji.length, start + emoji.length)
    }, 0)
  }

  return (
    <div className='flex flex-col justify-end z-40 min-h-[92vh]'>
      {/* Loading */}
      {/* <ChatLoading /> */}
      {/* Message */}
      {/* <MessageCart isReceived /> */}
      {/* Start conversation */}
      <div className='w-full h-[88vh] flex items-center justify-center'>
        <div className='text-[100px] cursor-pointer' onClick={() => onSendMessage({ text: '✋' })}>
          ✋
        </div>
      </div>
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
                    ref={inputRef}
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
          <Popover>
            <PopoverTrigger asChild>
              <Button size='icon' type='button' variant='secondary' className='rounded-none'>
                <Smile />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='p-0 border-none rounded-md absolute right-0 bottom-0'>
              <Picker
                data={emojies}
                theme={resolvedTheme}
                onEmojiSelect={(emoji: { native: string }) => handleEmojiSelect(emoji.native)}
              />
            </PopoverContent>
          </Popover>

          <Button type='submit' size='icon' className='rounded-none'>
            <Send />
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Chat
