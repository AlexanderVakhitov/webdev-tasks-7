define(function() {
    var hrundel = {};

    const decreaseValue = 1;
    const increaseValue = 5;
    const decreaseTimeout = 500;
    const increaseTimeout = 500;

    (function init() {
        if (localStorage.hrundel) {
            hrundel = JSON.parse(localStorage.hrundel);
            hrundel.status = 'none';
            updateHrundel();
        } else {
            resetHrundel();
        }

        setInterval(function () {
            decreaseProperty('satiety');
            decreaseProperty('energy');
            decreaseProperty('mood');
        }, decreaseTimeout);

        setInterval(function () {
            switch(hrundel.status) {
                case 'sleep':
                    increaseProperty('energy');
                    break;
                case 'feed':
                    increaseProperty('satiety');
                    break;
            }
        }, increaseTimeout);
    })();

    function getInstance() {
        return {
            satiety: hrundel.satiety,
            energy: hrundel.energy,
            mood: hrundel.mood
        };
    }

    function getStatus() {
        return hrundel.status;
    }

    function setStatus(status) {
        hrundel.status = status;
    }

    function resetHrundel() {
        hrundel = {
            satiety: 100,
            energy: 100,
            mood: 100,
            status: 'none',
            timestamp: new Date().getTime()
        };
        saveInstance();
    }

    function updateHrundel() {
        if (!isAlive()) {
            return;
        }

        var newTime = new Date().getTime();
        var oldTime = hrundel.timestamp;
        var iterateIndex = Math.floor((newTime - oldTime) / decreaseTimeout);

        while (iterateIndex-- && isAlive()) {
            decreaseProperty('satiety');
            decreaseProperty('energy');
            decreaseProperty('mood');
        }
    }

    function isAlive() {
        return (hrundel.satiety + hrundel.energy !== 0 &&
            hrundel.satiety + hrundel.mood !== 0 &&
            hrundel.energy + hrundel.mood !== 0);
    }

    function decreaseProperty(property) {
        if (isAlive()) {
            hrundel[property] - decreaseValue <= 0 ?
                hrundel[property] = 0 :
                hrundel[property] -= decreaseValue;
            saveInstance();
        }
    }

    function increaseProperty(property) {
        if (isAlive()) {
            hrundel[property] + increaseValue >= 100 ?
                hrundel[property] = 100 :
                hrundel[property] += increaseValue;
            saveInstance();
        }
    }

    function saveInstance() {
        hrundel.timestamp = new Date().getTime();
        localStorage.hrundel = JSON.stringify(hrundel);
    }

    return {
        getInstance: getInstance,
        getStatus: getStatus,
        setStatus: setStatus,
        reset: resetHrundel,
        decrease: decreaseProperty,
        increase: increaseProperty,
        isAlive: isAlive
    };
});
