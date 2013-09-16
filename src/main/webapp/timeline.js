function TimeLine(cWidth, cHeight) {

    this.step = 20;
    this.height = cHeight - 10;
    this.width = cWidth - 100;
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
        width: timeLine.width,
        height: timeLine.height + 10
    });
    var layer = new Kinetic.Layer();

    var box = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: timeLine.width,
        height: timeLine.height,
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

        var ms = Math.abs(timeLine.maxDate.getTime() - timeLine.minDate.getTime());

        var pointWeight = ms / timeLine.pointCount;
        var pointWidthPx = timeLine.pointWidth / pointWeight;

        $.each(data, function () {
            var date = new Date(this.date);
            var offset = date.getTime() - timeLine.minDate.getTime();

            var someX = offset * pointWidthPx;

            context.beginPath();
            context.moveTo(someX, timeLine.height - 10);
            context.lineTo(someX, 100);
            context.stroke();

            context.fillText(this.title, someX, 100);
            context.fillText(date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear(), someX, 110);


            var imageObj = new Image();

            imageObj.addEventListener('load', function() {
                context.drawImage(imageObj, someX, 0);
            }, false);

            /*imageObj.onload = function (someX) {
                context.drawImage(imageObj, someX, 0);

            };*/
            imageObj.src = 'data:image/png;base64,' + this.thumbnail;


            context.beginPath();
            var i = 0;
            for (var d = new Date(timeLine.minDate); d <= timeLine.maxDate; d.setTime(d.getTime() + pointWeight)) {
                var x = i * timeLine.pointWidth;
                context.moveTo(x, timeLine.height - 10);
                if (i % 10 == 0) {
                    context.lineTo(x, timeLine.height - 30);
                    x = x - timeLine.pointWidth/ 2;
                    if (x < 0)  {
                        x = 0;
                    }
                    context.fillText(d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear(), x, timeLine.height);
                } else {
                    context.lineTo(x, timeLine.height - 20);
                }
                i++;
            }
            context.stroke();




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
