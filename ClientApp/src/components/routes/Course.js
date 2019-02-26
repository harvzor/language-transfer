import React, { Component } from 'react'
import TrackList from '../TrackList'
import AudioUi from '../AudioUi'
import api from '../../services/ApiService'
import progressService from '../../services/ProgressService'
import Track from '../../models/TrackModel'

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
    downloadTrackEvent = (lesson) => {
        return progressService.toggleDownload(lesson.id, this.state.course.path + lesson.fileName)
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
