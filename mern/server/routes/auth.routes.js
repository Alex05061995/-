const Router = require('express');
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const authMiddleware = require('../middleWares/auth.middleware.js');
const fileService = require('../services/fileService.js');
const File = require('../models/File.js');

const router = new Router();

router.post('/registration',
    [
        check('email', 'Неверный email',).isEmail(),
        check('password', 'Пароль должен быть не меньше 3 и не больше 12 символов').isLength({ min: 3, max: 12 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Запрос не прошел', errors })
            }

            const { email, password } = req.body;

            const condidate = await User.findOne({ email });

            if (condidate) {
                return res.status(400).json({ message: `Пользователь с таким email ${email} уже существует` })
            }

            const hashPassword = await bcrypt.hash(password, 7);

            const user = new User({
                email: email,
                password: hashPassword
            })

            await user.save();
            await fileService.createDir(req, new File({user: user.id, name: ''}));
            return res.json({ message: 'Пользователь зарегестрирован' });

        } catch (e) {
            console.log(e);
            res.send({ message: 'Server error' })
        }
    })

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Пользователь по этому email не найден' })
        }

        const isValidePassword = bcrypt.compareSync(password, user.password);

        if (!isValidePassword) {
            return res.status(404).json({ message: 'Пароль неверный' })
        }

        const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1h' });

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                useSpace: user.useSpace,
                avatar: user.avatar
            }
        })

    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})


router.get('/auth', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id });

        const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1h' });

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                useSpace: user.usedSpace,
                avatar: user.avatar
            }
        })

    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' })
    }
})

module.exports = router;