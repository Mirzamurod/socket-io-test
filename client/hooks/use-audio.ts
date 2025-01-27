import useSound from 'use-sound'

const useAudio = () => {
  const [play1] = useSound(`/audio/notification.mp3`)
  const [play2] = useSound(`/audio/notification2.mp3`)
  const [play3] = useSound(`/audio/sending.mp3`)
  const [play4] = useSound(`/audio/sending2.mp3`)

  const playSound = (sound: string) => {
    switch (sound) {
      case 'notification':
        play1()
        break
      case 'notification2':
        play2()
        break
      case 'sending':
        play3()
        break
      case 'sending2':
        play4()
        break
      default:
    }
  }

  return { playSound }
}

export default useAudio
