import React, { Component, PropTypes } from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import * as actions from '../actions'

const FindHostButton = styled.Button`
`

const Host = styled.Text`
  margin: 5;
  font-size: 12;
  color: white;
  text-align: center;
`

const Container = styled.View`
  flex-grow: 0;
  flex-shrink: 0;
`

class Setup extends Component {
  static propTypes = {
    host: PropTypes.string,
    findHost: PropTypes.func.isRequired,
    loadConfig: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.loadConfig()
  }

  render() {
    const { host, findHost } = this.props

    return (
      <Container>
        <Host>{host || 'No host found'}</Host>
        { !host && <FindHostButton onPress={findHost} title="Find host" /> }
      </Container>
    )
  }
}

const mapStateToProps = ({ config }) => ({ host: config.host })
const mapDispatchToProps = {
  findHost: actions.findHost,
  loadConfig: actions.loadConfig,
}

export default connect(mapStateToProps, mapDispatchToProps)(Setup)
