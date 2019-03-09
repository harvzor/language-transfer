import {Howl/*, Howler*/} from 'howler'

/**
 * Handle the audio player.
 */
var Audio = function () {
    var track = null

    this.trackId = null

    /**
     * Percentage progress.
     */
    this.progress = 0

    /**
     * How long the track is in seconds.
     */
    this.duration = 0

    /**
     * The current playing position of the track in seconds.
     */
    this.position = 0

    /**
     * Run the state change functions.
     * @private
     */
    let stateChange = () => {
        this.stateChangeFunctions
            .forEach(func =>
                func({
                    progress: this.progress,
                    duration: this.duration,
                    position: this.position,
                    hasStarted: this.hasStarted,
                    isPaused: this.isPaused,
                    isLoading: this.isLoading
                })
            )
    }

    // Howler doesn't have a callback method for when progress is made in the track...
    // I have to set it up myself.
    /**
     * Watch for progress change.
     * @private
     */
    let progressChange = () => {
        if (this.isPaused)
            return

        this.position = track.seek()
        this.progress = this.position / this.duration * 100

        stateChange()

        requestAnimationFrame(progressChange)
    }

    /**
     * Setup the events.
     * @private
     */
    let setupEvents = () => {
        track.on('load', () => {
            console.log('load')

            this.duration = track.duration()

            this.isLoading = false

            stateChange()
        })

        track.on('play', () => {
            console.log('play')

            this.isPaused = false
            this.hasStarted = true
            this.isLoading = false

            stateChange()
            progressChange()
        })

        track.on('pause', () => {
            console.log('load')

            this.isPaused = true

            stateChange()
        })
    }

    /*
    * If the audio has started being played.
    */
    this.hasStarted = null

    /*
    * If the audio is currently paused/not playing.
    */
    this.isPaused = null

    /*
    * If the audio is currently loading.
    */
    this.isLoading = null

    /**
     * Scroll the music backwards of fowards by a given number of seconds.
     * @param {number} seconds Number of seconds to add to the current time position.
     */
    this.addSeconds = seconds => {
        track.seek(track.seek() + seconds)
    }

    /**
     * Seek the track along a certain percent.
     * @param {number} percent
     */
    this.seekToPercent = percent => {
        let seconds = track.duration() * percent / 100

        track.seek(seconds)
    }

    /**
     * Toggle playback.
     */
    this.toggle = () => {
        if (track.playing()) {
            track.pause();
        } else {
            track.play();
        }
    }

    /**
     * Change to a given track.
     * @param {object} lesson The lesson which should be played.
     * @param {string} path Path to the folder which the audio is stored.
     */
    this.changeTrack = (lesson, path) => {
        this.trackId = lesson.id

        this.hasStarted = false
        this.isLoading = true

        track = new Howl({
            src: lesson.downloaded
                ? lesson.audio
                : path + lesson.fileName
        })

        setupEvents()
        stateChange()

        /*
            api.getLesson(id)
                .then(lesson => {
                    track = new Howl({
                        src: lesson
                    })

                    setupEvents()
                    stateChange()
                })
        */
    }

    /**
     * Function should should run when the audio changes state (such as playing or being paused.
     */
    this.stateChangeFunctions = []
}

export default Audio
