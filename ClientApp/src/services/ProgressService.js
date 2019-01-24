import storageService from './StorageService'
import Track from '../models/TrackModel'
import apiService from './ApiService'

/**
 * Handles the user's progress in the browser local storage.
 */
var progressService = function() {
    let tracks = storageService.tracks.get() || []

    /**
     * @private
     */
    let save = () => {
        storageService.tracks.set(tracks)
    }

    let getTrack = (id) => {
        let track = tracks.find(track => track.id === id) || null

        if (track == null) {
            track = new Track({
                id: id
            })

            tracks.push(track)
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
        tracks: tracks,
        getTrack: getTrack,
        toggleComplete: toggleComplete,
        toggleDownload: toggleDownload
    }
}()

export default progressService
