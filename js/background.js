(function() {
    'use strict';

    var chromeVersionFull = /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1];
    var chromeVersion = parseInt(chromeVersionFull.split('.')[0]);

    // https://developer.chrome.com/apps/alarms
    chrome.alarms.onAlarm.addListener(function(alarm) {
        chrome.browserAction.setIcon({
            path: 'images/break.gif'
        });
        createNotification();
    });

    // https://developer.chrome.com/apps/notifications
    chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
        if (buttonIndex === 0) {
            chrome.tabs.create({
                url: "http://blimb.su"
            });
            localStorage.lastExerciseTime = new Date();
        }
        chrome.notifications.clear(notificationId, function() {});
    });

    chrome.notifications.onClosed.addListener(function() {
        chrome.browserAction.setIcon({
            path: 'images/on.png'
        });
    });

    function createNotification() {
        if (!localStorage.lastExerciseTime)
            var message = 'Пора дать глазам отдохнуть и заняться упражнениями.';
        else {
            var message = 'Последний раз вы занимались упражнениями';
            var hourEndings = ['часа', 'часов', 'часов'];
            var dayEndings = ['дня', 'дней', 'дней'];
            var exerciseDuration = 4 * 1000 * 60; // 4 min
            var timePassedSinceLastExercise = Date.parse(new Date()) - Date.parse(localStorage.lastExerciseTime) + exerciseDuration;
            var hoursPassedSinceLastExercise = Math.floor((timePassedSinceLastExercise / (1000 * 60 * 60)) % 24);
            var daysPassedSinceLastExercise = Math.floor(timePassedSinceLastExercise / (1000 * 60 * 60 * 24));

            if (daysPassedSinceLastExercise > 0) {
                message += ' больше ' + ((daysPassedSinceLastExercise == 1) ? '' : daysPassedSinceLastExercise + ' ') + getNumEnding(daysPassedSinceLastExercise, dayEndings);
            } else if (hoursPassedSinceLastExercise > 0) {
                message += ' больше ' + ((hoursPassedSinceLastExercise == 1) ? '' : hoursPassedSinceLastExercise + ' ') + ' ' + getNumEnding(hoursPassedSinceLastExercise, hourEndings);
            } else message += ' меньше часа';

            message += ' назад.';
        }

        var options = {
            type: 'basic',
            iconUrl: 'images/alarm.png',
            title: 'Сделайте перерыв',
            message: message,
            buttons: [{
                title: 'Перейти к упражнениям',
                iconUrl: ''
            }, {
                title: 'Пропустить',
                iconUrl: ''
            }]
        };

        if (chromeVersion >= 50) options.requireInteraction = true;

        chrome.notifications.create('blimbNotification', options);
    }

    /**
     * Функция возвращает окончание для множественного числа слова на основании числа и массива окончаний
     * param  iNumber Integer Число на основе которого нужно сформировать окончание
     * param  aEndings Array Массив слов или окончаний для чисел (1, 4, 5),
     *         например ['яблоко', 'яблока', 'яблок']
     * return String
     */
    function getNumEnding(iNumber, aEndings) {
        var sEnding, i;
        iNumber = iNumber % 100;
        if (iNumber >= 11 && iNumber <= 19) {
            sEnding = aEndings[2];
        } else {
            i = iNumber % 10;
            switch (i) {
                case (1):
                    sEnding = aEndings[0];
                    break;
                case (2):
                case (3):
                case (4):
                    sEnding = aEndings[1];
                    break;
                default:
                    sEnding = aEndings[2];
            }
        }
        return sEnding;
    }

})();