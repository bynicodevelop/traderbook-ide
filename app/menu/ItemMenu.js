const { ipcRenderer } = require('electron')
const Helper = require('../Helper')

module.exports = class ItemMenu {
    constructor(template) {
        this._template = template

        if(this._template.submenu !== undefined && this._template.submenu.length) {
            this._template.submenu.sort(Helper.sortByPriority)
        }
    }

    addSubMenu(template) {
        const itemMenu = new ItemMenu(template)

        return itemMenu.render()
    }

    addSeparator() {
        const li = document.createElement('li')
        li.classList.add('separator')

        return li
    }

    onClick(e) {
        if(this._template.event !== undefined) {
            ipcRenderer.send(this._template.event)
        }
    }

    render() {
        const li = document.createElement('li')

        const a = document.createElement('a')
        a.setAttribute('href', '#')

        a.onclick = this.onClick.bind(this)

        const text = document.createTextNode(this._template.label)

        a.appendChild(text)

        if(this._template.cmd !== undefined) {
            const span = document.createElement('span')
            const cmdText = document.createTextNode(this._template.cmd)
            span.appendChild(cmdText)
            a.appendChild(span)
        }

        li.appendChild(a)

        if(this._template.submenu !== undefined && this._template.submenu.length) {
            const ul = document.createElement('ul')

            for(let i = 0; i < this._template.submenu.length; i++) {
                if(this._template.submenu[i].separator) {
                    ul.appendChild(this.addSeparator())
                }

                ul.appendChild(this.addSubMenu(this._template.submenu[i]))
            }

            li.appendChild(ul)
        }

        return li
    }
}
