import * as api from '../utils/api'
import { SET_ACTIVE, SET_VOLUME } from '../reducers'

const getHost = state => state.config.host

const createAsyncActionTypes = type => ({
  requestType: type,
  successType: `${type}_SUCCESS`,
  failureType: `${type}_FAILURE`,
})

export const setActive = (zone, active) => (dispatch, getState) => {
  const { requestType, successType, failureType } = createAsyncActionTypes(SET_ACTIVE)
  const host = getHost(getState())

  dispatch({ type: requestType, zone, active })

  api.setActive(host, zone, active)
    .then(() => dispatch({ type: successType, zone, active }))
    .catch(error => dispatch({ type: failureType, zone, active, error }))
}

export const setVolume = (zone, volume) => (dispatch, getState) => {
  const { requestType, successType, failureType } = createAsyncActionTypes(SET_VOLUME)
  const host = getHost(getState())

  dispatch({ type: requestType, zone, volume })

  api.setVolume(host, zone, volume)
    .then(() => dispatch({ type: successType, zone, volume }))
    .catch(error => dispatch({ type: failureType, zone, volume, error }))
}
