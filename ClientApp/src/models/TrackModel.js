var Track = function(track) {
    this.id = track.id || null

    // If the lesson has been compelted.
    this.completed = track.completed || false

    // If the lesson has been downloaded.
    this.downloaded = track.downloaded || false

    // The downloaded audio.
    this.getAudio = () => {

    }
}

export default Track
