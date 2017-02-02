import React, { Component, PropTypes } from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import * as actions from '../actions'

import NowPlaying from './NowPlaying'
import Zones from './Zones'

const Container = styled.View`
  flex-grow: 1;
  background-color: black;
`

const Host = styled.Text`
  margin: 5;
  font-size: 12;
  color: white;
  text-align: center;
`

class Application extends Component {
  static propTypes = {
    host: PropTypes.string,
    findHost: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.findHost()
  }

  render() {
    const { host = 'No host found' } = this.props

    return (
      <Container>
        <NowPlaying />
        <Zones />
        <Host>Host: {host}</Host>
      </Container>
    )
  }
}

const mapStateToProps = ({ config }) => ({ host: config.host })
const mapDispatchToProps = { findHost: actions.findHost }

export default connect(mapStateToProps, mapDispatchToProps)(Application)
