var Track = function(lesson) {
    this.id = lesson.id || null

    // If the lesson has been compelted.
    this.completed = lesson.completed || false

    // If the lesson has been downloaded.
    this.downloaded = lesson.downloaded || false

    // The less audio.
    this.audio = lesson.audio || null

    this.getLocalStorageObject = () => {
        return {
            id: this.id,
            completed: this.completed,
            downloaded: this.downloaded
        }
    }

    this.getDbStorageObject = () => {
        return {
            id: this.id,
            audio: this.audio
        }
    }
}

export default Track
