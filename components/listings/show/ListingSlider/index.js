import {Component} from 'react'
import Carousel from 'react-slick'
import theme from '@emcasa/ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faAngleRight from '@fortawesome/fontawesome-pro-regular/faAngleRight'
import faAngleLeft from '@fortawesome/fontawesome-pro-regular/faAngleLeft'
import faCube from '@fortawesome/fontawesome-free-solid/faCube'
import CloseButton from 'components/shared/Common/Buttons/CloseButton'
import ButtonIcon from 'components/shared/Common/Buttons'
import {thumbnailUrl} from 'utils/image_url'
import {downloadBlob} from 'utils/file-utils'
import {
  log,
  LISTING_DETAIL_PHOTOS_LEFT,
  LISTING_DETAIL_PHOTOS_RIGHT,
  LISTING_DETAIL_PHOTOS_FULLSCREEN_OPEN,
  LISTING_DETAIL_PHOTOS_FULLSCREEN_CLOSE
} from 'lib/logging'
import Container, {
  SpinnerWrapper,
  Spinner,
  CarouselItem,
  Arrow,
  OpenMatterportButtonWrapper,
  PaginationTextWrapper,
  PaginationText,
  Header,
  TitleWrapper,
  Title
} from './styles'
import {
  Background
} from 'components/listings/show/Popup/styles'

class ListingGallery extends Component {
  state = {
    downloadingImages: false,
    nav: null,
    isFullScreen: false,
    currentImage: 0
  }

  componentDidMount() {
    this.setState({
      nav: this.slider
    })

    window.focus()

    this.keyListener = window.addEventListener('keyup', (event) => {
      if (event.defaultPrevented) {
        return
      }
      if (!this.slider) {
        return
      }
      switch (event.keyCode) {
        case 27:
          this.exitFullScreen()
          break
        case 39:
          this.slider.slickNext()
          break
        case 37:
          this.slider.slickPrev()
          break
      }
    })
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.keyListener)
  }

  downloadImages = async () => {
    this.setState({downloadingImages: true})
    const {currentUser: {jwt}, listing: {id}} = this.props

    const response = await getListingImages(id, jwt)

    const blob = await response.blob()
    downloadBlob(blob, `${id}.zip`, 'application/zip')
    this.setState({downloadingImages: false})
  }

  getImage = ({filename}) => {
    const {id, address, type} = this.props.listing
    return (
      <img
        className="slider-image"
        decoding="async"
        key={filename}
        src={thumbnailUrl(filename, 1920, 1080)}
        alt={`Imagem ${
          type === 'Casa' ? 'da' : 'do'
        } ${type} ID-${id} na ${address.street}, ${address.neighborhood}, ${
          address.city
        } - ${address.state}`}
        loaded={this[filename]}
      />
    )
  }

  getSliderImages = () => {
    const {listing} = this.props
    const images = [...listing.images].concat(
      listing.development ? listing.development.images : []
    )
    return images.map(this.getImage)
  }

  enterFullScreen = (index) => {
    if (!this.state.isFullScreen) {
      const afterChange = this.afterChange
      log(LISTING_DETAIL_PHOTOS_FULLSCREEN_OPEN, {listingId: this.props.listing.id})
      this.setState({isFullScreen: true}, () => {
        setTimeout(() => {
          if (this.slider) {
            afterChange(index)
            this.slider.slickGoTo(index)
          }
        }, 100)
      })
    }
  }

  exitFullScreen = () => {
    if (this.state.isFullScreen) {
      const afterChange = this.afterChange
      const {currentImage} = this.state
      log(LISTING_DETAIL_PHOTOS_FULLSCREEN_CLOSE, {listingId: this.props.listing.id})
      this.setState({isFullScreen: false}, () => {
        setTimeout(() => {
          if (this.slider) {
            afterChange(currentImage)
            this.slider.slickGoTo(currentImage)
          }
        }, 100)
      })
    }
  }

  afterChange = (index) => {
    this.setState({currentImage: index})
  }

  render() {
    const {listing, openMatterportPopup} = this.props
    const {matterportCode} = listing
    const imagesLength = listing.images.length
    const {isFullScreen, currentImage} = this.state
    const afterChange = this.afterChange

    const onClickShowTour = () => {
      this.exitFullScreen()
      openMatterportPopup()
    }
    const settings = {
      dots: false,
      className: 'images-slider',
      infinite: true,
      easing: 'ease-out',
      slidesToShow: isFullScreen ? 1 : 3,
      slidesToScroll: isFullScreen ? 1 : 3,
      centerMode: false,
      speed: 500,
      focusOnSelect: true,
      lazyLoad: true,
      swipeToSlide: true,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: isFullScreen ? 1 : 2,
            slidesToScroll: isFullScreen ? 1 : 2
          }
        },
        {
          breakpoint: 760,
          settings: {
            slidesToShow: 1,
            slidesToScroll: isFullScreen ? 1 : 1
          }
        }
      ],
      adaptiveHeight: false,
      nextArrow: <SliderArrow isFullScreen={isFullScreen} icon={faAngleRight} listingId={listing.id} />,
      prevArrow: <SliderArrow isFullScreen={isFullScreen} icon={faAngleLeft} left={true} listingId={listing.id} />,
      afterChange: afterChange
    }

    return (
      <Container isFullScreen={isFullScreen}>
        {imagesLength > 0 &&
          isFullScreen && <CloseButton onClick={this.exitFullScreen} />}
        <Header isFullScreen={isFullScreen}>
          <TitleWrapper isFullScreen={isFullScreen}>
            <Title fontWeight="bold">Fotos</Title>
          </TitleWrapper>
          {imagesLength > 0 &&
            isFullScreen &&
            matterportCode && (
            <OpenMatterportButtonWrapper isFullScreen={isFullScreen}>
              <ButtonIcon
                onClick={onClickShowTour}
                iconColor={theme.colors.white}
                color={theme.colors.white}
                backgroundColor={theme.colors.blue}
                noBorder
                icon={faCube}
              >
                Iniciar tour virtual
              </ButtonIcon>
            </OpenMatterportButtonWrapper>
          )}
        </Header>

        <Carousel
          {...settings}
          ref={(slider) => (this.slider = slider)}
        >
          {this.getSliderImages().map((content, id) => (
            <CarouselItem
              isFullScreen={isFullScreen}
              key={content.key || id}
              onClick={() => {
                this.enterFullScreen(id)
              }}
            >
              {content.props.src && (
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
              )}
              {content}
            </CarouselItem>
          ))}
        </Carousel>
        <PaginationTextWrapper isFullScreen={isFullScreen}>
          <PaginationText color="dark" fontSize="small">{`${currentImage + 1} / ${imagesLength}`}</PaginationText>
        </PaginationTextWrapper>
        <Background onClick={this.exitFullScreen} />
      </Container>
    )
  }
}

function SliderArrow({onClick, icon, left, listingId, disabled, isFullScreen}) {
  return (
    <Arrow
      isFullScreen={isFullScreen}
      disabled={disabled}
      onClick={() => {
        const properties = {listingId}
        const event = left
          ? LISTING_DETAIL_PHOTOS_LEFT
          : LISTING_DETAIL_PHOTOS_RIGHT
        log(event, properties)
        if (onClick) {
          onClick()
        }
      }}
      left={left}
      aria-label={left ? 'Voltar fotos' : 'Avançar fotos'}
    >
      <FontAwesomeIcon icon={icon} />
    </Arrow>
  )
}

export default ListingGallery
