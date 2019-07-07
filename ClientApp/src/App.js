import React, { Component } from 'react'
import { Router, Link, Route } from 'react-router-dom'
import './App.css'
import Home from './components/routes/Home'
import Course from './components/routes/Course'
import FullscreenButton from './components/FullscreenButton'
import Settings from './components/Settings'
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';

class App extends Component {
    history = createBrowserHistory()
    state = {
        settingsVisible: false,
        title: null
    }
    componentDidMount = () => {
        this.setupAnalytics()
    }
    setupAnalytics = () => {
        if (window.location.hostname === 'localhost') {
            return
        }

        ReactGA.initialize('UA-138693497-01')

        ReactGA.pageview(window.location.pathname + window.location.search)

        this.history.listen(location => {
            ReactGA.pageview(location.pathname + location.search)
        })
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
            <Router history={this.history}>
                <div>
                    <section className="bar bar--thin navigation borders-bottom">
                        <Route exact path="/" render={() => (
                            <h1 className="home">Language Transfer</h1>
                        )} />
                        <Route path={["/course/:playlistId/:lessonId", "/course/:playlistId"]} render={() => (
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
                    <Route path={["/course/:playlistId/:lessonId", "/course/:playlistId"]} render={(props) => (
                        <Course updateTitle={this.updateTitle} {...props} />
                    )} />
                </div>
            </Router>
        )
    }
}

export default App
