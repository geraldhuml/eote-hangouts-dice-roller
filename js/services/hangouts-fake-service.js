// These are need for the code in hangout-init.js to run properly if we're not actually connected to Hangouts
var gadgets = {
    util: {
        registerOnLoadHandler: function (func) {
            func();
        }
    }
};

var gapi = {
    hangout: {
        onApiReady: {
            add: function (func) {
                func({ isApiReady: true });
            }
        }
    }
};

appModule.service("hangoutsService", [function () {

    //var _data = { destiny: "DDLL" }
    var _data = new Object();
    var _stateChangedFunction = function () { };

    // Hardcode a participant for the fake service to use
    var _participant = {
        id: 1234,
        person: {
            image: {
                url: "https://lh4.googleusercontent.com/-XlaUq1MC7PQ/AAAAAAAAAAI/AAAAAAAAAAA/UhEE5TO7Li8/s96-c/photo.jpg"
            },
            displayName: "Chris Hooker"
        }
    };

    this.data = {
            getValue: function(key) {
                return _data[key];
            },
            setValue: function(key, value) {
                _data[key] = value;
                _stateChangedFunction({addedKeys: [{key: key, value: value}]});
            },
            onStateChanged: {
                add: function (func) {
                    _stateChangedFunction = func;
                }
            }
    }

    this.onApiReady = {
        add: function(func) {
            func({ isApiReady: true });
        }
    }

    this.getLocalParticipant = function () {
        return _participant;
    }

    this.getParticipantById = function (participantId) {
        return _participant;
    }
}]);
