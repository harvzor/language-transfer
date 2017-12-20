"use strict";

var courseList = function() {
    const $courseList = $('#course-list');

    api.getPlaylists()
        .then(playlists => {
            playlists.collection.forEach(playlist => {
                $courseList.append(
                    $('<li/>')
                        .append(
                            $('<a/>', {
                                'data-id': playlist.id,
                                href: '/course?id=' + playlist.id,
                                text: playlist.title
                            })
                        )
                );
            });
        })
};

$(document).ready(() => {
    courseList();
});
