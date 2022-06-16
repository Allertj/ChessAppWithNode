import { createServer } from "http"
import {Server, Socket} from "socket.io"
import Client from 'socket.io-client'
import { startSocket } from '../socket/sockethandler'
import { connect } from './db'
import { createUser } from '../controllers/auth.controller'
import { createNewGameinDB, startGameInDB } from '../controllers/game.controller'
import { db } from '../models'

describe("Socket tests", () => {
  let io: any
  let serverSocket: any 
  let clientSocket: any
  let httpServer: any
  let port: any

  let gameid: any
  let userid: any

  const createGamesAndUser = async () => {
    await connect()
    const newuser = await createUser("bbb", "bbb@email.com", "bbb", null)
    const newuser2 = await createUser("aaa", "aaa@email.com", "aaa", null)
    const founduser = await db.user.findOne({ username: "bbb"})
    const founduser2 = await db.user.findOne({ username: "aaa"})
    if (founduser && founduser2) {
        gameid = await createNewGameinDB(founduser)
        const foundgame = await db.game.findOne({ _id: gameid})
        if (foundgame) {
        await startGameInDB(foundgame, founduser2) }
        userid = founduser._id
    }

  }

  beforeEach((done) => {
    httpServer = createServer();
    io = new Server(httpServer);
    createGamesAndUser().then(() => {
        httpServer.listen(() => {
            port = httpServer.address().port;
            clientSocket = Client(`http://localhost:${port}`);
            startSocket(io)
            io.on("connection", (socket: any) => {
              serverSocket = socket;
            });
            clientSocket.on("connect", done);
      
          });
    })

  });

  afterEach(async() => {
    io.close();
    clientSocket.close();
})

  test("accept draw", (done) => {
    let otherclientSocket = Client(`http://localhost:${port}`);
    clientSocket.on("draw_finalised", (arg : any) => {
        expect(arg.result).toBe('accepted')
        otherclientSocket.close()
        done()
    })
    clientSocket.emit("initiate", {gameid: gameid});
    otherclientSocket.emit("draw_accepted", {gameid: gameid, gameasjson: "{}"});
  });

  test("concession", (done) => {
    let otherclientSocket = Client(`http://localhost:${port}`);
    clientSocket.on("other_player_has_conceded", (arg : any) => {
        expect(arg.gameid.toString()).toBe(gameid.toString());
        expect(arg.sender.toString()).toBe(userid.toString())
        otherclientSocket.close()
        done()
    })
    clientSocket.emit("initiate", {gameid: gameid});
    otherclientSocket.emit("concede", {gameid: gameid, gameasjson: "{}", sender: userid});
  });

  test("verify move - Stalemate", (done) => {
    serverSocket.on("move_verified_dummy", (arg : any) => {
        db.game.findOne({ _id: gameid}).then(result => {
            if (result) {
            let gameasjson = JSON.parse(result.gameasjson as string);
            expect(gameasjson.status).toBe("Ended")
            expect(result.status).toBe("Stalemate")
            expect(result.result).toBe(`{"draw":true,"by":"Stalemate"}`)
            done()
            }
        })
    })
    clientSocket.emit("move_verified", {move: {gameid: gameid}, gameasjson: JSON.stringify({status: "Stalemate"})});
    clientSocket.emit("move_verified_dummy", "delivered");
  });
})