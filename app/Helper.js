const { globalShortcut } = require('electron')

module.exports = {
    /**
     * Permet de regrouper les dossiers et les fichiers ensemble
     * @param a
     * @param b
     * @returns {number}
     */
    compareFolderFile(a, b) {
        if (a.type > b.type) {
            return -1;
        }

        if (a.type < b.type) {
            return 1;
        }

        return 0;
    },

    sortByPriority(a, b) {
        if (a.priority < b.priority) {
            return -1;
        }

        if (a.priority > b.priority) {
            return 1;
        }

        return 0;
    },

    setAccelerators(patterns, events, main) {
        for(let i = 0; i < patterns.length; i++) {
            if(patterns[i].accelerator !== undefined) {
                globalShortcut.register(patterns[i].accelerator, () => {
                    events[patterns[i].event](main.webContents)
                })
            }

            if(patterns[i].submenu !== undefined) {
                this.setAccelerators(patterns[i].submenu, events, main)
            }
        }
    }
}
