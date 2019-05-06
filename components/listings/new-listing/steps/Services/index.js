import React, {Component} from 'react'
import {Formik} from 'formik'
import moment from 'moment'
import * as Sentry from '@sentry/browser'
import {CREATE_LEAD, TOUR_SCHEDULE} from 'graphql/listings/mutations'
import {TOUR_OPTIONS} from 'graphql/listings/queries'
import Button from '@emcasa/ui-dom/components/Button'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Text from '@emcasa/ui-dom/components/Text'
import Container from 'components/listings/new-listing/shared/Container'
import {getSellerLeadInput} from 'lib/listings/insert'
import {
  SELLER_ONBOARDING_SERVICES_SCHEDULE,
  SELLER_ONBOARDING_SERVICES_SKIP,
  SELLER_ONBOARDING_LISTING_CREATION_SUCCESS,
  SELLER_ONBOARDING_LISTING_CREATION_ERROR,
  log
} from 'lib/logging'
import { VideoContainer } from './styles'

class Services extends Component {
  constructor(props) {
    super(props)
    this.tourStep = this.tourStep.bind(this)
    this.skipStep = this.skipStep.bind(this)
    this.nextStep = this.nextStep.bind(this)
    this.updateStateFromProps = this.updateStateFromProps.bind(this)

    this.getAvailableTimes = this.getAvailableTimes.bind(this)

    this.createListing = this.createListing.bind(this)
    this.createTour = this.createTour.bind(this)
    this.save = this.save.bind(this)
  }

  state = {
    wantsTour: false,
    availableTimes: null,
    loading: false,
    error: null,
    listingCreated: false,
    listingId: null,
    tourCreated: false
  }

  componentDidMount() {
    this.updateStateFromProps(this.props)
  }

  componentWillReceiveProps(props) {
    this.updateStateFromProps(props)
  }

  updateStateFromProps(props) {
    const { services } = props
    if (services) {
      this.setState({
        wantsTour: services.wantsTour
      })
    }
  }

  async getAvailableTimes() {
    this.setState({loading: true})
    try {
      const { data } = await apolloClient.query({
        query: TOUR_OPTIONS
      })
      this.setState({
        loading: false,
        error: null
      })
      const tourOptions = data.tourOptions.slice()
      this.tourStep(tourOptions.reverse())
    } catch (e) {
      Sentry.captureException(e)
      this.setState({
        loading: false,
        error: 'Ocorreu um erro. Por favor, tente novamente.'
      })
    }
  }

  tourStep(data) {
    const { navigateTo, updateServices } = this.props
    updateServices({
      wantsTour: this.state.wantsTour,
      tourOptions: data
    })
    navigateTo('tour')
  }

  async createListing() {
    this.setState({loading: true})

    const input = getSellerLeadInput(this.props)
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_LEAD,
        variables: {
          input
        }
      })

      if (data) {
        log(SELLER_ONBOARDING_LISTING_CREATION_SUCCESS, {listing: input})
        this.setState({
          listingCreated: true,
          listingId: data.siteSellerLeadCreate.uuid
        })
      }
    } catch (e) {
      Sentry.captureException(e)
      log(SELLER_ONBOARDING_LISTING_CREATION_ERROR, {
        listing: input,
        error: e && e.message ? e.message : ''
      })
      this.setState({
        loading: false,
        error: 'Ocorreu um erro. Por favor, tente novamente.'
      })
    }
  }

  async createTour() {
    this.setState({loading: true})

    try {
      const { tour, services } = this.props
      const { day, time } = tour
      const { wantsTour } = services

      const datetime = moment(day + time, 'YYYY-MM-DD HH').toDate()
      const { data } = await apolloClient.mutate({
        mutation: TOUR_SCHEDULE,
        variables: {
          input: {
            listingId: this.state.listingId,
            options: {
              datetime
            },
            wantsTour,
            wantsPictures: wantsTour
          }
        }
      })

      if (data) {
        this.setState({tourCreated: true})
      }
    } catch (e) {
      Sentry.captureException(e)
      this.setState({
        loading: false,
        error: 'Ocorreu um erro. Por favor, tente novamente.'
      })
    }
  }

  async save() {
    if (!this.state.listingCreated) {
      await this.createListing()
    }
    if (this.state.listingCreated && !this.state.tourCreated && this.state.wantsTour) {
      await this.createTour()
    }
    if (this.state.listingCreated && this.state.tourCreated || (this.state.listingCreated && !this.state.wantsTour)) {
      this.nextStep()
    }
  }

  skipStep() {
    log(SELLER_ONBOARDING_SERVICES_SKIP)
    const { updateServices } = this.props
    updateServices({
      wantsTour: false
    })
    this.save()
  }

  nextStep() {
    if (this.state.wantsTour) {
      log(SELLER_ONBOARDING_SERVICES_SCHEDULE)
    }
    const { navigateTo, updateListing } = this.props
    updateListing({id: this.state.listingId})
    navigateTo('success')
  }

  render() {
    return (
      <div ref={this.props.hostRef}>
        <Container>
          <Col width={[1,null,null,1/2]}>
            <Formik
              render={() => (
                <>
                  <Text
                    fontSize="large"
                    fontWeight="bold"
                    textAlign="center">
                    Gostaria de produzir um Tour Virtual 3D do seu imóvel?
                  </Text>
                  <VideoContainer>
                    <video
                      style={{width: "100%"}}
                      src="https://s3.amazonaws.com/emcasa-ui/videos/tour-compressed.mp4"
                      type="video/mp4"
                      loop="loop"
                      muted="muted"
                      autoplay="autoplay"
                      playsInline="playsinline">
                    </video>
                  </VideoContainer>
                  <Text textAlign="center" color="grey">
                    Nossa equipe utiliza uma câmera especial para criar um modelo 3D do seu imóvel. Através dele, as pessoas podem visitá-lo antes de agendar a visita presencial.
                  </Text>
                  <Text color="red">{this.state.error}</Text>
                  <Row justifyContent="space-between" mt={4}>
                    <Col>
                      <Button
                        style={{width: 90}}
                        height="tall"
                        onClick={this.skipStep}>Pular</Button>
                    </Col>
                    <Col>
                      <Button
                        active
                        height="tall"
                        onClick={this.getAvailableTimes}>
                        Escolher data
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

export default Services
