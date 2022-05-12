// const server = ""
const server = "http://127.0.0.1:5000"
const PORT = 5000
const MAX_OPEN_GAMES = 1000
const MAX_TOTAL_GAMES = 1000

const config = {
    secret: "verysecretchesskeythinkofsomething!!@@!!123"
  };

const dbConfig = {
    HOST: "127.0.0.1",
    PORT: 27017,
    DB: "chessapp"
};

export { server, PORT, MAX_OPEN_GAMES, MAX_TOTAL_GAMES, config, dbConfig } 