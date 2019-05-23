import {Component} from 'react'
import throttle from 'lodash/throttle'
import {getY, getX} from 'utils/polyfills/bounding-rect'
import {FadeLoader} from 'react-spinners'
import Col from '@emcasa/ui-dom/components/Col'
import theme from 'config/theme'
import {log, LISTING_SEARCH_LOAD_MORE} from 'lib/logging'
import {Container, Footer} from './styles'
import ListingsGrid from 'components/listings/shared/ListingsGrid'
import ListingsLoad from 'components/listings/shared/ListingsLoad'

class ListingInfiniteScroll extends Component {
  static defaultProps = {
    threshold: -35,
    onLoad: Promise.resolve()
  }

  state = {
    loading: false
  }

  footerRef = (el) => {
    this.footer = el
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.onscroll = this.onScroll
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.onscroll = null
    }
  }

  // Distance from the bottom of the viewport to the footer element
  get footerViewportDistance() {
    const {horizontal} = this.props
    if (!this.footer) return null
    const rect = this.footer.getBoundingClientRect()
    return (horizontal ? getX(rect) : getY(rect)) - window.innerHeight
  }

  shouldTriggerLoad = () => {
    const {threshold} = this.props
    const distance = this.footerViewportDistance
    return !isNaN(distance) && distance <= threshold
  }

  loadMore = async () => {
    const {onLoad} = this.props
    this.setState({loading: true})
    const loadedValues = await onLoad()
    log(LISTING_SEARCH_LOAD_MORE, {
      remaining: this.props.remaining_count,
      filters: this.props.filters
    })
    this.setState({loading: false})
  }

  onScroll = throttle(() => {
    const {remaining_count} = this.props
    const {loading} = this.state
    const {onLoad} = this.props
    if (this.shouldTriggerLoad() && remaining_count > 0 && !loading && onLoad)
      this.loadMore()
  }, 500)

  render() {
    const {
      entries,
      titleComponent,
      remaining_count,
      horizontal,
      children: renderEntry
    } = this.props
    return (
      <Container
        style={{position: 'relative'}}
        ref={(wrapper) => (this.wrapper = wrapper)}
      >
        {titleComponent && !horizontal && titleComponent}
        <ListingsGrid>{entries.map(renderEntry)}</ListingsGrid>
        {remaining_count > 0 && (
          <Footer
            className="infinite-scroll-footer"
            ref={this.footerRef}
            horizontal={horizontal}
          >
            <a
              onClick={() => !this.state.loading && this.loadMore()}
              title="Próxima página"
            >
              <Col py={4}>
                <ListingsLoad length={4} />
              </Col>
            </a>
          </Footer>
        )}
      </Container>
    )
  }
}

export default ListingInfiniteScroll
