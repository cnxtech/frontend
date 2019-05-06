import React, {Component} from 'react'
import {Formik} from 'formik'
import * as Sentry from '@sentry/browser'
import {TOUR_OPTIONS} from 'graphql/listings/queries'
import Button from '@emcasa/ui-dom/components/Button'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Text from '@emcasa/ui-dom/components/Text'
import Container from 'components/listings/new-listing/shared/Container'
import {requestCreateSellerLead} from 'components/listings/new-listing/lib/seller-lead'
import {
  SELLER_ONBOARDING_SERVICES_SKIP,
  log
} from 'lib/logging'
import {VideoContainer} from './styles'

class Services extends Component {
  constructor(props) {
    super(props)
    this.tourStep = this.tourStep.bind(this)
    this.skipStep = this.skipStep.bind(this)
    this.nextStep = this.nextStep.bind(this)
    this.updateStateFromProps = this.updateStateFromProps.bind(this)
    this.save = this.save.bind(this)
  }

  state = {
    wantsTour: false,
    availableTimes: null,
    loading: false,
    error: null,
    listingCreated: false,
    siteSellerLeadUuid: null,
    tourCreated: false
  }

  componentDidMount() {
    this.updateStateFromProps(this.props)
  }

  componentWillReceiveProps(props) {
    this.updateStateFromProps(props)
  }

  updateStateFromProps(props) {
    const {services} = props
    if (services) {
      this.setState({
        wantsTour: services.wantsTour
      })
    }
  }

  getAvailableTimes = async () => {
    this.setState({loading: true})
    try {
      const {data} = await apolloClient.query({
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
    const {navigateTo, updateServices} = this.props
    updateServices({
      wantsTour: this.state.wantsTour,
      tourOptions: data
    })
    navigateTo('tour')
  }

  createSellerLead = async () => {
    this.setState({loading: true})
    const response = await requestCreateSellerLead(apolloClient, this.props)
    this.setState({
      loading: false,
      error: response ? null : 'Ocorreu um erro. Por favor, tente novamente.',
      listingCreated: true,
      siteSellerLeadUuid: response
    })
    if (response) {
      this.nextStep()
    }
  }

  async save() {
    if (!this.state.listingCreated) {
      await this.createSellerLead()
    }
  }

  skipStep() {
    log(SELLER_ONBOARDING_SERVICES_SKIP)
    const {updateServices} = this.props
    updateServices({
      wantsTour: false
    })
    this.save()
  }

  nextStep() {
    const {navigateTo, updateListing} = this.props
    updateListing({id: this.state.siteSellerLeadUuid})
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
