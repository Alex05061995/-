const fs = require('fs');
const file = require('../models/File.js');
const config = require('config');

class FileService {

    createDir(file) {
        const filePath = `${config.get('filePath')}\\${file.user}\\${file.path}`;

        return new Promise((resolve, reject) => {
            try {
                if(!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath);
                    return resolve ({mesage: 'Файл создан'})
                } else {
                    return reject({mesage: 'Файл по такому пути уже существует!'})
                }
            } catch {
                return reject({message: 'File error'})
            }
        })
    }

    deleteFile(file) {
        const path = this.getPath(file);
        if(file.type === 'dir') {
            fs.rmdirSync(path);
        } else {
            fs.unlinkSync(path);
        }
    }

    getPath(file) {
        return config.get('filePath') + '\\' + file.user + '\\' + file.path;
    }
 
}


module.exports = new FileService();