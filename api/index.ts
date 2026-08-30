import { createApp } from '../src/main';

let server: Promise<any> | undefined;

async function getServer() {
  if (!server) {
    server = createApp().then(async (app) => {
      await app.init();
      return app.getHttpAdapter().getInstance();
    });
  }

  return server;
}

export default async function handler(req: any, res: any) {
  const app = await getServer();
  return app(req, res);
}
