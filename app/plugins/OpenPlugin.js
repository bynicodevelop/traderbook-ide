const dirTree = require('directory-tree')

module.exports = class OpenPlugin {
    constructor(app, dialog) {
        this.app = app
        this.dialog = dialog
    }

    get priority() {
        return 1
    }

    get subMenu() {
        return 0
    }

    get menuLabel() {
        return 'Open'
    }

    get accelerator() {
        return 'CmdOrCtrl+D'
    }

    get cmd() {
        return 'Ctrl + D'
    }

    get eventId() {
        return 'project:open'
    }

    event(e, args) {
        this.dialog.showOpenDialog({
            properties: ['openDirectory']
        }, folder => {
            if(folder === undefined) return;

            const tree = dirTree(folder[0])

            if(e.sender === undefined) {
                e.send('project:opened', tree)
            } else {
                e.sender.send('project:opened', tree)
            }
        })
    }
}
