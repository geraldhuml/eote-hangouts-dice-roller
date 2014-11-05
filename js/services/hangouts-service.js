appModule.service("hangoutsService", [function () {

    this.data = gapi.hangout.data;

    this.onApiReady = gapi.hangout.onApiReady;

    this.getLocalParticipant = function () {
        return gapi.hangout.getLocalParticipant();
    }

    this.getParticipantById = function (participantId) {
        return gapi.hangout.getParticipantById(participantId);
    }
}]);