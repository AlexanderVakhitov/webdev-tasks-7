define(['snap.svg'], function (Snap) {
    const updateTimeout = 500;

    function init () {
        var svg = Snap('#hrundel');

        svg.circle(150, 510, 105).attr({ fill: '#f99' });
        svg.circle(450, 510, 105).attr({ fill: '#9F9' });
        svg.circle(750, 510, 105).attr({ fill: '#99f' });

        this.satietyBar = svg.circle(150, 510, 100)
            .attr({
                fill: '#a00'
            });
        this.energyBar = svg.circle(450, 510, 100)
            .attr({
                fill: '#0a0'
            });
        this.moodBar = svg.circle(750, 510, 100)
            .attr({
                fill: '#00a'
            });
    }

    function update (instance) {
        this.satietyBar.animate({
            r: instance.satiety
        }, 1000);
        this.energyBar.animate({
            r: instance.energy
        }, 1000);
        this.moodBar.animate({
            r: instance.mood
        }, 1000);
    }

    return {
        init: init,
        update: update
    };
});
