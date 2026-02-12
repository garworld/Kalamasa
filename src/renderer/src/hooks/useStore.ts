import { imageList } from '@renderer/contants/FRAME_DATA'
import { create } from 'zustand'

export type frame = (typeof imageList)[number]

interface MyState {
  selectedFrame: frame
  setSelectedFrame: (data: frame) => void
  userAmount: number
  setUserAmount: (amount: number) => void
  capturedImages: string[]
  setCapturedImages: (data: string[]) => void
  resetAll: () => void
  mergedImages: string
  setMergeImages: (data: string) => void
  mergedVideos: string
  setMergedVideos: (data: string) => void
  timeLeft: number
  setTimeLeft: (data: number) => void
}

export const useStore = create<MyState>((set) => ({
  selectedFrame: imageList[0],
  setSelectedFrame: (data: frame): void => set(() => ({ selectedFrame: data })),
  userAmount: 1,
  setUserAmount: (amount: number): void => set(() => ({ userAmount: amount })),
  capturedImages: [],
  setCapturedImages: (data: string[]): void => set(() => ({ capturedImages: data })),
  resetAll: (): void =>
    set(() => ({
      selectedFrame: imageList[0],
      userAmount: 1,
      capturedImages: []
    })),
  mergedImages: '',
  setMergeImages: (data: string): void => set(() => ({ mergedImages: data })),
  mergedVideos: '',
  setMergedVideos: (data: string): void => set(() => ({ mergedVideos: data })),
  timeLeft: 300,
  setTimeLeft: (data: number): void => set(() => ({ timeLeft: data }))
}))
