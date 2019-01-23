import React, { Component } from 'react'
import progressService from '../services/ProgressService'

class TrackItem extends Component {
    state = {
        isComplete: false,
        isDownloaded: false
    }
    componentDidMount = () => {
        let track = progressService.getTrack(this.props.lesson.id)

        this.setState(() => ({
            isComplete: track.completed,
            isDownloaded: track.downloaded
        }))
    }
    handleClick = (event) => {
        event.preventDefault()

        this.props.trackSelected(this.props.lesson)
    }
    downloadHandClick = (event) => {
        event.preventDefault()

        progressService.toggleDownload(this.props.lesson.id)

        this.setState(() => ({
            isDownloaded: progressService.getTrack(this.props.lesson.id).downloaded
        }))
    }
    completionHandleClick = (event) => {
        event.preventDefault()

        progressService.toggleComplete(this.props.lesson.id)

        this.setState(() => ({
            isComplete: progressService.getTrack(this.props.lesson.id).completed
        }))
    }
    render() {
        return (
            <li className={this.props.selected ? "selected" : ""}>
                <a href={'#' + this.props.lesson.id} data-id={this.props.lesson.id} onClick={this.handleClick}>{this.props.lesson.title}</a>
                <a href={'#' + this.props.lesson.id} data-id={this.props.lesson.id} onClick={this.downloadHandClick}>{this.state.isDownloaded ? "Delete download" : "Download"}</a>
                <a href={'#' + this.props.lesson.id} data-id={this.props.lesson.id} onClick={this.completionHandleClick}>Mark {this.state.isComplete ? "uncomplete" : "complete"}</a>
            </li>
        )
    }
}

export default TrackItem
