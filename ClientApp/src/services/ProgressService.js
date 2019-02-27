import storageService from './StorageService'
import Lesson from '../models/LessonModel'
import apiService from './ApiService'

/**
 * DEPRECATED!
 * Handles the user's progress in the browser local storage.
 */
var progressService = function() {
    let lessons = storageService.lessons.getAll() || []

    /**
     * @private
     */
    let save = () => {
        storageService.lessons.setAll(lessons)
    }

    let getTrack = (id) => {
        let track = lessons.find(track => track.id === id) || null

        if (track == null) {
            track = new Lesson({
                id: id
            })

            lessons.push(track)
        }

        return track
    }

    let toggleComplete = (id) => {
        let track = getTrack(id)

        track.completed = !track.completed

        save()
    }

    let toggleDownload = (id, audioPath) => {
        return new Promise((resolve, reject) => {
            let track = getTrack(id)

            if (track.downloaded) {
                track.audio = null

                track.downloaded = false

                save()

                resolve()
            } else {
                apiService.getLessonAudio(audioPath)
                    .then(audio => {
                        track.audio = audio

                        track.downloaded = true

                        save()

                        resolve()
                    })
                    .catch(() => {
                        resolve()
                    })
            }
        })
    }

    return {
        tracks: lessons,
        getTrack: getTrack,
        toggleComplete: toggleComplete,
        toggleDownload: toggleDownload
    }
}()

export default progressService
