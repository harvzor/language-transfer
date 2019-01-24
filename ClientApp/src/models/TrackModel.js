var Track = function(track) {
    this.id = track.id || null

    // If the lesson has been compelted.
    this.completed = track.completed || false

    // If the lesson has been downloaded.
    this.downloaded = track.downloaded || false

    // The less audio.
    this.audio = track.audio || null

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
