import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getPegelJSON } from "./pegel.ts"


const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/pegel", (context) => {
    context.response.body = getPegelJSON()
  })

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });