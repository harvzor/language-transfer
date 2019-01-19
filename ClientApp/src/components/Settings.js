import React, { Component } from 'react'
import storage from '../services/StorageService'
import NoSleep from 'nosleep.js'

class Settings extends Component {
    state = {
        settings: storage.settings.get() || {
            vibrate: false
        }
    }
    noSleep = null
    save = (settings) => {
        storage.settings.set(settings);
    }
    keepAwakeChange = (event) => {
        let checked = event.target.checked

        if (this.noSleep === null) {
            this.noSleep = new NoSleep()
        }

        if (checked) {
            this.noSleep.enable()
        } else {
            this.noSleep.disable()
        }
    }
    vibrateChange = (event) => {
        let checked = event.target.checked

        this.setState(prevState => {
            prevState.settings.vibrate = checked

            this.save(prevState.settings)

            return prevState
        })
    }
    render() {
        return (
            <section className={"settings-page" + (this.props.visible ? "" : " hidden")}>
                <h3>Settings</h3>
                <label>
                    <input type="checkbox" onChange={this.keepAwakeChange} />
                    Keep awake? (experimental, won't be remembered)
                </label>
                <label>
                    <input type="checkbox" defaultChecked={this.state.settings.vibrate} onChange={this.vibrateChange} />
                    Vibrate? (only works on some mobile browsers)
                </label>
            </section>
        )
    }
}

export default Settings
