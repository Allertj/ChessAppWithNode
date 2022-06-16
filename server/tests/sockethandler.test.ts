import { createServer } from "http"
import {Server, Socket} from "socket.io"
import Client from 'socket.io-client'
import { startSocket } from '../socket/sockethandler'
import { createNewGameinDB } from '../controllers/game.controller'
import { createUser } from '../controllers/auth.controller'

describe("Socket tests", () => {
  let io: any
  let serverSocket: any 
  let clientSocket: any
  let httpServer: any
  let port: any

  beforeAll((done) => {
    httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      port = httpServer.address().port;
      clientSocket = Client(`http://localhost:${port}`);
      startSocket(io)
      io.on("connection", (socket: any) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);

    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("should work", (done) => {
    expect(serverSocket._events.initiate).toBeTruthy();
    expect(serverSocket._events.move).toBeTruthy();
    expect(serverSocket._events.promotion).toBeTruthy();
    expect(serverSocket._events.propose_draw).toBeTruthy();
    expect(serverSocket._events.draw_accepted).toBeTruthy();
    expect(serverSocket._events.draw_declined).toBeTruthy();
    expect(serverSocket._events.concede).toBeTruthy();
    expect(serverSocket._events.move_verified).toBeTruthy();
    done();
});

  test("connect and join room of id", (done) => {
    clientSocket.on("connectaaa", (arg : any) => {
        expect(arg).toBe("connected to someid")
        expect(io.sockets.adapter.rooms.get("someid")).toBeTruthy()
        done();
    });
    clientSocket.emit("initiate", {gameid: "someid"});
  });

  test("connect other client", (done) => {
    let otherclientSocket = Client(`http://localhost:${port}`);
    otherclientSocket.on("connectaaa", (arg : any) => {
        expect(arg).toBe("connected to someid11")
        expect(io.sockets.adapter.rooms.get("someid11")).toBeTruthy()
        otherclientSocket.close()
        done();
    });
    otherclientSocket.emit("initiate", {gameid: "someid11"});
  });

  test("connect other client2", (done) => {
    let otherclientSocket = Client(`http://localhost:${port}`);
    otherclientSocket.on("connectaaa", (arg : any) => {
        const clients = io.sockets.adapter.rooms.get('someid');
        expect(clients.size).toBe(2)
        otherclientSocket.close()
        done();
    });
    otherclientSocket.emit("initiate", {gameid: "someid"});
  });
  test("promotion", (done) => {
    clientSocket.on("promotion_received", (arg : any) => {
        expect(arg.message).toBe("promotion json")
        done()
    })    
    clientSocket.emit("promotion", {gameid: "someid", message: "promotion json"});
  });

  test("send move", (done) => {
    let otherclientSocket = Client(`http://localhost:${port}`);
    clientSocket.on("othermove", (arg : any) => {
        expect(arg.move).toBe("somemove")
        expect(arg.gameid).toBe("someid")
        otherclientSocket.close()
        done();
    });
    otherclientSocket.emit("move", {gameid: "someid", move: "somemove"});
  });

  test("propose draw", (done) => {
    let otherclientSocket = Client(`http://localhost:${port}`);
    clientSocket.on("draw_proposed", (arg : any) => {
        expect(arg.sender).toBe("senderproposesdraw")
        expect(arg.gameid).toBe("someid")
        otherclientSocket.close()
        done();
    });
    otherclientSocket.emit("propose_draw", {gameid: "someid", sender: "senderproposesdraw"});
  });

  test("decline draw", (done) => {
    let otherclientSocket = Client(`http://localhost:${port}`);
    clientSocket.on("draw_finalised", (arg : any) => {
        expect(arg.result).toBe('declined')
        otherclientSocket.close()
        done()
    })    
    otherclientSocket.emit("draw_declined", {gameid: "someid", gameasjson: "{}"});
  });
});
