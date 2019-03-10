import apiService from '../services/ApiService'
import storageService from '../services/StorageService'

var Lesson = function(lesson) {
    /**
     * ID of this lesson, unique only to this course.
     */
    this.lessonId = lesson.lessonId || null

    /**
     * Unique course name this lesson belongs to.
     */
    this.courseName = lesson.courseName || null

    /**
     * Printable title.
     */
    this.title = lesson.title || ''

    /**
     * Name of the audio file.
     */
    this.fileName = lesson.fileName || ''

    /**
     * File size, in bytes.
     */
    this.fileSize = lesson.fileSize || 0

    /**
     * If the lesson has been completed.
     */
    this.completed = lesson.completed || false

    /**
     * If the lesson has been downloaded.
     */
    this.downloaded = lesson.downloaded || false

    /**
     * Lesson audio, if it has been downloaded.
     */
    this.audio = lesson.audio || null

    /**
     * Toggle if the lesson has been completed by the user.
     * @returns {void}
     */
    this.toggleComplete = () => {
        this.completed = !this.completed
    }

    /**
     * Download the lesson's audio if it hasn't already.
     * Delete the lssons's audio if it's already been downloaded.
     * @returns {void}
     */
    this.toggleDownload = async() => {
        if (this.downloaded) {
            this.audio = null

            this.downloaded = false
        } else {
            // TODO: audio path
            this.audio = await apiService.getLessonAudio('/api/audio/lesson/' + this.fileName)

            this.downloaded = true
        }
    }

    /**
     * Get the raw object (without functions), useful for saving to storage.
     * @returns {Object}
     */
    this.getBasicObject = () => {
        let l = {}

        for (let key in this) {
            if (typeof this[key] !== 'function') {
                l[key] = this[key]
            }
        }

        return l
    }

    /**
     * Save this lesson to storage.
     * @returns {void}
     */
    this.save = async() => {
        storageService.lessons.set(this.getBasicObject())
    }

    /**
     * Get the latest saved object from storage (or it will just return this object.)
     * @returns {Object} Lesson object.
     */
    this.getSaved = async() => {
        try
        {
            return await storageService.lessons.get(this.lessonId, this.courseName)
        }
        catch
        {
            return this
        }
    }

    /**
     * Get the file size in a printable format.
     * @returns {string} Size in MB or whatever, ready for printing to the UI.
     */
    this.getPrintableFileSize = () => {
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

        if (this.fileSize === 0)
            return '0 Bytes'

        let i = parseInt(Math.floor(Math.log(this.fileSize) / Math.log(1024)))

        return Math.round(this.fileSize / Math.pow(1024, i), 2) + sizes[i]
    }
}

export default Lesson
