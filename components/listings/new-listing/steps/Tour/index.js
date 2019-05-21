import React, {Fragment, Component} from 'react'
import {Formik, Field} from 'formik'
import RadioButton from '@emcasa/ui-dom/components/RadioButton'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Text from '@emcasa/ui-dom/components/Text'
import View from '@emcasa/ui-dom/components/View'
import Button from '@emcasa/ui-dom/components/Button'
import TourMonths from './components/TourMonths'
import TourDays from './components/TourDays'
import Container from 'components/listings/new-listing/shared/Container'
import {requestCreateTour, requestCreateSellerLead} from 'components/listings/new-listing/lib/seller-lead'
import {
  getTimeRange,
  getTourDays,
  getTourMonths,
  getTimeDisplay,
  TOUR_HOURS,
  MORNING,
  AFTERNOON
} from 'components/listings/new-listing/lib/times'
import {BUTTON_WIDTH} from 'components/listings/new-listing/styles'

class Tour extends Component {
  constructor(props) {
    super(props)
    this.nextStep = this.nextStep.bind(this)
    this.previousStep = this.previousStep.bind(this)

    this.onMonthChanged = this.onMonthChanged.bind(this)
    this.onDaySelected = this.onDaySelected.bind(this)

    this.selectTime = this.selectTime.bind(this)
    this.hasCustomTime = this.hasCustomTime.bind(this)
    this.selectCustomTime = this.selectCustomTime.bind(this)

    this.save = this.save.bind(this)
  }

  state = {
    month: null,
    day: null,
    time: null,
    timeRange: null,
    customTime: false,
    monthOffset: 0,
    dayOffset: 0,
    loading: false,
    listingCreated: false,
    tourCreated: false,
    error: null,
    siteSellerLeadUuid: null
  }

  componentDidMount() {
    this.updateStateFromProps(this.props)
  }

  componentWillReceiveProps(props) {
    this.updateStateFromProps(props)
  }

  updateStateFromProps(props) {
    const { tour, services } = props
    let firstAvailableMonth
    if (services) {
      firstAvailableMonth = getTourMonths(services.tourOptions)[0]
    }
    if (tour) {
      this.setState({
        month: tour.month || firstAvailableMonth.date.getMonth(),
        day: tour.day,
        time: tour.time,
        customTime: tour.customTime,
        dayOffset: tour.dayOffset,
        monthOffset: tour.monthOffset
      })
    }
  }

  nextStep() {
    const { navigateTo, services, updateTour, updateServices, updateListing } = this.props
    updateTour(this.state)
    updateServices({
      tourOptions: services.tourOptions
    })
    updateListing({id: this.state.siteSellerLeadUuid})
    navigateTo('success')
  }

  previousStep() {
    this.props.navigateTo('services')
  }

  createSellerLead = async () => {
    this.setState({loading: true})
    const response = await requestCreateSellerLead(apolloClient, this.props)
    await this.setState({
      loading: false,
      error: response ? null : 'Ocorreu um erro. Por favor, tente novamente.',
      listingCreated: true,
      siteSellerLeadUuid: response
    })
  }

  createTour = async () => {
    this.setState({loading: true})
    const response = await requestCreateTour(apolloClient, this.state)
    await this.setState({
      loading: false,
      error: response ? null : 'Ocorreu um erro. Por favor, tente novamente.',
      tourCreated: response
    })
  }

  async save() {
    if (!this.state.listingCreated) {
      await this.createSellerLead()
    }
    if (this.state.listingCreated && !this.state.tourCreated) {
      await this.createTour()
    }
    if (this.state.listingCreated && this.state.tourCreated) {
      this.nextStep()
    }
  }

  onMonthChanged(month, monthOffset) {
    this.setState({
      month,
      monthOffset
    })
  }

  onDaySelected(day, dayOffset, setFieldTouched, setFieldValue) {
    setFieldValue('day', day)
    setFieldTouched('day')
    setFieldValue('time', null)
    setFieldTouched('time')
    this.setState({
      day,
      dayOffset,
      time: null
    })
  }

  selectTime(time, timeRange) {
    this.setState({
      time,
      timeRange
    })
  }

