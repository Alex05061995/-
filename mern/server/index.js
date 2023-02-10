const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const authRouter = require('./routes/auth.routes.js');
const app = express();
const PORT = process.env.PORT || config.get('serverPort');
const corsMiddleware = require('./middleWares/cors.middleware.js');
const fileRouter = require('./routes/file.routes.js');
const fileUpload = require('express-fileupload');
const filePathMiddleware = require('./middleWares/filepath.middleWare.js');
const path = require('path')

app.use(corsMiddleware);
app.use(filePathMiddleware(path.resolve(__dirname, 'files')));
app.use(express.json());
app.use(fileUpload({}));
app.use(express.static('static'));
app.use('/api/auth', authRouter);
app.use('/api/files', fileRouter);



const start = async() => {
    try {
        mongoose.set('strictQuery', true);
        mongoose.connect(config.get('dbURL'))
        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        })
    } catch(e) {
        console.log(e.message)
    }
}

start();