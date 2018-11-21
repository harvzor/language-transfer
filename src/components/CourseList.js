import React from 'react';
import CourseItem from './CourseItem'

const CourseList = (props) => {
    return (
        <ul>
            {props.playlists.map((playlist, i) =>
                <CourseItem playlist={playlist} key={i} />
            )}
        </ul>
    )
}

export default CourseList;
