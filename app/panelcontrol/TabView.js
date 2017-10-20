module.exports = class TabView {
    constructor(file) {
        this.name = file._name

        this.li = document.createElement('li')
        this.li.classList.add('tab')

        this.a = document.createElement('a')
        this.a.setAttribute('href', `#${file._path}`)

        this.icon = document.createElement('i')
        this.icon.classList.add('fa')
        this.icon.classList.add('fa-times')

        this.saveIcon = document.createElement('i')
        this.saveIcon.classList.add('fa')
        this.saveIcon.classList.add('fa-circle')
        this.saveIcon.classList.add('hidden')
    }

    set name(value) {
        this._name = value
    }

    /**
     * Permet le déclanchement d'un événement sur le clique de l'onglet
     *
     * @param callback
     */
    onClick(callback) {
        this.a.addEventListener('click', callback)
    }

    /**
     * Permet de déclanchement d'un événement sur le clique du bouton de fermeture de l'onglet
     *
     * @param callback
     */
    onClose(callback) {
        this.icon.addEventListener('click', callback)
    }

    /**
     * Permet de placer une notification informant qu'il faut enregister le fichier
     */
    saveNotification() {
        this.saveIcon.classList.remove('hidden')
    }

    /**
     * Permet de supprimer une notification d'enregistrement de fichier
     */
    onSaved() {
        this.saveIcon.classList.add('hidden')
    }

    /**
     * Permet de montrer que l'onglet est en cours d'utilisation
     */
    setActive() {
        this.li.classList.add('active')
    }

    /**
     * Permet de retirer l'état actif sur l'onglet
     */
    unsetActive() {
        this.li.classList.remove('active')
    }

    /**
     * Quand le fichier est en lecture et n'a subit aucune modification
     */
    setRead() {
        this.li.classList.add('read')
    }

    /**
     * Permet de changer le status du fichier de read et write
     */
    unsetRead() {
        this.li.classList.remove('read')
    }

    isReading() {
        return this.li.classList.contains('read')
    }

    render() {
        this.li.classList.add('active')

        this.setRead()

        const text = document.createTextNode(this._name)

        this.a.appendChild(text)

        this.li.appendChild(this.saveIcon)
        this.li.appendChild(this.a)
        this.li.appendChild(this.icon)

        return this.li
    }
}
