import {
  stringToDate, addZ, dateToString, daysBetween, getRanges, prepareCalls, worker
} from './worker'
const mockStringToDate = stringToDate
const mockDaysBetween = daysBetween

jest.mock('./requestPromise', () => {
  return {
    requestPromise: jest.fn((resource, id, start, finish) => {
      const init = mockStringToDate(start)
      const end = mockStringToDate(finish)
      const days = mockDaysBetween(init, end)
      if (days === 1) {
        if (start === '2017-07-17') return 'nope'
        return 10
      }
      return 'Hay más de 100 resultados'
    })
  }
})

describe('helper functions', () => {
  it('should convert a string to date', () => {
    expect(stringToDate('2017-01-01'))
      .toEqual(expect.any(Date))
  })
  it('should convert a date to string', () => {
    expect(dateToString(new Date(2017, 0, 1)))
      .toBe('2017-01-01')
  })
  it('should add zeroes to given value', () => {
    expect(addZ(1)).toBe('01')
    expect(addZ(5)).toBe('05')
    expect(addZ(10)).toBe('10')
    expect(addZ(100)).toBe('00')
  })
  it('should return days between two dates', () => {
    const init = new Date(2017, 0, 1)
    const end = new Date(2017, 11, 31)
    expect(daysBetween(init, end)).toEqual(365)
  })
  it('should create one range of days', () => {
    const init = new Date(2017, 0, 1)
    const end = new Date(2017, 11, 31)
    const days = 500
    expect(getRanges(init, end, days)).toEqual([['2017-01-01', '2017-12-31']])
  })
  it('should create two range of days', () => {
    const init = new Date(2017, 0, 1)
    const end = new Date(2017, 11, 31)
    const days = 300
    expect(getRanges(init, end, days)).toEqual([
      ['2017-01-01', '2017-10-28'],
      ['2017-10-29', '2017-12-31']
    ])
  })
  it('should create one range of days per day', () => {
    const init = new Date(2017, 0, 1)
    const end = new Date(2017, 11, 31)
    const days = 1
    expect(getRanges(init, end, days).length).toEqual(365)
  })
  it('should prepare a set of calls for every 30 days', () => {
    const init = '2017-01-01'
    const end = '2017-12-31'
    expect(prepareCalls(init, end)).toEqual([
      ['2017-01-01', '2017-01-30'],
      ['2017-01-31', '2017-03-01'],
      ['2017-03-02', '2017-03-31'],
      ['2017-04-01', '2017-04-30'],
      ['2017-05-01', '2017-05-30'],
      ['2017-05-31', '2017-06-29'],
      ['2017-06-30', '2017-07-29'],
      ['2017-07-30', '2017-08-28'],
      ['2017-08-29', '2017-09-27'],
      ['2017-09-28', '2017-10-27'],
      ['2017-10-28', '2017-11-26'],
      ['2017-11-27', '2017-12-26'],
      ['2017-12-27', '2017-12-31']
    ])
  })
  it('should prepare a set of calls for every 15 days', () => {
    const init = '2017-01-01'
    const end = '2017-01-25'
    expect(prepareCalls(init, end)).toEqual([
      ['2017-01-01', '2017-01-15'],
      ['2017-01-16', '2017-01-25']
    ])
  })
  it('should prepare a set of calls for every 7 days', () => {
    const init = '2017-01-01'
    const end = '2017-01-14'
    expect(prepareCalls(init, end)).toEqual([
      ['2017-01-01', '2017-01-07'],
      ['2017-01-08', '2017-01-14']
    ])
  })
  it('should prepare a set of calls for every day', () => {
    const init = '2017-01-01'
    const end = '2017-01-06'
    expect(prepareCalls(init, end)).toEqual([
      ['2017-01-01', '2017-01-01'],
      ['2017-01-02', '2017-01-02'],
      ['2017-01-03', '2017-01-03'],
      ['2017-01-04', '2017-01-04'],
      ['2017-01-05', '2017-01-05'],
      ['2017-01-06', '2017-01-06']
    ])
  })
})

describe('worker scrapper', () => {
  it('should return an integer', async () => {
    const val = await worker('facturas', '123', '2017-01-01', '2017-12-31')
    expect(val.numberOfCalls).toBe(453)
  })
})
