/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, BrowserWindow } from 'electron'
import { FastifyInstance, FastifyRequest } from 'fastify'
import nodemailer from 'nodemailer'
import { nanoid } from 'nanoid'
import path from 'path'
import fs from 'fs-extra'

export interface PaymentWebhookBody {
  event: string
  created: string
  business_id: string
  data: {
    id: string
    business_id: string
    currency: string
    amount: number
    status: string
    created: string
    qr_id: string
    qr_string: string
    reference_id: string
    type: string
    channel_code: string
    expires_at: string
    metadata: any
    payment_detail: {
      receipt_id: string | null
      source: string
      name: string | null
      account_details: string | null
      merchant_pan: string | null
      customer_pan: string | null
    }
  }
}

interface CallbackHeaders {
  'x-callback-token': string
}

interface SendPhotoBody {
  email: string
  mergeImageBase64: string
  capturedImagesBase64: string[]
  mergedVideosBase64: string
}

interface SavePhotoBody {
  merged: string
  captured: string[]
  video: string
}

export const routes = async (fastify: FastifyInstance): Promise<void> => {
  // simpan status pembayaran sementara sebelum menggunakan DB
  const paymentStatusStore = {}
  fastify.post(
    '/callback',
    async (
      request: FastifyRequest<{
        Headers: CallbackHeaders
        Body: PaymentWebhookBody
      }>,
      reply
    ) => {
      const { status, reference_id, amount, currency } = request.body.data
      const callbackToken = request.headers['x-callback-token'] as string | undefined

      try {
        if (callbackToken === process.env.WEBHOOK_API_KEY) {
          paymentStatusStore[reference_id] = status
          if (status === 'SUCCEEDED') {
            // console.log('PAYMENT SUCCEEDED')
            const allWindows = BrowserWindow.getAllWindows()
            allWindows.forEach((window) => {
              window.webContents.send('payment-success', {
                reference_id,
                amount,
                currency
              })
            })

            reply.send({ status: 'received' })
          }
        }
      } catch (err) {
        fastify.log.error(err)
        reply.status(500).send('Internal Server Error')
      }
    }
  )

  fastify.get(
    '/payment-status',
    async (request: FastifyRequest<{ Querystring: { reference_id: string } }>, reply) => {
      const { reference_id } = request.query
      try {
        if (!reference_id) {
          return reply.status(400).send({ status: 'INVALID_REFERENCE' })
        }
        const status = paymentStatusStore[reference_id] || 'PENDING'
        return reply.send({ status })
      } catch (err) {
        fastify.log.error(err)
        reply.status(500).send('Internal Server Error')
      }
    }
  )

  fastify.post(
    '/send-photo-email',
    async (request: FastifyRequest<{ Body: SendPhotoBody }>, reply) => {
      const { email, mergeImageBase64, capturedImagesBase64, mergedVideosBase64 } = request.body
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.NODEMAILER_MAIL,
            pass: process.env.NODEMAILER_PASS
          },
          tls: {
            rejectUnauthorized: false
          }
        })

        const attachments = [
          {
            filename: 'photo-merged.png',
            content: mergeImageBase64.split('base64,')[1],
            encoding: 'base64'
          },
          ...capturedImagesBase64.map((img, i) => ({
            filename: `photo-${i + 1}.png`,
            content: img.split('base64,')[1],
            encoding: 'base64'
          })),
          mergedVideosBase64 && {
            filename: `behind-the-scene.mp4`,
            content: mergedVideosBase64.split('base64,')[1],
            encoding: 'base64'
          }
        ].filter(Boolean)

        const info = await transporter.sendMail({
          from: 'PhotoBooth App Snapspot',
          to: email,
          subject: 'Hasil Foto Kamu 📸',
          html: '<p>Berikut hasil fotomu dan behind the scene!</p>',
          attachments: attachments
        })

        reply.send({ success: true, messageId: info.messageId })
      } catch (err: any) {
        fastify.log.error(err)
        const errorMessage =
          err?.message === 'No recipients defined'
            ? 'Alamat email kamu tidak ditemukan. Silakan gunakan alamat email lain yang aktif.'
            : 'Internal Server Error'

        reply.status(500).send(errorMessage)
      }
    }
  )

  const basePath = app.getAppPath()
  const UPLOAD_DIR = path.join(basePath, 'src', 'uploads')

  fs.ensureDirSync(UPLOAD_DIR)

  fastify.post(
    '/upload-photo',
    async (
      request: FastifyRequest<{
        Body: SavePhotoBody
      }>,
      reply
    ) => {
      const { merged, captured, video } = request.body
      try {
        const id = nanoid()
        // console.log({ UPLOAD_DIR })
        const sessionFolder = path.join(UPLOAD_DIR, id)
        await fs.ensureDir(sessionFolder)
        // console.log('Saving to folder:', sessionFolder)
        console.log('Files in session folder:', await fs.readdir(sessionFolder))

        const saveBase64 = async (dataUrl: string, filename: string): Promise<void> => {
          const base64 = dataUrl.split(',')[1]
          const buffer = Buffer.from(base64, 'base64')
          await fs.writeFile(path.join(sessionFolder, filename), buffer)
        }

        // Simpan semua captured
        await Promise.all(captured.map((img, i) => saveBase64(img, `captured_${i}.jpg`)))

        // Simpan merge
        await saveBase64(merged, 'merged.jpg')

        if (video) {
          await saveBase64(video, 'behind-the-scenes.mp4')
        }

        // Balikin URL folder
        const url = `http://localhost:8181/${id}`

        reply.send({
          id,
          folderUrl: url,
          message: 'Photo saved successfully',
          upload_dir: UPLOAD_DIR
        })
      } catch (err) {
        fastify.log.error(err)
        reply.status(500).send('Internal Server Error')
      }
    }
  )
}
