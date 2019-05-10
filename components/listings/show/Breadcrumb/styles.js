import styled from 'styled-components'
import theme from 'config/theme'
import * as colors from 'constants/colors'
import {
  headerMobileMedia,
  mobileMedia
} from 'constants/media'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import {LISTING_MAX_WIDTH} from 'constants/dimensions'
import {breakpoint} from '@emcasa/ui/lib/styles'

export const Wrapper = styled(Row)`
  justify-content: center;
  padding: ${theme.space[4]}px;
  background-color: ${theme.colors.smoke};
`

export const Container = styled('ul')`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: ${LISTING_MAX_WIDTH}px;
  margin: 0;
  padding: 0 ${theme.space[2]}px;
  box-sizing: border-box;
`

export const Path = styled('li')`
  display: flex;
  align-items: center;
  height: 48px;

  :not(:first-of-type) {
    :before {
      content: '>';
      font-size: 14px;
      margin: 0 ${theme.space[1]}px;
      color: ${theme.colors.grey};
    }
  }
`

export const LinkButton = styled(Text)`
  display: flex;
  align-items: center;
  height: 100%;
  text-decoration: none;
  color: ${theme.colors.grey};

  &:hover {
    color: ${theme.colors.pink};
  }
`
