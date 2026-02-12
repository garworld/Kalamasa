/* eslint-disable @typescript-eslint/no-explicit-any */
import icons from '@renderer/assets/icons'
import images from '@renderer/assets/images'
import { StyledModal, StyledSharingPhoto } from '@renderer/Styled'
import { useState } from 'react'
import CustomModal from './CustomModal'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@renderer/hooks/useStore'
import CustomFetch from '@renderer/helpers/CustomFetch'
import { toast } from 'react-toastify'
import Lottie from 'lottie-react'

const SharingPhotoLayout = (): JSX.Element => {
  const mergeImages = useStore((state) => state.mergedImages)
  const capturedImages = useStore((state) => state.capturedImages)
  const mergedVideos = useStore((state) => state.mergedVideos)
  const [selectedView, setSelectedView] = useState<string>('photo')
  const [showModal, setShowModal] = useState<string | boolean>(false)
  const [userEmail, setUserEmail] = useState<string>('')
  const [qrValue, setQrValue] = useState<string>('')
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false)
  const nav = useNavigate()

  // send via email
  const handleSendEmail = async (): Promise<void> => {
    try {
      setIsLoadingButton(true)
      const body = {
        email: userEmail,
        mergeImageBase64: mergeImages,
        capturedImagesBase64: capturedImages,
        mergedVideosBase64: mergedVideos
      }
      // console.log(body)

      const res = await CustomFetch('/send-photo-email', 'POST', body, false)

      if (res.ok) {
        const result = await res.json()
        console.log(result)
        toast.success(
          'Foto dan behind the scene telah dikirimkan ke email kamu. Apabila tidak masuk, cek folder spam atau gunakan alamat email lainnya.',
          { className: 'custom-toast-success' }
        )
      } else {
        const errorData = await res.json() // kalau backend kasih info error
        console.error('Error:', errorData)
        toast.error(errorData?.message || 'Terjadi kesalahan saat mengirim email.', {
          className: 'custom-toast-error'
        })
      }
      setIsLoadingButton(false)
    } catch (err: any) {
      console.log('error', err)
      toast.error(
        err?.message ||
          'Alamat email kamu tidak ditemukan. Silakan gunakan alamat email lain yang aktif.',
        {
          className: 'custom-toast-error'
        }
      )
      setIsLoadingButton(false)
    }
  }

  const handleShareQR = async (): Promise<void> => {
    try {
      const body = {
        merged: mergeImages,
        captured: capturedImages,
        video: mergedVideos
      }

      const res = await CustomFetch('/upload-photo', 'POST', body, false)
      const result = await res.json()

      setShowModal('qr-code')
      // console.log(result.folderUrl)
      // console.log(result.upload_dir)
      setQrValue(result.folderUrl)
    } catch (err) {
      console.log('error', err)
    }
  }

  return (
    <StyledSharingPhoto>
      <div className="flex">
        <div className="content">
          <div className="select-result">
            <img
              className={`clickable ${selectedView === 'photo' ? 'active' : null}`}
              onClick={() => setSelectedView('photo')}
              src={images.girl}
              width={'150px'}
            />
            <img
              className={`clickable ${selectedView === 'bts' ? 'active' : null}`}
              onClick={() => setSelectedView('bts')}
              src={images.girlBts}
              width={'150px'}
            />
          </div>
          {selectedView === 'photo' ? (
            <div className="view">
              <img
                src={mergeImages}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
          ) : (
            <div className="view border">
              {mergedVideos ? (
                <video
                  src={mergedVideos}
                  controls
                  width="100%"
                  style={{ borderRadius: '14px', objectFit: 'contain' }}
                />
              ) : (
                <div>Video belum tersedia</div>
              )}
            </div>
          )}
        </div>
        <div className="select-result">
          <div className="round-button clickable" onClick={() => setShowModal('email')}>
            <img src={icons.mail} />
            <span>Email</span>
          </div>
          <div className="round-button clickable" onClick={handleShareQR}>
            <img src={icons.qrCode} />
            <span>QR Code</span>
          </div>
        </div>
      </div>
      <div className="flex-right">
        <button
          className="button orange"
          onClick={() => {
            if (window.electron) {
              window.electron.ipcRenderer.send('print-photo', mergeImages)
            } else {
              console.warn('Electron API not found. Skipping print.')
            }
            nav('/thanks')
          }}
        >
          Print dan Selesai
        </button>
      </div>
      <CustomModal showModal={showModal === 'email'} setShowModal={() => setShowModal(false)}>
        <StyledModal width={'70%'} height={'auto'}>
          <div className="flex">
            <div className="title">Kirim foto dan behind the scene ke email kamu</div>
            <img src={icons.close} className="close" onClick={() => setShowModal(false)} />
          </div>
          <div>
            <input
              className="voucher-input"
              placeholder="Alamat email kamu"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>
          <div className="flex center">
            <button
              className="orange"
              onClick={handleSendEmail}
              disabled={isLoadingButton || !userEmail}
            >
              {isLoadingButton ? (
                <div style={{ width: '65px', display: 'flex' }}>
                  <Lottie animationData={images.loading} loop={true} />
                </div>
              ) : (
                <span>Kirim ke Email</span>
              )}
            </button>
          </div>
        </StyledModal>
      </CustomModal>
      <CustomModal showModal={showModal === 'qr-code'} setShowModal={() => setShowModal(false)}>
        <StyledModal width={'30%'} height={'auto'}>
          <div className="flex">
            <div className="title">QR Code</div>
            <img src={icons.close} className="close" onClick={() => setShowModal(false)} />
          </div>
          <div className="flex center">
            <QRCode value={qrValue} size={200} />
          </div>
          <div className="flex center">
            <span className="text-center">
              Scan QR diatas untuk menyimpan foto dan video behind the scene
            </span>
          </div>
        </StyledModal>
      </CustomModal>
    </StyledSharingPhoto>
  )
}

export default SharingPhotoLayout
