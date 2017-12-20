var api = function() {
    const baseUrl = '/json/';

    /**
     * @private
     */
    var get = (item, data) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: baseUrl + item + '.json'
            })
            .done((returnData) => {
                resolve(returnData);
            })
            .fail(() => {
                reject();
            });
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
