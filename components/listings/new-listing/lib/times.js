import moment from 'moment'
import 'moment/locale/pt-br'
moment.locale('pt-br')

export const MORNING = '09'
export const AFTERNOON = '13'
export const MORNING_RANGE = ['09', '12']
export const AFTERNOON_RANGE = ['13', '18']
export const MORNING_DISPLAY = 'Manhã (das 09h às 12h)'
export const AFTERNOON_DISPLAY = 'Tarde (das 13h às 18h)'

export const MONTH_KEY_FORMAT = 'YYYY-MM'
export const DAY_KEY_FORMAT = 'YYYY-MM-DD'

export const getTourMonths = (timeList) => {
  const tourMonths = {}
  timeList.forEach((item) => {
    const parser = moment(item)
    const display = parser.format('MMMM [de] YYYY')
    const upperCaseDisplay = display.charAt(0).toUpperCase() + display.slice(1)
    const key = parser.format(MONTH_KEY_FORMAT)

    if (!tourMonths[key]) {
      tourMonths[key] = {
        key,
        date: new Date(item),
        display: upperCaseDisplay
      }
    }
  })
  return Object.values(tourMonths).reverse()
}

export const getTourDays = (timeList, month) => {
  const tourDays = {}
  timeList.forEach((item) => {
    const date = new Date(item)
    if (date.getMonth() !== month) return

    const parser = moment(item)
    const key = parser.format(DAY_KEY_FORMAT)

    if (!tourDays[key]) {
      tourDays[key] = {
        key,
        date,
        day: parser.format('DD'),
        dayOfWeek: parser.format('ddd')
      }
    }
  })
  const tourDaysValues = Object.values(tourDays)
  return tourDaysValues.reverse()
}

export const getTimeDisplay = (time, longText) => {
  if (time === MORNING && longText) {
    return MORNING_DISPLAY
  } else if (time === AFTERNOON && longText) {
    return AFTERNOON_DISPLAY
  }
  return `${time}:00h`
}

export const getDateDisplay = (date) => {
  const parser = moment(date)
  return parser.format('DD/MM/YY')
}

export const getFullTourDateDisplay = (tour) => {
  if (tour && tour.day && tour.time) {
    const date = moment(tour.day).format('DD/MM/YYYY')
    if (tour.timeRange) {
      return `${date} - entre ${tour.timeRange[0]}h e ${tour.timeRange[1]}h`
    }
    return `${date} - às ${tour.time}h`
  } else {
    return '00/00/0000 - entre 00h e 00h'
  }
}

export const getTimeRange = (time) => {
  if (time === MORNING) {
    return MORNING_RANGE
  } else if (time === AFTERNOON) {
    return AFTERNOON_RANGE
  }
}

export const TOUR_HOURS = ['09', '10', '11', '12', '13', '14', '15', '16', '17']
