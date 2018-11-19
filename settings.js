class Settings extends React.Component {
    state = {
        settings: storage.settings.get() || {
            autoStop: false
        }
    }
    noSleep = new NoSleep()
    save = (settings) => {
        storage.settings.set(settings);
    }
    keepAwakeChange = (event) => {
        let checked = event.target.checked

        if (checked) {
            this.noSleep.enable()
        } else {
            this.noSleep.disable()
        }
    }
    autoStopChange = (event) => {
        let checked = event.target.checked

        this.setState(prevState => {
            prevState.settings.autoStop = checked

            this.save(prevState.settings)

            return prevState
        })
    }
    render() {
        return (
            <section className={"settings-page" + (this.props.visible ? "" : " hidden")}>
                <h3>Settings</h3>
                <label>
                    <input type="checkbox" onChange={this.keepAwakeChange} />
                    Keep awake? (experimental, won't be remembered)
                </label>
                <label>
                    <input type="checkbox" defaultChecked={this.state.settings.autoStop} onChange={this.autoStopChange} />
                    Auto stop? (not functional)
                </label>
            </section>
        )
    }
}
