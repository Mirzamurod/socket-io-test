import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { ChevronDown, PlayCircle } from 'lucide-react'
import { SOUNDS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import useAudio from '@/hooks/use-audio'
import { Separator } from '../ui/separator'
import { Switch } from '../ui/switch'

const NotificationForm = () => {
  const { playSound } = useAudio()
  const [notificationSound, setNotificationSound] = useState('')
  const [sendingSound, setSendingSound] = useState('')

  const onNotificationSound = (value: string) => {
    setNotificationSound(value)
    playSound(value)
  }

  const onSendingSound = (value: string) => {
    setSendingSound(value)
    playSound(value)
  }

  return (
    <>
      <div className='flex items-center justify-between relative'>
        <div className='flex flex-col'>
          <p>Notification Sound</p>
          <p className='text-muted-foreground text-xs'>Apple</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button size='sm'>
              Select <ChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-80 absolute -right-12'>
            <div className='flex flex-col space-y-1'>
              {SOUNDS.map(sound => (
                <div
                  key={sound.label}
                  className={cn(
                    'flex justify-between items-center bg-secondary cursor-pointer hover:bg-primary-foreground',
                    notificationSound === sound.value && 'bg-primary-foreground'
                  )}
                  onClick={() => onNotificationSound(sound.value)}
                >
                  <Button size='sm' variant='ghost' className='justify-start'>
                    {sound.label}
                  </Button>
                  <Button size='icon' variant='ghost'>
                    <PlayCircle />
                  </Button>
                </div>
              ))}
            </div>
            <Button className='w-full mt-2 font-bold'>Submit</Button>
          </PopoverContent>
        </Popover>
      </div>
      <Separator />
      <div className='flex items-center justify-between relative'>
        <div className='flex flex-col'>
          <p>Sending Sound</p>
          <p className='text-muted-foreground text-xs'>Apple</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button size='sm'>
              Select <ChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-80 absolute -right-12'>
            <div className='flex flex-col space-y-1'>
              {SOUNDS.map(sound => (
                <div
                  key={sound.label}
                  className={cn(
                    'flex justify-between items-center bg-secondary cursor-pointer hover:bg-primary-foreground',
                    sendingSound === sound.value && 'bg-primary-foreground'
                  )}
                  onClick={() => onSendingSound(sound.value)}
                >
                  <Button size='sm' variant='ghost' className='justify-start'>
                    {sound.label}
                  </Button>
                  <Button size='icon' variant='ghost'>
                    <PlayCircle />
                  </Button>
                </div>
              ))}
            </div>
            <Button className='w-full mt-2 font-bold'>Submit</Button>
          </PopoverContent>
        </Popover>
      </div>
      <Separator />
      <div className='flex items-center justify-between relative'>
        <div className='flex flex-col'>
          <p>Mode Mute</p>
          <p className='text-muted-foreground text-xs'>Muted</p>
        </div>
        <Switch />
      </div>
    </>
  )
}

export default NotificationForm
