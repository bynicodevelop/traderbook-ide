const { ipcRenderer } = require('electron')

const path = require('path')

module.exports = class FileView {
    constructor(data, basePath) {
        this.basePath = basePath
        this.name = data.name
        this.path = data.path
    }

    set name(value) {
        this._name = value
    }

    set path(value) {
        this._path = value // path.join(this.basePath, value)
    }

    onClick(e) {
        e.preventDefault()

        ipcRenderer.send('open:file', this)
    }

    onOpenFile(e) {
        e.preventDefault()

        ipcRenderer.send('open:file', this)
    }

    render() {
        const li = document.createElement('li')
        li.classList.add('file')

        const a = document.createElement('a')

        a.onclick = this.onClick.bind(this)
        // a.ondblclick = this.onOpenFile.bind(this)

        const icon = document.createElement('i')
        icon.classList.add('fa')
        icon.classList.add('fa-file-code-o')

        a.appendChild(icon)

        const text = document.createTextNode(this._name)

        a.appendChild(text)

        li.appendChild(a)

        return li
    }
}
