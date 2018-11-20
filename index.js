"use strict";

const CourseList = (props) => {
    return (
        <ul>
            {props.playlists.map((playlist, i) =>
                <CourseItem playlist={playlist} key={i} />
            )}
        </ul>
    )
}

const CourseItem = (props) => {
    return (
        <li>
            <a href={"/course?id=" + props.playlist.id}>{props.playlist.title}</a>
        </li>
    )
}

class App extends React.Component {
    state = {
        settingsVisible: false,
        playlists: {
            collection: []
        }
    }
    componentDidMount = () => {
        api.getPlaylists()
            .then(playlists => {
                this.setState(() => ({
                    playlists: playlists
                }))
            })
    }
    toggleSettingsVisible = (event) => {
        event.preventDefault()

        this.setState((prevState) => ({
            settingsVisible: !prevState.settingsVisible
        }))
    }
    render() {
        return (
            <div>
                <section className="bar bar--thin navigation">
                    <h1>Language Transfer</h1>
                    <FullscreenButton />
                    <a href="#settings" className="navigation-settings" onClick={this.toggleSettingsVisible}></a>
                </section>
                <Settings visible={this.state.settingsVisible} />
                <section className="list">
                    <p>Select a course you want to start.</p>
                    <CourseList playlists={this.state.playlists.collection} />
                </section>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
