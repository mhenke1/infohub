import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { getPegelJSON } from "./pegel.ts"
import { getBusJSON } from "./bus.ts"


const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/pegel", (context) => {
    context.response.body = getPegelJSON()
  })
  .get("/departures", (context) => {
    context.response.body = getBusJSON()
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });