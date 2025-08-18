import "@testing-library/jest-dom"; 
import { server } from "./server";
import "whatwg-fetch";

/** Global test setup: jsdom + Testing Library + MSW. Starts/stops the mock server and polyfills fetch. */

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

