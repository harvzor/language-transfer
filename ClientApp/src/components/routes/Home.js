import React, { Component } from 'react'
import CourseList from '../CourseList'
import api from '../../services/ApiService'
import Course from '../../models/CourseModel';

class Home extends Component {
    state = {
        settingsVisible: false,
        courses: []
    }
    componentDidMount = () => {
        api.getCourses()
            .then(courses => {
                courses
                    .map(course => new Course(course))
                    .forEach(course => {
                        course.getSavedLessons(() => {}, c => {
                            this.setState(prevState => {
                                prevState.courses.push(c)

                                return prevState
                            })
                        })
                    })

            })
    }
    render() {
        return (
            <section className="list">
                <p>Learn a language using these free audio lessons.</p>
                <p>Start by selecting language you want to learn.</p>
                <CourseList courses={this.state.courses} />
            </section>
        )
    }
}

export default Home
