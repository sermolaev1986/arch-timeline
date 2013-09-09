function TimeLine(cWidth, cHeight) {
    this.begin = new Date(1988, 10, 10, 12, 10);
    this.end = new Date(2011, 10, 10, 12, 10);
    this.stepWidth = 10;
    this.step = 20;
    this.height = cHeight;
    this.pointCount = (this.end.getTime() - this.begin.getTime())/(1000*60*60*24)/this.step;
    var timeLine = this;
    var container = $("#timeline-container");
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var stage = new Kinetic.Stage({
        container: 'timeline-container',
        width: cWidth,
        height: cHeight + 10
//        draggable: true,
//        dragBoundFunc: function (pos) {
//            var realWidth = timeLine.stepWidth * timeLine.pointCount;
//            var rightBound = -realWidth + cWidth - 100;
//            //noinspection JSUnresolvedFunction
//            return  {
//                x: pos.x >= 100 ? 100 : pos.x < rightBound ? rightBound : pos.x,
//                y: this.getAbsolutePosition().y
//            }
//        }
    });
    var layer = new Kinetic.Layer();
    var gauge = new Kinetic.Shape({
        drawFunc: function (canvas) {
            var context = canvas.getContext();
            context.font = '10px Calibri';
            context.beginPath();
            var i = 0;
            for (var d = new Date(timeLine.begin.getTime()); d <= timeLine.end; d.setDate(d.getDate() + timeLine.step)) {
                console.log(d);
                var x = 10 + i * timeLine.stepWidth;
                context.moveTo(x, cHeight);
                if (i % 10 == 0) {
                    context.lineTo(x, cHeight - timeLine.stepWidth * 2);
                    context.fillText(d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear(), x - timeLine.stepWidth / 2, cHeight + 10);
                } else {
                    context.lineTo(x, cHeight - timeLine.stepWidth / 2);
                }
                i++;
            }
//            timeLine.pointCount = i;
            context.closePath();
            canvas.fillStroke(this);
        },
        stroke: 'black',
        strokeWidth: 0
    });
    var group = new Kinetic.Group({
        draggable: true,
        dragBoundFunc: function (pos) {
            var realWidth = timeLine.stepWidth * timeLine.pointCount;
            var rightBound = -realWidth + cWidth - 100;
            //noinspection JSUnresolvedFunction
            return  {
                x: pos.x >= 100 ? 100 : pos.x < rightBound ? rightBound : pos.x,
                y: this.getAbsolutePosition().y
            }
        }
    });
    var box = new Kinetic.Rect({
        x: 10,
        y: 0,
        width: timeLine.pointCount * timeLine.stepWidth,
        height: cHeight,
        fill: 'Beige',
        stroke: 'black',
        strokeWidth: 0
    });

    var plusImageObj = new Image();
    plusImageObj.onload = function() {
        var plus = new Kinetic.Image({
            x: 10,
            y: 10,
            image: plusImageObj,
            width: 32,
            height: 32
        });
        plus.on('mouseup', function() {
            timeLine.step++;
        });
        layer.add(plus);
    }
    plusImageObj.src = 'images/plus-icon.png';
    var minusImageObj = new Image();
    minusImageObj.onload = function() {
        var minus = new Kinetic.Image({
            x: 10,
            y: 50,
            image: minusImageObj,
            width: 32,
            height: 32
        });
        minus.on('mouseup', function() {
            timeLine.step--;
        });
        layer.add(minus);
    }
    minusImageObj.src = 'images/minus-icon.png';
    group.add(box);
    group.add(gauge);
    layer.add(group);
    stage.add(layer);

    this.refresh = function(data)   {
        $.each(data, function () {
            new Event(this,group);
        });
    }


}

function Event(data, group) {

    var date = new Date(data.date);
    var dayCount = (date.getTime() - timeLine.begin.getTime())/(1000*60*60*24);
    var x = dayCount/timeLine.step * timeLine.stepWidth;

    var thumbnailImageObj = new Image();
    thumbnailImageObj.onload = function() {
        var thumbnail = new Kinetic.Image({
            x: x,
            y: 50,
            image: thumbnailImageObj,
            width: 50,
            height: 50
        });
        group.add(thumbnail);
    }

    thumbnailImageObj.src = 'data:image/png;base64,' + data.thumbnail;

    var event = new Kinetic.Shape({
        drawFunc: function (canvas) {
            var context = canvas.getContext();

            context.moveTo(x,timeLine.height);
            context.lineTo(x,50);
            context.stroke();

            context.font = '10px Calibri';
            context.fillText(data.title, x, 110);
        },
        stroke: 'black',
        strokeWidth: 0
    });

    group.add(event);

}