import { prepareResponse, sort } from './prepareResponse'
import mockResults from './__mocks__/allResults.json'

describe('prepareResponse', () => {
  it('should return a mutated object', () => {
    mockResults.elapsedMs = 800
    const mutated = (prepareResponse(mockResults))
    expect(mutated).toEqual({
      total: 1075,
      numberOfCalls: 20,
      elapsedMs: 800,
      details: expect.any(Array)
    })
  })
  it('should return items in order', () => {
    const shuffled = [
      { start: '2017-07-30', finish: '2017-08-13', result: '56' },
      { start: '2017-01-31', finish: '2017-03-01', result: '99' },
      { start: '2017-07-30', finish: '2017-08-13', result: '56' }
    ]
    shuffled.sort(sort)
    expect(shuffled).toEqual([
      { start: '2017-01-31', finish: '2017-03-01', result: '99' },
      { start: '2017-07-30', finish: '2017-08-13', result: '56' },
      { start: '2017-07-30', finish: '2017-08-13', result: '56' }
    ])
  })
})
