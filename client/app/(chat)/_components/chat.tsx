import {} from 'react'
import ChatLoading from '@/components/loadings/chat.loading'
import MessageCart from '@/components/carts/message.cart'

const Chat = () => {
  return (
    <div className='flex flex-col justify-end z-40 min-h-[92vh]'>
      {/* Loading */}
      {/* <ChatLoading /> */}
      {/* Message */}
      <MessageCart />

      {/* Message Input */}
    </div>
  )
}

export default Chat
