import React, { Component } from 'react'
import TrackList from '../TrackList'
import AudioUi from '../AudioUi'
import api from '../../services/ApiService'
import CourseModel from '../../models/CourseModel'
import PieChart from 'react-minimal-pie-chart'
import Audio from '../../services/AudioService'

class Course extends Component {
    state = {
        trackSelected: false,
        course: new CourseModel()
    }
    componentDidMount = () => {
        const id = this.props.match.params.playlistId

        api.getCourse(id)
            .then(apiCourse => {
                let course = new CourseModel(apiCourse)

                this.props.updateTitle(course.title)

                course.getSavedLessons(c => {
                    this.setState(() => ({
                        course: c
                    }))
                })
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
    renderPieChart() {
        if (this.state.course.calculateCompletionPercentage() === 0) {
            return;
        }

        return <PieChart
            data={[
                {
                    value: this.state.course.calculateCompletionPercentage(),
                    color: 'black'
                },
                {
                    value: 100 - this.state.course.calculateCompletionPercentage(),
                    color: 'grey'
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
            style={{margin: '30px auto', width: '50%', maxWidth: '300px' }}
        />
    }
    render() {
        return (
            <div>
                <section className={"list tracks " + (this.state.trackSelected ? " track-selected" : "")}>
                    <p>Select a track to be played.</p>
                    { this.renderPieChart() }
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
