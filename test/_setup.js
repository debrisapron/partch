import Partch from '../src'

beforeAll(() => {
  window.P = Partch()
})

beforeEach(() => {
  P.panic() // Resets context state
})
