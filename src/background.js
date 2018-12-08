'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'
const express = require('express')
import Docker from 'dockerode'
const docker = new Docker({ socketPath: '/var/run/docker.sock'})
const routes = express()
const cors = require('cors')
routes.use(cors())
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Create server before creating browser window
// Running containers and list of images
routes.get('/home', (req, res, next) => {
  docker.listContainers((err, containers) => {
    docker.listImages((err, images) => {
      res.json({
        containers,
        images
      })
    })
  })
})

// Manipulation containers
routes.get('/container/:id', (req, res) => {
  console.log(req.params.id)
  const id = req.params.id
  const action = req.query.action
  const container = docker.getContainer(id)
  if (action === 'stop') {
    container.stop().then(detail => {
      console.log(detail)
      res.send(detail)
    })
  } else if (action === 'restart') {
    container.restart().then(detail => {
      console.log(detail)
      res.send(detail)
    })
  } else if (action === 'start') {
    container.start().then(detail => {
      console.log(detail)
      res.send(detail)
    })
  } else if (action === 'delete') {
    container.remove().then(detail => {
      console.log(detail)
      res.send(detail)
    })
  } else if (action === 'detail') {
    container.inspect().then(detail => {
      console.log(detail)
      res.send(detail)
    })
  }
})

// Manipulate Images
routes.get('/image/:id', (req, res) => {
  const id = req.params.id
  const action = req.query.action
  const image = docker.getImage(id)
  if (action === 'delete') {
    image.remove().then(detail => {
      res.send(detail)
    })
  } else if (action === 'detail') {
    image.inspect().then(detail => {
      res.send(detail)
    })
  }
})

// List of all containers
routes.get('/containers', (req, res) => {
  docker.listContainers({ all: true }, (err, containers) => {
    if (err) res.send(err)
    else res.json(containers)
  })
})

// List of all images
routes.get('/images', (req, res) => {
  docker.listImages((err, images) => {
    if (err) res.send(err)
    else res.json(images)
  })
})

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true })
function createWindow() {
  // Start server
  routes.listen(3000, () => {
    console.log('sever started')
  })

  // Create the browser window.
  win = new BrowserWindow({ width: 1280, height: 720 })

  if (isDevelopment || process.env.IS_TEST) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools()
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
