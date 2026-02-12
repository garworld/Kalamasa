import fs from 'fs'
import path from 'path'
import { app, BrowserWindow } from 'electron'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import { Buffer } from 'buffer'

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

const tempDir = path.join(app.getPath('temp'), 'bts-videos')
fs.mkdirSync(tempDir, { recursive: true })

export const saveVideoBuffer = (buffer: Buffer, index: number): void => {
  const filepath = path.join(tempDir, `clip-${index}.webm`)
  fs.writeFileSync(filepath, buffer)
  console.log(`Saved clip-${index}.webm (${buffer.length} bytes)`)
}

export const mergeAllVideos = async (): Promise<string> => {
  const transcodedDir = path.join(tempDir, 'transcoded')
  fs.mkdirSync(transcodedDir, { recursive: true })

  const files = fs
    .readdirSync(tempDir)
    .filter((f) => f.endsWith('.webm'))
    .sort()

  const total = files.length

  // Step 1: Transcode semua .webm ke .ts
  for (let i = 0; i < files.length; i++) {
    const inputPath = path.join(tempDir, files[i])
    const outputPath = path.join(transcodedDir, `${path.parse(files[i]).name}.ts`)

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .format('mpegts')
        .outputOptions(['-preset', 'ultrafast', '-crf', '23'])
        .output(outputPath)
        .on('end', () => {
          const progress = Math.round(((i + 1) / (total + 1)) * 100)
          BrowserWindow.getAllWindows()[0]?.webContents.send('video-transcoded', progress)
          resolve()
        })
        .on('error', reject)
        .run()
    })
  }

  // Step 2: Buat filelist.txt
  const fileListPath = path.join(tempDir, 'filelist.txt')
  const tsFiles = fs
    .readdirSync(transcodedDir)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => `file '${path.join(transcodedDir, f).replace(/\\/g, '/')}'`)
    .join('\n')
  fs.writeFileSync(fileListPath, tsFiles)

  // Step 3: Merge jadi 1 video
  const finalVideoPath = path.join(tempDir, `merged-bts-${Date.now()}.mp4`)
  await new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(fileListPath)
      .inputOptions(['-f', 'concat', '-safe', '0'])
      .outputOptions(['-c:v', 'libx264', '-c:a', 'aac'])
      .output(finalVideoPath)
      .on('end', () => {
        BrowserWindow.getAllWindows()[0]?.webContents.send('video-transcoded', 100)
        resolve()
      })
      .on('error', reject)
      .run()
  })

  // Step 4: Baca video → convert ke base64
  const buffer = fs.readFileSync(finalVideoPath)
  const base64 = buffer.toString('base64')

  // Step 5: Cleanup semua file sementara
  try {
    // Hapus .webm
    fs.readdirSync(tempDir)
      .filter((f) => f.endsWith('.webm'))
      .forEach((f) => fs.unlinkSync(path.join(tempDir, f)))

    // Hapus .ts dan folder-nya
    if (fs.existsSync(transcodedDir)) {
      fs.readdirSync(transcodedDir).forEach((f) => fs.unlinkSync(path.join(transcodedDir, f)))
      fs.rmdirSync(transcodedDir)
    }

    // Hapus filelist
    if (fs.existsSync(fileListPath)) {
      fs.unlinkSync(fileListPath)
    }

    // Hapus video final setelah dibaca
    if (fs.existsSync(finalVideoPath)) {
      fs.unlinkSync(finalVideoPath)
    }

    console.log('Semua file sementara berhasil dibersihkan.')
  } catch (err) {
    console.error('Error saat cleanup:', err)
  }

  return base64
}
