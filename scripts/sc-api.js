var api = function() {
    const baseUrl = 'https://api-v2.soundcloud.com/';

    /**
     * @private
     */
    var get = (item, data) => {
        data = typeof data === 'undefined' ? {} : data;

        data.client_id = settings().clientId;

        return new Promise((resolve, reject) => {
            fetch(baseUrl + item, {
                body: data
            })
            .then(returnData => {
                resolve(returnData);
            })
            .catch(() => {
                reject();
            })

            /*
                $.ajax({
                    url: baseUrl + item,
                    data: data
                })
                .done((returnData) => {
                    resolve(returnData);
                })
                .fail(() => {
                    reject();
                });
            */
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
