// server.ts
import express from "express";
import cors from "cors";
import * as http from "http";
import { Server as SocketIOServer } from "socket.io";
import { SocketManager } from "./socketManager";

export class Server {
  public static readonly PORT: number = 8080;
  private app: express.Application;
  private server: http.Server;
  private port: string | number;
  private io: SocketIOServer;

  constructor() {
    this.createApp();
    this.configSetup();
    this.createServer();
    this.sockets();
    this.listen();
  }

  private createApp(): void {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json()); // Parse JSON requests
  }

  private createServer(): void {
    this.server = http.createServer(this.app);
  }

  private configSetup(): void {
    this.port = process.env.PORT || Server.PORT || 8080;
  }

  private sockets(): void {
    this.io = require("socket.io")(this.server, { origins: "*:*" });
    new SocketManager(this.io);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });
  }
}

new Server();
