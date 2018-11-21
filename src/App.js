import React, { Component } from 'react'
import './App.css'
import CourseList from './components/CourseList'
import FullscreenButton from './components/FullscreenButton'
import Settings from './components/Settings'
import api from './api'

class App extends Component {
    state = {
        settingsVisible: false,
        playlists: {
            collection: []
        }
    }
    componentDidMount = () => {
        api.getPlaylists()
            .then(playlists => {
                this.setState(() => ({
                    playlists: playlists
                }))
            })
    }
    toggleSettingsVisible = (event) => {
        event.preventDefault()

        this.setState((prevState) => ({
            settingsVisible: !prevState.settingsVisible
        }))
    }
    render() {
        return (
            <div>
                <section className="bar bar--thin navigation">
                    <h1>Language Transfer</h1>
                    <FullscreenButton />
                    <a href="#settings" className="navigation-settings" onClick={this.toggleSettingsVisible}>open settings</a>
                </section>
                <Settings visible={this.state.settingsVisible} />
                <section className="list">
                    <p>Select a course you want to start.</p>
                    <CourseList playlists={this.state.playlists.collection} />
                </section>
            </div>
        )
    }
}

export default App
