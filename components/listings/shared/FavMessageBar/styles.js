import styled from 'styled-components'
import theme from '@emcasa/ui'
import {breakpoint} from '@emcasa/ui/lib/styles'
import Row from '@emcasa/ui-dom/components/Row'
import {LISTING_MAX_WIDTH} from 'constants/dimensions'
import {CircleStyle} from 'components/shared/Common/Buttons/Like/styles'

const CLOSE_BUTTON_WIDTH = 60

export const Container = styled(Row)`
  width: 100%;
  max-width: ${LISTING_MAX_WIDTH}px;
  padding: ${theme.space[1]}px 0 ${theme.space[1]}px ${theme.space[4]}px;
  background-color: ${theme.colors.smoke};

  @media screen and ${breakpoint.up('desktop')} {
    border-radius: 8px;
  }
`

export const Content = styled(Row)`
  flex: 1;
`

export const FakeButton = styled.span`
  ${CircleStyle}
  margin-right: ${theme.space[2]}px;
  background-color: ${theme.colors.white};

  svg {
    path {
      stroke: ${theme.colors.pink};
    }
  }
`

export const BreakTextMobile = styled.br`
  @media screen and ${breakpoint.up('desktop')} {
    display: none;
  }
`
export const CloseButton = styled.button`
  flex: 0 0 ${CLOSE_BUTTON_WIDTH}px;
  height: ${CLOSE_BUTTON_WIDTH}px;
  background: none;
  display: flex;
  justify-content: center;
  padding: 0;
  border: none;
  outline: none;
  cursor: pointer;
`
