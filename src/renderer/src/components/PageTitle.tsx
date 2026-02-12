/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { StyledModal, StyledPageTitle } from '../Styled'
import CustomModal from './CustomModal'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '@renderer/hooks/useStore'

interface PageTitleProps {
  title: string
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  const setTimeLeft = useStore((state) => state.setTimeLeft)
  const timeLeft = useStore((state) => state.timeLeft)
  const capturedImages = useStore((state) => state.capturedImages)
  const selectedFrame = useStore((state) => state.selectedFrame)
  const [countdown, setCountdown] = useState<number>(3000)
  const [showModal, setShowModal] = useState<string | boolean>(false)
  const location = useLocation()
  const nav = useNavigate()

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        const newCountdown = prev > 1 ? prev - 1 : 0
        // console.log(`countdown:${newCountdown}`)
        if (timeLeft !== 0) {
          setTimeLeft(newCountdown)
        }
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return newCountdown
      })
    }, 1000)

    return (): void => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (countdown === 60) {
      setShowModal('warning')
    }

    if (countdown === 0) {
      setShowModal(false)
      if (location.pathname === '/pre-photo') {
        nav('/photo-session')
      } else if (location.pathname === '/photo-session') {
        if (capturedImages.length < selectedFrame.photoAmount) {
          return
        } else {
          nav('/photo-edit')
        }
      } else if (location.pathname === '/photo-edit') {
        nav('/share-photo')
      }
    }
  }, [countdown])

  return (
    <StyledPageTitle>
      <div className="title">{title}</div>
      <div className="timer">{formatTime(countdown)}</div>

      <CustomModal showModal={showModal === 'warning'} setShowModal={() => setShowModal(false)}>
        <StyledModal width={'70%'} height={'auto'}>
          <span className="warning">Waktu Kamu Tinggal 1 Menit, Nih</span>
          <span className="warning font-20">
            Selesaikan sesi foto kamu segera. Jika waktu habis, proses akan dilanjutkan secara
            otomatis.
          </span>
          <div className="flex center">
            <button className="orange" onClick={() => setShowModal(false)}>
              Oke, Mengerti
            </button>
          </div>
        </StyledModal>
      </CustomModal>
    </StyledPageTitle>
  )
}

export default PageTitle
