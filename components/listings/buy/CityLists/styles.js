import styled from 'styled-components'
import theme from '@emcasa/ui'
import {breakpoint} from '@emcasa/ui/lib/styles'
import View from '@emcasa/ui-dom/components/View'
import Text from '@emcasa/ui-dom/components/Text'
import {LISTING_MAX_WIDTH} from 'constants/dimensions'

export const HIGHLIGHTS_GRID_WIDTH = 147
export const HIGHLIGHTS_GRID_WIDTH_DESKTOP = 180

export const Container = styled(View)`
  width: 100%;
  max-width: ${LISTING_MAX_WIDTH}px;
  display: flex;
  flex-direction: column;
  margin: ${theme.space[4] * 2}px auto 0;
  padding: 0 ${theme.space[4]}px;
  box-sizing: border-box;

  @media screen and ${breakpoint.up('desktop')} {
    margin-top: ${theme.space[5]}px;
  }
`

export const Title = styled(Text)`
  margin: 0 0 ${theme.space[5]}px;
`

export const SubTitle = styled(Text)`
  margin: 0 0 ${theme.space[4]}px;
`

export const HighlightsList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: ${`repeat(auto-fill,minmax(${HIGHLIGHTS_GRID_WIDTH}px, 1fr))`};
  grid-gap: ${theme.space[3]}px;
  margin: 0;
  padding: 0;

  @media screen and ${breakpoint.up('desktop')} {
    grid-template-columns: ${`repeat(auto-fill,minmax(${HIGHLIGHTS_GRID_WIDTH_DESKTOP}px, 1fr))`};
  }
`

export const HighlightsLink = styled.a`
  position: relative;
  display: block;
  overflow: hidden;
  height: ${`${HIGHLIGHTS_GRID_WIDTH}px`};
  border-radius: ${theme.space[2]}px;
  background-color: ${theme.colors.snow};

  @media screen and ${breakpoint.up('desktop')} {
    height: ${`${HIGHLIGHTS_GRID_WIDTH_DESKTOP}px`};
  }

  &::before {
    z-index: 1;
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1) 100%);
  }
`

export const HighlightsImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const HighlightsLabel = styled(Text)`
  z-index: 2;
  position: absolute;
  bottom: ${theme.space[2]}px;
  left: 0;
  width: 100%;
  margin: 0;
  text-align: center;
`

export const TypesListGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${theme.space[3]}px;

  @media screen and ${breakpoint.up('desktop')} {
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: ${theme.space[4]}px;
  }
`
export const TypesList = styled.ul`
  list-style: none;
  margin: 0 0 ${theme.space[3]}px;
  padding: 0;
`
export const TypesListItem = styled.li`
  margin-bottom: ${theme.space[3]}px;
`
export const TypesListLink = styled.a`
  display: block;

  &:hover {
    color: ${theme.colors.pink};
  }
`
