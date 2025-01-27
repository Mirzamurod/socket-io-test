import { useState } from 'react'
import { useTheme } from 'next-themes'
import { LogIn, Menu, Moon, Settings2, Upload, UserPlus, VolumeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import InformationForm from '@/components/forms/information.form'
import EmailForm from '@/components/forms/email.form'
import NotificationForm from '@/components/forms/notification.form'
import DangerZoneForm from '@/components/forms/danger-zone.form'

const Settings = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button size='icon' variant='secondary'>
            <Menu />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0 w-80'>
          <h2 className='pt-2 pl-2 text-muted-foreground'>
            Setting: <span className='text-white'>test@gmail.com</span>
          </h2>
          <Separator />
          <div className='flex flex-col'>
            {[
              { icon: Settings2, text: 'Profile' },
              { icon: UserPlus, text: 'Create contact' },
              { icon: VolumeOff, text: 'Mute' },
            ].map(item => (
              <div
                key={item.text}
                className='flex justify-between items-center p-2 hover:bg-secondary cursor-pointer'
                onClick={() => setIsProfileOpen(item.text === 'Profile' ? true : false)}
              >
                <div className='flex items-center gap-1'>
                  <item.icon size={16} />
                  <span className='text-sm'>{item.text}</span>
                </div>
                {item.text === 'Mute' ? <Switch /> : null}
              </div>
            ))}

            <div className='flex justify-between items-center p-2 hover:bg-secondary cursor-pointer'>
              <div className='flex items-center gap-1'>
                <Moon size={16} />
                <span className='text-sm'>Night mode</span>
              </div>
              <Switch
                checked={resolvedTheme === 'dark' ? true : false}
                onCheckedChange={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              />
            </div>
            <div className='flex justify-between items-center bg-destructive p-2 cursor-pointer'>
              <div className='flex items-center gap-1'>
                <LogIn size={16} />
                <span>Logout</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <SheetContent side='left' className='w-80 p-2'>
          <SheetHeader>
            <SheetTitle>My profile</SheetTitle>
            <SheetDescription>
              Setting up your profile will you connect with your friends and family easily
            </SheetDescription>
          </SheetHeader>
          <Separator />
          <div className='mx-auto w-1/2 h-36 relative'>
            <Avatar className='w-full h-36'>
              <AvatarFallback className='text-6xl uppercase'>sb</AvatarFallback>
            </Avatar>
            <Button size='icon' className='absolute right-0 bottom-0'>
              <Upload size={16} />
            </Button>
          </div>
          <Accordion type='single' collapsible className='mt-4'>
            {[
              { text: 'Basic information', component: <InformationForm /> },
              { text: 'Email', component: <EmailForm /> },
              { text: 'Notification', component: <NotificationForm /> },
              { text: 'Danger zone', component: <DangerZoneForm /> },
            ].map(item => (
              <AccordionItem value={item.text} key={item.text} className='mt-2'>
                <AccordionTrigger className='bg-secondary px-2'>{item.text}</AccordionTrigger>
                <AccordionContent className='px-2 mt-2'>{item.component}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Settings
