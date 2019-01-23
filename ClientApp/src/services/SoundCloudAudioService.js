const SC = window.SC

/**
 * Handle the audio player.
 */
var Audio = function () {
    const widget = SC.Widget(document.querySelector('iframe'));
    const url = 'https://api.soundcloud.com/tracks/{id}';

    this.trackId = null;

    /**
     * Run the state change functions.
     * @private
     */
    let stateChange = () => {
        this.stateChangeFunctions
            .forEach(func => func(this.hasStarted, this.isPaused, this.isLoading));
    };

    /*
    * If the audio has started being played.
    */
    this.hasStarted = null;

    /*
    * If the audio is currently paused/not playing.
    */
    this.isPaused = null;

    /*
    * If the audio is currently loading.
    */
    this.isLoading = null;

    /* Only run when the page first loads the widget.
        widget.bind(SC.Widget.Events.READY, () => {
            this.isLoading = false;

            console.log('raed');

            stateChange();
        });
    */

    widget.bind(SC.Widget.Events.PLAY_PROGRESS, progress => {
        let isLoading = progress.loadedProgress === 0;

        if (isLoading !== this.isLoading) {
            this.isLoading = isLoading;

            stateChange();
        }
    });

    widget.bind(SC.Widget.Events.PLAY, () => {
        this.isPaused = false;
        this.hasStarted = true;
        // Is this right??
        this.isLoading = true;

        stateChange();
    });

    widget.bind(SC.Widget.Events.PAUSE, () => {
        this.isPaused = true;

        stateChange();
    });

    /**
     * Scroll the music backwards of fowards by a given number of seconds.
     * @param {number} seconds Number of seconds to add to the current time position.
     */
    this.addSeconds = seconds => {
        widget.getPosition(milliseconds => {
            widget.seekTo(milliseconds + (seconds * 1000));
        });
    };

    /**
     * Toggle playback.
     */
    this.toggle = () => {
        widget.toggle();
    };

    /**
     * Change to a given track.
     * @param {number} id Id of the track to change to.
     */
    this.changeTrack = id => {
        this.trackId = id;

        let newUrl = url.replace('{id}', this.trackId);

        widget.load(newUrl, {
            auto_play: false,
            hide_related: true,
            show_comments: false,
            show_user: false,
            show_reposts: false,
            show_teaster: false,
            visual: false,
            download: false,
            show_artwork: false,
            // Only run when the widget is manually loaded.
            callback: () => {
                this.isLoading = false;

                stateChange();
            }
        });

        this.hasStarted = false;
        this.isLoading = true;

        stateChange();
    };

    /**
     * Function should should run when the audio changes state (such as playing or being paused.
     */
    this.stateChangeFunctions = [];
};

export default Audio
