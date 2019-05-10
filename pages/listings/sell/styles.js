import styled from 'styled-components'
import theme from '@emcasa/ui'
import {breakpoint} from '@emcasa/ui/lib/styles'
import { HEADER_HEIGHT } from 'constants/dimensions'
import View from '@emcasa/ui-dom/components/View'
import Text from '@emcasa/ui-dom/components/Text'

export const Container = styled(View)`
  display: flex;
  flex-direction: column;
`

export const Block = styled(View)`
  display: flex;
  flex: 1;
  min-height: 60vh;
  max-width: 100vw;
  overflow: hidden;
  justify-content: center;
  padding-top: ${HEADER_HEIGHT}px;
`

export const MainBlock = styled(Block)`
  padding-top: 0px;
  min-height: 80vh;
  @media (max-width: ${theme.breakpoints[0]}) {
    min-height: 100vh;
  }
`

export const UnderlinedText = styled(Text)`
  margin-top: 0;
  text-decoration: underline;
  cursor: pointer;
`

export const Content = styled(View)`
  max-width: 100%;
  margin-top: ${HEADER_HEIGHT * 2}px;
   @media (min-width: ${theme.breakpoints[0]}){
    @media (min-aspect-ratio: 2 / 1) {
      margin-top: ${HEADER_HEIGHT}px;
    }
   }
`
