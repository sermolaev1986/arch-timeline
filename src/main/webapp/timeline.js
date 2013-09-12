function TimeLine(cWidth, cHeight) {
    this.begin = new Date(1988, 10, 10, 12, 10);
    this.end = new Date(2011, 10, 10, 12, 10);
    this.stepWidth = 10;
    this.step = 20;
    this.height = cHeight;
    this.width = cWidth;
//    this.pointCount = (this.end.getTime() - this.begin.getTime())/(1000*60*60*24)/this.step;
    this.pointCount = 20;
    this.pointWidth = this.width / this.pointCount;
    this.minDateString = undefined;
    this.maxDateString = undefined;
    this.minDate = undefined;
    this.maxDate = undefined;

    var canvas = document.getElementById('myCanvas');
    this.context = canvas.getContext('2d');

    var timeLine = this;
    var container = $("#timeline-container");
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var stage = new Kinetic.Stage({
        container: 'timeline-container',
        width: cWidth,
        height: cHeight + 10
    });
    var layer = new Kinetic.Layer();
    /*var gauge = new Kinetic.Shape({
     drawFunc: function (canvas) {
     var context = canvas.getContext();
     context.font = '10px Calibri';
     context.beginPath();
     var i = 0;
     for (var d = new Date(timeLine.begin.getTime()); d <= timeLine.end; d.setDate(d.getDate() + timeLine.step)) {
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
     });*/

    var box = new Kinetic.Rect({
        x: 0,
        y: 0,
//        width: timeLine.pointCount * timeLine.stepWidth,
        width: cWidth,
        height: cHeight,
        fill: 'Beige',
        stroke: 'black',
        strokeWidth: 0
    });

//    group.add(box);
//    group.add(gauge);
//    layer.add(group);

    $("#left-icon").on("mouseup", function () {
        timeLine.setNextPageEnabled(true);
        timeLine.previousPage();
    });

    $("#right-icon").on("mouseup", function () {
        timeLine.setPreviousPageEnabled(true);
        timeLine.nextPage();
    });

    this.setPreviousPageEnabled = function (isEnabled) {
        if (isEnabled) {
            $("#left-icon").removeAttr("disabled");
        } else {
            $("#left-icon").attr("disabled", "true");
        }
    }

    this.setNextPageEnabled = function (isEnabled) {
        if (isEnabled) {
            $("#right-icon").removeAttr("disabled");
        } else {
            $("#right-icon").attr("disabled", "true");
        }
    }

    /*
     layer.add(box);
     stage.add(layer);*/

    this.init = function () {
        timeLine.setNextPageEnabled(false);
        var date = new Date();
        var day = date.getDate() + "";
        if (day.length == 1)    {
            day = "0" + day;
        }
        timeLine.minDateString = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + day;
        timeLine.previousPage();
    }

    this.refresh = function (data) {
        var context = timeLine.context;

        context.clearRect(0, 0, timeLine.width, timeLine.height);

        var ms = timeLine.maxDate.getTime() - timeLine.minDate.getTime();

        var pointWeight = ms / timeLine.pointCount;

        $.each(data, function () {
            var offset = new Date(this.date).getTime() - timeLine.minDate.getTime();
            var x = offset * timeLine.pointWidth / pointWeight;

            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, 100);
            context.stroke();

            var imageObj = new Image();

            imageObj.onload = function () {
                context.drawImage(imageObj, x, 0);
            };
            imageObj.src = 'data:image/png;base64,' + this.thumbnail;


            context.fillText(this.title, x, 100);

//            new Event(this,group);
        });
    }

    this.nextPage = function () {
        var url = 'events/next-page/8?dateString=' + timeLine.maxDateString;
        $.getJSON(url, function (data) {
            timeLine.setNextPageEnabled(!data.last);

            var events = data.events;
            if (events.length > 0) {
                timeLine.setStartDate(events[0].date);
                timeLine.setEndDate(events[events.length - 1].date);
            }

            timeLine.refresh(events);
        });
    }

    this.previousPage = function () {
        var url;

        url = 'events/previous-page/8?dateString=' + timeLine.minDateString;

        $.getJSON(url, function (data) {

            timeLine.setPreviousPageEnabled(!data.last);

            var events = data.events;
            if (events.length > 0) {
                timeLine.setEndDate(events[0].date);
                timeLine.setStartDate(events[events.length - 1].date);
            }

            timeLine.refresh(events);
        });

    }

    this.setStartDate = function (startDate) {
        timeLine.minDateString = startDate;
        timeLine.minDate = new Date(startDate);
        $("#startDate").text("start: " + startDate);
    }

    this.setEndDate = function (endDate) {

        timeLine.maxDateString = endDate;
        timeLine.maxDate = new Date(endDate);
        $("#endDate").text("end: " + endDate);
    }

    this.init();


}

function Event(data, group) {

    var date = new Date(data.date);
    var dayCount = (date.getTime() - timeLine.begin.getTime()) / (1000 * 60 * 60 * 24);
    var x = dayCount / timeLine.step * timeLine.stepWidth;

    var thumbnailImageObj = new Image();
    thumbnailImageObj.onload = function () {
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

            context.moveTo(x, timeLine.height);
            context.lineTo(x, 50);
            context.stroke();

            context.font = '10px Calibri';
            context.fillText(data.title, x, 110);
        },
        stroke: 'black',
        strokeWidth: 0
    });

    group.add(event);

}