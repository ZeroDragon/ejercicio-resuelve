import { requestPromise } from './requestPromise'
import request from 'request'

jest.mock('request', () => {
  return jest.fn((params, cb) => {
    if (params.url === 'undefinedinvoices') {
      cb(null, 'reponse', 'body')
    }
    if (params.url !== 'undefinedinvoices') {
      cb(new Error('nope'), null, null)
    }
  })
})

describe('request promise', () => {
  it('should return data', async () => {
    const resource = 'invoices'
    const id = '123'
    const start = '2017-01-01'
    const finish = '2017-03-30'
    const result = await requestPromise(resource, id, start, finish)
    expect(request).toHaveBeenCalledWith(
      {
        'method': 'GET',
        'qs': {
          'finish': '2017-03-30',
          'id': '123',
          'start': '2017-01-01'
        },
        'url': 'undefinedinvoices'
      },
      expect.any(Function)
    )
    expect(result).toEqual('body')
  })
  it('should return null', async () => {
    const resource = 'onvoices'
    const id = '123'
    const start = '2017-01-01'
    const finish = '2017-03-30'
    const result = await requestPromise(resource, id, start, finish)
    expect(result).toBe('null')
  })
})
