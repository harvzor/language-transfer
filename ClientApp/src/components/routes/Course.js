import React, { Component } from 'react'
import TrackList from '../TrackList'
import AudioUi from '../AudioUi'
import api from '../../services/ApiService'
import Lesson from '../../models/LessonModel'

class Course extends Component {
    state = {
        trackSelected: false,
        course: {
            lessons: []
        }
    }
    componentDidMount = () => {
        const id = this.props.match.params.playlistId

        api.getPlaylist(id)
            .then(course => {
                this.props.updateTitle(course.title)

                course.lessons = course.lessons
                    .map(lesson => new Lesson(lesson))

                Promise.all(
                    course.lessons
                        .map(lesson => lesson.getSaved())
                )
                .then(lessons => {
                    course.lessons = lessons

                    this.setState(() => ({
                        course: course
                    }))
                })
            })
    }
    trackSelectedEvent = (lesson) => {
        this.setState(() => ({
            trackSelected: true
        }))

        AudioUi.audio.changeTrack(lesson, this.state.course.path)
    }
    render() {
        return (
            <div>
                <section className="list tracks">
                    <p>Select a track to be played.</p>
                    <TrackList lessons={this.state.course.lessons} trackSelected={this.trackSelectedEvent} downloadTrackEvent={this.downloadTrackEvent} />
                </section>
                <div className={"ui-container" + (this.state.trackSelected ? "" : " hidden")}>
                    <AudioUi />
                </div>
            </div>
        )
    }
}

export default Course
