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
