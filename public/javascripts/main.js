require(['models/Hrundel', 'models/HrundelSvg', 'models/HrundelBar'], function (Hrundel, HrundelSvg, HrundelBar) {
    const updateTimeout = 500;
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

    HrundelSvg.init();
    HrundelBar.init();
    initEvents();

    function initEvents() {
        satietyButton.onclick = Hrundel.increase.bind(null, 'satiety');
        energyButton.onclick = Hrundel.increase.bind(null, 'energy');
        moodButton.onclick = Hrundel.increase.bind(null, 'mood');
        newGame.onclick = Hrundel.reset;

        visitInstance();
        lightInstance();
        listenInstance();
        feedInstance();
        hrundelVoice();

        setInterval(function () {
            if (Hrundel.isAlive()) {
                HrundelSvg.alive();
            } else {
                HrundelSvg.dead();
                hrundelMsg.innerHTML = 'Хрюндель умер!';
            }
            HrundelBar.update(Hrundel.getInstance());
        }, updateTimeout);
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

        document.addEventListener(visibilityChange, function() {
            if (!Hrundel.isAlive()) {
                return;
            }

            if (document[hidden]) {
                hrundelMsg.innerHTML = 'Хрюндель уснул...';
                Hrundel.setStatus('sleep');
                HrundelSvg.sleep();
            } else {
                hrundelMsg.innerHTML = 'Хрюндель проснулся!';
                Hrundel.setStatus('none');
                HrundelSvg.wakeUp();
            }
        });
    }

    function lightInstance() {
        if ('ondevicelight' in window) {
            window.ondevicelight = function(event) {
                if (!Hrundel.isAlive()) {
                    return;
                }

                if (event.value <= 10 && Hrundel.getStatus() !== 'listen') {
                    if (Hrundel.getStatus() != 'sleep') {
                        hrundelMsg.innerHTML = 'Хрюндель уснул...';
                        Hrundel.setStatus('sleep');
                        HrundelSvg.sleep();
                    }
                }
                if (Hrundel.getStatus() === 'sleep') {
                    hrundelMsg.innerHTML = 'Хрюндель проснулся!';
                    Hrundel.setStatus('none');
                    HrundelSvg.wakeUp();
                }
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
                Hrundel.increase('mood');

                if (Hrundel.getInstance().mood === 100 ||
                    Hrundel.getStatus() === 'sleep') {
                    setTimeout(function () {
                        hrundelMsg.innerHTML = 'Хрюндель Вас не слушает!';
                    }, 2000);
                    Hrundel.setStatus('none');
                    recognizer.stop();
                }
            };

            svgHrundel.onclick = function() {
                if (!Hrundel.isAlive()) {
                    return;
                }

                if (Hrundel.getInstance().mood < 100 &&
                    Hrundel.getStatus() !== 'sleep') {
                    hrundelMsg.innerHTML = 'Хрюндель Вас слушает!';
                    Hrundel.setStatus('listen');
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
                        if (!Hrundel.isAlive()) {
                            return;
                        }

                        if (battery.charging &&
                            Hrundel.getInstance().energy < 100 &&
                            Hrundel.getStatus() !== 'sleep') {
                            Hrundel.setStatus('feed');
                        }
                    }, 500);
                });
        }
    }

    function hrundelVoice() {
        if (window.speechSynthesis) {
            setInterval(function () {
                if (Hrundel.isAlive()) {
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

});
