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
     * If the track has started.
    */
    this.hasStarted = false

    /**
     * If the track has ended.
    */
    this.hasEnded = false

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
                    hasEnded: this.hasEnded,
                    isPaused: this.isPaused,
                    isLoading: this.isLoading,
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
        if (this.isPaused || this.isLoading || this.hasEnded)
            return

        // I'm sure this should speed up the app but it just gets slower and slower!
        // if (this.position === track.seek()) {
        //     requestAnimationFrame(progressChange)
        // }

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
            this.duration = track.duration()

            this.isLoading = false

            stateChange()
        })

        track.on('play', () => {
            this.isPaused = false
            this.hasStarted = true
            this.isLoading = false

            stateChange()
            progressChange()
        })

        track.on('pause', () => {
            this.isPaused = true

            stateChange()
        })

        track.on('stop', () => {
            stateChange()
        })

        track.on('end', () => {
            this.hasEnded = true
            this.hasStarted = false

            stateChange()

            this.hasEnded = false
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
    this.changeTrack = (lesson) => {
        if (track !== null) {
            // These values cannot be put in the on stop event as the on stop event doesn't execute fast enough.
            this.isPaused = null
            this.isLoading = null
            this.hasStarted = null

            this.progress = 0
            this.duration = 0
            this.position = 0

            track.unload()
        }

        this.trackId = lesson.lessonId

        this.hasStarted = false
        this.isLoading = true

        track = new Howl({
            src: lesson.downloaded
                ? lesson.audio
                : `/audio/${lesson.courseName}/${lesson.fileName}`
        })

        setupEvents()
        stateChange()
    }

    /**
     * Function should should run when the audio changes state (such as playing or being paused.
     */
    this.stateChangeFunctions = []
}

var audio = new Audio()

export default audio
