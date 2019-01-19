import React, { Component } from 'react'
import AudioElement from './AudioElement'
import Controls from './Controls'

class AudioUi extends Component {
    audio = null
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
