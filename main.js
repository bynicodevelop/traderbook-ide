const {app, ipcMain, BrowserWindow, Menu, dialog, globalShortcut} = require('electron')
const FileManager = require('./app/FileManager')
const Helper = require('./app/Helper')
const fs = require('fs')

const path = require('path')
const url = require('url')

let mainWindow

const menuPattern = [
    {
        label: 'File',
        submenu: [
            // {
            //     label: 'New...',
            //     event: 'file:create'
            // },
            // {
            //     label: 'Open',
            //     accelerator: 'CmdOrCtrl+O',
            //     event: 'project:open'
            // },
            // {
            //     label: '',
            //     separator: true
            // },
            // {
            //     label: 'Quit',
            //     accelerator: 'CmdOrCtrl+Q',
            //     event: 'app:exit'
            // }
        ]
    },
    {
        label: '?',
        submenu: [
            // {
            //     label: 'Help'
            // },
            // {
            //     label: 'About'
            // }
        ]
    }
]

const eventsEmitted = { }

/**
 * Permet de récupérer les plugins pour Initialiser l'application
 */
fs.readdirSync(path.join(__dirname, 'app', 'plugins')).forEach(file => {
    if(path.extname(file) !== '.js') {
        return;
    }

    const pluginName = require(path.join(__dirname, 'app', 'plugins', file))

    const pluginObject = new pluginName(app, dialog)

    eventsEmitted[pluginObject.eventId] = pluginObject.event.bind(pluginObject)

    for(let i = 0; i < menuPattern.length; i++) {
        if(pluginObject.subMenu !== undefined && pluginObject.subMenu === i) {
            menuPattern[i].submenu.push({
                separator: pluginObject.separator !== undefined,
                priority: pluginObject.priority,
                label: pluginObject.menuLabel,
                accelerator: pluginObject.accelerator,
                cmd: pluginObject.cmd,
                event: pluginObject.eventId
            })
        }
    }
})

function createWindow () {
    const menu = Menu.buildFromTemplate([])
    Menu.setApplicationMenu(menu)

    // Create the browser window.
    mainWindow = new BrowserWindow({
      minWidth: 800,
      minHeight: 600,
      width: 1360,
      height: 768
    })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    Helper.setAccelerators(menuPattern, eventsEmitted, mainWindow)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('data:load', (e, data) => {
    e.sender.send('data:loaded', {
        menuPattern
    })
})


const fileManager = new FileManager()

/**
 * Permet de récupérer le contenu d'un fichier
 */
ipcMain.on('open:file', fileManager.open)

/**
 * Permet l'enregistrement d'un fichier
 */
ipcMain.on('save:file', fileManager.save)


ipcMain.on('file:create', (e, args) => {
    console.log( "file:create" );
})


/**
 * Permet de charger les événements des plugins
 */
Object.keys( eventsEmitted ).forEach(event => {
    ipcMain.on(event, eventsEmitted[event])
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
