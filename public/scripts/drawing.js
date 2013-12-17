/**
 * Created with JetBrains WebStorm.
 * User: Mortoni
 * Date: 11/07/13
 * To change this template use File | Settings | File Templates.
 */
function drawSomething() {

    var ctx = $('#draw')[0].getContext("2d");
    //draw a circle
    ctx.beginPath();
    ctx.arc(Math.random()*75, Math.random()*75, 10, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();

}