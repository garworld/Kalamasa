import React from 'react'
import { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { StyledFrameListBox } from '../Styled'
import { imageList, categories } from '../contants/FRAME_DATA'
import { useStore } from '@renderer/hooks/useStore'
import { useMediaQuery } from '@mui/material'

// Komponen TabPanel untuk menampilkan konten sesuai tab yang aktif
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

interface FrameListBoxProps {
  onFrameSelect: (frame: (typeof imageList)[0]) => void
}

const TabPanel = (props: TabPanelProps): JSX.Element => {
  const { children, value, index } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

const FrameListBox = ({ onFrameSelect }: FrameListBoxProps): JSX.Element => {
  const [value, setValue] = useState(0)
  const setSelectedFrame = useStore((state) => state.setSelectedFrame)

  const handleChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setValue(newValue)
  }

  const handleSelect = (frame: (typeof imageList)[0]): void => {
    setSelectedFrame(frame)
    onFrameSelect(frame) // Kirim ke parent
  }

  const isTwoCols = useMediaQuery(`(min-width: 900px)`)
  const cols = isTwoCols ? 2 : 1

  return (
    <StyledFrameListBox>
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{
          borderRight: 2,
          borderColor: '#000',
          maxWidth: 100,
          minWidth: 95,
          // Mengubah warna indikator menjadi hitam
          '& .MuiTabs-indicator': {
            backgroundColor: '#000000',
            width: '3px'
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontFamily: 'Poppins',
            color: '#000000', // Default black
            opacity: 0.9
          },
          // Mengubah warna teks tab yang dipilih menjadi hitam
          '& .MuiTab-root.Mui-selected': {
            color: '#000000',
            fontWeight: 'bold',
            opacity: 1
          },
          // Mengubah warna teks saat hover
          '& .MuiTab-root:hover': {
            color: '#000000',
            opacity: 1
          }
        }}
      >
        {categories.map((category, index) => (
          <Tab
            key={index}
            label={category}
            sx={{
              '& .MuiTab-wrapper': {
                width: '100%',
                alignItems: 'flex-start'
              }
            }}
          />
        ))}
      </Tabs>
      <div className="tab-panel-box">
        <TabPanel value={value} index={value}>
          <ImageList cols={cols} gap={24}>
            {imageList
              .filter((item) => {
                const selectedCategory = categories[value]
                if (selectedCategory === 'Semua') return true
                return item.category === selectedCategory
              })
              .map((item, index) => (
                <ImageListItem key={index} onClick={() => handleSelect(item)}>
                  <img className={'clickable'} src={item.img} alt={item.title} loading="lazy" />
                </ImageListItem>
              ))}
          </ImageList>
        </TabPanel>
      </div>
    </StyledFrameListBox>
  )
}

export default FrameListBox
