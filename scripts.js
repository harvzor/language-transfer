"use strict";

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
    };
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
