import React, { Component, PropTypes } from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { throttle } from 'lodash'
import * as actions from '../actions'

import Slider from './Slider'

const Container = styled.View`
  flex-grow: 1;
  align-items: center;
  margin-bottom: 50;
`

class Zone extends Component {
  componentDidMount() {
    this.props.fetchStatus()
  }

  render() {
    const { active, name, volume, setVolume } = this.props

    return (
      <Container>
        <Slider
          active={active}
          title={name}
          value={volume}
          onChange={setVolume}
        />
      </Container>
    )
  }
}

Zone.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  volume: PropTypes.number.isRequired,
  fetchStatus: PropTypes.func.isRequired,
  // setActive: PropTypes.func.isRequired,
  setVolume: PropTypes.func.isRequired,
}

const mapStateToProps = ({ zones }, { id }) => ({ ...zones[id] })
const mapDispatchToProps = (dispatch, { id }) => ({
  fetchStatus: () => dispatch(actions.fetchStatus(id)),
  setActive: active => dispatch(actions.setActive(id, active)),
  setVolume: throttle(volume => dispatch(actions.setVolume(id, volume)), 250, { leading: false }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Zone)
