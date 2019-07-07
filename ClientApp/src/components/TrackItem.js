import React, { Component } from 'react'
import CheckBox from "react-animated-checkbox"
import Audio from '../services/AudioService'
import { Link } from 'react-router-dom'

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

        Audio.stateChangeFunctions.push((state) => {
            if (state.hasEnded && Audio.trackId === this.props.lesson.lessonId) {
                this.props.lesson.completed = true

                this.completionChangeEvent()
            }
        })
    }
    handleClick = (event) => {
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
    completionChangeEvent = async() => {

        await this.props.lesson.save()

        this.setState(() => ({
            isComplete: this.props.lesson.completed
        }))

        this.props.updateCompletionVisualisation(this.props.lesson)
    }
    completionHandleClick = (event) => {
        event.preventDefault()

        this.props.lesson.toggleComplete()

        this.completionChangeEvent()
    }
    render() {
        return (
            <li className={ "borders li-flex" + (this.props.selected ? " selected" : "") }>
                <Link to={'/course/german/' + this.props.lesson.lessonId} onClick={this.handleClick}>{this.props.lesson.title}</Link>
                {/* <a href={'#' + this.props.lesson.lessonId} onClick={this.handleClick}>{this.props.lesson.title}</a> */}
                <a href={'#' + this.props.lesson.lessonId} className="borders-left" onClick={this.downloadHandleClick}>{this.downloadText()}</a>
                <a href={'#' + this.props.lesson.lessonId} className="borders-left" onClick={this.completionHandleClick}>
                    <CheckBox
                        checked={this.state.isComplete}
                        checkBoxStyle={{
                            checkedColor: "#34b93d",
                            size: 20,
                            unCheckedColor: "#b8b8b8"
                        }}
                        duration={400}
                    />
                </a>
            </li>
        )
    }
}

export default TrackItem
