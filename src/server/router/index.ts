// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { coinRouter } from "./coin";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("coin.", coinRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
