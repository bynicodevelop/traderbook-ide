const Helper = require('../Helper')
const FileView = require('./FileView')

module.exports = class FolderView {
    constructor(data, basePath) {
        this.data = data
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

    toggleHiddenFiles(e) {
        e.preventDefault()

        const parentElement = e.target.parentNode
        const nextElement = parentElement.nextElementSibling

        if(nextElement.classList.contains('hidden')) {
            nextElement.classList.remove('hidden')
        } else {
            nextElement.classList.add('hidden')
        }
    }

    render() {
        const li = document.createElement('li')

        // Création du texte
        const div = document.createElement('div')
        div.classList.add('folder')

        const a = document.createElement('a')

        const icon = document.createElement('i')
        icon.classList.add('fa')
        icon.classList.add('fa-folder-o')

        const text = document.createTextNode(this._name)

        a.appendChild(icon)
        a.appendChild(text)

        a.onclick = this.toggleHiddenFiles

        div.appendChild(a)

        // Création de la liste
        const ol = document.createElement('ol')
        ol.classList.add('hidden')

        li.appendChild(div)

        // Lister les fichiers enfants
        const children = this.data.children.sort(Helper.compareFolderFile).reverse()

        children.forEach(child => {
            if(child.type === 'directory') {
                const folderView = new FolderView(child, this.basePath)
                ol.appendChild(folderView.render())
            } else {
                const fileView = new FileView(child, this.basePath)
                ol.appendChild(fileView.render())
            }
        })

        li.appendChild(ol)

        return li
    }
}
