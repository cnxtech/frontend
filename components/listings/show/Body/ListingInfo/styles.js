import styled from 'styled-components'
import theme from 'config/theme'
import {breakpoint} from '@emcasa/ui/lib/styles'
import {HEADER_HEIGHT} from 'constants/dimensions'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Text from '@emcasa/ui-dom/components/Text'
import Button from '@emcasa/ui-dom/components/Button'

export const Container = styled(Col)`
  @media screen and ${breakpoint.up('desktop')} {
    flex: 1 1 100%;
    margin-right: ${theme.space[6]}px;
  }
`

export const Title = styled(Text)`
  margin: 0;
  display: flex;
  flex-direction: column;
`

export const ExtraTitleSEO = styled.span`
  position: fixed;
  top: -100vh;
  pointer-events: none;
  user-select: none;
  left: -100vw;
`

export const ValuesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: ${theme.space[5]}px;
`

export const ValuesItem = styled(Row)`
  margin: 0 ${theme.space[5]}px ${theme.space[2]}px 0;

  ${Text} {
    margin: 0;
  }
`

export const ButtonsContainer = styled(Row)`
  margin-top: ${theme.space[4]}px;

  ${Button} {
    margin-right: ${theme.space[2]}px;

    &:last-child {
      margin-right: 0;
    }
  }
`

export const OpenMatterportButtonWrapper = styled.div`
  z-index: 2;
  position: absolute;
  top: ${theme.space[5]}px;
  left: 50%;
  flex: 0;
  transform: translateX(-50%);

  @media screen and ${breakpoint.up('desktop')} {
    position: relative;
    top: 0;
    left: 0;
    margin-right: ${theme.space[2]}px;
    transform: translateX(0);
  }
`

export const PriceItem = styled(Text)`
  display: flex;
  justify-content: space-between;
  margin: 0 0 ${theme.space[3]}px;
  font-size: ${theme.fontSizes[1]}px;

  @media screen and ${breakpoint.up('desktop')} {
    font-size: ${theme.fontSizes[2]}px;
  }

  span {
    font-size: inherit;
  }
`

export const PriceItemSpacer = styled('span')`
  flex: 1 1 100%;
  flex-direction: column;
  justify-content: flex-end;
  display: flex;
  padding: 0 ${theme.space[4]}px ${theme.space[2]}px;

  &::before {
    content: '';
    width: 100%;
    height: 1px;
    background-color: ${theme.colors.lightGrey};
  }
`
