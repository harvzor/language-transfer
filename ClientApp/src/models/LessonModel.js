import apiService from '../services/ApiService'
import storageService from '../services/StorageService'

var Lesson = function(lesson) {
    this.id = lesson.id || null
    this.title = lesson.title || ''
    this.fileName = lesson.fileName || ''

    // If the lesson has been compelted.
    this.completed = lesson.completed || false

    // If the lesson has been downloaded.
    this.downloaded = lesson.downloaded || false

    // The less audio.
    this.audio = lesson.audio || null

    this.toggleComplete = () => {
        this.completed = !this.completed
    }

    this.toggleDownload = async() => {
        if (this.downloaded) {
            this.audio = null

            this.downloaded = false
        } else {
            //console.log(await apiService.getLessonAudio('/audio/german/' + this.fileName))
            // TODO: audio path
            //this.audio = await apiService.getLessonAudio('/audio/german/' + this.fileName)

            // TODO: audio path
            this.audio = await apiService.getLessonAudio('/api/audio/lesson/' + this.fileName)

            console.log(this.audio)

            this.downloaded = true
        }
    }

    this.getBasicObject = () => {
        let l = {};

        for (let key in this) {
            if (typeof this[key] !== 'function') {
                l[key] = this[key]
            }
        }

        return l
    }

    this.save = async() => {
        storageService.lessons.set(this.getBasicObject())
    }

    this.getSaved = async() => {
        return await storageService.lessons.get(this.id) || this
    }
}

export default Lesson
