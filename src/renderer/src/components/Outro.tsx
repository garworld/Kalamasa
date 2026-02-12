/* eslint-disable react-hooks/exhaustive-deps */
import images from '@renderer/assets/images'
import { useStore } from '@renderer/hooks/useStore'
import { StyledOutro } from '@renderer/Styled'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Outro = (): JSX.Element => {
  const [countdown, setCountdown] = useState<number>(30)
  const nav = useNavigate()
  const resetAll = useStore((state) => state.resetAll)

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    resetAll()
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return (): void => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (countdown === 0) {
      nav('/')
    }
  }, [countdown])

  return (
    <StyledOutro>
      <div className="flex gap-6 center">
        <img src={images.logo} className="logo" />
        <p>Snapspot</p>
      </div>
      <div className="flex center column">
        <img src={images.outro} />
        <button className="orange" onClick={() => nav('/')}>
          Kembali ke Awal ({formatTime(countdown)})
        </button>
      </div>
    </StyledOutro>
  )
}

export default Outro
