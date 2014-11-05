appModule.directive("messageDisplay", ["$sanitize", "hangoutsService", function ($sanitize, hangoutsService) {
    return {
        restrict: 'E',
        templateUrl: "message-display.html",
        scope: {
            message: '=message'
        },
        link: function ($scope, element, attrs) {

            $scope.person = hangoutsService.getParticipantById($scope.message.participantId).person;

            $scope.dateTime = new Date().toLocaleTimeString();

            $scope.symbols = {
                "S": "success.png",
                "F": "failure.png",
                "A": "advantage.png",
                "T": "threat.png",
                "X": "triumph.png",
                "D": "despair.png",
                "B": "black-circle.png",
                "W": "white-circle.png"
            }
        }
    };
}]);