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

                let lessons = course.lessons
                    .map(lesson => new Lesson(lesson))

                course.lessons = []

                this.getSavedLessons(course, lessons, 0)

                /*
                    lessons
                        .forEach(lesson => {
                            lesson.getSaved()
                                .then(lesson => {
                                    course.lessons.push(lesson)

                                    this.setState(() => ({
                                        course: course
                                    }))
                                })
                        })
                */

                /* This proves to be very slow when the audio data has been downloaded.
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
                */
            })
    }
    getSavedLessons = (course, lessons, index) => {
        if (lessons.length === index) {
            return
        }

        lessons[index].getSaved()
            .then(lesson => {
                course.lessons.push(lesson)

                this.setState(() => ({
                    course: course
                }))

                this.getSavedLessons(course, lessons, index + 1)
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
