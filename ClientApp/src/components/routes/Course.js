import React, { Component } from 'react'
import TrackList from '../TrackList'
import AudioUi from '../AudioUi'
import api from '../../services/ApiService'

class Course extends Component {
    state = {
        trackSelected: false,
        playlist: {
            tracks: []
        }
    }
    componentDidMount = () => {
        const id = this.props.match.params.playlistId

        api.getPlaylist(id)
            .then(playlist => {
                this.props.updateTitle(playlist.title)

                this.setState(() => ({
                    playlist: playlist
                }))
            });
    }
    trackSelectedEvent = () => {
        this.setState(() => ({
            trackSelected: true
        }))
    }
    render() {
        return (
            <div>
                <section className="list tracks">
                    <p>Select a track to be played.</p>
                    <TrackList tracks={this.state.playlist.tracks} trackSelected={this.trackSelectedEvent} />
                </section>
                <div className={"ui-container" + (this.state.trackSelected ? "" : " hidden")}>
                    <AudioUi />
                </div>
            </div>
        )
    }
}

export default Course
