const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

module.exports = class AboutPlugin {
    constructor(app, dialog) {
        this.app = app
        this.dialog = dialog
    }

    get priority() {
        return 1
    }

    get subMenu() {
        return 1
    }

    get menuLabel() {
        return 'About'
    }

    get eventId() {
        return 'app:about'
    }

    event(e, args) {
        const win = new BrowserWindow({
            minWidth: 300,
            minHeight: 150,
            width: 300,
            height: 150,
            show: false })

        win.show()

        // win.webContents.openDevTools()

        win.loadURL(url.format({
            pathname: path.join(__dirname, 'about.html'),
            protocol: 'file:',
            slashes: true
        }))
    }
}
