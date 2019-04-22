import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import './App.css'
import Home from './components/routes/Home'
import Course from './components/routes/Course'
import FullscreenButton from './components/FullscreenButton'
import Settings from './components/Settings'

class App extends Component {
    state = {
        settingsVisible: false,
        title: null
    }
    toggleSettingsVisible = (event) => {
        event.preventDefault()

        this.setState((prevState) => ({
            settingsVisible: !prevState.settingsVisible
        }))
    }
    updateTitle = (title) => {
        this.setState({
            title: title
        })
    }
    render() {
        return (
            <Router>
                <div>
                    <section className="bar bar--thin navigation borders-bottom">
                        <Route exact path="/" render={() => (
                            <h1 className="home">Language Transfer</h1>
                        )} />
                        <Route path="/course/:playlistId" render={() => (
                            <div>
                                <Link to={'/'} className="navigation-back borders-right">
                                    &lt;
                                </Link>
                                <h1>Language Transfer</h1>
                                <h2>{this.state.title}</h2>
                            </div>
                        )} />
                        <FullscreenButton />
                        <a href="#settings" className="navigation-settings" onClick={this.toggleSettingsVisible}>open settings</a>
                    </section>
                    <Settings visible={this.state.settingsVisible} />
                    <Route exact path="/" component={Home} />
                    {/* https://stackoverflow.com/questions/27864720/react-router-pass-props-to-handler-component */}
                    <Route path="/course/:playlistId" render={(props) => (
                        <Course updateTitle={this.updateTitle} {...props} />
                    )} />
                </div>
            </Router>
        )
    }
}

export default App
