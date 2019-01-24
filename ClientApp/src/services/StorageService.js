import dbService from './dbService'
import TrackModel from '../models/TrackModel'

var storage = function() {
    let tracks = function() {
        let key = 'tracks'

        let get = () => {
            let storedTracks = JSON.parse(localStorage.getItem(key))

            if (!storedTracks) {
                return null
            }

            storedTracks = storedTracks.map(track => {
                track.audio = null

                return track
            })

            storedTracks.forEach((track) => {
                dbService.get(track.id)
                    .then((dbTrack) => {
                        if (dbTrack) {
                            track.audio = dbTrack.audio

                            console.log(track)
                        }
                    })
                    .catch((e) => {
                        console.error(e)
                    })
            })

            return storedTracks.map(storedTrack => new TrackModel(storedTrack))
        }

        let set = (tracksForSaving) => {
            let localStorageTracks = tracksForSaving.map(track => track.getLocalStorageObject())

            localStorage.setItem(key, JSON.stringify(localStorageTracks))

            if (tracksForSaving.audio === null) {
            } else {
                tracksForSaving
                    .filter(track => track.downloaded)
                    .map(track => track.getDbStorageObject())
                    .forEach(track => {
                        dbService.set(track)
                    })
            }
        }

        return {
            get: get,
            set: set
        }
    }()

    let settings = function() {
        let key = 'settings'

        let get = () => {
            return JSON.parse(localStorage.getItem(key))
        }

        let set = (data) => {
            localStorage.setItem(key, JSON.stringify(data))
        }

        return {
            get: get,
            set: set
        }
    }()

    return {
        tracks: tracks,
        settings: settings
    }
}()

export default storage
