import React, { Component } from 'react'
import AudioUi from './AudioUi'
import Audio from '../services/AudioService'
import Moment from 'react-moment'

class AudioElement extends Component {
    constructor(props) {
        super(props)
        this.audio = React.createRef()
    }
    audio = null
    state = {
        progress: 0,
        position: 0,
        duration: 0
    }
    componentDidMount = () => {
        AudioUi.audio = new Audio()

        AudioUi.audio.stateChangeFunctions.push((state) => {
            console.log(state)
            this.setState({
                progress: state.progress,
                position: state.position,
                duration: state.duration
            })
        })
    }
    seek = (e) => {
        let width = this.audio.current.offsetWidth
        let clickPosition = e.nativeEvent.offsetX
        let percentage = clickPosition / width * 100

        AudioUi.audio.seekToPercent(percentage)
    }
    render() {
        return (
            <section className="bar audio" onClick={this.seek} ref={this.audio}>
                <div className="audio-information">
                    <Moment format="m:ss">{this.state.position * 1000}</Moment>
                    &nbsp;/&nbsp;
                    <Moment format="m:ss">{this.state.duration * 1000}</Moment>
                </div>
                <div className="audio-progress" style={{width: this.state.progress + '%'}}></div>
            </section>
        )
    }
}

export default AudioElement
