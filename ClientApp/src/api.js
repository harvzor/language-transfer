var api = function() {
    const baseUrl = '/api/soundcloud/'

    /**
     * @private
     */
    var get = (item, data) => {
        return new Promise((resolve, reject) => {
            fetch(baseUrl + item)
                .then(resp => resp.json())
                .then(data => {
                    resolve(data)
                })
                .catch(() => {
                    reject()
                })
        });
    };

    var getPlaylists = () => {
        return get('playlists')
    }

    var getPlaylist = (id) => {
        return get('playlist/' + id)
    }

    return {
        getPlaylists: getPlaylists,
        getPlaylist: getPlaylist
    }
}()

export default api
