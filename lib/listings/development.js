import flow from 'lodash/fp/flow'
import reduce from 'lodash/fp/reduce'
import groupBy from 'lodash/fp/groupBy'

export const groupListings = flow([
  groupBy((l) => `${l.area}.${l.rooms}`),
  reduce(
    (groups, listings) => [
      ...groups,
      [
        {
          index: groups.length,
          area: listings[0].area,
          rooms: listings[0].rooms
        },
        listings
      ]
    ],
    []
  )
])
