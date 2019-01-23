import React, { Component } from 'react'
//import AudioElement from './SoundCloudAudioElement'
import AudioElement from './LocalAudioElement'
import Controls from './Controls'
//import Audio from '../services/AudioService'

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
