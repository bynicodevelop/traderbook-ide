const { ipcRenderer } = require('electron')
const editor = require('monaco-loader')
const path = require('path')

module.exports = class PanelView {
    constructor(file) {
        this.languages = require(path.join(__dirname, '..', '..', 'languages.json'))

        this.file = file
        this.onChangeEvent = null

        this.div = document.createElement('div')
        this.div.classList.add('panel')
        this.div.id = this.file._path

    }

    setActive() {
        this.div.classList.add('active')
    }

    unsetActive() {
        this.div.classList.remove('active')
    }

    onChange(callback) {
        this.onChangeEvent = callback
    }

    emitChange(value) {
        this.onChangeEvent(value, this.file)
    }

    saveCode(file) {
        ipcRenderer.send('save:file', {
            path: file._path,
            content: file._code
        })
    }

    render() {
        this.div.classList.add('active')

        editor().then(monaco => {
            const ext = path.extname(this.file._path).substring(1, path.extname(this.file._path).length)

            let defaultLanguage = ext

            if(this.languages[ext] !== undefined) {
                defaultLanguage = this.languages[ext]
            }

            const model = monaco.editor.createModel(this.file._code, defaultLanguage)

            const ide = monaco.editor.create(this.div, {
                model: model,
                language: defaultLanguage,
                theme: 'vs-dark',
                automaticLayout: true
            });

            ide.onMouseLeave(e => {
                this.file._code = ide.getValue()

                this.saveCode({
                    _path: this.file._path,
                    _code: this.file._code
                })
            })

            ide.onDidChangeModelContent(e =>  {
                this.emitChange(model.getValue())
            })

            ide.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
                console.log( "save" );
                this.file._code = ide.getValue()

                this.saveCode({
                    _path: this.file._path,
                    _code: this.file._code
                })
            })
        }).catch(e => console.log(e))

        return this.div
    }
}
