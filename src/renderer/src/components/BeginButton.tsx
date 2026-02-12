/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import CustomFetch from '../helpers/CustomFetch'
import QRCode from 'react-qr-code'
import { SwipeableButton } from 'react-swipeable-button'
import { StyledBeginButton, StyledModal, StyledActionButton } from '../Styled'
import CustomModal from './CustomModal'
import icons from '../assets/icons'
import images from '../assets/images'
import { useNavigate } from 'react-router-dom'
import { voucherData } from '@renderer/contants/VOUCHER_DATA'

function BeginButton(): JSX.Element {
  const [qrData, setQrData] = useState<string>('')
  const [showModal, setShowModal] = useState<string | boolean>(false)
  const [voucherValue, setVoucherValue] = useState<string>('')
  const [price, setPrice] = useState<number>(35000)
  const [isVoucherValid, setIsVoucherValid] = useState<boolean>(true)
  const referenceIdRef = useRef<string>('')

  const nav = useNavigate()

  const bankArray = [
    images.dana,
    images.gopay,
    images.ovo,
    images.linkaja,
    images.livin,
    images.bca,
    images.wondr,
    images.brimo,
    images.octo,
    images.jenius,
    images.seabank
  ]

  const swipeableButtonRef = useRef<SwipeableButton | null>(null) // Create a ref for the component

  const handleReset = (): void => {
    swipeableButtonRef.current?.buttonReset() // Call the reset method
  }

  const generateExpiryTimestamp = (): string => {
    const currentTime = new Date()

    currentTime.setMinutes(currentTime.getMinutes() + 15)

    const isoString = currentTime.toISOString().split('.')[0] + 'Z'

    return isoString
  }

  const generateReferenceId = (): string => {
    const now = new Date()
    // Format: YYYYMMDD_HHMMSS
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    const h = String(now.getHours()).padStart(2, '0')
    const min = String(now.getMinutes()).padStart(2, '0')
    const s = String(now.getSeconds()).padStart(2, '0')
    // Hasil: 20240527_173012
    return `trx_${y}${m}${d}_${h}${min}${s}`
  }

  const getQrCode = async (): Promise<void> => {
    try {
      const ref_id = generateReferenceId()
      const body = {
        reference_id: ref_id,
        type: 'DYNAMIC',
        currency: 'IDR',
        amount: price,
        expires_at: generateExpiryTimestamp()
      }
      referenceIdRef.current = ref_id
      // console.log({ body })
      const response = await CustomFetch(`/qr_codes`, 'POST', body, true)

      const res = await response.json()
      // console.log(res)
      setQrData(res.id)
    } catch (err) {
      console.log('error', err)
    }
  }

  const checkVoucher = (input: string): void => {
    voucherData.forEach((val) => {
      // console.log({ id: val.voucherId, input })
      if (val.voucherId === input.toUpperCase()) {
        setIsVoucherValid(true)
        if (val.discountAmount.includes('%')) {
          const discValue = parseFloat(val.discountAmount) / 100
          // console.log(discValue)
          if (discValue === 1) {
            setVoucherValue('')
            return nav('/pre-photo')
          } else {
            const newPrice = price * (1 - discValue)
            // console.log(newPrice)
            setPrice(newPrice)
            setVoucherValue('')
            return setShowModal('payment')
          }
        } else {
          const newPrice = price - Number(val.discountAmount)
          setPrice(newPrice)
          setVoucherValue('')
          return setShowModal('payment')
        }
      }
      return setIsVoucherValid(false)
    })
  }

  // const checkPaymentStatus = async (): Promise<void> => {
  //   const response = await CustomFetch(`/payment-status?reference_id=${referenceId}`)
  //   const result = await response.json()
  //   // console.log(result.status)

  //   if (result.status === 'SUCCEEDED') {
  //     nav('/pre-photo')
  //   } else {
  //     toast.error('Pembayaran anda belum diterima, tunggu beberapa saat lagi', {
  //       className: 'custom-toast-error'
  //     })
  //   }
  // }

  useEffect(() => {
    getQrCode()
    if (window.api && window.api.onPaymentSuccess) {
      window.api.onPaymentSuccess(() => {
        nav('/pre-photo')
        setShowModal(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (showModal == false && swipeableButtonRef.current) {
      setTimeout(() => {
        handleReset()
      }, 100)
    }
  }, [showModal])

  useEffect(() => {
    setIsVoucherValid(true)
  }, [voucherValue])

  return (
    <StyledBeginButton>
      <button className="orange" onClick={() => setShowModal('payment')}>
        Mulai Sekarang
      </button>
      <div className="flex">
        <div className="devider"></div>
        <p>atau</p>
        <div className="devider"></div>
      </div>
      <button className="blue" onClick={() => setShowModal('voucher')}>
        Masukkan Voucher
      </button>
      <CustomModal
        showModal={showModal === 'payment'}
        setShowModal={() => {
          setShowModal('payment')
          setPrice(35000)
        }}
      >
        <StyledModal width={'min(920px, 92vw)'} height={'auto'}>
          <div className="flex">
            <div className="title">Bayar menggunakan QRIS</div>
            <img
              src={icons.close}
              className="close"
              onClick={() => {
                setShowModal(false)
                setPrice(35000)
              }}
            />
          </div>
          <div className="payment-content">
            <div className="payment-item">
              <QRCode value={qrData} size={200} />
              <p style={{ fontSize: '10px' }}>{qrData}</p>
              <h1>
                {price.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 2
                })}
              </h1>
              <h2>
                Kode tidak muncul?{' '}
                <span className="refresh" onClick={getQrCode}>
                  Refresh
                </span>
              </h2>
            </div>
            <div className="payment-item">
              <div className="e-wallet">
                <div>Kamu bisa menggunakan mobile banking maupun e-wallet</div>
                <div className="images-box">
                  <div className="images">
                    {bankArray.slice(0, 4).map((val, id) => (
                      <img key={id} src={val} />
                    ))}
                  </div>
                  <div className="images">
                    {bankArray.slice(4, 8).map((val, id) => (
                      <img style={{ maxWidth: '90px', objectFit: 'contain' }} key={id} src={val} />
                    ))}
                  </div>
                  <div className="images">
                    {bankArray.slice(8, 11).map((val, id) => (
                      <img style={{ maxWidth: '100px', objectFit: 'contain' }} key={id} src={val} />
                    ))}
                  </div>
                </div>
                <p>dan semua aplikasi yang menyediakan QRIS</p>
              </div>
            </div>
            <div className="payment-item center">
              <StyledActionButton onClick={() => nav('/pre-photo')}>
                Cek Pembayaran Kamu
              </StyledActionButton>
            </div>
          </div>
        </StyledModal>
      </CustomModal>
      <CustomModal
        showModal={showModal === 'voucher'}
        setShowModal={() => {
          setShowModal('voucher')
          setVoucherValue('')
        }}
      >
        <StyledModal width={'60%'} height={'auto'}>
          <div className="voucher-content">
            <div className="flex">
              <div className="title">Masukkan Kode Voucher</div>
              <img
                src={icons.close}
                className="close"
                onClick={() => {
                  setShowModal(false)
                  setVoucherValue('')
                }}
              />
            </div>
            <div>
              <input
                className="voucher-input uppercase"
                placeholder="Masukkan disini.."
                value={voucherValue}
                onChange={(e) => setVoucherValue(e.target.value)}
              />
            </div>
            {isVoucherValid ? (
              <p>Dapatkan voucher melalui sosial media kami</p>
            ) : (
              <p style={{ color: 'red' }}>Maaf, kode voucher kamu tidak berlaku</p>
            )}
            <div style={{ textAlign: 'center' }} className="center">
              <StyledActionButton
                onClick={() => {
                  checkVoucher(voucherValue)
                }}
              >
                Masukkan Voucher
              </StyledActionButton>
            </div>
          </div>
        </StyledModal>
      </CustomModal>
    </StyledBeginButton>
  )
}

export default BeginButton
