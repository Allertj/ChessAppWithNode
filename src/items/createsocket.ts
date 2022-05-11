import { server } from '../config'
import socketIOClient from "socket.io-client";

const createSocket = (token: string, id: string) => {
    const ENDPOINT = `${server}`;
    const socket = socketIOClient(ENDPOINT, {
        auth: {
            token: token,
            id: id
        }})

    socket.on("connectaaa", (msg) => {
      console.log("connected to socket:", msg)
    })

    socket.on("disconnect", () => {
      console.log("disconnected from socket:", socket.id); 
    });
    return socket
}

export { createSocket } 