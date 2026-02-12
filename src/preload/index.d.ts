/* eslint-disable @typescript-eslint/no-explicit-any */
export {}

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, data?: any) => void
        on: (channel: string, listener: (...args: any[]) => void) => void
        once: (channel: string, listener: (...args: any[]) => void) => void
        invoke: (channel: string, data?: any) => Promise<any>
        removeListener: (channel: string, listener: (...args: any[]) => void) => void
      }
    }
    api: {
      onPaymentSuccess: (callback: (data: PaymentSuccessData) => void) => void
    }
  }

  interface PaymentSuccessData {
    reference_id: string
    amount: number
    currency: string
  }
}
