import React from 'react'
import PieChart from 'react-minimal-pie-chart'
import { Link } from 'react-router-dom'

const CourseItem = (props) => {
    return (
        <li className="li-flex">
            <Link to={'/course/' + props.course.name}>
                {props.course.title}
            </Link>
            <PieChart
                data={[
                    {
                        value: props.course.calculateCompletionPercentage(),
                        color: 'black'
                    },
                    {
                        value: 100 - props.course.calculateCompletionPercentage(),
                        color: 'grey'
                    }
                ]}
                lineWidth={20}
                label={({ data, dataIndex }) =>
                    dataIndex === 0 ? Math.round(data[dataIndex].percentage) + '%' : ''
                }
                labelStyle={{
                    fontSize: '40px',
                    fontFamily: 'sans-serif',
                    paddingTop: '5px',
                    transform: 'translateY(12.5px)'
                }}
                labelPosition={0}
                style={{
                    float: 'right',
                    padding: '2px',
                    width: '50px',
                    pointerEvents: 'none'
                }}
            />
        </li>
    )
}

export default CourseItem
