const fileService = require('../services/fileService.js');
const User = require('../models/User.js');
const File = require('../models/File.js');
const config = require('config');
const fs = require('fs');
const uuid = require('uuid');

class FileController {
    async createDir(req, res) {
        try {
            const { name, type, parent } = req.body;
            const file = new File({ name, type, parent, user: req.user.id });
            const parentFile = await File.findOne({ _id: parent });
            if (!parentFile) {
                file.path = name;
                await fileService.createDir(file);
            } else {
                file.path = `${parentFile.path}\\${file.name}`;
                await fileService.createDir(file);
                parentFile.childs.push(file._id);
                await parentFile.save();
            }

            await file.save();
            return res.json(file)
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: e })
        }
    }

    async getFiles(req, res) {
        try {
            const { sort } = req.query;
            let files;
            switch (sort) {
                case 'name': files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ name: 1 });
                    break
                case 'type': files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ type: 1 });
                    break
                case 'date': files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ date: 1 });
                    break
                default: files = await File.find({ user: req.user.id, parent: req.query.parent });
                    break
            }
            return res.json(files);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Нет файлов' })
        }
    }

    async uploadFile(req, res) {
        try {
            const file = req.files.file;
            const parent = await File.findOne({ user: req.user.id, _id: req.body.parent });
            const user = await User.findOne({ _id: req.user.id });

            if (user.usedSpace + file.size > user.diskSpace) {
                return res.status(400).json({ massage: 'Не хватает памяти!' });
            }

            user.usedSpace = user.usedSpace + file.size;

            let path;

            if (parent) {
                path = `${config.get('filePath')}\\${user.id}\\${parent.path}\\${file.name}`;
                parent.size = parent.size + file.size;
            } else {
                path = `${config.get('filePath')}\\${user.id}\\${file.name}`;
            }

            if (fs.existsSync(path)) {
                return res.status(400).json({ message: 'Такой файл уже существует!' });
            }

            file.mv(path);

            const type = file.name.split('.').pop();

            let filePath = file.name;

            if (parent) {
                filePath = parent.path + '\\' + file.name;
            }

            const dbFile = new File({
                name: file.name,
                type,
                size: file.size,
                path: filePath,
                parent: parent?.id,
                user: user._id
            })

            await dbFile.save();
            await parent.save();

            res.json(dbFile);

        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Ошибка загрузки!' })
        }
    }

    async downloadFile(req, res) {
        try {
            const file = await File.findOne({ _id: req.query.id, user: req.user.id });
            const path = config.get('filePath') + '\\' + req.user.id + '\\' + file.path
            //  + '\\' + file.name;

            if (fs.existsSync(path)) {
                return res.download(path, file.name);
            }

            res.status(500).json({ massage: 'Ошибка загрузки(или файл не найден)' })

        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Ошибка загрузки' })
        }
    }

    async deleteFile(req, res) {
        try {
            const file = await File.findOne({ _id: req.query.id, user: req.user.id });
            if (!file) {
                res.status(400).json({ message: 'Файл не найден' })
            }

            fileService.deleteFile(file);
            await file.remove();
            return res.status(200).json({ message: 'Файл удален' })
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: 'Папка не пустая' })
        }
    }

    async serchFiles(req, res) {
        try {

            const searchName = req.query.search;
            let files = await File.find({user: req.user.id});
            files = files.filter(file => file.name.includes(searchName));
            return res.json(files);

        } catch(e) {
            console.log(e);
            return res.status(400).json({message: 'Ошибка поиска'})
        }
    }

    async uploadAvatar(req, res) {
        try {
            const file = req.files.file;
            const user = await User.findById(req.user.id);
            const avatarName = uuid.v4() + '.jpg';
            file.mv(config.get('staticPath') + '\\' + avatarName);
            user.avatar = avatarName;
            await user.save();
            return res.json(user);

        } catch (e) {
           console.log(e);
           return res.status(400).json({message: 'Ошибка загрузки фото'});
        }
    }

    async deleteAvatar(req, res) {
        try {
            const user = await User.findById(req.user.id);
            fs.unlinkSync(config.get('staticPath') + '\\' + user.avatar)
            user.avatar = null;
            await user.save();
            return res.json(user);

        } catch (e) {
           console.log(e);
           return res.status(400).json({message: 'Ошибка удаления фото'});
        }
    }
}




module.exports = new FileController();