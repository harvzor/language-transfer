import React, { Component } from 'react'

class TrackItem extends Component {
    state = {
        isComplete: false,
        isDownloading: false,
        isDownloaded: false
    }
    componentDidMount = () => {
        this.setState(() => ({
            isComplete: this.props.lesson.completed,
            isDownloaded: this.props.lesson.downloaded
        }))
    }
    handleClick = (event) => {
        event.preventDefault()

        this.props.trackSelected(this.props.lesson)
    }
    downloadHandleClick = async(event) => {
        event.preventDefault()

        this.setState(() => ({
            isDownloading: true
        }))

        await this.props.lesson.toggleDownload()
        await this.props.lesson.save()

        this.setState(() => ({
            isDownloaded: this.props.lesson.downloaded,
            isDownloading: false
        }))
    }
    downloadText = () => {
        let fileSize = () => {
            return ` (${this.props.lesson.getPrintableFileSize()})`
        }

        if (this.state.isDownloading)
            return "Downloading..."

        if (this.state.isDownloaded)
            return "Delete download" + fileSize()

        return `Download` + fileSize()
    }
    completionHandleClick = async(event) => {
        event.preventDefault()

        await this.props.lesson.toggleComplete()
        await this.props.lesson.save()

        this.setState(() => ({
            isComplete: this.props.lesson.completed
        }))

        this.props.updateCompletionVisualisation(this.props.lesson)
    }
    render() {
        return (
            <li className={this.props.selected ? "selected" : ""}>
                <a href={'#' + this.props.lesson.id} data-id={this.props.lesson.id} onClick={this.handleClick}>{this.props.lesson.title}</a>
                <a href={'#' + this.props.lesson.id} data-id={this.props.lesson.id} onClick={this.downloadHandleClick}>{this.downloadText()}</a>
                <a href={'#' + this.props.lesson.id} data-id={this.props.lesson.id} onClick={this.completionHandleClick}>Mark {this.state.isComplete ? "uncomplete" : "complete"}</a>
            </li>
        )
    }
}

export default TrackItem
