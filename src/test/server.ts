import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/** MSW server instance shared across tests (default handlers; tests can override with server.use). */

export const server = setupServer(...handlers);
