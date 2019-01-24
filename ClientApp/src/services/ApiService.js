var api = function() {
    const baseUrl = '/api/audio/'

    /**
     * @private
     */
    var get = (item, isJson) => {
        return new Promise((resolve, reject) => {
            fetch(baseUrl + item)
                .then(resp => {
                    if (isJson)
                        return resp.json()

                    return resp.text()
                })
                .then(data => {
                    resolve(data)
                })
                .catch(() => {
                    reject()
                })
        });
    };

    var getPlaylists = () => {
        return get('playlists', true)
    }

    var getPlaylist = (id) => {
        return get('playlist/' + id, true)
    }

    var getLesson = (id) => {
        return get('lesson/' + id, false)
    }

    var getLessonAudio = (audioPath) => {
        return new Promise((resolve, reject) => {
            fetch(audioPath)
                .then(resp => {
                    return resp.text()
                })
                .then(data => {
                    resolve(data)
                })
                .catch(() => {
                    reject()
                })
        })
    }

    return {
        getPlaylists: getPlaylists,
        getPlaylist: getPlaylist,
        getLesson: getLesson,
        getLessonAudio: getLessonAudio
    }
}()

export default api
