// const server = ""
// const server = "http://192.168.0.146:5000"
const server = "http://127.0.0.1:5000"
const PORT = 5000
const MAX_OPEN_GAMES = 1000

const config = {
    secret: "verysecretchesskeythinkofsomething!!@@!!123"
  };

const dbConfig = {
    HOST: "127.0.0.1",
    PORT: 27017,
    DB: "chessapp"
};

const DockerDB = {
  HOST: "mongo",
  PORT: 27021,
  DB: "chessapp"
};

  const DBADDRESS = `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`
  // const DBADDRESS = `mongodb://${DockerDB.HOST}:${DockerDB.PORT}/${DockerDB.DB}`

export { server, PORT, MAX_OPEN_GAMES, config, dbConfig, DBADDRESS } 