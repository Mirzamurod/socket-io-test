import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { z } from 'zod'
import { UseFormReturn } from 'react-hook-form'
import { Paperclip, Send, Smile } from 'lucide-react'
import emojies from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import ChatLoading from '@/components/loadings/chat.loading'
import MessageCart from '@/components/cards/message.card'
import { messageSchema } from '@/lib/validation'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useLoading } from '@/hooks/use-loading'
import { IMessage } from '@/types'
import { useCurrentContact } from '@/hooks/use-current'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UploadDropzone } from '@/lib/uploadthing'
import { useSession } from 'next-auth/react'

interface IProps {
  messageForm: UseFormReturn<z.infer<typeof messageSchema>>
  onSubmitMessage: (values: z.infer<typeof messageSchema>) => void
  messages: IMessage[]
  onReadMessages: () => Promise<void>
  onReaction: (reaction: string, messageId: string) => Promise<void>
  onDeleteMessage: (messageId: string) => Promise<void>
  onTyping: (e: ChangeEvent<HTMLInputElement>) => void
}

const Chat: FC<IProps> = props => {
  const {
    messageForm,
    onSubmitMessage,
    messages,
    onReadMessages,
    onReaction,
    onDeleteMessage,
    onTyping,
  } = props
  const { resolvedTheme } = useTheme()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { loadMessages } = useLoading()
  const scrollRef = useRef<HTMLFormElement | null>(null)
  const { editedMessage, setEditedMessage, currentContact } = useCurrentContact()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    onReadMessages()
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (editedMessage) {
      messageForm.setValue('text', editedMessage.text)
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [editedMessage])

  const filteredMessages = messages.filter(
    (message, index, self) =>
      ((message.sender._id === session?.currentUser?._id &&
        message.receiver._id === currentContact?._id) ||
        (message.sender._id === currentContact?._id &&
          message.receiver._id === session?.currentUser?._id)) &&
      index === self.findIndex(m => m._id === message._id)
  )

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
      {loadMessages ? <ChatLoading /> : null}
      {messages.length === 0 ? (
        <div className='w-full h-[88vh] flex items-center justify-center'>
          <div
            className='text-[100px] cursor-pointer'
            onClick={() => onSubmitMessage({ text: '✋' })}
          >
            ✋
          </div>
        </div>
      ) : null}
      {!loadMessages && filteredMessages.length
        ? filteredMessages.map(message => (
            <MessageCart
              key={message._id}
              message={message}
              onReaction={onReaction}
              onDeleteMessage={onDeleteMessage}
            />
          ))
        : null}
      <Form {...messageForm}>
        <form
          onSubmit={messageForm.handleSubmit(onSubmitMessage)}
          className='w-full flex relative'
          ref={scrollRef}
        >
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size='icon' type='button' variant='secondary' className='rounded-none'>
                <Paperclip />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle />
              </DialogHeader>
              <UploadDropzone
                endpoint='imageUploader'
                onClientUploadComplete={res => {
                  onSubmitMessage({ text: '', image: res[0].url })
                  setOpen(false)
                }}
                config={{ appendOnPaste: true, mode: 'manual' }}
              />
            </DialogContent>
          </Dialog>
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
                    onChange={e => {
                      field.onChange(e.target.value)
                      onTyping(e)
                      if (e.target.value === '') setEditedMessage(null)
                    }}
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
