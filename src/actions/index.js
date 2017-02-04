import * as api from '../utils/api'
import { FIND_HOST, SET_ACTIVE, SET_VOLUME } from '../reducers'
import createAsyncActionTypes from '../utils/createAsyncActionTypes'

const getHost = state => state.config.host

export const findHost = () => dispatch => {
  const { requestType, successType, failureType } = createAsyncActionTypes(FIND_HOST)

  dispatch({ type: requestType })

  api.findHost()
    .then(({ host }) => dispatch({ type: successType, host }))
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
