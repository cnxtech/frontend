import {
  getTimeRange,
  getTourMonths,
  getTourDays,
  getDateDisplay,
  getFullTourDateDisplay,
  getTimeDisplay,
  MORNING,
  AFTERNOON,
  MORNING_RANGE,
  AFTERNOON_RANGE,
  MORNING_DISPLAY,
  AFTERNOON_DISPLAY
} from 'components/listings/new-listing/lib/times'

const fullList = [
  '2018-11-16T09:15:57.739175',
  '2018-11-16T17:15:57.739175',
  '2018-11-15T09:15:57.739175',
  '2018-11-15T17:15:57.739175',
  '2018-11-14T09:15:57.739175',
  '2018-11-14T17:15:57.739175',
  '2018-11-13T09:15:57.739175',
  '2018-11-13T17:15:57.739175',
  '2018-11-12T09:15:57.739175',
  '2018-11-12T17:15:57.739175'
]

describe('Tour dates', () => {
  it('should return a list of unique tour months', () => {
    const tourMonths = getTourMonths(fullList)
    expect(tourMonths.length).toBe(1)
  })

  it('should return a list of unique days of the given month', () => {
    const tourDays = getTourDays(fullList, 10)
    expect(tourDays.length).toBe(5)
  })

  it('should format date value into user friendly date', () => {
    const date = '2018-11-23'
    expect(getDateDisplay(date)).toBe('23/11/18')
  })

  it('should return a formatted tour date display', () => {
    const tour = {
      day: '2018-11-26',
      time: '09',
    }
    const tourTimeDisplay = getFullTourDateDisplay(tour)
    expect(tourTimeDisplay).toBe('26/11/2018 - às 09h')
  })

  it('should return a formatted tour date display with a time range', () => {
    const tour = {
      day: '2018-11-26',
      time: '09',
      timeRange: ['09', '12']
    }
    const tourTimeDisplay = getFullTourDateDisplay(tour)
    expect(tourTimeDisplay).toBe('26/11/2018 - entre 09h e 12h')
  })

  it('should return an empty tour time display when no tour value is given', () => {
    const tour = {}
    const tourTimeDisplay = getFullTourDateDisplay(tour)
    expect(tourTimeDisplay).toBe('00/00/0000 - entre 00h e 00h')
  })

  it('should return the morning time range when the morning time is passed', () => {
    expect(getTimeRange(MORNING)).toBe(MORNING_RANGE)
  })

  it('should return the afternoon time range when the afternoon time is passed', () => {
    expect(getTimeRange(AFTERNOON)).toBe(AFTERNOON_RANGE)
  })

  it('should return the formatted morning time display when the morning time is passed', () => {
    expect(getTimeDisplay(MORNING)).toBe('09:00h')
  })

  it('should return the formatted afternoon time display when the afternoon time is passed', () => {
    expect(getTimeDisplay(AFTERNOON)).toBe('13:00h')
  })

  it('should return the full morning time display when the morning time is passed', () => {
    expect(getTimeDisplay(MORNING, true)).toBe(MORNING_DISPLAY)
  })

  it('should return the full afternoon time display when the afternoon time is passed', () => {
    expect(getTimeDisplay(AFTERNOON, true)).toBe(AFTERNOON_DISPLAY)
  })
})
