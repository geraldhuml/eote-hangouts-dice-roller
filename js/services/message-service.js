appModule.service("messageService", ["hangoutsService", function (hangoutsService) {
    var nextLocalMessageId = 1;

    this.getNextMessageId = function () {
        return 'msg-' + hangoutsService.getLocalParticipant().id + '-' + nextLocalMessageId++;
    }
}]);