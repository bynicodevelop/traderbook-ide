const Helper = require('./Helper')
const FolderView = require('./treeview/FolderView')
const FileView = require('./treeview/FileView')

module.exports = class TreeView {
    constructor(data, basePath) {
        this.data = data
        this.basePath = basePath
    }

    render() {
        const ol = document.createElement('ol')

        this.data.children.sort(Helper.compareFolderFile)

        console.log( this.data.children );
        const children = this.data.children.reverse()

        children.forEach(el => {
            if(el.type === 'directory') {
                // Création d'un dossier
                const folderView = new FolderView(el, this.basePath)
                ol.appendChild(folderView.render())
            } else {
                // Création d'un fichier
                const fileView = new FileView(el, this.basePath)
                ol.appendChild(fileView.render())
            }
        })

        const fileTreeView = document.getElementById('file-tree-view')

        fileTreeView.innerHTML = null

        fileTreeView.appendChild(ol)
    }
}
