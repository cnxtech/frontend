import styled from 'styled-components'
import View from '@emcasa/ui-dom/components/View'
import Text from '@emcasa/ui-dom/components/Text'
import {breakpoint} from '@emcasa/ui/lib/styles'
import {HEADER_HEIGHT} from 'constants/dimensions'

const CLOUDINARY_URL =
  'https://res.cloudinary.com/emcasa/image/upload/f_auto/v1542831121/background'

const UnderlinedText = styled(Text)`
  margin-top: 0;
  text-decoration: underline;
  cursor: pointer;
`

const Container = styled(View)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-self: stretch;
  background-image: url(${CLOUDINARY_URL}/wall-large);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom;

  @media ${breakpoint.down('tablet')} {
    background-image: url(${CLOUDINARY_URL}/wall-small);
  }

  @media ${breakpoint.up('desktop')} {
    @media (max-height: 590px) {
      align-items: center;
      background-image: url(${CLOUDINARY_URL}/wall-small);
    }

    @media (max-width: 1300px) {
      align-items: center;
      margin-top: -20vh;
    }

    @media (min-width: 1500px) {
      align-items: center;
      margin-top: -40vh;
    }
  }

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    align-items: center;
    background-image: url(${CLOUDINARY_URL}/wall-small);
  }
`

const Content = styled(View)`
  max-width: 100%;
  margin-top: ${HEADER_HEIGHT * 2}px;
  @media ${breakpoint.up('desktop')} {
    @media (min-aspect-ratio: 2 / 1) {
      margin-top: ${HEADER_HEIGHT}px;
    }
  }
`

export {UnderlinedText, Container, Content}
