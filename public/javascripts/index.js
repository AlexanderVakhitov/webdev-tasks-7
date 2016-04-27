'use strict';

var hrundel = {};

const decreaseValue = 1;
const increaseValue = 5;
const decreaseTimeout = 10000;
const increaseTimeout = 500;
const speechTimeout = 10000;

const hrundelPhrases = [
    'Привет, я свинья. А кто ты?',
    'Привет! Меня зовут Хрюндель!',
    'Хрю хрю хрю.',
    'Гав гав... ой, то есть хрю хрю.',
    'Похрюкай со мной... ну пожалуйста.'
];

const volumeInput = document.querySelector('.volume');
const hrundelMsg = document.querySelector('.message');
const svgHrundel = document.querySelector('.hrundel');
const satietyButton = document.querySelector('.add-satiety');
const energyButton = document.querySelector('.add-energy');
const moodButton = document.querySelector('.add-mood');
const newGame = document.querySelector('.new-game');

const hrundelSvg = new HrundelSvg();
const hrundelBar = new HrundelBar();

initTamagotchi();
initEvents();

function initTamagotchi() {
    if (localStorage.hrundel) {
        hrundel = JSON.parse(localStorage.hrundel);
        hrundel.status = 'none';
        updateHrundel();
    } else {
        resetHrundel();
    }

    setInterval(function() {
        decreaseProperty('satiety');
        decreaseProperty('energy');
        decreaseProperty('mood');
        isAlive();
    }, decreaseTimeout);

    saveInstance();
}

function initEvents() {
    satietyButton.onclick = increaseProperty.bind(null, 'satiety');
    energyButton.onclick = increaseProperty.bind(null, 'energy');
    moodButton.onclick = increaseProperty.bind(null, 'mood');
    newGame.onclick = resetHrundel;

    visitInstance();
    lightInstance();
    listenInstance();
    feedInstance();

    hrundelVoice();
}

function visitInstance() {
    var hidden = null;
    var visibilityChange = null;
    if ('hidden' in document) {
        hidden           = 'hidden';
        visibilityChange = 'visibilitychange';
    } else if ('mozHidden' in document) {
        hidden           = 'mozHidden';
        visibilityChange = 'mozvisibilitychange';
    } else if ('webkitHidden' in document) {
        hidden           = 'webkitHidden';
        visibilityChange = 'webkitvisibilitychange';
    }

    setInterval(function () {
        if (document[hidden]) {
            increaseProperty('energy');
        }
    }, increaseTimeout);

    document.addEventListener(visibilityChange, function() {
        if (document[hidden]) {
            hrundelMsg.innerHTML = 'Хрюндель уснул...';
            hrundel.status = 'sleep';
            hrundelSvg.sleep();
        } else {
            hrundelMsg.innerHTML = 'Хрюндель проснулся!';
            hrundel.status = 'none';
            hrundelSvg.wakeUp();
        }
    });
}

function lightInstance() {
    if ('ondevicelight' in window) {
        window.ondevicelight = function(event) {
            setInterval(function () {
                if (event.value <= 10 && hrundel.status !== 'listen') {
                    if (hrundel.status != 'sleep') {
                        hrundelMsg.innerHTML = 'Хрюндель уснул...';
                        hrundel.status = 'sleep';
                    }
                    increaseProperty('energy');
                }
                if (hrundel.status === 'sleep') {
                    hrundelMsg.innerHTML = 'Хрюндель проснулся!';
                    hrundel.status = 'none';
                }
            }, increaseTimeout);
        };
    }
}

function listenInstance() {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        var recognizer = new SpeechRecognition();

        recognizer.lang = 'ru-RU';
        recognizer.continuous = true;

        recognizer.onresult = function (event) {
            var index = event.resultIndex;
            var result = event.results[index][0].transcript.trim();

            hrundelMsg.innerHTML = result;
            increaseProperty('mood');

            if (hrundel.mood === 100 || hrundel.status === 'sleep') {
                setTimeout(function () {
                    hrundelMsg.innerHTML = 'Хрюндель Вас не слушает!';
                }, 2000);
                hrundel.status = 'none';
                recognizer.stop();
            }
        };

        svgHrundel.onclick = function() {
            if (hrundel.status !== 'sleep' && hrundel.mood < 100) {
                hrundelMsg.innerHTML = 'Хрюндель Вас слушает!';
                hrundel.status = 'listen';
                recognizer.start();
            }
        };
    }
}

