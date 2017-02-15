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

class Application extends Component {
  static propTypes = {
    host: PropTypes.string,
    findHost: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.findHost()
  }

  render() {
    const { host } = this.props

    return (
      <Container>
        { host && <NowPlaying /> }
        { host && <Zones /> }
      </Container>
    )
  }
}

const mapStateToProps = ({ config }) => ({ host: config.host })
const mapDispatchToProps = { findHost: actions.findHost }

export default connect(mapStateToProps, mapDispatchToProps)(Application)
