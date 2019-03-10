import React, { Component } from 'react'
import TrackList from '../TrackList'
import AudioUi from '../AudioUi'
import api from '../../services/ApiService'
import Lesson from '../../models/LessonModel'
import PieChart from 'react-minimal-pie-chart'
import Audio from '../../services/AudioService'

class Course extends Component {
    state = {
        trackSelected: false,
        course: {
            lessons: []
        }
    }
    componentDidMount = () => {
        const id = this.props.match.params.playlistId

        api.getCourse(id)
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

        Audio.changeTrack(lesson, this.state.course.path)
    }
    updateCompletionVisualisation = (lesson) => {
        this.setState((prevState) => {
            let index = prevState.course.lessons.findIndex(l => l.lessonId === lesson.lessonId)

            prevState.course.lessons[index] = lesson

            return prevState
        })
    }
    calculateCompletionPercentage = () => {
        return Math.floor(
            this.state.course.lessons.filter(lesson => lesson.completed).length
            / this.state.course.lessons.length
            * 100
        ) || 0
    }
    render() {
        return (
            <div>
                <section className="list tracks">
                    <PieChart
                        data={[
                            {
                                value: this.calculateCompletionPercentage(),
                                color: 'red'
                            },
                            {
                                value: 100 - this.calculateCompletionPercentage(),
                                color: 'blue'
                            }
                        ]}
                        lineWidth={20}
                        label={({ data, dataIndex }) =>
                            dataIndex === 0 ? Math.round(data[dataIndex].percentage) + '% complete' : ''
                        }
                        labelStyle={{
                            fontSize: '10px',
                            fontFamily: 'sans-serif'
                        }}
                        labelPosition={0}
                        style={{margin: '30px auto', width: '50%' }}
                    />
                    <p>Select a track to be played.</p>
                    <TrackList
                        lessons={this.state.course.lessons}
                        trackSelected={this.trackSelectedEvent}
                        downloadTrackEvent={this.downloadTrackEvent}
                        updateCompletionVisualisation={this.updateCompletionVisualisation}
                    />
                </section>
                <div className={"ui-container" + (this.state.trackSelected ? "" : " hidden")}>
                    <AudioUi />
                </div>
            </div>
        )
    }
}

export default Course
