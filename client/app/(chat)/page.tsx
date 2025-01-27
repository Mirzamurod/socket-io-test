'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import ContactList from './_components/contact-list'
import AddContact from './_components/add-contact'
import { useCurrentContact } from '@/hooks/use-current'
import { emailSchema, messageSchema } from '@/lib/validation'
import TopChat from './_components/top-chat'
import Chat from './_components/chat'
import { IUser } from '@/types'

const ChatPage = () => {
  const router = useRouter()
  const { currentContact } = useCurrentContact()

  const contactForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  })

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: '', image: '' },
  })

  useEffect(() => {
    router.replace('/')
  }, [])

  const onCreateContact = (values: z.infer<typeof emailSchema>) => {
    console.log(values)
  }

  const onSendMessage = (values: z.infer<typeof messageSchema>) => {
    console.log(values)
  }

  return (
    <div>
      {/* Chat */}
      <div className='w-80 h-screen border-r fixed inset-0 z-50'>
        {/* Loading */}
        {/* <div className='w-full h-[95vh] flex justify-center items-center'>
          <Loader2 size={50} className='animate-spin' />
        </div> */}
        {/* Contact list */}
        <ContactList contacts={contacts} />
      </div>
      {/* Chat area */}
      <div className='pl-80 w-full'>
        {/* Add contact */}
        {!currentContact?._id ? (
          <AddContact contactForm={contactForm} onCreateContact={onCreateContact} />
        ) : (
          <div className='w-full relative'>
            <TopChat />
            <Chat messageForm={messageForm} onSendMessage={onSendMessage} messages={messages} />
          </div>
        )}
        {/* Chat */}
      </div>
    </div>
  )
}

const contacts: IUser[] = [
  {
    email: 'test@gamil.com',
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'lorem text input bir nimala',
  },
  { email: 'test1@gamil.com', _id: '2' },
  { email: 'test3@gamil.com', _id: '3' },
]

const messages = [
  { text: 'test@gamil.com', _id: '1' },
  { text: 'test1@gamil.com', _id: '2' },
  { text: 'test3@gamil.com', _id: '3' },
  { text: 'test4@gamil.com', _id: '4' },
  { text: 'test5@gamil.com', _id: '5' },
  { text: 'test6@gamil.com', _id: '6' },
]

export default ChatPage
