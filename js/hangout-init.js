function init() {
    // When API is ready...
    gapi.hangout.onApiReady.add(
        function (eventObj) {
            if (eventObj.isApiReady) {
                // Bootstrap Angular manually so we make sure things happen in the proper order between
                // Angular and the Google APIs
                angular.bootstrap(document, ['appModule']);
            }
        });
}

// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);