function feedInstance() {
    if (navigator.getBattery) {
        navigator
            .getBattery()
            .then(function (battery) {
                setInterval(function () {
                    if (battery.charging &&
                        hrundel.energy < 100 &&
                        hrundel.status !== 'sleep') {
                        increaseProperty('satiety');
                    }
                }, increaseTimeout);
            });
    }
}

function hrundelVoice() {
    if (window.speechSynthesis) {
        setInterval(function () {
            if (hrundel.status === 'none') {
                var msg = new SpeechSynthesisUtterance(speechText());
                msg.volume = parseFloat(volumeInput.value);
                msg.lang = 'ru-RU';
                window.speechSynthesis.speak(msg);
            }
        }, speechTimeout);
    }
}

function speechText() {
    return hrundelPhrases[Math.floor(Math.random() * hrundelPhrases.length)];
}

function Hrundel(tamagotchi) {
    this.satiety = tamagotchi.satiety;
    this.energy = tamagotchi.energy;
    this.mood = tamagotchi.mood;
    this.status = tamagotchi.status;
    this.isAlive = tamagotchi.isAlive;
    this.timestamp = tamagotchi.timestamp;
}

function HrundelSvg() {
    this.init = function () {
        var svg = Snap('#hrundel');

        this.hrundelBg = svg.ellipse(450, 210, 350, 180).attr({ opacity: 0 });
        //Legs
        svg.circle(410, 340, 40).attr({
            fill: '#f99',
            stroke: "#000",
            strokeWidth: 5
        });
        svg.circle(490, 340, 40).attr({
            fill: '#f99',
            stroke: "#000",
            strokeWidth: 5
        });
        //Hands
        this.leftHand = svg.ellipse(400, 250, 80, 40).attr({
            fill: '#f99',
            stroke: "#000",
            strokeWidth: 5
        });
        this.rightHand = svg.ellipse(500, 250, 80, 40).attr({
            fill: '#f99',
            stroke: "#000",
            strokeWidth: 5
        });
        //Ears
        svg.polygon(360, 150, 350, 40, 450, 100).attr({
            fill: '#f99',
            stroke: "#000",
            strokeWidth: 5
        });
        svg.polygon(540, 150, 550, 40, 450, 100).attr({
            fill: '#f99',
            stroke: "#000",
            strokeWidth: 5
        });
        //Body
        svg.ellipse(450, 250, 80, 100).attr({
            fill: '#f99',
            stroke: "#000",
            strokeWidth: 5
        });
        svg.circle(450, 320, 5);
        //Head
        svg.circle(450, 150, 100).attr({
            fill: '#f99',
            stroke: "#000",
            strokeWidth: 5
        });
        svg.circle(450, 170, 35).attr({
            fill: '#f99',
            stroke: "#000",
            strokeWidth: 5
        });
        svg.circle(440, 170, 5);
        svg.circle(460, 170, 5);
        //Dead eyes
        this.deadLeftEye = svg.group(
            svg.line(400, 100, 420, 120),
            svg.line(400, 120, 420, 100)
        ).attr({
                opacity: 0,
                stroke: "#000",
                strokeWidth: 5
            });
        this.deadRightEye = svg.group(
            svg.line(480, 100, 500, 120),
            svg.line(480, 120, 500, 100)
        ).attr({
                opacity: 0,
                stroke: "#000",
                strokeWidth: 5
            });
        //Eyes
        this.leftEye = svg.ellipse(410, 110, 20, 20);
        this.rightEye = svg.ellipse(490, 110, 20, 20);
    }.bind(this)();

    this.sleep = function () {
        Snap.animate(0, 10, function (val) {
            this.leftEye.attr({
                ry: 2 * (10 - val) + 2
            });
            this.rightEye.attr({
                ry: 2 * (10 - val) + 2
            });
            this.hrundelBg.attr({
                opacity: val / 10
            });
        }.bind(this), 2000);
    };

    this.wakeUp = function () {
        Snap.animate(10, 0, function (val) {
            this.leftEye.attr({
                ry: 2 * (10 - val)
            });
            this.rightEye.attr({
                ry: 2 * (10 - val)
            });
            this.hrundelBg.attr({
                opacity: val / 10
            });
        }.bind(this), 2000);
    };

    this.alive = function () {
        this.leftEye.attr({ opacity: 1 });
        this.rightEye.attr({ opacity: 1 });
        this.deadLeftEye.attr({ opacity: 0 });
        this.deadRightEye.attr({ opacity: 0 });
    };

    this.dead = function () {
        this.leftEye.attr({ opacity: 0 });
        this.rightEye.attr({ opacity: 0 });
        this.deadLeftEye.attr({ opacity: 1 });
        this.deadRightEye.attr({ opacity: 1 });
    };
}

