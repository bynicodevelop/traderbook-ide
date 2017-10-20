const ItemMenu = require('./menu/ItemMenu')

module.exports = class Menu {
    constructor(id, templates) {
        this._id = id
        this._templates = templates
    }

    addItem(template) {
        const itemMenu = new ItemMenu(template)

        return itemMenu.render()
    }

    render() {
        const ul = document.getElementById(this._id)

        for(let i = 0; i < this._templates.length; i++) {
            ul.appendChild(this.addItem(this._templates[i]))
        }
    }
}
