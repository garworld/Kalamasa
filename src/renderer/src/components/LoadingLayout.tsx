/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledLoadingLayout, StyledModal } from '../Styled'
import CustomModal from './CustomModal'
import { useEffect, useState } from 'react'
import icons from '@renderer/assets/icons'
import images from '@renderer/assets/images'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '@renderer/hooks/useStore'

const LoadingLayout = (): JSX.Element => {
  const setMergedVideos = useStore((state) => state.setMergedVideos)
  const [showModal, setShowModal] = useState<string | false>(false)
  const [progress, setProgress] = useState<number>(0)
  const location = useLocation()
  const nav = useNavigate()
  const from = location.state?.from
  // console.log({ from })

  useEffect(() => {
    // Check if running in browser (no Electron)
    if (!window.electron) {
      console.warn('Electron API not found. Simulating loading process.')
      setProgress(100)
      setTimeout(() => {
        if (from === '/photo-session') {
          nav('/photo-edit', { replace: true })
        } else {
          nav('/share-photo', { replace: true })
        }
      }, 2000)
      return
    }

    const handleProgress = (_: any, percent: number): void => {
      // console.log('progress:', percent)
      setProgress(percent)
    }
    const mergeAndGetVideo = async (): Promise<void> => {
      try {
        const base64 = await window.electron.ipcRenderer.invoke('merge-all-videos')
        console.log('Received base64:', base64.slice(0, 100)) // log sebagian aja

        setMergedVideos(`data:video/mp4;base64,${base64}`)

        setTimeout(() => {
          if (from === '/photo-session') {
            nav('/photo-edit', { replace: true })
          } else {
            nav('/share-photo', { replace: true })
          }
          setProgress(0)
        }, 1000)
      } catch (err) {
        console.error('❌ Merge failed:', err)
      }
    }

    window.electron.ipcRenderer.on('video-transcoded', handleProgress)
    mergeAndGetVideo()

    // Cleanup listener saat komponen unmount
    return (): void => {
      window.electron.ipcRenderer.removeListener('video-transcoded', handleProgress)
    }
  }, [])

  return (
    <StyledLoadingLayout>
      {from === '/photo-session' ? (
        <div className="loading-screen border">Behind the Scene</div>
      ) : (
        <div className="loading-screen">
          <span>Tunggu sebentar, kami lagi nyiapin fotomu..</span>
          <img src={images.cameraGif} />
        </div>
      )}

      <div className="loading-bar">
        <div className="bar">
          <div
            className="bar-overlay"
            style={{
              width: `${progress}%`,
              borderTopRightRadius: progress >= 98 ? '14px' : '0px',
              borderBottomRightRadius: progress >= 98 ? '14px' : '0px'
            }}
          />
        </div>
        <div>Loading...</div>
      </div>
      <CustomModal showModal={showModal === 'error'} setShowModal={() => setShowModal(false)}>
        <StyledModal width={'70%'} height={'auto'}>
          <div className="warning">Loading Error</div>
          <div className="warning font-20">
            Silakan coba lagi. Apabila loading masih error, mohon hubungi petugas.
          </div>
          <div className="flex center">
            <button className="orange">
              <img src={icons.refresh} />
              <span>Coba Lagi</span>
            </button>
          </div>
        </StyledModal>
      </CustomModal>
    </StyledLoadingLayout>
  )
}

export default LoadingLayout
