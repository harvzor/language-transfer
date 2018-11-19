var api = function() {
    const baseUrl = '/json/';

    /**
     * @private
     */
    var get = (item, data) => {
        return new Promise((resolve, reject) => {
            fetch(baseUrl + item + '.json')
                .then(resp => resp.json())
                .then(data => {
                    resolve(data)
                })
                .catch(() => {
                    reject();
                })
        });
    };

    var getUser = () => {
        return get('users/' + settings().userId);
    };

    var getPlaylists = () => {
        return get('users/' + settings().userId + '/playlists');
    };

    var getPlaylist = (id) => {
        return get('playlists/' + id);
    };

    return {
        getUser: getUser,
        getPlaylists: getPlaylists,
        getPlaylist: getPlaylist
    };
}();
