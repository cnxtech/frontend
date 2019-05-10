import styled from 'styled-components'
import theme from 'config/theme'
import {breakpoint} from '@emcasa/ui/lib/styles'
import View from '@emcasa/ui-dom/components/View'
import Text from '@emcasa/ui-dom/components/Text'
import {LISTING_MAX_WIDTH} from 'constants/dimensions'

export const Container = styled(View)`
  width: 100%;
  max-width: ${LISTING_MAX_WIDTH}px;
  display: flex;
  flex-direction: column;
  padding: 0 ${theme.space[4]}px;
  box-sizing: border-box;
`

export const Header = styled(View)`
  margin-bottom: ${theme.space[4]}px;

  h2 {
    margin: 0;
  }

  p {
    margin-top: 0;
  }
`

export const Cities = styled(View)`
  display: flex;
  flex-direction: column;
`

export const City = styled(View)`
  display: flex;
  flex-direction: column;
  margin-bottom: ${theme.space[2]}px;

  h3 {
    margin-bottom: 0;
  }
`

export const NeighborhoodsHighlights = styled(View)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0 10px;
  margin: ${theme.space[3]}px 0 0;

  @media ${breakpoint.down('tablet')} {
    grid-template-columns: 1fr;
  }
`

export const Neighborhood = styled('a')`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 185px;
  max-width: 100%;
  border-radius: 4px;
  box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.3);
  overflow: hidden;

  @media ${breakpoint.down('tablet')} {
    flex: 1 1 100%;
    height: 125px;
    margin-bottom: ${theme.space[2]}px;
  }

  h4 {
    color: white;
    font-size: 20px;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`

export const Soon = styled(View)`
  position: absolute;
  right: ${theme.space[3]}px;
  top: ${theme.space[3]}px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.pink};
  padding: ${theme.space[1]}px ${theme.space[2]}px;
  border-radius: 4px;
  color: white;
  font-size: ${theme.fontSizes[1]}px;
`

export const NeighborhoodsLinks = styled(View)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0 10px;
  margin: ${theme.space[3]}px 0;

  @media ${breakpoint.down('tablet')} {
    grid-template-columns: repeat(2, 1fr);
  }

  .NeighborhoodLink {
    font-size: ${theme.fontSizes[2]}px;
    padding: ${theme.space[1]}px 0;

    &:hover {
      color: ${theme.colors.pink};
    }

    @media ${breakpoint.down('tablet')} {
      padding: ${theme.space[2]}px 0;
    }
  }
`

export const ListTitle = styled(Text)`
  font-size: inherit;
  margin: 0;
  color: inherit;
`
