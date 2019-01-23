import React, { Component } from 'react'
import TrackList from '../TrackList'
import AudioUi from '../AudioUi'
import api from '../../services/ApiService'

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

                this.setState(() => ({
                    course: course
                }))
            });
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
                    <TrackList lessons={this.state.course.lessons} trackSelected={this.trackSelectedEvent} />
                </section>
                <div className={"ui-container" + (this.state.trackSelected ? "" : " hidden")}>
                    <AudioUi />
                </div>
            </div>
        )
    }
}

export default Course
