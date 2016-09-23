import parseXML from 'xml-parser'
import { trim } from 'lodash'

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

export const sendCommand = (host, command) => {
  console.log(`Sending command ${command} to ${host}`)
}

export const setVolume = (host, volume) => sendCommand(host, `volume:${volume}`)
export const setActive = (host, active) => sendCommand(host, `active:${active}`)

export const fetchStatus = (host, zone = 'ZONE1') => (
  fetch(`http://${host}/goform/formMainZone_MainZoneXml.xml?ZoneName=${zone}`)
    .then(response => (
      response
        .text()
        .then(parseXML)
        .then(transformXML)
        .then(({ MasterVolume, ZonePower }) => ({
          volume: parseFloat(MasterVolume) / (130 - 80),
          active: ZonePower === 'ON',
        }))
    ))
)
