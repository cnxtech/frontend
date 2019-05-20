import styled from 'styled-components'
import {themeGet} from 'styled-system'
import {breakpoint} from '@emcasa/ui/lib/styles'
import Text from '@emcasa/ui-dom/components/Text'

export const Container = styled.div``

export const Title = styled(Text).attrs({fontSize: 'small'})`
  background: ${themeGet('colors.snow')};
  padding: ${themeGet('space.4')}px;
  font-weight: bold;
  font-size: ${themeGet('fontSize.0')}px;
  margin: 0;
`

export const List = styled.ul`
  margin: 0;
  padding: 0;
  & > li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 ${themeGet('space.4')}px;
    border-bottom: 1px solid ${themeGet('colors.lightGrey')};
  }
`

export const UnitsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: flex-start;
  & > * {
    box-sizing: border-box;
    flex: ${1 / 3};
    padding: 0 ${themeGet('space.2')}px;
  }
  @media ${breakpoint.down('tablet')} {
    & > * {
      flex-basis: 100%;
      padding: 0;
    }
  }
`
