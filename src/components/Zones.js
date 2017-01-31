import React, { PropTypes } from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { keys } from 'lodash'
import Zone from './Zone'

const Container = styled.View`
  flex-grow: 1;
  flex-direction: row;
`

const Zones = ({ zones }) => (
  <Container>
    {zones.map(id => <Zone key={id} id={id} />)}
  </Container>
)

Zones.propTypes = {
  zones: PropTypes.arrayOf(PropTypes.string).isRequired,
}

const mapStateToProps = ({ zones }) => ({ zones: keys(zones) })

export default connect(mapStateToProps)(Zones)
