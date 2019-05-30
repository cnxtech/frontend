import styled from 'styled-components'
import theme from 'config/theme'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import Button from '@emcasa/ui-dom/components/Button'

const PROFILE_INITIALVIEW_MAX_WIDTH = 414

export const ProfileAvatar = styled(Row)`
  width: 100px;
  height: 100px;
  font-size: ${theme.fontSizes[4]}px;
  color: ${theme.colors.white};
  background-color: ${theme.colors.blue};
  border-radius: 100%;
`

export const InitialView = styled(Row)`
  width: 100%;
  margin: ${theme.space[6]}px auto ${theme.space[4]}px;
  max-width: ${({maxWidth}) => maxWidth ? maxWidth : `${PROFILE_INITIALVIEW_MAX_WIDTH}px`};

  ${ProfileAvatar} {
    margin: 0 auto ${theme.space[5]}px;
  }

  ${Text} {
    display: block;
    margin: ${theme.space[1]}px 0;
  }

  ${Text} + ${Button} {
    margin: ${theme.space[5]}px 0 ${theme.space[2]}px;
  }
`
