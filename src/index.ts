import { Elysia } from "elysia";
import globalHandlingErrorPlugin from "./lib/plugins/global-handling-error.plugin";
import loggerPlugin from "./lib/plugins/logger.plugin";
import xCorrelationIDPlugin from "./lib/plugins/x-correlation-id.plugin";
import { user } from "./modules/user";
import { jwtAdminAuthPlugin, jwtPublicAuthPlugin } from "./lib/plugins/jwt-auth.plugin";
import { auth } from "./modules/auth";
import { document } from "./modules/document";
import { chat } from "./modules/chat";
import cors from "@elysiajs/cors";

new Elysia()
  .use(cors({
    origin: "*",
    credentials: true,
  }))
  .use(xCorrelationIDPlugin)
  .use(loggerPlugin)
  .use(globalHandlingErrorPlugin)
  .get("/health-check", () => "OK")

  // ADMIN ROUTES
  .group("/api/v1", (admin) =>
    admin
      .use(jwtAdminAuthPlugin)
      .use(user)
  )

  // USER ROUTES
  .group("/api/v1", (user) =>
    user
      .use(jwtPublicAuthPlugin)
      .use(document)
      .use(chat)
  )

  // PUBLIC ROUTES
  .group("/api/v1", (publicRoutes) =>
    publicRoutes
      .use(auth)
  )

  .listen(3000);

