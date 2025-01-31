import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation } from '@tanstack/react-query'
import { ChevronDown, Ghost, PlayCircle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { SOUNDS } from '@/lib/constants'
import { cn, getSoundLabel } from '@/lib/utils'
import useAudio from '@/hooks/use-audio'
import { Separator } from '../ui/separator'
import { Switch } from '../ui/switch'
import { axiosClient } from '@/http/axios'
import { toast } from '@/hooks/use-toast'
import { generateToken } from '@/lib/generate-token'

interface IPayload {
  notificationSound?: string
  sendingSound?: string
  muted?: boolean
}

const NotificationForm = () => {
  const { playSound } = useAudio()
  const { data: session, update } = useSession()
  const [selectedSound, setSelectedSound] = useState('')
  const [isNotification, setIsNotification] = useState(false)
  const [isSounding, setIsSounding] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: IPayload) => {
      const token = await generateToken(session?.currentUser?._id)
      const { data } = await axiosClient.patch('/user/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return data
    },
    onSuccess: () => {
      toast({ description: 'Profile updated successfully' })
      update()
      setIsNotification(false)
      setIsSounding(false)
    },
  })

  const onPlaySound = (value: string) => {
    setSelectedSound(value)
    playSound(value)
  }

  return (
    <>
      <div className='flex items-center justify-between relative'>
        <div className='flex flex-col'>
          <p>Notification Sound</p>
          <p className='text-muted-foreground text-xs'>
            {getSoundLabel(session?.currentUser?.notificationSound)}
          </p>
        </div>
        <Popover open={isNotification} onOpenChange={setIsNotification}>
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
                    (selectedSound === sound.value ||
                      session?.currentUser?.notificationSound === sound.value) &&
                      'bg-primary-foreground'
                  )}
                  onClick={() => onPlaySound(sound.value)}
                >
                  <Button size='sm' variant='ghost' className='justify-start'>
                    {sound.label}
                  </Button>
                  {session?.currentUser?.notificationSound === sound.value ? (
                    <Button size='icon'>
                      <Ghost />
                    </Button>
                  ) : (
                    <Button size='icon' variant='ghost'>
                      <PlayCircle />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              disabled={isPending}
              className='w-full mt-2 font-bold'
              onClick={() => mutate({ notificationSound: selectedSound })}
            >
              Submit
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <Separator />
      <div className='flex items-center justify-between relative'>
        <div className='flex flex-col'>
          <p>Sending Sound</p>
          <p className='text-muted-foreground text-xs'>
            {getSoundLabel(session?.currentUser?.sendingSound)}
          </p>
        </div>
        <Popover open={isSounding} onOpenChange={setIsSounding}>
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
                    (selectedSound === sound.value ||
                      session?.currentUser?.sendingSound === sound.value) &&
                      'bg-primary-foreground'
                  )}
                  onClick={() => onPlaySound(sound.value)}
                >
                  <Button size='sm' variant='ghost' className='justify-start'>
                    {sound.label}
                  </Button>
                  {session?.currentUser?.sendingSound === sound.value ? (
                    <Button size='icon'>
                      <Ghost />
                    </Button>
                  ) : (
                    <Button size='icon' variant='ghost'>
                      <PlayCircle />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              disabled={isPending}
              className='w-full mt-2 font-bold'
              onClick={() => mutate({ sendingSound: selectedSound })}
            >
              Submit
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <Separator />
      <div className='flex items-center justify-between relative'>
        <div className='flex flex-col'>
          <p>Mode Mute</p>
          <p className='text-muted-foreground text-xs'>
            {session?.currentUser?.muted ? 'Unmuted' : 'Muted'}
          </p>
        </div>
        <Switch
          disabled={isPending}
          checked={!session?.currentUser?.muted}
          onCheckedChange={() => mutate({ muted: !session?.currentUser?.muted })}
        />
      </div>
    </>
  )
}

export default NotificationForm
