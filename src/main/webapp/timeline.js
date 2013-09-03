function TimeLine(cWidth, cHeight) {
    var container = $("#timeline-container");
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var stage = new Kinetic.Stage({
        container: 'timeline-container',
        width: cWidth,
        height: cHeight + 10,
        draggable: true,
        dragBoundFunc: function (pos) {
            var rightBound = -5020 + cWidth;
            //noinspection JSUnresolvedFunction
            return {
                x: pos.x > 0 ? 0 : pos.x < rightBound ? rightBound : pos.x,
                y: this.getAbsolutePosition().y
            }
        }
    });
    var layer = new Kinetic.Layer();
    var gauge = new Kinetic.Shape({
        drawFunc: function (canvas) {
            var context = canvas.getContext();
            context.beginPath();
            for (i = 0; i < 1000; i++) {
                var step = 10;
                var x = 10 + i * step;
                context.moveTo(x, cHeight);
                if (i % 10 == 0) {
                    context.lineTo(x, cHeight - step * 2);
                    context.fillText(i, x - step / 2, cHeight + 10);
                } else {
                    context.lineTo(x, cHeight - step / 2);
                }
                context.font = '10px Calibri';

            }
            context.closePath();
            canvas.fillStroke(this);
        },
        stroke: 'black',
        strokeWidth: 1
    });
    layer.add(gauge);
    stage.add(layer);
}