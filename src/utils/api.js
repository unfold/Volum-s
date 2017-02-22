import parseXML from 'xml-parser'
import { AsyncStorage } from 'react-native'
import Zeroconf from 'react-native-zeroconf'
import { includes, trim } from 'lodash'
import request from './request'

const CONFIG_KEY = 'config'
const MIN_VOLUME = -80
const MAX_VOLUME = 18

const normalizeVolume = value => (
  value === '--' ? 0 : (parseFloat(value) - MIN_VOLUME) / (MAX_VOLUME - MIN_VOLUME)
)

const denormalizeVolume = value => (
  Math.round((value * (MAX_VOLUME - MIN_VOLUME)) + MIN_VOLUME)
)

const transformValue = value => trim(value) || null
const transformChildren = children => (
  children.length > 1 ? children.reduce((result, { attributes, content }) => ({
    ...result,
    [attributes.index]: transformValue(content),
  }), {}) : transformValue(children[0].content)
)

const transformXML = document => (
  document.root.children.reduce((result, { name, children }) => ({
    ...result,
    [name]: transformChildren(children),
  }), {})
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
    .then(({ MasterVolume, RenameZone, ZonePower }) => ({
      name: RenameZone,
      volume: normalizeVolume(MasterVolume),
      active: ZonePower === 'ON',
    }))
}
