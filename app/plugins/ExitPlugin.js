module.exports = class OpenPlugin {
    constructor(app) {
        this.app = app
    }

    get separator() {
        return true
    }

    get priority() {
        return 100
    }

    get subMenu() {
        return 0
    }

    get menuLabel() {
        return 'Exit'
    }

    get accelerator() {
        return 'CmdOrCtrl+Q'
    }

    get cmd() {
        return 'Ctrl + Q'
    }

    get eventId() {
        return 'app:exit'
    }

    event(e, args) {
        if (process.platform !== 'darwin') {
            this.app.quit()
        }
    }
}
