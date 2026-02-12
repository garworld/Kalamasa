/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { startServer, stopServer } from '../server/index'
import * as dotenv from 'dotenv'
import { spawn } from 'child_process'
import { saveVideoBuffer, mergeAllVideos } from '../helpers/ffmpeg-helper'
import fs from 'fs'

dotenv.config()

let filebrowserProcess: any

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 1024,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"]
      }
    })
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  const basePath = app.getAppPath()

  // Tentukan path absolut ke filebrowser.exe
  const filebrowserPath = path.join(basePath, 'src', 'filebrowser.exe')
  const uploadsDir = path.join(basePath, 'src', 'uploads')

  const command = `"${filebrowserPath}" -r "${uploadsDir}" -p 8181`

  filebrowserProcess = spawn(command, {
    cwd: path.dirname(filebrowserPath),
    stdio: 'ignore',
    shell: true
  })

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.on('save-single-video', (_, { buffer, index }) => {
    const actualBuffer = Buffer.from(buffer) // balikin ke Buffer
    saveVideoBuffer(actualBuffer, index)
  })

  ipcMain.handle('merge-all-videos', async () => {
    try {
      const finalPath = await mergeAllVideos()
      return finalPath
    } catch (err) {
      console.error('Merge error:', err)
      return null
    }
  })

  ipcMain.handle('check-video-count', () => {
    const tempDir = path.join(app.getPath('temp'), 'bts-videos')
    const files = fs.readdirSync(tempDir).filter((f) => f.endsWith('.webm'))
    return files.length
  })

  ipcMain.on('print-photo', async (_event, base64Data): Promise<void> => {
    const win = new BrowserWindow({ show: false })
    await win.loadURL(
      `data:text/html;charset=utf-8,
    <html>
  <head>
    <style>
      @media print {
        body {
          margin: 0;
        }
        img {
          width: 4in;
          height: 6in;
        }
      }
      body {
        margin: 0;
      }
      img {
        width: 4in;
        height: 6in;
      }
    </style>
  </head>
  <body>
    <img src="${base64Data}" />
    <script>
      window.onload = () => {
        window.print()
      }
    </script>
  </body>
</html>`
    )

    win.webContents.on('did-finish-load', () => {
      setTimeout(() => win.close(), 1000)
    })
  })

  createWindow()
  await startServer()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (filebrowserProcess) filebrowserProcess.kill()
    app.quit()
  }
})

app.on('before-quit', async () => {
  await stopServer()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
