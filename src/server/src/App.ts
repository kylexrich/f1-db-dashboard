import Server from './rest/Server';
import { initdb} from "./db";

export class App {
  public initServer(port: number) {
    const server = new Server(port);
    return server.start().catch((err: Error) => {
      console.error(`App::initServer() - ERROR: ${err.message}`);
    });
  }
}

console.info('App - starting');
const app = new App();
(async () => {
  console.info('Initializing database...');
  await initdb();
  console.info('Starting server...');
  await app.initServer(1337);
})();
