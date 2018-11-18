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

const TrackList = (props) => {
    return (
        <ul>
            {props.tracks.map((track, i) =>
                <TrackItem track={track} id={i} key={i} />
            )}
        </ul>
    )
}

class TrackItem extends React.Component {
    state = {
        isSelected: false,
        isComplete: progress.getTrack(this.props.track.id) == null ? false : progress.getTrack(this.props.track.id).complete
    }
    handleClick = (event) => {
        event.preventDefault()

        AudioUi.audio.changeTrack(this.props.track.id)

        this.setState(() => ({
            isSelected: true
        }))
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
            <li className={{ "selected": this.state.isSelected }}>
                <a href={this.props.track.id} data-id={this.props.track.id} onClick={this.handleClick}>{this.props.id + 1}</a>
                <a href={this.props.track.id} data-id={this.props.track.id} onClick={this.completionHandleClick}>Mark {this.state.isComplete ? "uncomplete" : "complete"}</a>
            </li>
        )
    }
}

class App extends React.Component {
    render() {
        return (
            <div>
                <section className="bar bar--thin navigation">
                    <a href="/" className="navigation-back">&lt;</a>
                    <h1>Language Transfer</h1>
                    <h2 id="course-name"></h2>
                    <a href="#settings" className="navigation-settings"></a>
                </section>
                <section className="settings-page hidden">
                    <h3>Settings</h3>
                    <label>
                        <input type="checkbox" name="keepAwake" />
                        Keep awake? (experimental, won't be remembered)
                    </label>
                    <label>
                        <input type="checkbox" name="autoStop" />
                        Auto stop? (not functional)
                    </label>
                </section>
                <section className="list tracks" id="track-list"></section>
                <div className="ui-container">
                    /*
                        <section className="bar hint">
                            <p>Translate: "find them!" to German</p>
                        </section>
                    */
                    <AudioUi />
                </div>
            </div>
        )
    }
}

var trackList = function() {
    const $trackList = $('#track-list');
    const id = new URLSearchParams(window.location.search).get('id');

    api.getPlaylist(id)
        .then(playlist => {
            courseName(playlist);

            ReactDOM.render(<TrackList tracks={playlist.tracks} />, $trackList[0])
        });
};

var courseName = function(playlist) {
    $('#course-name').text(playlist.title);
};

ReactDOM.render(<App />, $('#app')[0])

$(document).ready(() => {
    trackList();
});
