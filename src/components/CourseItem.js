import React from 'react'
import { Link } from 'react-router-dom'

const CourseItem = (props) => {
    return (
        <li>
            <Link to={'/course/' + props.playlist.id}>
                {props.playlist.title}
            </Link>
        </li>
    )
}

export default CourseItem
