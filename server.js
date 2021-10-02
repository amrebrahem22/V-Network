require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer')
const { ExpressPeerServer } = require('peer')

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Socket
const http = require('http').createServer(app);
const io = require('socket.io')(http)

io.on('connection', socket => {
    SocketServer(socket)
})

// Peer server
ExpressPeerServer(http, {path: '/' })

// Connect to Mongo
const URI = process.env.MONGO_URL;

mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log('Connected To MongoDB');
})

// Routes
app.use('/api', require('./routes/authRouter'));
app.use('/api', require('./routes/userRouter'))
app.use('/api', require('./routes/postRouter'))
app.use('/api', require('./routes/commentRouter'))
app.use('/api', require('./routes/notifyRouter'))
app.use('/api', require('./routes/messageRouter'))

const port = process.env.PORT || 5000;

http.listen(port, () => console.log(`Server Running on Port ${port}`))