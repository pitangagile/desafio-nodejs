import http from "http";
import {app} from "./entrypoints/app";
const server = http.createServer(app);
import {config} from "dotenv";
config();
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server listening 
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});