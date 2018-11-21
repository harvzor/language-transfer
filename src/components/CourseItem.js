import React from 'react'

const CourseItem = (props) => {
    return (
        <li>
            <a href={"/course?id=" + props.playlist.id}>{props.playlist.title}</a>
        </li>
    )
}

export default CourseItem
