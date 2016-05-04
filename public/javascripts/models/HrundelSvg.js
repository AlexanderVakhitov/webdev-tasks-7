define(['snap.svg'], function (Snap) {
    function init() {
        var svg = Snap('#hrundel');
        this.hrundelBg = svg.ellipse(450, 210, 350, 180).attr({ opacity: 0 });

        svg.circle(410, 340, 40)
            .attr({
                fill: '#f99',
                stroke: "#000",
                strokeWidth: 5
            });
        svg.circle(490, 340, 40)
            .attr({
                fill: '#f99',
                stroke: "#000",
                strokeWidth: 5
            });

        this.leftHand = svg.ellipse(400, 250, 80, 40)
            .attr({
                fill: '#f99',
                stroke: "#000",
                strokeWidth: 5
            });
        this.rightHand = svg.ellipse(500, 250, 80, 40)
            .attr({
                fill: '#f99',
                stroke: "#000",
                strokeWidth: 5
            });

        svg.polygon(360, 150, 350, 40, 450, 100)
            .attr({
                fill: '#f99',
                stroke: "#000",
                strokeWidth: 5
            });
        svg.polygon(540, 150, 550, 40, 450, 100)
            .attr({
                fill: '#f99',
                stroke: "#000",
                strokeWidth: 5
            });

        svg.ellipse(450, 250, 80, 100)
            .attr({
                fill: '#f99',
                stroke: "#000",
                strokeWidth: 5
            });
        svg.circle(450, 320, 5);

        svg.circle(450, 150, 100)
            .attr({
                fill: '#f99',
                stroke: "#000",
                strokeWidth: 5
            });
        svg.circle(450, 170, 35)
            .attr({
                fill: '#f99',
                stroke: "#000",
                strokeWidth: 5
            });
        svg.circle(440, 170, 5);
        svg.circle(460, 170, 5);

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

        this.leftEye = svg.ellipse(410, 110, 20, 20);
        this.rightEye = svg.ellipse(490, 110, 20, 20);
    }

    function sleep() {
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
    }

    function wakeUp() {
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
    }

    function alive() {
        this.leftEye.attr({ opacity: 1 });
        this.rightEye.attr({ opacity: 1 });
        this.deadLeftEye.attr({ opacity: 0 });
        this.deadRightEye.attr({ opacity: 0 });
    }

    function dead() {
        this.leftEye.attr({ opacity: 0 });
        this.rightEye.attr({ opacity: 0 });
        this.deadLeftEye.attr({ opacity: 1 });
        this.deadRightEye.attr({ opacity: 1 });
    }

    return {
        init: init,
        sleep: sleep,
        wakeUp: wakeUp,
        alive: alive,
        dead: dead
    };
});
