'use client'

import { FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { IUser } from '@/types'
import Settings from './settings'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCurrentContact } from '@/hooks/use-current'
import { cn, sliceText } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { CONST } from '@/lib/constants'
import Image from 'next/image'

interface IProps {
  contacts: IUser[]
}

const ContactList: FC<IProps> = props => {
  const { contacts } = props
  const router = useRouter()
  const { currentContact, setCurrentContact } = useCurrentContact()
  const { onlineUsers } = useAuth()
  const [query, setQuery] = useState('')

  const filteredContacts = contacts
    .filter(contact => contact.email.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
    .sort((a, b) => {
      const dateA = a.lastMessage?.updatedAt ? new Date(a.lastMessage.updatedAt).getTime() : 0
      const dateB = b.lastMessage?.updatedAt ? new Date(b.lastMessage.updatedAt).getDate() : 0
      return dateB - dateA
    })

  const renderContact = (contact: IUser) => {
    const onChat = () => {
      if (currentContact?._id === contact._id) {
        return console.log('chatting with', contact.email)
      }

      setCurrentContact(contact)
      router.push(`/?chat=${contact._id}`)
    }

    return (
      <div
        onClick={onChat}
        className={cn(
          'flex justify-between items-center cursor-pointer hover:bg-secondary/50 md:p-2',
          currentContact?._id === contact._id && 'bg-secondary/50'
        )}
      >
        <div className='flex items-center gap-2'>
          <div className='relative'>
            <Avatar className='z-40'>
              <AvatarImage src={contact.avatar} alt={contact.email} className='object-cover' />
              <AvatarFallback className='uppercase'>{contact.email[0]}</AvatarFallback>
            </Avatar>
            {onlineUsers.some(user => user._id === contact._id) ? (
              <div className='size-3 bg-green-500 absolute rounded-full bottom-0 right-0 !z-40' />
            ) : null}
          </div>
          <div className='max-md:hidden'>
            <h2 className='capitalize line-clamp-1 text-sm'>
              {contact.firstName ?? contact.email.split('@')[0]}
            </h2>
            {contact.lastMessage ? (
              contact.lastMessage.image ? (
                <div className='flex items-center gap-1'>
                  <Image
                    width={20}
                    height={20}
                    alt={contact.email}
                    className='object-cover'
                    src={contact.lastMessage.image}
                  />
                  <p
                    className={cn(
                      'text-xs line-clamp-1',
                      contact.lastMessage?.status !== CONST.READ
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    Photo
                  </p>
                </div>
              ) : (
                <p
                  className={cn(
                    'text-xs max-md:hidden line-clamp-1',
                    contact.lastMessage?.status !== CONST.READ
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {sliceText(contact.lastMessage.text, 25)}
                </p>
              )
            ) : (
              <p className='text-xs max-md:hidden line-clamp-1 text-muted-foreground'>
                No message yet
              </p>
            )}
          </div>
        </div>
        {contact.lastMessage ? (
          <div className='self-end'>
            <p className='text-xs text-muted-foreground'>
              {format(contact.lastMessage.updatedAt, 'hh:mm a')}
            </p>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div>
      {/* Top bar */}
      <div className='flex items-center bg-background md:pl-2 sticky top-0 z-50'>
        <Settings />
        <div className='md:m-2 w-full max-md:hidden'>
          <Input
            className='bg-secondary'
            placeholder='Search...'
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className='max-md:mt-2'>
        {filteredContacts.length === 0 ? (
          <div className='w-full h-[95vh] flex justify-center items-center text-center text-muted-foreground'>
            <p>Contact list is empty</p>
          </div>
        ) : (
          filteredContacts.map(contact => <div key={contact._id}>{renderContact(contact)}</div>)
        )}
      </div>
    </div>
  )
}

export default ContactList
