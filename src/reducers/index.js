import { combineReducers } from 'redux'

const config = (state = {
  host: '192.168.1.140',
}, action => {
  return state
})

const playing = (state = {
  artist: 'Orchestral Manoeuvres in the Dark',
  album: 'Orchestral Manoeuvres in the Dark',
  track: 'Pretending To See The Future',
  coverImageUrl: 'http://fillmurray.com/300/300',
}, action) => {
  return state
}

const zones = (state = {
  ZONE1: {
    active: false,
    name: 'Entrance',
    volume: 0,
  },

  ZONE2: {
    active: true,
    name: 'Workspace',
    volume: 0.5,
  },
}, action) => {
  return state
}

export default combineReducers({
  config,
  playing,
  zones,
})
