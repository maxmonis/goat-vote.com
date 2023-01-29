/**
 * Returns the delay in MS to be used for a mock response. Allows
 * mocking loading states in development without slowing down tests
 */
export function mockDelay(devDelay = 500, testDelay = 0) {
  return process.env.NODE_ENV === "test" ? testDelay : devDelay
}
