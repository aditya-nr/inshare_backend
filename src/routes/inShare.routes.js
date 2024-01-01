const inShareSocketIntialize = (io) => {

    return io.on('connection', socket => {

        console.log("connected : ", socket.id);
        // mount all other controllers

    })
}

export default inShareSocketIntialize