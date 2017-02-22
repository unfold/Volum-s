import * as api from '../utils/api'
import createAsyncActionTypes from '../utils/createAsyncActionTypes'

import {
  FETCH_NOW_PLAYING,
  FETCH_STATUS,
  FIND_HOST,
  LOAD_CONFIG,
  SET_ACTIVE,
  SET_VOLUME,
} from '../reducers'

const getHost = state => state.config.host

export const loadConfig = () => dispatch => {
  const { requestType, successType, failureType } = createAsyncActionTypes(LOAD_CONFIG)

  dispatch({ type: requestType })

  api.loadConfig()
    .then(config => dispatch({ type: successType, config }))
    .catch(error => dispatch({ type: failureType, error: error.message }))
}

export const findHost = () => (dispatch, getState) => {
  const { requestType, successType, failureType } = createAsyncActionTypes(FIND_HOST)

  dispatch({ type: requestType })

  api.findHost()
    .then(({ host }) => {
      const state = getState()

      return api.saveConfig({
        ...state.config,
        host,
      })
      .then(() => dispatch({ type: successType, host }))
    })
    .catch(error => dispatch({ type: failureType, error: error.message }))
}

export const fetchStatus = zone => (dispatch, getState) => {
  const { requestType, successType, failureType } = createAsyncActionTypes(FETCH_STATUS)
  const host = getHost(getState())

  dispatch({ type: requestType, zone })

  api.fetchStatus(host, zone)
    .then(status => dispatch({ type: successType, zone, status }))
    .catch(error => dispatch({ type: failureType, zone, error: error.message }))
}

export const fetchNowPlaying = () => (dispatch, getState) => {
  const { requestType, successType, failureType } = createAsyncActionTypes(FETCH_NOW_PLAYING)
  const host = getHost(getState())

  dispatch({ type: requestType })

  api.fetchNowPlaying(host)
    .then(playing => dispatch({ type: successType, playing }))
    .catch(error => dispatch({ type: failureType, error: error.message }))
}

export const setActive = (zone, active) => (dispatch, getState) => {
  const { requestType, successType, failureType } = createAsyncActionTypes(SET_ACTIVE)
  const host = getHost(getState())

  dispatch({ type: requestType, zone, active })

  api.setActive(host, zone, active)
    .then(() => dispatch({ type: successType, zone, active }))
    .catch(error => dispatch({ type: failureType, zone, active, error: error.message }))
}

export const setVolume = (zone, volume) => (dispatch, getState) => {
  const { requestType, successType, failureType } = createAsyncActionTypes(SET_VOLUME)
  const host = getHost(getState())

  dispatch({ type: requestType, zone, volume })

  api.setVolume(host, zone, volume)
    .then(() => dispatch({ type: successType, zone, volume }))
    .catch(error => dispatch({ type: failureType, zone, volume, error: error.message }))
}