  validateDay(value) {
    if (!value) {
      return 'É necessário selecionar um dia.'
    }
  }

  validateTime(value) {
    if (!value) {
      return 'É necessário selecionar um horário.'
    }
  }

  hasCustomTime(tourHours) {
    if (tourHours.length === 0) {
      return false
    }
    return !(tourHours.includes(MORNING) && tourHours.includes(AFTERNOON) && tourHours.length === 2)
  }

  selectCustomTime() {
    const { time, customTime } = this.state
    if (time) {
      this.setState({
        time: null,
        customTime: true
      })
      return
    }

    if (!customTime) {
      this.setState({
        time: null
      })
    }
    this.setState({
      customTime: true
    })
  }

  render() {
    const { tour, services } = this.props
    let month, day, time, monthOffset, dayOffset
    if (tour) {
      month = tour.month
      day = tour.day
      time = tour.time
      monthOffset = tour.monthOffset
      dayOffset = tour.dayOffset
    }
    const { tourOptions } = services
    const tourDays = getTourDays(tourOptions, this.state.month)
    const tourMonths = getTourMonths(tourOptions)

    return (
      <div ref={this.props.hostRef}>
        <Container>
          <Col width={[1,null,null,1/2]}>
            <Formik
              initialValues={{
                month,
                day,
                time
              }}
              isInitialValid={() => {
                return !this.validateTime(time) || !this.validateDay(day)
              }}
              render={({isValid, setFieldTouched, setFieldValue}) => (
                <>
                  <Text
                    fontSize="large"
                    fontWeight="bold"
                    textAlign="center">
                    Escolha a melhor data
                  </Text>
                  <Row mb={4}>
                    <Field
                      name="month"
                      render={() =>
                        <TourMonths
                          initialMonthOffset={monthOffset}
                          tourMonths={tourMonths}
                          onMonthChanged={this.onMonthChanged}
                        />
                      }/>
                  </Row>
                  <Row mb={4}>
                    <Field
                      name="day"
                      validate={this.validateDay}
                      render={() =>
                        <TourDays
                          month={month}
                          initialDayOffset={dayOffset || this.state.dayOffset}
                          initialDay={day}
                          tourDays={tourDays}
                          onDaySelected={(day, dayOffset) => {
                            this.onDaySelected(day, dayOffset, setFieldTouched, setFieldValue)
                          }}
                        />
                      }/>
                  </Row>
                  {this.state.day && <Row mb={4}>
                    <Field
                      name="time"
                      validate={this.validateTime}
                      render={() =>
                        <Col width={1}>
                          <RadioButton.Group>
                            {TOUR_HOURS.map((item, index) => {
                              if (item !== MORNING && item !== AFTERNOON) {
                                return null
                              }
                              return (
                                <Fragment key={index}>
                                  <RadioButton
                                    label={getTimeDisplay(item, true)}
                                    value={item}
                                    checked={this.state.time === item && !this.state.customTime}
                                    onClick={() => {
                                      setFieldValue('time', item)
                                      setFieldTouched('time')
                                      this.setState({customTime: false})
                                      const timeRange = this.getTimeRange(item)
                                      this.selectTime(item, timeRange)
                                    }}
                                  />
                                  <View mb={2} />
                                </Fragment>
                              )
                            })}
                          </RadioButton.Group>
                        </Col>
                      }/>
                  </Row>}
                  <Text textAlign="center" color="grey">Lembre-se, sua casa bem arrumada aumenta a qualidade do Tour Virtual 3D e das fotos.</Text>
                  <Text color="red">{this.state.error}</Text>
                  <Row justifyContent="space-between" mt={4}>
                    <Col>
                      <Button
                        style={{width: BUTTON_WIDTH}}
                        height="tall"
                        onClick={this.previousStep}>Voltar</Button>
                    </Col>
                    <Col>
                      <Button
                        style={{width: BUTTON_WIDTH}}
                        height="tall"
                        active={!this.state.loading && isValid}
                        disabled={!isValid || this.state.loading}
                        onClick={this.save}>
                        Agendar
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            />
          </Col>
        </Container>
      </div>
    )
  }
}

export default Tour
