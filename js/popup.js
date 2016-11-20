(function($) {
    'use strict';

    var alarmName = 'blimbAlarm';

    $('#toggleAlarm').click(toggleAlarm);

    $("#interval").change(resetAlarm);

    $("#interval").val(localStorage.interval || '60');

    initialSettings();

    chrome.alarms.get(alarmName, synchronizeClockWithAlarmTimer);

    function toggleAlarm() {
        chrome.alarms.get(alarmName, function(isAlarmExists) {
            if (isAlarmExists) cancelAlarm();
            else createAlarm();
            initialSettings();
        });
    }

    function resetAlarm() {
        localStorage.interval = $(this).val();
        chrome.alarms.get(alarmName, function(isAlarmExists) {
            if (isAlarmExists) cancelAlarm();
            createAlarm();
        });
    }

    function initialSettings() {
        chrome.alarms.get(alarmName, function(isAlarmExists) {
            var toggleLabel;
            if (isAlarmExists) {
                toggleLabel = 'Отключить';
                $(".wrapper").slideDown("fast");
                chrome.browserAction.setIcon({
                    path: 'images/on.png'
                });
            } else {
                toggleLabel = 'Включить';
                $(".wrapper").slideUp("fast");
                chrome.browserAction.setIcon({
                    path: 'images/off.png'
                });
            }
            document.getElementById('toggleAlarm').innerText = toggleLabel;
        });
    }

    function synchronizeClockWithAlarmTimer(alarm) {
        if (alarm) {
            var deadline = new Date(alarm.scheduledTime).toUTCString();
            initializeClock('countdown-clock', deadline);
        }
    };

    function createAlarm() {
        var $interval = parseInt($("#interval").val() || localStorage.interval || '60');
        chrome.alarms.create(alarmName, {
            delayInMinutes: $interval,
            periodInMinutes: $interval
        });
        localStorage.interval = $interval;
        var deadline = new Date(Date.parse(new Date()) + $interval * 60 * 1000);
        initializeClock('countdown-clock', deadline);
    }

    function cancelAlarm() {
        chrome.alarms.clear(alarmName);
    }

})(jQuery);