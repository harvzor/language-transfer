var settings = function() {
    let settings = null

    settings = {
        "userId": 81304541,
        "clientId": "3G4IUm6MvEkHBNMfVTb8cvapuzQ9tiV0"
    }

    /*
        $.ajax({
            url: baseUrl + 'settings.json'
        })
        .done((data) => {
            settings = data
        })
    */

    // Why doesn't this work?
    //return settings

    return function() {
        return settings
    };
}();

export default settings
