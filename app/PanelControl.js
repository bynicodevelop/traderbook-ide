const { ipcRenderer } = require('electron')

const TabView = require('./panelcontrol/TabView')
const PanelView = require('./panelcontrol/PanelView')

module.exports = class PanelControl {
    constructor() {
        this.listFile = {}

        ipcRenderer.on('saved:file', (e, data) => {
            if(this.listFile[ data.path ] !== undefined) {
                this.listFile[ data.path ][ 'tabView' ].onSaved()
            }
        })
    }

    onClose(e) {
        e.preventDefault()

        let id = e.target.previousSibling.getAttribute('href')
        id = id.substring(1, id.length)

        const tab = e.target.parentNode
        const panel = document.getElementById(id)

        document.getElementById('tabs-controls').removeChild(tab)
        document.getElementById('panels-controls').removeChild(panel)

        const isActiveTab = tab.classList.contains('active')

        /**
         * Permet d'enregister un fichier lors de la fermeture du fichier
         */
        if(!this.listFile[ id ][ 'tabView' ].isReading()) {
            ipcRenderer.send('save:file', {
                path: this.listFile[ id ][ 'panelView' ].file._path,
                content: this.listFile[ id ][ 'panelView' ].file._code
            })
        }

        delete this.listFile[ id ]

        if(isActiveTab) {
            for(let item in this.listFile) {
                this.listFile[ item ][ 'tabView' ].unsetActive()
                this.listFile[ item ][ 'panelView' ].unsetActive()
            }

            const item = this.listFile[Object.keys(this.listFile)[Object.keys(this.listFile).length - 1]]

            if(item !== undefined) {
                item[ 'tabView' ].setActive()
                item[ 'panelView' ].setActive()
            }
        }
    }

    onClick(e) {
        e.preventDefault()

        let id = e.target.getAttribute('href')
        id = id.substring(1, id.length)

        this.activeControl(id)
    }

    onModelChange(value, file) {
        this.listFile[ file._path ][ 'tabView' ].unsetRead()
        this.listFile[ file._path ][ 'tabView' ].saveNotification()
    }

    activeControl(id) {
        for(let item in this.listFile) {
            this.listFile[ item ][ 'tabView' ].unsetActive()
            this.listFile[ item ][ 'panelView' ].unsetActive()
        }

        this.listFile[ id ][ 'tabView' ].setActive()
        this.listFile[ id ][ 'panelView' ].setActive()
    }

    addControl(file) {
        const tabsControls = document.getElementById('tabs-controls')
        const panelsControls = document.getElementById('panels-controls')

        if(!this.listFile.hasOwnProperty( file._path )) {
            const tabView = new TabView(file)

            tabView.onClick(this.onClick.bind(this))
            tabView.onClose(this.onClose.bind(this))

            tabsControls.appendChild(tabView.render())

            const panelView = new PanelView(file)

            panelView.onChange(this.onModelChange.bind(this))

            this.listFile[file._path] = {
                tabView: tabView,
                panelView: panelView
            }

            panelsControls.appendChild(panelView.render())

            this.activeControl(file._path)
        } else {
            this.activeControl(file._path)
        }
    }
}
