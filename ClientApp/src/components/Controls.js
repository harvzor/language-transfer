import React, { Component } from 'react'
import AudioUi from './AudioUi'
import storage from '../services/StorageService'

class Controls extends Component {
    state = {
        toggleText: 'Play'
    }
    handleBackClick = (event) => {
        event.preventDefault();

        AudioUi.audio.addSeconds(-5);
    }
    handleToggleClick = (event) => {
        event.preventDefault();

        AudioUi.audio.toggle();

        if (storage.settings.get() !== null && storage.settings.get().vibrate)
            window.navigator.vibrate(200);
    }
    handleForwardClick = (event) => {
        event.preventDefault();

        AudioUi.audio.addSeconds(5);
    }
    componentDidMount = () => {
        AudioUi.audio.stateChangeFunctions.push((hasStarted, isPaused, isLoading) => {
            if (!hasStarted) {
                this.setState(() => ({
                    toggleText: 'Play'
                }))
            }

            if (hasStarted && !isPaused) {
                this.setState(() => ({
                    toggleText: 'Pause'
                }))
            }

            if (isLoading) {
                this.setState(() => ({
                    toggleText: 'Loading...'
                }))
            }

            if (hasStarted && isPaused) {
                this.setState(() => ({
                    toggleText: 'Resume'
                }))
            }
        })
    }
    render() {
        return (
            <section className="bar controls">
                <button className="controls-skip" onClick={this.handleBackClick}>-5s</button>
                <button onClick={this.handleToggleClick}>{this.state.toggleText}</button>
                <button className="controls-skip" onClick={this.handleForwardClick}>+5s</button>
            </section>
        )
    }
}

export default Controls
