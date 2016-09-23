import parseXML from 'xml-parser'
import { trim } from 'lodash'
import request from './request'

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
  const query = {
    cmd0: `${command}/${argument || ''}`,
    cmd1: 'aspMainZone_WebUpdateStatus/',
    ZoneName: zone,
  }

  return request({ url, query, method: 'PUT' })
    .then(response => response.text())
    .then(text => {
      console.log('Received command response:', text)
    })
}

// MainZone/index.put.asp?cmd0=PutMasterVolumeSet%2F-30.0&ZoneName=ZONE2
export const setVolume = (host, zone, volume) =>
  sendCommand(host, zone, 'PutMasterVolumeSet', volume)

// MainZone/index.put.asp?cmd0=PutZone_OnOff%2FON&cmd1=aspMainZone_WebUpdateStatus%2F&ZoneName=ZONE2
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
    .then(({ MasterVolume, ZonePower }) => ({
      volume: parseFloat(MasterVolume) / (130 - 80),
      active: ZonePower === 'ON',
    }))
}
