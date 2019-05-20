import moment from 'moment'
import 'moment/locale/pt-br'
moment.locale('pt-br')

const EARLY = '09'
const LATE = '17'
const EARLY_DISPLAY = 'No começo do dia (das 09h às 12h)'
const LATE_DISPLAY = 'No final do dia (das 16h às 19h)'

const MONTH_KEY_FORMAT = 'YYYY-MM'
const DAY_KEY_FORMAT = 'YYYY-MM-DD'

const getTourMonths = (timeList) => {
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

const getTourDays = (timeList, month) => {
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

const getTimeDisplay = (time, longText) => {
  if (time === EARLY && longText) {
    return EARLY_DISPLAY
  } else if (time === LATE && longText) {
    return LATE_DISPLAY
  }
  return `${time}:00h`
}

const getDateDisplay = (date) => {
  const parser = moment(date)
  return parser.format('DD/MM/YY')
}

const getFullTourDateDisplay = (tour) => {
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

const TOUR_HOURS = ['09', '10', '11', '12', '13', '14', '15', '16', '17']

export {
  getTourMonths,
  getTourDays,
  getTimeDisplay,
  getDateDisplay,
  getFullTourDateDisplay,

  TOUR_HOURS,
  EARLY,
  LATE,
  EARLY_DISPLAY,
  LATE_DISPLAY
}