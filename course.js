"use strict";

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

const AudioElement = (props) => {
    return (
        <section className="bar audio">
            <iframe width="100%" height="100%" scrolling="no" frameBorder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F&amp;show_teaser=false"></iframe>
        </section>
    )
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

        audio.changeTrack(this.props.track.id)

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

var trackList = function(audio) {
    const $trackList = $('#track-list');
    const id = new URLSearchParams(window.location.search).get('id');

    api.getPlaylist(id)
        .then(playlist => {
            courseName(playlist);

            ReactDOM.render(<TrackList tracks={playlist.tracks} />, $trackList[0])
        });
};

var controls = function(audio) {
    const $controlsBack = $('#controls-back');
    const $controlsForward = $('#controls-forward');
    const $controlsToggle = $('#controls-toggle');

    audio.stateChangeFunctions.push((hasStarted, isPaused, isLoading) => {
        if (!hasStarted) {
            $controlsToggle.text('Play')
        }

        if (hasStarted && !isPaused) {
            $controlsToggle.text('Pause')
        }

        if (isLoading) {
            $controlsToggle.text('Loading...')
        }

        if (hasStarted && isPaused) {
            $controlsToggle.text('Resume')
        }
    });

    $controlsBack.on('click', function() {
        audio.addSeconds(-5);
    });

    $controlsForward.on('click', function() {
        audio.addSeconds(5);
    });

    $controlsToggle.on('click', function() {
        audio.toggle();
    });
};

var courseName = function(playlist) {
    $('#course-name').text(playlist.title);
};

ReactDOM.render(<AudioElement />, $('#audio-target')[0])
const audio = new Audio();

$(document).ready(() => {
    trackList(audio);
    controls(audio);
});
