import React, { Component } from 'react'
import AudioElement from './LocalAudioElement'
import Controls from './Controls'

class AudioUi extends Component {
    render() {
        return (
            <div>
                <AudioElement />
                <Controls />
            </div>
        )
    }
}

export default AudioUi
