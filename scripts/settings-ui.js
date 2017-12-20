var settingsUi = function() {
    let settings = storage.settings.get() || {
        keepAwake: false,
        autoStop: false
    };

    const noSleep = new NoSleep();
    const $keepAwake = $('input[name="keepAwake"]');
    const $autoStop = $('input[name="autoStop"]');
    const $settingsPage = $('.settings-page');

    /**
     * @private
     */
    let toggleOpen = () => {
        $settingsPage.toggleClass('hidden');
    };

    /**
     * @private
     */
    let save = () => {
        storage.settings.set(settings);
    };

    let toggleNoSleep = () => {
        if (settings.keepAwake) {
            noSleep.enable();
        } else {
            noSleep.disable();
        }
    };

    $('.navigation-settings').on('click', (e) => {
        e.preventDefault();

        toggleOpen();
    });

    $keepAwake.prop('checked', settings.keepAwake);
    $autoStop.prop('checked', settings.autoStop);

    $keepAwake.on('change', function() {
        settings.keepAwake = this.checked;

        toggleNoSleep();
        //save();
    });

    $autoStop.on('change', function() {
        settings.autoStop = this.checked;

        save();
    });
};

$(document).ready(function() {
    settingsUi();
});
