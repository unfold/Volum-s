import { combineReducers } from 'redux'
import createAsyncActionTypes from '../utils/createAsyncActionTypes'

export const LOAD_CONFIG = 'LOAD_CONFIG'
export const FIND_HOST = 'FIND_HOST'
export const SET_ACTIVE = 'SET_ACTIVE'
export const SET_VOLUME = 'SET_VOLUME'

const config = (state = {
  host: null,
}, action) => {
  const { successType: loadConfigSuccessType } = createAsyncActionTypes(LOAD_CONFIG)
  const { successType: findHostSuccessType } = createAsyncActionTypes(FIND_HOST)

  switch (action.type) {
    case loadConfigSuccessType:
      return action.config
    case findHostSuccessType:
      return {
        ...state,
        host: action.host,
      }
    default:
      return state
  }
}

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
