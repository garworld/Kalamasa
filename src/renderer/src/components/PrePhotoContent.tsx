/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledPrePhotoContent } from '@renderer/Styled'
import FrameListBox from './FrameListBox'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../hooks/useStore'
import { toast } from 'react-toastify'

const PrePhotoContent = (): JSX.Element => {
  const userAmount = useStore((state) => state.userAmount)
  const setUserAmount = useStore((state) => state.setUserAmount)
  const selectedFrame = useStore((state) => state.selectedFrame)
  const setSelectedFrame = useStore((state) => state.setSelectedFrame)
  const nav = useNavigate()

  const handleFrameSelect = (frame: any): void => {
    setSelectedFrame(frame)
  }

  return (
    <StyledPrePhotoContent>
      <div style={{ width: '40%' }}>
        <FrameListBox onFrameSelect={handleFrameSelect} />
      </div>
      <div
        style={{
          width: '60%',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div className="selected-frame">
          <div className="frame">{selectedFrame ? <img src={selectedFrame.img} /> : null}</div>
        </div>
        <div className="flex-column">
          <p>Jumlah orang yang berfoto (maks. 6)</p>
          <div className="flex">
            <div className="flex">
              <button
                className="clickable"
                onClick={() => {
                  if (userAmount === 0) return
                  return setUserAmount(userAmount - 1)
                }}
              >
                -
              </button>
              <div className="show-amount">{userAmount}</div>
              <button
                className="clickable"
                onClick={() => {
                  if (userAmount === 6) return
                  return setUserAmount(userAmount + 1)
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="flex">
          <button
            className="button orange"
            onClick={() =>
              userAmount === 0
                ? toast.error('Masukkan jumlah orang yang berfoto', {
                    className: 'custom-toast-error'
                  })
                : nav('/photo-session')
            }
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </StyledPrePhotoContent>
  )
}

export default PrePhotoContent
