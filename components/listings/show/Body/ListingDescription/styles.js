import styled from 'styled-components'
import theme from 'config/theme'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import breakpoint from '@emcasa/ui/lib/styles/breakpoint';

export default styled(Row)`
  box-sizing: border-box;
  flex: 1 1 100%;
  overflow: hidden;
  @media screen and ${breakpoint.up('desktop')} {
    flex: 1 1 100%;
  }
`

export const Content = styled(Row)`
  ${({expanded, collapsedHeight}) => expanded ? `
    max-height: 350em;
  ` : `
    overflow: hidden;
    position: relative;
    max-height: ${collapsedHeight}px;
  `}
`

Content.defaultProps = {
  collapsedHeight: 0
}

export const P = styled(Text)`
  margin: 0 0 ${theme.space[5]}px;
`

export const Title = styled(Text).attrs({as: 'h3'})`
  z-index: 2;
  display: flex;
  align-items: center;
  margin: 0;
  pointer-events: none;
  span {
    pointer-events: all;
  }
`

export const BottomRow = styled(Row)`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  &:before {
    pointer-events: none;
    z-index: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${(props) => props.expanded ? '100%' : '250%'};
    content: '';
    display: block;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, ${theme.colors.white} 65%);
  }

  button {
    z-index: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${theme.fontSizes[1]}px;

    svg {
      display: inline-block;
      width: 0.9em;
      height: 20px;
      margin-right: ${theme.space[2]}px;
      overflow: visible;
      vertical-align: -.125em;
      font-size: inherit;
    }
  }
`
