'use client'

import { useEffect, useState } from 'react'
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
import { useLoading } from '@/hooks/use-loading'
import { axiosClient } from '@/http/axios'
import { useSession } from 'next-auth/react'
import { generateToken } from '@/lib/generate-token'
import { toast } from '@/hooks/use-toast'

const ChatPage = () => {
  const router = useRouter()
  const { currentContact } = useCurrentContact()
  const { setCreating, setLoading, isLoading } = useLoading()
  const { data: session } = useSession()
  const [contacts, setContacts] = useState<IUser[]>([])

  const contactForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  })

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: '', image: '' },
  })

  const getContacts = async () => {
    setLoading(true)
    const token = await generateToken(session?.currentUser?._id)
    try {
      const { data } = await axiosClient.get<{ contacts: IUser[] }>('/user/contacts', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setContacts(data.contacts)
    } catch (error) {
      toast({ description: 'Cannot fetch contacts', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    router.replace('/')
  }, [])

  useEffect(() => {
    if (session?.currentUser?._id) {
      getContacts()
    }
  }, [session?.currentUser?._id])

  const onCreateContact = async (values: z.infer<typeof emailSchema>) => {
    setCreating(true)
    const token = await generateToken(session?.currentUser?._id)
    try {
      const { data } = await axiosClient.post<{ contact: IUser }>('/user/contact', values, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setContacts(prev => [...prev, data.contact])
      toast({ description: 'Contact added successfully' })
      contactForm.reset()
    } catch (error: any) {
      if (error.response?.data?.message) {
        return toast({ description: error.response.data.message, variant: 'destructive' })
      }
      return toast({ description: 'Something went wrong', variant: 'destructive' })
    } finally {
      setCreating(false)
    }
  }

  const onSendMessage = (values: z.infer<typeof messageSchema>) => {
    console.log(values)
  }

  return (
    <div>
      {/* Chat */}
      <div className='w-80 h-screen border-r fixed inset-0 z-50'>
        {/* Loading */}
        {isLoading ? (
          <div className='w-full h-[95vh] flex justify-center items-center'>
            <Loader2 size={50} className='animate-spin' />
          </div>
        ) : null}
        {/* Contact list */}
        {!isLoading ? <ContactList contacts={contacts} /> : null}
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

const messages = [
  { text: 'test@gamil.com', _id: '1' },
  { text: 'test1@gamil.com', _id: '2' },
  { text: 'test3@gamil.com', _id: '3' },
  { text: 'test4@gamil.com', _id: '4' },
  { text: 'test5@gamil.com', _id: '5' },
  { text: 'test6@gamil.com', _id: '6' },
]

export default ChatPage
