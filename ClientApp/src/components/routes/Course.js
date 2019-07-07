import React, { Component } from 'react'
import TrackList from '../TrackList'
import AudioUi from '../AudioUi'
import api from '../../services/ApiService'
import CourseModel from '../../models/CourseModel'
import PieChart from 'react-minimal-pie-chart'
import Audio from '../../services/AudioService'

class Course extends Component {
    state = {
        selectedLesson: null,
        trackSelected: false,
        course: new CourseModel()
    }
    componentDidMount = () => {
        const playlistId = this.props.match.params.playlistId
        const lessonId = parseInt(this.props.match.params.lessonId)

        api.getCourse(playlistId)
            .then(apiCourse => {
                let course = new CourseModel(apiCourse)

                course.getSaved()

                // this.setState(() => ({
                //     course: course
                // }))

                this.props.updateTitle(course.title)

                course.getSavedLessons(c => {
                    this.setState(() => ({
                        course: c
                    }))

                }, () => {
                    if (lessonId) {
                        const selectedLesson = this.state.course.lessons
                            .find(lesson => lesson.lessonId === lessonId)

                        if (selectedLesson) {
                            this.trackSelectedEvent(selectedLesson)
                        }
                    }
                })
            })

        this.trackTotalListeningTime()

    }
    renderFriendlyTime = (seconds) => {
        seconds = parseInt(seconds, 10);

        let days = Math.floor(seconds / (3600*24));

        seconds  -= days*3600*24;

        let hours   = Math.floor(seconds / 3600);

        seconds  -= hours*3600;

        let minutes = Math.floor(seconds / 60);

        seconds  -= minutes*60;

        return <span>
            { days > 0 ? `${days} day` : '' }
            { days > 1 ? `s` : '' }
            { days > 0 ? ` ` : '' }
            { hours > 0 ? `${hours} hour` : '' }
            { hours > 1 ? `s` : '' }
            { hours > 0 ? ` ` : '' }
            { minutes > 0 ? `${minutes} minute` : '' }
            { minutes > 1 ? `s` : '' }
            { minutes > 0 ? ` ` : '' }
            { (days > 0 || hours > 0 || minutes > 0) && seconds > 0 ? 'and ' : '' }
            { seconds > 0 ? `${seconds } second` : '' }
            { seconds > 1 ? `s` : '' }
        </span>
    }
    trackTotalListeningTime = () => {
        let oldSeconds = 0

        Audio.stateChangeFunctions.push((state) => {
            let currentSeconds = parseInt(state.position)
            // This will probably always only be 1 second later.
            let difference = currentSeconds - oldSeconds;

            if (difference !== 1) {
                // Probably the track has been skipped ahead or something.
                if (difference !== 0) {
                    oldSeconds = currentSeconds
                }

                // No change, don't update anything.
                return
            }

            oldSeconds = currentSeconds

            this.setState((prevState) => ({ ...prevState.course, totalListeningTime: prevState.course.totalListeningTime += difference }));

            this.state.course.save()
        })
    }
    trackSelectedEvent = (lesson) => {
        this.setState(() => ({
            trackSelected: true,
            selectedLesson: lesson.lessonId
        }))

        Audio.changeTrack(lesson)
    }
    updateCompletionVisualisation = (lesson) => {
        this.setState((prevState) => {
            let index = prevState.course.lessons.findIndex(l => l.lessonId === lesson.lessonId)

            prevState.course.lessons[index] = lesson

            return prevState
        })
    }
    renderProgress() {
        if (this.state.course.calculateCompletionPercentage() === 0 && this.state.course.totalListeningTime === 0) {
            return
        }

        return <div>
            <h3>Your progress:</h3>
            { this.renderTimeSpentListening() }
            { this.renderPieChart() }
        </div>
    }
    renderTimeSpentListening() {
        if (this.state.course.totalListeningTime === 0) {
            return
        }

        return <p>Time spent listening: { this.renderFriendlyTime(this.state.course.totalListeningTime) }</p>
    }
    renderPieChart() {
        if (this.state.course.calculateCompletionPercentage() === 0) {
            return
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
                    { this.renderProgress() }
                    <h3>Select a track to be played:</h3>
                    <TrackList
                        lessons={this.state.course.lessons}
                        selectedLesson={this.state.selectedLesson}
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