function HrundelBar() {
    this.init = function () {
        var svg = Snap('#hrundel');

        svg.circle(150, 510, 105).attr({ fill: '#f99' });
        svg.circle(450, 510, 105).attr({ fill: '#9F9' });
        svg.circle(750, 510, 105).attr({ fill: '#99f' });

        this.satietyBar = svg.circle(150, 510, 100).attr({
            fill: '#a00'
        });
        this.energyBar = svg.circle(450, 510, 100).attr({
            fill: '#0a0'
        });
        this.moodBar = svg.circle(750, 510, 100).attr({
            fill: '#00a'
        });
    }.bind(this)();

    this.update = function (instance) {
        this.satietyBar.animate({r: instance.satiety}, 1000);
        this.energyBar.animate({r: instance.energy}, 1000);
        this.moodBar.animate({r: instance.mood}, 1000);
    };
}

function resetHrundel() {
    hrundel = new Hrundel({
        satiety: 100,
        energy: 100,
        mood: 100,
        status: 'none',
        isAlive: true,
        timestamp: new Date().getTime()
    });
    hrundelMsg.innerHTML = 'Привет, я Хрюндель!';
    hrundelSvg.alive();
    saveInstance();
}

function updateHrundel() {
    if (!hrundel.isAlive) {
        hrundelMsg.innerHTML = 'Хрюндель героически погиб!';
        hrundelSvg.dead();
        return;
    }

    var newTime = new Date().getTime();
    var oldTime = hrundel.timestamp;
    var iterateIndex = Math.floor((newTime - oldTime) / decreaseTimeout);

    while (iterateIndex-- && hrundel.isAlive) {
        decreaseProperty('satiety');
        decreaseProperty('energy');
        decreaseProperty('mood');
        isAlive();
    }
}

function isAlive() {
    if (hrundel.satiety + hrundel.energy === 0 ||
        hrundel.satiety + hrundel.mood === 0 ||
        hrundel.energy + hrundel.mood === 0) {
        hrundelMsg.innerHTML = 'Хрюндель героически погиб!';
        hrundel.isAlive = false;
        hrundelSvg.dead();
        saveInstance();
    }
}

function decreaseProperty(property) {
    if (hrundel.isAlive) {
        hrundel[property] - decreaseValue <= 0 ?
            hrundel[property] = 0 :
            hrundel[property] -= decreaseValue;
        saveInstance();
    }
}

function increaseProperty(property) {
    if (hrundel.isAlive) {
        hrundel[property] + increaseValue >= 100 ?
            hrundel[property] = 100 :
            hrundel[property] += increaseValue;
        saveInstance();
    }
}

function saveInstance() {
    hrundelBar.update(hrundel);
    hrundel.timestamp = new Date().getTime();
    localStorage.hrundel = JSON.stringify(hrundel);
}
