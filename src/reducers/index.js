import { combineReducers } from 'redux'

export const SET_ACTIVE = 'SET_ACTIVE'
export const SET_VOLUME = 'SET_VOLUME'

const config = (state = {
  host: '192.168.1.140',
}) => state

const playing = (state = {
  artist: 'Orchestral Manoeuvres in the Dark',
  album: 'Orchestral Manoeuvres in the Dark',
  track: 'Pretending To See The Future',
  coverImageUrl: 'http://fillmurray.com/300/300',
}) => state

const zones = (state = {
  ZONE1: {
    active: false,
    name: 'Entrance',
    volume: 0,
  },

  ZONE2: {
    active: true,
    name: 'Workspace',
    volume: 0,
  },
}, action) => {
  switch (action.type) {
    case SET_ACTIVE:
      // return update(state, [action.zone, 'active'], action.active)
      return {
        ...state,
        [action.zone]: {
          ...state[action.zone],
          active: action.active,
        },
      }
    case SET_VOLUME:
      // return update(state, [action.zone, 'volume'], action.volume)
      return {
        ...state,
        [action.zone]: {
          ...state[action.zone],
          volume: action.volume,
        },
      }
    default:
      return state
  }
}

export default combineReducers({
  config,
  playing,
  zones,
})
