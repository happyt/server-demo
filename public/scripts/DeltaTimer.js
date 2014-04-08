/**
 * Created by ianmorton on 08/04/2014.
 *
 * from http://jsfiddle.net/AWpvu/1/
 * http://stackoverflow.com/questions/11624078/repeating-settimeout
 *
 */

module.exports.DeltaTimer = function (render, interval) {
    var timeout;
    var lastTime;

    this.start = start;
    this.stop = stop;

    function start() {
        timeout = setTimeout(loop, 0);
        lastTime = + new Date;
        return lastTime;
    }

    function stop() {
        clearTimeout(timeout);
        return lastTime;
    }

    function loop() {
        var thisTime = + new Date;
        var deltaTime = thisTime - lastTime;
        var delay = Math.max(interval - deltaTime, 0);
        timeout = setTimeout(loop, delay);
        lastTime = thisTime + delay;
        render(thisTime);
    }
}