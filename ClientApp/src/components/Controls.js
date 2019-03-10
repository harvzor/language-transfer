import React, { Component } from 'react'
import storage from '../services/StorageService'
import Audio from '../services/AudioService'

class Controls extends Component {
    state = {
        toggleText: 'Play'
    }
    handleBackClick = (event) => {
        event.preventDefault()

        Audio.addSeconds(-5)
    }
    handleToggleClick = (event) => {
        event.preventDefault()

        Audio.toggle()

        if (storage.settings.get() !== null && storage.settings.get().vibrate)
            window.navigator.vibrate(200)
    }
    handleForwardClick = (event) => {
        event.preventDefault()

        Audio.addSeconds(5)
    }
    componentDidMount = () => {
        Audio.stateChangeFunctions.push((state) => {
            if (!state.hasStarted) {
                this.setState(() => ({
                    toggleText: 'Play'
                }))
            }

            if (state.hasStarted && !state.isPaused) {
                this.setState(() => ({
                    toggleText: 'Pause'
                }))
            }

            if (state.isLoading) {
                this.setState(() => ({
                    toggleText: 'Loading...'
                }))
            }

            if (state.hasStarted && state.isPaused) {
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
