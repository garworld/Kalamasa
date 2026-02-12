/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

interface PaymentSuccessData {
  reference_id: string
  amount: number
  currency: string
}

console.log('Preload script loaded!')

// Custom APIs for renderer
const api = {
  onPaymentSuccess: (callback: (data: PaymentSuccessData) => void): void => {
    ipcRenderer.on('payment-success', (_event: IpcRendererEvent, data: PaymentSuccessData) => {
      callback(data)
    })
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      ipcRenderer: {
        send: (channel, data) => ipcRenderer.send(channel, data),
        on: (channel, listener) => ipcRenderer.on(channel, listener),
        invoke: (channel, data) => ipcRenderer.invoke(channel, data),
        removeListener: (channel, data) => ipcRenderer.removeListener(channel, data)
      }
    })
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = {
    ...electronAPI,
    ipcRenderer: {
      send: (channel, data) => ipcRenderer.send(channel, data),
      on: (channel, listener) => ipcRenderer.on(channel, listener),
      invoke: (channel, data) => ipcRenderer.invoke(channel, data),
      removeListener: (channel, data) => ipcRenderer.removeListener(channel, data)
    }
  }
  // @ts-ignore (define in dts)
  window.api = api
}
