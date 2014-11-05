appModule.controller("appController", ["$scope", "$compile", "diceService", "messageService", "hangoutsService",
    function ($scope, $compile, diceService, messageService, hangoutsService) {
        var outputArea = angular.element(document.getElementById('outputArea'));

        // Initialization function for the controller
        $scope.init = function () {
            $scope.destiny = "";

            // If destiny tokens have already been added, make sure the participant now joining sees the correct current state
            if (hangoutsService.data.getValue('destiny')) {
                $scope.destiny = hangoutsService.data.getValue('destiny');
            }

            $scope.resetAfterRoll = false;

            // Set the dice quantities when the app first loads
            $scope.diceQuantities = [];
            $scope.resetDiceQuantities();
            $scope.numericDieType = 100;

            $scope.contentLoaded = true;
        }

        // Set quantities of all dice to zero
        $scope.resetDiceQuantities = function () {
            for (var color in diceService.dice) {
                $scope.diceQuantities[color] = 0;
            }
            $scope.diceQuantities['Numeric'] = 0;
        }

        // Insert a break line in the output area
        $scope.insertBreak = function () {
            outputArea.prepend("<hr/>");
        }

        // Clear all the messages from the output area
        $scope.clearMessages = function () {
            outputArea.html("");
        }

        // Roll all the selected dice
        $scope.roll = function () {
            var qty = 0;
            for (var color in diceService.dice) {
                qty += $scope.diceQuantities[color];
            }

            qty += $scope.diceQuantities['Numeric'];

            if (qty > 0) {
                diceService.roll($scope.diceQuantities, $scope.numericDieType);

                if ($scope.resetAfterRoll) {
                    $scope.resetDiceQuantities();
                }
            } else {
                outputArea.prepend("<div class='alert'>No dice selected!</div>");
            }
        }

        //$scope.rollStandardDie = function (maxValue, postText) {
        //    diceService.rollStandardDie(maxValue, postText);
        //}

        // Display a message in the output area using the message-display directive
        $scope.displayMessage = function (message) {
            var messageDisplay = angular.element("<message-display message='message'></message-display>");
            var newScope = $scope.$new(true);
            newScope.message = message;
            var el = $compile(messageDisplay)(newScope);
            outputArea.prepend(messageDisplay);
        };

        // Add a destiny point
        // Destiny points start as light side
        $scope.addDestiny = function () {
            var destiny = "";
            if (hangoutsService.data.getValue('destiny')) {
                destiny = hangoutsService.data.getValue('destiny');
            }

            destiny += "L";

            // Set the destiny in the shared state
            hangoutsService.data.setValue("destiny", destiny);

            // Also add a message telling everyone that someone added a Destiny token
            var message = {
                messageId: messageService.getNextMessageId(),
                type: "html",
                participantId: hangoutsService.getLocalParticipant().id,
                data: {
                    html: "Destiny added"
                }
            };

            // Set the message in the shared state
            hangoutsService.data.setValue(message.messageId, JSON.stringify(message));
        }

        // Remove the last destiny point added
        $scope.removeDestiny = function () {
            var destiny = "";
            if (hangoutsService.data.getValue('destiny')) {
                destiny = hangoutsService.data.getValue('destiny');
            }

            destiny = destiny.substr(0, destiny.length - 1);

            // Set the destiny in the shared state
            hangoutsService.data.setValue("destiny", destiny);

            // Also add a message telling everyone that someone removed a Destiny token
            var message = {
                messageId: messageService.getNextMessageId(),
                type: "html",
                participantId: hangoutsService.getLocalParticipant().id,
                data: {
                    html: "Destiny removed"
                }
            };

            // Set the message in the shared state
            hangoutsService.data.setValue(message.messageId, JSON.stringify(message));
        }

        // Toggle a destiny point from light to dark or vice-versa
        $scope.toggleDestiny = function (position) {
            var destiny = "";

            if (hangoutsService.data.getValue('destiny')) {
                destiny = hangoutsService.data.getValue('destiny');
            }

            var destinyUsed = destiny.charAt(position);

            if (destinyUsed == "L") {
                destiny = replaceAt(destiny, position, "D");
            } else {
                destiny = replaceAt(destiny, position, "L");
            }

            // Set the destiny in the shared state
            hangoutsService.data.setValue("destiny", destiny);

            // Also add a message telling everyone that someone flipped Destiny token
            var message = {
                messageId: messageService.getNextMessageId(),
                type: "html",
                participantId: hangoutsService.getLocalParticipant().id,
                data: {
                    html: "Destiny used: " + (destinyUsed == "L" ? "Light" : "Dark")
                }
            };

            // Set the message in the shared state
            hangoutsService.data.setValue(message.messageId, JSON.stringify(message));
        }

        // Add an event handler for whenever the state of the data changes
        hangoutsService.data.onStateChanged.add(function (stateChangedEvent) {
            // Loop through all the keys that were added to the shared state
            for (var i = 0; i < stateChangedEvent.addedKeys.length; i++) {
                var key = stateChangedEvent.addedKeys[i].key;
                var keyFirstPart = key.substring(0, key.indexOf("-") == -1 ? key.length : key.indexOf("-"));

                // The first part of the key will tell us what we need to do with it
                switch (keyFirstPart) {
                    case "msg":
                        // A message of any type to display in the main output area
                        // e.g. the results of a die roll
                        var message = JSON.parse(stateChangedEvent.addedKeys[i].value);
                        $scope.displayMessage(message);
                        break;
                    case "destiny":
                        // The current state of the destiny tracker
                        $scope.destiny = "";
                        if (hangoutsService.data.getValue('destiny')) {
                            $scope.destiny = hangoutsService.data.getValue('destiny');
                        }
                        break;
                }
            }
        });

        // After everything is defined, call the init function for the controller
        $scope.init();
    }]);