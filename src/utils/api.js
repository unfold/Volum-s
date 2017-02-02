import parseXML from 'xml-parser'
import Zeroconf from 'react-native-zeroconf'
import { trim } from 'lodash'
import request from './request'

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

  console.log(`Sending command: ${command}(${argument}) to ${zone}`)

  return request({ url, data, method: 'POST' })
    .then(response => response.text())
}

export const findHost = () => {
  const scan = new Promise((resolve, reject) => {
    // dns-sd -B _airplay._tcp .
    const type = 'googlecast'
    const scanner = new Zeroconf()
    scanner.on('resolved', result => {
      scanner.stop()

      resolve(result)
    })

    scanner.on('error', reject)
    scanner.scan(type)
  })

  const timeout = new Promise((resolve, reject) => (
    setTimeout(() => reject(new Error('Timeout')), 60 * 1000)
  ))

  return Promise.race([scan, timeout])
}

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
