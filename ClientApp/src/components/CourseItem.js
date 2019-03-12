import React from 'react'
import PieChart from 'react-minimal-pie-chart'
import { Link } from 'react-router-dom'

const CourseItem = (props) => {
    return (
        <li>
            <Link to={'/course/' + props.course.name}>
                {props.course.title}
            </Link>
            <PieChart
                data={[
                    {
                        value: props.course.calculateCompletionPercentage(),
                        color: 'red'
                    },
                    {
                        value: 100 - props.course.calculateCompletionPercentage(),
                        color: 'blue'
                    }
                ]}
                lineWidth={20}
                label={({ data, dataIndex }) =>
                    dataIndex === 0 ? Math.round(data[dataIndex].percentage) + '%' : ''
                }
                labelStyle={{
                    fontSize: '50px',
                    fontFamily: 'sans-serif'
                }}
                labelPosition={0}
                style={{ float: 'right', padding: '5px', width: '50px' }}
            />
        </li>
    )
}

export default CourseItem
