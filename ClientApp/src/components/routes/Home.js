import React, { Component } from 'react'
import CourseList from '../CourseList'
import api from '../../services/ApiService'

class Home extends Component {
    state = {
        settingsVisible: false,
        playlists: []
    }
    componentDidMount = () => {
        api.getCourses()
            .then(courses => {
                this.setState(() => ({
                    playlists: courses
                }))
            })
    }
    render() {
        return (
            <section className="list">
                <p>Select a course you want to start.</p>
                <CourseList playlists={this.state.playlists} />
            </section>
        )
    }
}

export default Home
