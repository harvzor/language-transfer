"use strict";

/**
 * Handles the user's progress in the browser local storage.
 */
var progress = function() {
    let tracks = storage.tracks.get() || [];

    /**
     * @private
     */
    let save = () => {
        storage.tracks.set(tracks);
    };

    let getTrack = (id) => {
        return tracks.find(track => track.id == id) || null;
    };

    let toggleComplete = (id) => {
        let track = getTrack(id);

        if (track == null) {
            track = new Track({ id: id });

            tracks.push(track);
        }

        track.complete = !track.complete;

        save();
    };

    return {
        tracks: tracks,
        getTrack: getTrack,
        toggleComplete: toggleComplete
    };
}();


class AudioUi extends React.Component {
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

class AudioElement extends React.Component {
    componentDidMount = () => {
        AudioUi.audio = new Audio()
    }
    render() {
        return (
            <section className="bar audio">
                <iframe width="100%" height="100%" scrolling="no" frameBorder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F&amp;show_teaser=false"></iframe>
            </section>
        )
    }
}

class Controls extends React.Component {
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

class TrackList extends React.Component {
    state = {
        // The index of the selected track.
        selected: null
    }
    handleTrackClick = (i) => {
        this.setState(() => ({
            selected: i
        }))

        this.props.trackSelected()
    }
    render() {
        return (
            <ul>
                {this.props.tracks.map((track, i) =>
                    <TrackItem selected={i === this.state.selected} trackSelected={this.handleTrackClick} track={track} id={i} key={i} />
                )}
            </ul>
        )
    }
}

class TrackItem extends React.Component {
    state = {
        isComplete: progress.getTrack(this.props.track.id) == null ? false : progress.getTrack(this.props.track.id).complete
    }
    handleClick = (event) => {
        event.preventDefault()

        AudioUi.audio.changeTrack(this.props.track.id)

        this.props.trackSelected(this.props.id)
    }
    completionHandleClick = (event) => {
        event.preventDefault()

        progress.toggleComplete(this.props.track.id)

        this.setState(() => ({
            isComplete: progress.getTrack(this.props.track.id).complete
        }))
    }
    render() {
        return (
            <li className={this.props.selected ? "selected" : ""}>
                <a href={this.props.track.id} data-id={this.props.track.id} onClick={this.handleClick}>Track {this.props.id + 1}</a>
                <a href={this.props.track.id} data-id={this.props.track.id} onClick={this.completionHandleClick}>Mark {this.state.isComplete ? "uncomplete" : "complete"}</a>
            </li>
        )
    }
}

class App extends React.Component {
    state = {
        trackSelected: false,
        playlist: {
            title: '',
            tracks: []
        }
    }
    componentDidMount = () => {
        const id = new URLSearchParams(window.location.search).get('id');

        api.getPlaylist(id)
            .then(playlist => {
                this.setState(() => ({
                    playlist: playlist
                }))
            });
    }
    toggleFullscreen = (event) => {
        event.preventDefault()

        document.getElementById('app').requestFullscreen();
    }
    toggleSettingsVisible = (event) => {
        event.preventDefault()

        this.setState((prevState) => ({
            settingsVisible: !prevState.settingsVisible
        }))
    }
    trackSelectedEvent = () => {
        this.setState(() => ({
            trackSelected: true
        }))
    }
    render() {
        return (
            <div>
                <section className="bar bar--thin navigation">
                    <a href="/" className="navigation-back">&lt;</a>
                    <h1>Language Transfer</h1>
                    <h2>{this.state.playlist.title}</h2>
                    <a href="#fullscreen" className="navigation-settings fullscreen" onClick={this.toggleFullscreen}></a>
                    <a href="#settings" className="navigation-settings" onClick={this.toggleSettingsVisible}></a>
                </section>
                <Settings visible={this.state.settingsVisible} />
                <section className="list tracks">
                    <p>Select a track to be played.</p>
                    <TrackList tracks={this.state.playlist.tracks} trackSelected={this.trackSelectedEvent} />
                </section>
                <div className={"ui-container" + (this.state.trackSelected ? "" : " hidden")}>
                    <AudioUi />
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
