import theme from '@emcasa/ui'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import {
  Wrapper,
  CardStyle,
  LISTING_CARD_IMAGE_HEIGHT
} from 'components/listings/shared/ListingCard/styles.js'
import styled, {keyframes} from 'styled-components'

const BLINK_ANIM_TIME = 0.3

const animationName = keyframes`
  0% { opacity: 0.6; }
  100% { opacity: 1; }
`

const Container = styled.span`
  ${CardStyle};
`

const BlinkContainer = styled(Row)`
  animation: ${animationName} ${BLINK_ANIM_TIME}s linear 0s infinite alternate;
`

export default function ListingCardLoad() {
  return (
    <Wrapper as="div">
      <Container>
        <BlinkContainer flexDirection="column">
          <Col
            backgroundColor={theme.colors.smoke}
            as="span"
            width="100%"
            height={LISTING_CARD_IMAGE_HEIGHT}
          />
          <Row as="span" flexDirection="column" pt={3} pb={2} px={2}>
            <Row as="span" justifyContent="space-between" mb={3}>
              <Col
                backgroundColor={theme.colors.smoke}
                as="span"
                height="14px"
                width="55%"
              />
              <Col
                backgroundColor={theme.colors.smoke}
                as="span"
                height="14px"
                width="30%"
              />
            </Row>
            <Col
              backgroundColor={theme.colors.smoke}
              as="span"
              height="8px"
              width="65%"
              mb={1}
            />
            <Col
              backgroundColor={theme.colors.smoke}
              as="span"
              height="8px"
              width="55%"
              mb={1}
            />
          </Row>
        </BlinkContainer>
      </Container>
    </Wrapper>
  )
}
