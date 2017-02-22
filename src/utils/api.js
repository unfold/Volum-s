import parseXML from 'xml-parser'
import htmlEntities from 'he'
import md5 from 'md5'
import { AsyncStorage } from 'react-native'
import Zeroconf from 'react-native-zeroconf'
import { compact, includes, trim } from 'lodash'
import request from './request'

const CONFIG_KEY = 'config'
const MIN_VOLUME = -80
const MAX_VOLUME = 18
const TRUTHY = ['1', 'true', 'on']
const FALSEY = ['0', 'false', 'off']

const normalizeVolume = value => (
  value === '--' ? 0 : (parseFloat(value) - MIN_VOLUME) / (MAX_VOLUME - MIN_VOLUME)
)

const denormalizeVolume = value => (
  Math.round((value * (MAX_VOLUME - MIN_VOLUME)) + MIN_VOLUME)
)

const getArtworkUrl = (host, details) => {
  const id = md5(compact(details).join(''))

  return `http://${host}/NetAudio/art.asp-jpg?id=${id}`
}

const transformValue = value => {
  if (!value) {
    return null
  }

  if (includes(FALSEY, value.toLowerCase())) {
    return false
  }

  if (includes(TRUTHY, value.toLowerCase())) {
    return true
  }

  return htmlEntities.decode(htmlEntities.decode(trim(value)))
}

const transformChildren = children => children.map(child => transformValue(child.content))

const transformXML = document => (
  document.root.children.reduce((result, { name, children }) => {
    const value = transformChildren(children)

    return {
      ...result,
      [name]: value.length > 1 ? value : value[0],
    }
  }, {})
)

export const sendCommand = (host, zone, command, argument) => {
  const url = `http://${host}/MainZone/index.put.asp`
  const data = {
    cmd0: `${command}/${argument}`,
    ZoneName: zone,
  }

  // console.log(`Sending command: ${command}(${argument}) to ${zone} (${url})`)

  return request({ url, data, method: 'POST' })
    .then(response => response.text())
}

export const loadConfig = () => (
  AsyncStorage.getItem(CONFIG_KEY).then(data => JSON.parse(data) || {})
)

export const saveConfig = config => (
  AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(config))
)

export const findHost = () => (
  new Promise((resolve, reject) => {
    const type = 'airplay'
    const scanner = new Zeroconf()
    scanner.on('resolved', result => {
      if (includes(result.name, 'Denon')) {
        scanner.stop()

        resolve(result)
      }
    })

    scanner.on('error', reject)
    scanner.scan(type)
  })
)

export const setVolume = (host, zone, volume) =>
  sendCommand(host, zone, 'PutMasterVolumeSet', denormalizeVolume(volume))

export const setActive = (host, zone, active) =>
  sendCommand(host, zone, 'PutZone_OnOff', active ? 'ON' : 'OFF')

export const fetchStatus = (host, zone = 'ZONE1') => {
  const url = `http://${host}/goform/formMainZone_MainZoneXml.xml`
  const query = {
    ZoneName: zone,
  }

  return request({ url, query })
    .then(response => response.text())
    .then(parseXML)
    .then(transformXML)
    .then(result => ({
      name: result.RenameZone,
      volume: normalizeVolume(result.MasterVolume),
      active: result.ZonePower,
    }))
}

export const fetchNowPlaying = host => {
  const url = `http://${host}/goform/formNetAudio_StatusXml.xml`

  return request({ url })
    .then(response => response.text())
    .then(parseXML)
    .then(transformXML)
    .then(result => ({
      track: result.szLine[1],
      artist: result.szLine[2],
      album: result.szLine[4],
      source: result.NetPlayingTitle,
      artworkUrl: result.Art === '2' ? getArtworkUrl(host, result.szLine) : null,
    }))
}
