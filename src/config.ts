const server = process.env.REACT_APP_BACKEND_ADDRESS
const config = {
    secret: process.env.REACT_APP_SECRET as string
  };

export { server, config} 