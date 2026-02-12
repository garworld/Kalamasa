/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Webcam from 'react-webcam'
import { StyledPhotoLayout } from '../Styled'
import React, { useEffect, useState } from 'react'
import icons from '../assets/icons'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@renderer/hooks/useStore'
import sounds from '@renderer/assets/sounds'
import { photo_guide } from '@renderer/contants/PHOTO_GUIDE'

const PhotoLayout = (): JSX.Element => {
  const capturedImages = useStore((state) => state.capturedImages)
  const setCapturedImages = useStore((state) => state.setCapturedImages)
  const selectedFrame = useStore((state) => state.selectedFrame)
  const userAmount = useStore((state) => state.userAmount)
  const timeLeft = useStore((state) => state.timeLeft)
  const webcamRef = React.useRef<any>(null)
  const countdownRef = React.useRef<number | null>(null)
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const recordedChunksRef = React.useRef<Blob[]>([])
  const videoChunksListRef = React.useRef<Blob[]>([])
  const capturedImagesLengthRef = React.useRef<number>(capturedImages.length)
  const autoCapturedStartedRef = React.useRef<boolean>(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isRetakeMode, setIsRetakeMode] = useState<null | number>(null)
  const [retakeCount, setRetakeCount] = useState<number>(0)
  const [_isRecording, setIsRecording] = useState<boolean>(false)
  const [isAutoCaptured, setIsAutoCaptured] = useState<boolean>(false)
  const [camId, setCamId] = useState<string>('') // simpan cam id
  const nav = useNavigate()
  const shutter = new Audio(sounds.shutter)
  const currentPhotoPose = photo_guide[userAmount] || photo_guide[1]

  useEffect(() => {
    const initCam = async (): Promise<void> => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) return

        // unlock permission (biar enumerateDevices kebaca normal di Electron/Chrome)
        const temp = await navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        temp.getTracks().forEach((t) => t.stop())

        const devices = await navigator.mediaDevices?.enumerateDevices()
        const cams = devices.filter((d) => d.kind === 'videoinput')

        // set kamera id yang pertama, karena kamera cuman 1
        if (cams[0]?.deviceId) setCamId(cams[0].deviceId)
      } catch (err) {
        console.error('initCam error: ', err)
      }
    }

    initCam()
  }, [])

  // navigasi slider
  const handleNext = (): void => {
    if (currentIndex < capturedImages.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const startCountdown = (retakeIndex: number | null): void => {
    if (retakeIndex !== null) {
      if (countdown === null) {
        setIsRetakeMode(retakeIndex)
        setCountdown(5) // Set countdown ke 5 detik
      }
    } else {
      if (countdown === null && capturedImages.length < selectedFrame.photoAmount) {
        setIsRetakeMode(retakeIndex)
        setCountdown(5) // Set countdown ke 5 detik
        startRecording()
      }
    }
  }

  const startRecording = async (): Promise<void> => {
    if (webcamRef.current && webcamRef.current.video) {
      const stream = webcamRef.current.video.srcObject as MediaStream
      if (!stream) return

      recordedChunksRef.current = []

      const options = MediaRecorder.isTypeSupported('video/webm: codecs=vp9')
        ? { mimeType: 'video/webm; codecs=vp9' }
        : MediaRecorder.isTypeSupported('video/webm; codecs=vp8')
          ? { mimeType: 'video/webm; codecs=vp8' }
          : { mimeType: 'video/webm' }

      const mediaRecorder = new MediaRecorder(stream, options)

      mediaRecorder.ondataavailable = (event): void => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
    }
  }

  const stopRecording = (): void => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      // console.log(videoChunksListRef.current)
      mediaRecorderRef.current.onstop = (): void => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
        videoChunksListRef.current.push(blob)

        // Simpan buffer ke main process
        const index = videoChunksListRef.current.length - 1
        blob.arrayBuffer().then((arrayBuffer) => {
          window.electron.ipcRenderer.send('save-single-video', {
            buffer: Array.from(new Uint8Array(arrayBuffer)), // kirim sebagai array of numbers
            index
          })
        })
      }

      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Mengelola countdown timer
  useEffect(() => {
    if (countdown === 1) {
      setTimeout(() => {
        shutter.play()
      }, 500)
    }
    if (countdown === 0) {
      stopRecording()
      // Mengambil snapshot setelah countdown selesai
      // console.log('Countdown selesai', webcamRef.current)
      if (webcamRef.current && typeof webcamRef.current.getScreenshot === 'function') {
        const imageSrc = webcamRef.current.getScreenshot({ quality: 0.8 })
        if (imageSrc) {
          if (isRetakeMode !== null) {
            const newImages = [...capturedImages]
            newImages[isRetakeMode] = imageSrc
            setRetakeCount((prev) => prev + 1)
            setCapturedImages(newImages)
          } else {
            setCapturedImages([...capturedImages, imageSrc])
          }
        }
        // console.log({ imageSrc })
      } else {
        console.error('Webcam ref is not ready or getScreenshot is not a function')
      }
      setCountdown(null)
      setIsRetakeMode(null)
    }

    if (countdown !== null && countdown > 0) {
      countdownRef.current = window.setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    }

    return (): void => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current)
      }
    }
  }, [countdown])

  useEffect(() => {
    if (capturedImages.length > 0) {
      capturedImagesLengthRef.current = capturedImages.length
      if (isRetakeMode) {
        setCurrentIndex(isRetakeMode)
      } else {
        // console.log(`length: ${capturedImages.length}`)

        setCurrentIndex(capturedImages.length - 1)
      }
    }
  }, [capturedImages])

  useEffect(() => {
    // console.log(timeLeft)
    if (timeLeft === 0 && countdown === null) {
      if (!autoCapturedStartedRef.current) {
        autoCapturedStartedRef.current = true
        if (capturedImagesLengthRef.current < selectedFrame.photoAmount) {
          startCountdown(null)
          setIsAutoCaptured(true)
        } else {
          nav('/photo-edit')
          return
        }
      }
      const interval = setInterval(() => {
        // console.log(`${capturedImagesLengthRef.current} ${selectedFrame.photoAmount}`)
        if (capturedImagesLengthRef.current < selectedFrame.photoAmount) {
          startCountdown(null)
          setIsAutoCaptured(true)
        } else {
          clearInterval(interval)
          nav('/photo-edit')
        }
      }, 7000)
    }
  }, [timeLeft, capturedImages.length, countdown])

  return (
    <StyledPhotoLayout>
      <div className="photo-session photo-session-column">
        <div className="photo-box">
          <Webcam
            key={camId}
            ref={webcamRef}
            audio={false}
            mirrored
            screenshotFormat="image/jpeg"
            videoConstraints={{
              deviceId: camId ? { exact: camId } : undefined,
              facingMode: 'user',
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              frameRate: { ideal: 30 }
            }}
            onUserMediaError={(e) => console.error('Camera error:', e)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '20px'
            }}
          />
          {countdown !== null && <div className="countdown-overlay">{countdown}</div>}
        </div>
        <div
          className={`controls ${capturedImages.length !== 0 && countdown === null && capturedImages.length < selectedFrame.photoAmount ? 'retake-button-include' : 'none'}`}
          style={{ marginTop: '-5%', textAlign: 'center' }}
        >
          {countdown === null && capturedImages.length === 0 ? (
            <button
              className="button blue"
              onClick={() => startCountdown(null)}
              disabled={countdown !== null || capturedImages.length >= selectedFrame.photoAmount}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '3px',
                  justifyContent: 'center'
                }}
              >
                <img src={icons.camera} />
                <span>Mulai Foto</span>
              </div>
            </button>
          ) : capturedImages.length !== 0 && countdown === null && !isAutoCaptured ? (
            <div className="button-gap">
              <button
                className="button orange"
                onClick={() => startCountdown(capturedImages.length - 1)}
                disabled={countdown !== null || retakeCount === 3 || capturedImages.length === 0}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '3px',
                    justifyContent: 'center'
                  }}
                >
                  <img src={icons.refresh} />
                  <span>Retake Foto (Sisa {3 - retakeCount})</span>
                </div>
              </button>
              <button
                style={{
                  display: capturedImages.length >= selectedFrame.photoAmount ? 'none' : 'block'
                }}
                className="button blue"
                onClick={() => startCountdown(null)}
                disabled={countdown !== null || capturedImages.length >= selectedFrame.photoAmount}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '3px',
                    justifyContent: 'center'
                  }}
                >
                  <img src={icons.camera} />
                  <span>Lanjut Foto</span>
                </div>
              </button>
              {capturedImages.length >= selectedFrame.photoAmount && (
                <button
                  className="button orange mobile-finish-btn"
                  onClick={() => {
                    nav('/photo-edit')
                  }}
                >
                  Lanjutkan
                </button>
              )}
            </div>
          ) : null}
        </div>
        <div className="flex-column">
          <div className="photo-guide">
            <div className="title">Hasil Foto</div>
            {capturedImages.length ? (
              <div className="pose-image">
                <img
                  src={capturedImages[currentIndex]}
                  alt={`Captured ${currentIndex + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '20px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            ) : (
              <>
                <div className="pose-image blank" />
              </>
            )}
            <div className="slider">
              <div className="button-slider">
                <img className="clickable" src={icons.roundButton} onClick={handlePrev} />
                <img
                  className="clickable"
                  src={icons.roundButton}
                  style={{ rotate: '180deg' }}
                  onClick={handleNext}
                />
              </div>
              <div className="button-retake">
                <button
                  className="orange clickable"
                  onClick={() => startCountdown(currentIndex)}
                  disabled={countdown !== null || retakeCount === 3 || capturedImages.length === 0}
                >
                  Retake Foto ({3 - retakeCount})
                </button>
              </div>
            </div>
          </div>
          <div className="photo-guide">
            <div className="title">Panduan Pose</div>
            <div className="pose-image">
              <img
                src={
                  currentPhotoPose[capturedImages.length]?.image
                    ? currentPhotoPose[capturedImages.length]?.image
                    : currentPhotoPose[0]?.image
                }
                style={{ objectFit: 'contain', width: '100%', height: '100%', maxHeight: '200px' }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-right desktop-finish-btn">
        <button
          className="button orange"
          onClick={() => {
            nav('/photo-edit')
          }}
          disabled={capturedImages.length + 1 <= selectedFrame.photoAmount}
        >
          Lanjutkan
        </button>
      </div>
    </StyledPhotoLayout>
  )
}

export default PhotoLayout
