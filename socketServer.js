let users = []

const SocketServer = (socket) => {
    socket.on('joinUser', id => {
        users.push({ id: id, socketId: socket.id })
        console.log(users)
    })
    
    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
        console.log(users)
    })

    socket.on('likePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('likeToClient', newPost)
            })
        }
    })
    
    socket.on('unlikePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('unLikeToClient', newPost)
            })
        }
    })
    
    // Comments
    socket.on('createComment', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createCommentToClient', newPost)
            })
        }
    })
    
    socket.on('deleteComment', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
            })
        }
    })
    
    // Follow
    socket.on('follow', newUser => {
        const user = users.find(user => user.id === newUser._id)

        user & socket.to(`${user.socketId}`).emit('followToClient', newUser)
    })
    
    socket.on('unFollow', newUser => {
        const user = users.find(user => user.id === newUser._id)

        user & socket.to(`${user.socketId}`).emit('unFollowToClient', newUser)
    })

    // Notify
    socket.on('createNotify', msg => {
        const clients = users.filter(user => msg.recipients.includes(user.id))

        if(clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createNotifyToClient', msg)
            })
        }
    })
    
    socket.on('removeNotify', msg => {
        const clients = users.filter(user => msg.recipients.includes(user.id))

        if(clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg)
            })
        }
    })

     // Message
     socket.on('addMessage', msg => {
        const user = users.find(user => user.id === msg.recipient)
        user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
    })
}

module.exports = SocketServer