/* eslint-disable react-hooks/exhaustive-deps */
import icons from '@renderer/assets/icons'
import { mergeImageWithFrame } from '../helpers/MergeImageWithFrame'
import { useStore } from '@renderer/hooks/useStore'
import { StyledPhotoLayout } from '@renderer/Styled'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const EditPhotoLayout = (): JSX.Element => {
  const selectedFrame = useStore((state) => state.selectedFrame)
  const capturedImages = useStore((state) => state.capturedImages)
  const setMergeImages = useStore((state) => state.setMergeImages)
  const [orderImages, setOrderImages] = useState<string[]>([...capturedImages])
  const [selectedFilter, setSelectedFilter] = useState<string>('No Filter')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 })
  const nav = useNavigate()
  const frameRef = useRef<HTMLDivElement>(null)
  const filterList = [
    { name: 'Normal', color: '#757575' },
    { name: 'Black & White', color: '#B5B5B5' },
    { name: 'Yellow', color: '#FFD83A' },
    { name: 'Vintage', color: '#FF8989' },
    { name: 'Modern', color: '#26EF84' },
    { name: 'Sky', color: '#6BDCFF' }
  ]

  const handlePhotoClick = (index: number): void => {
    // console.log({ index })
    if (selectedIndex === null) {
      setSelectedIndex(index) // pilih pertama
    } else {
      if (selectedIndex !== index) {
        const newOrder = [...orderImages]
        ;[newOrder[selectedIndex], newOrder[index]] = [newOrder[index], newOrder[selectedIndex]]
        setOrderImages(newOrder)
      }
      toast.dismiss()
      toast.success('Tata letak foto berhasil diubah.', { className: 'custom-toast-success' })
      setSelectedIndex(null) // reset setelah swap
    }
  }

  const handleMergeAndContinue = async (): Promise<void> => {
    const result = await mergeImageWithFrame(
      orderImages,
      selectedFrame.img,
      selectedFrame.photoPos,
      selectedFilter
    )
    setMergeImages(result)

    const expectedCount = selectedFrame.photoAmount

    // Check if running in Electron
    if (!window.electron) {
      console.warn('Electron API not found. Skipping video processing.')
      nav('/loading', { state: { from: location.pathname } })
      return
    }

    const interval = setInterval(async () => {
      try {
        const count = await window.electron.ipcRenderer.invoke('check-video-count')
        console.log(`⏳ Waiting for video files: ${count}/${expectedCount}`)

        if (count >= expectedCount) {
          clearInterval(interval)
          window.electron.ipcRenderer.send('merge-all-videos')
          nav('/loading', { state: { from: location.pathname } })
        }
      } catch (error) {
        console.error('Error checking video count:', error)
        clearInterval(interval)
        nav('/loading', { state: { from: location.pathname } })
      }
    }, 500)
  }

  const getFilterStyle = (filterName: string): string => {
    switch (filterName) {
      case 'Black & White':
        return 'grayscale(100%)'
      case 'Yellow':
        return 'sepia(100%) hue-rotate(30deg) saturate(3)'
      case 'Vintage':
        return 'contrast(0.8) sepia(0.4)'
      case 'Modern':
        return 'saturate(2) brightness(1.2)'
      case 'Sky':
        return 'hue-rotate(180deg) brightness(1.1)'
      default:
        return 'none'
    }
  }

  useEffect(() => {
    const processImages = async (): Promise<void> => {
      if (capturedImages.length < 2) return

      try {
        const result = await mergeImageWithFrame(
          capturedImages,
          selectedFrame.img,
          selectedFrame.photoPos,
          selectedFilter
        )

        setMergeImages(result) // disimpan ke state hasil merge
      } catch (err) {
        console.error('Error merging images:', err)
      }
    }

    if (capturedImages.length >= 2 && selectedFrame?.img) {
      processImages()
    }
  }, [capturedImages, selectedFrame, selectedFilter])

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0] && entries[0].contentRect) {
        const { width, height } = entries[0].contentRect
        setFrameSize({ width, height })
        // console.log({ width, height })
      }
    })

    if (frameRef.current) {
      resizeObserver.observe(frameRef.current)
    }

    return (): void => {
      resizeObserver.disconnect()
    }
  }, [])

  const renderedPhotoSlots = useMemo(() => {
    if (!frameSize.width || !frameSize.height) return null
    return selectedFrame.photoPosPreview.map((pos, i) => {
      const left = pos.x * frameSize.width
      const top = pos.y * frameSize.height
      const width = pos.width * frameSize.width
      const height = pos.height * frameSize.height

      return (
        <div
          key={i}
          onClick={() => handlePhotoClick(i)}
          style={{
            position: 'absolute',
            left,
            top,
            width,
            height,
            cursor: 'pointer',
            overflow: 'hidden'
          }}
        >
          <img
            src={orderImages[i]}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: selectedIndex === i ? 'brightness(0.3)' : getFilterStyle(selectedFilter)
            }}
          />
          {selectedIndex === i && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                width: '100%'
              }}
            >
              <img src={icons.swap} style={{ width: '28px' }} />
            </div>
          )}
        </div>
      )
    })
  }, [frameSize, orderImages, selectedIndex, selectedFilter])

  return (
    <StyledPhotoLayout>
      <div
        style={{
          width: '100%',
          height: '90%',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        <div className="photo-session">
          <div className="edit-box width-30">
            <div className="title">Pilih Filter</div>
            <div className="filter-list">
              <div className="flex">
                {filterList.map((val, idx) => {
                  return (
                    <div
                      key={idx}
                      className={`button-filter clickable ${val.name === selectedFilter ? 'border' : null}`}
                      onClick={() => setSelectedFilter(val.name)}
                      style={{ backgroundColor: val.color }}
                    >
                      {val.name}
                    </div>
                  )
                })}
              </div>
              {/* <div className="flex">
                {filterList.slice(3, 6).map((val, idx) => {
                  return (
                    <div
                      key={idx}
                      className={`button-filter clickable ${val.name === selectedFilter ? 'border' : null}`}
                      onClick={() => setSelectedFilter(val.name)}
                      style={{ backgroundColor: val.color }}
                    >
                      {val.name}
                    </div>
                  )
                })}
              </div> */}
            </div>
          </div>
          <div className="edit-box width-70">
            <div className="title">Edit letak foto</div>
            <div className="filter-list">
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  objectFit: 'contain'
                }}
              >
                <div
                  ref={frameRef}
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '2 / 3', // atau sesuaikan ratio framenya
                    backgroundImage: `url("${selectedFrame.img}")`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {renderedPhotoSlots}
                </div>
              </div>
            </div>
            <div className="edit-position">
              {selectedIndex !== null
                ? 'Sekarang, pilih posisi baru untuk foto yang dipilih'
                : 'Pilih foto yang ingin kamu pindahkan'}
            </div>
          </div>
        </div>
        <div className="flex-right">
          <button className="button orange" onClick={handleMergeAndContinue}>
            Lanjutkan
          </button>
        </div>
      </div>
    </StyledPhotoLayout>
  )
}

export default EditPhotoLayout
