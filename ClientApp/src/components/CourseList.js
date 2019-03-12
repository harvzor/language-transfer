import React from 'react';
import CourseItem from './CourseItem'

const CourseList = (props) => {
    return (
        <ul>
            {props.courses.map((course, i) =>
                <CourseItem course={course} key={i} />
            )}
        </ul>
    )
}

export default CourseList;
