"use strict";

const CourseList = (props) => {
    return (
        <ul>
            {props.playlists.map((playlist, i) =>
                <CourseItem playlist={playlist} key={i} />
            )}
        </ul>
    )
}

const CourseItem = (props) => {
    return (
        <li>
            <a href={"/course?id=" + props.playlist.id}>{props.playlist.title}</a>
        </li>
    )
}

var courseList = function() {
    const $courseList = $('#course-list');

    api.getPlaylists()
        .then(playlists => {
            ReactDOM.render(<CourseList playlists={playlists.collection} />, $courseList[0])
        })
};

$(document).ready(() => {
    courseList();
});
