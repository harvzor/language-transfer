import storage from './StorageService'
import Track from '../models/TrackModel'

/**
 * Handles the user's progress in the browser local storage.
 */
var progressService = function() {
    let tracks = storage.tracks.get() || []

    /**
     * @private
     */
    let save = () => {
        storage.tracks.set(tracks)
    }

    let getTrack = (id) => {
        let track = tracks.find(track => track.id === id) || null

        console.log(id, track)

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

    let toggleDownload = (id) => {
        let track = getTrack(id)

        track.downloaded = !track.downloaded

        save()
    }

    return {
        tracks: tracks,
        getTrack: getTrack,
        toggleComplete: toggleComplete,
        toggleDownload: toggleDownload
    }
}()

export default progressService
