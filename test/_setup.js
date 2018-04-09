import { expect } from 'chai'
import Partch from '../src'

before(() => {
  window.P = Partch()
  window.expect = expect
})

beforeEach(() => {
  P.panic() // Resets context state
})
