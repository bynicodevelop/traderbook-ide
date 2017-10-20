(() => {
    const { ipcRenderer } = require('electron')
    const Menu = require('./app/Menu')
    const TreeView = require('./app/TreeView')
    const PanelControl = require('./app/PanelControl')

    ipcRenderer.send('data:load')

    ipcRenderer.on('project:opened', (e, data) => {
        const treeView = new TreeView(data, __dirname)
        treeView.render()
    })

    ipcRenderer.on('data:loaded', (e, data) => {
        const menu = new Menu('main-menu', data.menuPattern)
        menu.render()
    })

    const panelControl = new PanelControl()

    ipcRenderer.on('opened:file', (e, file) => {
        panelControl.addControl(file)
    })

    const bodyHeight = document.body.offsetHeight;

    const header = document.getElementById('header')
    const headerHeight = header.offsetHeight

    const minHeightStyle = (bodyHeight - headerHeight) + 'px'

    const fileTreeView = document.getElementById('file-tree-view')
    fileTreeView.style.height = minHeightStyle

    const panelsControl = document.getElementById('panels-controls')
    panelsControl.style.height = minHeightStyle

    const onResizeWindow = () => {
        const bodyHeight = document.body.offsetHeight;

        const minHeightStyle = (bodyHeight - headerHeight) + 'px'

        fileTreeView.style.height = minHeightStyle
        panelsControl.style.height = minHeightStyle
    }

    window.addEventListener('resize', onResizeWindow)
})()
