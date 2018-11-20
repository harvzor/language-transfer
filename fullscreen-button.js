class FullscreenButton extends React.Component {
    state = {
        isFullscreen: false
    }
    componentDidMount = () => {
        if (!screenfull.enabled)
            return
        screenfull.on('change', () => {
            this.setState(() => ({
                isFullscreen: screenfull.isFullscreen
            }))
        })
    }
    toggleFullscreen = (event) => {
        event.preventDefault()

        screenfull.toggle()
    }
    classString = () => {
        return 'navigation-settings fullscreen fullscreen--'
            + (this.state.isFullscreen ? 'exit' : 'enter')
    }
    render() {
        if (screenfull.enabled) {
            return (
                <a href="#fullscreen" className={this.classString()} onClick={this.toggleFullscreen}></a>
            )
        }

        return null
    }
}
