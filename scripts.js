"use strict";

var Track = function(track) {
    this.id = track.id || null;
    this.complete = track.complete || false;
};

var storage = function() {
    let tracks = function() {
        let key = 'tracks';

        let get = () => {
            return JSON.parse(localStorage.getItem(key));
        };

        let set = (data) => {
            localStorage.setItem(key, JSON.stringify(data));
        };

        return {
            get: get,
            set: set
        };
    }();

    return {
        tracks: tracks
    };
}();

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

var api = function() {
    const baseUrl = 'json/';

    var getPlaylist = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: baseUrl + 'tracks.json'
            })
            .done((data) => {
                resolve(data);
            })
            .fail(() => {
                reject();
            });
        });
    };

    return {
        getPlaylist: getPlaylist
    };
}();

var Audio = function () {
    const widget = SC.Widget(document.querySelector('iframe'));
    const url = 'https://api.soundcloud.com/tracks/{id}';

    let stateChange = () => {
        this.stateChangeFunctions.forEach(func => func(this.hasStarted, this.isPaused));
    };

    this.hasStarted = null;
    this.isPaused = null;

    widget.bind(SC.Widget.Events.PLAY, () => {
        this.isPaused = false;
        this.hasStarted = true;

        stateChange();
    });

    widget.bind(SC.Widget.Events.PAUSE, () => {
        this.isPaused = true;

        stateChange();
    });

    this.addSeconds = (seconds) => {
        widget.getPosition((milliseconds) => {
            widget.seekTo(milliseconds + (seconds * 1000));
        });
    };

    this.toggle = () => {
        widget.toggle();
    };

    this.changeTrack = (id) => {
        let newUrl = url.replace('{id}', id);

        widget.load(newUrl, {
            auto_play: false,
            hide_related: true,
            show_comments: false,
            show_user: false,
            show_reposts: false,
            show_teaster: false,
            visual: false,
            download: false,
            show_artwork: false
        });

        this.hasStarted = false;

        stateChange();
    };

    this.stateChangeFunctions = [];
};

var trackList = function(audio) {
    const $trackList = $('#track-list');

    api.getPlaylist()
        .then(data => {
            data.tracks.forEach((track, index) => {
                $trackList.append(
                    $('<li/>')
                        .append(
                            $('<a/>', {
                                'data-id': track.id,
                                href: track.id,
                                text: 'Track ' + (index + 1)
                            })
                            .on('click', function(e) {
                                let $this = $(this);
                                let id = $this.data('id');

                                e.preventDefault();

                                audio.changeTrack(id);
                            }),
                            $('<a/>', {
                                'data-id': track.id,
                                href: track.id,
                                text: progress.getTrack(track.id) != null && progress.getTrack(track.id).complete
                                    ? 'Mark uncomplete'
                                    : 'Mark complete'
                            })
                            .on('click', function(e) {
                                let $this = $(this);
                                let id = $this.data('id');

                                e.preventDefault();

                                progress.toggleComplete(id);

                                if (progress.getTrack(track.id).complete) {
                                    $this.text('Mark uncomplete');
                                } else {
                                    $this.text('Mark complete');
                                }
                            })
                        )
                );
            });
        });
};

var controls = function(audio) {
    const $controlsBack = $('#controls-back');
    const $controlsForward = $('#controls-forward');
    const $controlsToggle = $('#controls-toggle');

    audio.stateChangeFunctions.push((hasStarted, isPaused) => {
        if (!hasStarted) {
            $controlsToggle.text('Play')

            return;
        }

        if (isPaused) {
            $controlsToggle.text('Resume')
        } else {
            $controlsToggle.text('Pause')
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

$(document).ready(function() {
    const audio = new Audio();

    trackList(audio);
    controls(audio);
});
