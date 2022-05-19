interface SocketMessage {
  gameid: string,
}

interface SocketMessageSender extends SocketMessage {
  sender: string
}

interface SocketMessageGame extends SocketMessage {
  sender: string
  gameasjson: string
}

interface SocketMessageMove extends SocketMessage {
  gameasjson: string
  move: string
  sender: string
}

interface SocketMessageVerified extends SocketMessage {
  gameasjson: string
  move: {gameid: string, sender: string}
}

export {SocketMessage, SocketMessageSender, SocketMessageGame, SocketMessageMove, SocketMessageVerified }   