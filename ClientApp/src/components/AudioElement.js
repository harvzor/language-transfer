import React, { Component } from 'react'
import AudioUi from './AudioUi'
import Audio from '../Audio'

class AudioElement extends Component {
    componentDidMount = () => {
        AudioUi.audio = new Audio()
    }
    render() {
        return (
            <section className="bar audio">
                <iframe title="Soundcloud audio player" width="100%" height="100%" scrolling="no" frameBorder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F&amp;show_teaser=false"></iframe>
            </section>
        )
    }
}

export default AudioElement
