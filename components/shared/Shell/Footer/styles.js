import styled from 'styled-components'
import theme from 'config/theme'
import Text from '@emcasa/ui-dom/components/Text'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import {breakpoint} from '@emcasa/ui/lib/styles'
import {LISTING_MAX_WIDTH, LISTING_BUTTONSBAR_HEIGHT} from 'constants/dimensions.js'

const MAX_WIDTH_LOGO = 110

export const Wrapper = styled.address`
  font-style: normal;
  background-color: ${theme.colors.dark};
`

export const Container = styled(Row)`
  flex-direction: column;
  margin: 0 auto;
  padding: ${theme.space[5]}px ${theme.space[4]}px ${LISTING_BUTTONSBAR_HEIGHT + (theme.space[5] * 2)}px;
  max-width: ${LISTING_MAX_WIDTH + 420}px;
  box-sizing: border-box;

  @media screen and ${breakpoint.up('desktop')} {
    flex-direction: row;
    padding: ${theme.space[5] * 2}px ${theme.space[4]}px ${theme.space[6]}px;
  }
`

export const AboutContainer = styled(Row)`
  flex: 1 1 100%;
  min-width: ${MAX_WIDTH_LOGO}px;
  flex-direction: column;
  margin: 0 ${theme.space[5]}px ${theme.space[5]}px 0;
`

export const LogoWrapper = styled.div`
  max-width: ${MAX_WIDTH_LOGO}px;
`

export const AboutText = styled(Text)`
  max-width: 350px;
  margin: ${theme.space[4]}px 0 0;
`

export const LinksContainer = styled(Row)`
  flex: 1 1 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.space[5]}px ${theme.space[4] * 2}px;

  @media screen and ${breakpoint.up('desktop')} {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

export const TitleLinks = styled(Text)`
  margin: 0 0 ${theme.space[2]}px;
  color: ${theme.colors.white};
  white-space: nowrap;
`

export const TextLink = styled(Text)`
  margin: ${theme.space[3]}px 0 0;
  color: ${theme.colors.disabled};
  white-space: nowrap;

  &:hover {
    color: ${theme.colors.white};
  }

  svg {
    width: 1em;
    height: 1em;
    margin-right: ${theme.space[2]}px;
    color: ${theme.colors.white};
  }
`

export const LinkGroup = styled.div`
  @media ${breakpoint.down('tablet')} {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-content: flex-start;
  }

  a {
    text-decoration: none;
  }
`
