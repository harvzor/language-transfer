"use strict";

/*
var Track = function(track) {
    this.id = track.id || null;
    this.complete = track.complete || false;
};
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

var trackList = function(audio) {
    const $trackList = $('#track-list');

    api.getPlaylist(157713757)
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

$(document).ready(() => {
    const audio = new Audio();

    trackList(audio);
    controls(audio);
});
