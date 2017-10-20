const fs = require('fs')

module.exports = class FileManager {
    open(e, file) {
        file._code = fs.readFileSync(file._path, 'utf8')

        e.sender.send('opened:file', file)
    }

    save(e, file) {
        fs.writeFileSync(file.path, file.content, 'utf8')

        e.sender.send('saved:file', file)
    }
}
