import styled from 'styled-components'
import {themeGet} from 'styled-system'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import Icon from '@emcasa/ui-dom/components/Icon'

const ICON_SIZE = 22

export const Hr = styled.hr`
  height: 2px;
  width: 100%;
  background: ${themeGet('colors.lightGrey')};
  margin: ${(ICON_SIZE - 2) / 2}px 0;
  border: none;
  outline: none;
  flex: 1;
`

export const Phase = styled(function DevelopmentPhase({
  active,
  children,
  ...props
}) {
  return (
    <Row {...props}>
      <Hr />
      <Row
        display="flex"
        flexDirection="column"
        alignItems="center"
        mr={3}
        ml={3}
      >
        <Icon
          name={active ? 'check-circle' : 'dot-circle'}
          color={active ? 'green' : 'lightGrey'}
          size={22}
        />
        <Text inline fontSize="small">{children}</Text>
      </Row>
      <Hr />
    </Row>
  )
})`
  position: relative;
  flex: 1 1 ${100 / 3}%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding-bottom: ${themeGet('space.4')}px;
  ${Icon} {
    margin-bottom: ${themeGet('space.2')}px;
  }
  ${Text} {
    position: absolute;
    bottom: 0;
  }
`

export default styled(Row)`
  display: flex;
  flex-direction: row-reverse;
  box-sizing: border-box;
  flex: 1 1 100%;
  margin: ${themeGet('space.4')}px;
  margin-bottom: ${themeGet('space.5')}px;
  ${Phase}:first-child ${Hr}:last-child,
  ${Phase}:last-child ${Hr}:first-child {
    display: none;
  }
`
