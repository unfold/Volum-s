import React, { Component, PropTypes } from 'react'
import Zone from './Zone'

export default class extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    fetchStatus: PropTypes.func.isRequired,
    setActive: PropTypes.func.isRequired,
    setVolume: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      name: props.id,
      volume: 0,
      active: false,
    }
  }

  componentDidMount() {
    this.fetchStatus()
  }

  setVolume(volume) {
    const { id, setVolume } = this.props

    this.setState({ volume })

    setVolume(id, volume)
  }

  setActive(active) {
    const { id, setActive } = this.props

    this.setState({ active })

    setActive(id, active)
  }

  fetchStatus() {
    const { id, fetchStatus } = this.props

    fetchStatus(id).then(status => this.setState(status))
  }

  render() {
    const { name, active, volume } = this.state

    return (
      <Zone
        name={name}
        active={active}
        volume={volume}
        setActive={value => this.setActive(value)}
        setVolume={value => this.setVolume(value)}
      />
    )
  }
}
