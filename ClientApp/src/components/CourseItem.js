import React from 'react'
import { Link } from 'react-router-dom'

const CourseItem = (props) => {
    return (
        <li>
            <Link to={'/course/' + props.playlist.name}>
                {props.playlist.title}
            </Link>
        </li>
    )
}

export default CourseItem
