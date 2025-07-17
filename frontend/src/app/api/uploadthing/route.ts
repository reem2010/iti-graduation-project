import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// ✅ No token needed here
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
