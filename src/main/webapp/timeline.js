function TimeLine(cWidth, cHeight) {

    this.widthBound = 100;
    this.heightBound = 10;
    this.height = cHeight - this.heightBound;
    this.width = cWidth - this.widthBound;
    this.pointCount = 50;
    this.pointWidth = this.width / this.pointCount;
    this.minDateString = undefined;
    this.maxDateString = undefined;
    this.minDate = undefined;
    this.maxDate = undefined;
    this.tagHeight = undefined;

    this.labelFontSize = 10;
    this.labelFill = "white";
    this.tagFontSize = 30;
    this.tagFill = "green";

    var timeLine = this;

    var stage = new Kinetic.Stage({
        container: 'timeline-container',
        width: cWidth,
        height: cHeight
    });
    var layer = new Kinetic.Layer();
    var imageLayer = new Kinetic.Layer();
    var staticLayer = new Kinetic.Layer();

    var fontFamily = 'Calibri';


    this.tagHeight = this.height / 4;

    var firstText = new Kinetic.Text({
        x: 0,
        y: 0*this.tagHeight,
        text: 'История русской архитектуры',
        fontSize: timeLine.tagFontSize,
        fontFamily: fontFamily,
        fill: timeLine.tagFill
    });

    var secondText = new Kinetic.Text({
        x: 0,
        y: 1*this.tagHeight,
        text: 'Simple Text',
        fontSize: timeLine.tagFontSize,
        fontFamily: fontFamily,
        fill: timeLine.tagFill
    });

    var thirdText = new Kinetic.Text({
        x: 0,
        y: 2*this.tagHeight,
        text: 'Simple Text',
        fontSize: timeLine.tagFontSize,
        fontFamily: fontFamily,
        fill: timeLine.tagFill
    });

    var fourthText = new Kinetic.Text({
        x: 0,
        y: 3 * this.tagHeight,
        text: 'Simple Text',
        fontSize: timeLine.tagFontSize,
        fontFamily: fontFamily,
        fill: timeLine.tagFill
    });



    var fill2 = 'Beige';
    var stroke = 'black';
    var strokeWidth = 0;

    var firstBox = new Kinetic.Rect({
        x: 0,
        y: 0 * this.tagHeight,
        width: cWidth,
        height: this.tagHeight,
        fill: fill2,
        stroke: stroke,
        strokeWidth: strokeWidth
    });

    var secondBox = new Kinetic.Rect({
        x: 0,
        y: 1 * this.tagHeight,
        width: cWidth,
        height: this.tagHeight,
        fill: fill2,
        stroke: stroke,
        strokeWidth: strokeWidth
    });

    var thirdBox = new Kinetic.Rect({
        x: 0,
        y: 2 * this.tagHeight,
        width: cWidth,
        height: this.tagHeight,
        fill: fill2,
        stroke: stroke,
        strokeWidth: strokeWidth
    });

    var fourthBox = new Kinetic.Rect({
        x: 0,
        y: 3 * this.tagHeight,
        width: cWidth,
        height: this.tagHeight,
        fill: fill2,
        stroke: stroke,
        strokeWidth: strokeWidth
    });

    var gauge1 = new Kinetic.Shape({
        drawFunc: function(context) {
            context.beginPath();
            for (var i = 0; i < timeLine.pointCount; i++) {
                var x = i * timeLine.pointWidth;
                context.moveTo(x, 1 * timeLine.tagHeight - 10);
                if (i % 10 == 0) {
                    context.lineTo(x, 1* timeLine.tagHeight - 30);
                } else {
                    context.lineTo(x, 1 * timeLine.tagHeight - 20);
                }
            }
            context.stroke();
        }
    });

    var gauge2 = new Kinetic.Shape({
        drawFunc: function(context) {
            context.beginPath();
            for (var i = 0; i < timeLine.pointCount; i++) {
                var x = i * timeLine.pointWidth;
                context.moveTo(x, 2 * timeLine.tagHeight - 10);
                if (i % 10 == 0) {
                    context.lineTo(x, 2* timeLine.tagHeight - 30);
                } else {
                    context.lineTo(x, 2 * timeLine.tagHeight - 20);
                }
            }
            context.stroke();
        }
    });

    var gauge3 = new Kinetic.Shape({
        drawFunc: function(context) {
            context.beginPath();
            for (var i = 0; i < timeLine.pointCount; i++) {
                var x = i * timeLine.pointWidth;
                context.moveTo(x, 3 * timeLine.tagHeight - 10);
                if (i % 10 == 0) {
                    context.lineTo(x, 3* timeLine.tagHeight - 30);
                } else {
                    context.lineTo(x, 3 * timeLine.tagHeight - 20);
                }
            }
            context.stroke();
        }
    });

    var gauge4 = new Kinetic.Shape({
        drawFunc: function(context) {
            context.beginPath();
            for (var i = 0; i < timeLine.pointCount; i++) {
                var x = i * timeLine.pointWidth;
                context.moveTo(x, 4 * timeLine.tagHeight - 10);
                if (i % 10 == 0) {
                    context.lineTo(x, 4* timeLine.tagHeight - 30);
                } else {
                    context.lineTo(x, 4 * timeLine.tagHeight - 20);
                }
            }
            context.stroke();
        }
    });




    staticLayer.add(firstBox);
    staticLayer.add(secondBox);
    staticLayer.add(thirdBox);
    staticLayer.add(fourthBox);

    staticLayer.add(firstText);
    staticLayer.add(secondText);
    staticLayer.add(thirdText);
    staticLayer.add(fourthText);

    staticLayer.add(gauge1);
    staticLayer.add(gauge2);
    staticLayer.add(gauge3);
    staticLayer.add(gauge4);

    stage.add(staticLayer);
    stage.add(layer);
    stage.add(imageLayer);


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

        imageLayer.removeChildren();

        var shape = new Kinetic.Shape({
            drawFunc: function(context) {
                context.clearRect(0, 0, timeLine.width + timeLine.widthBound, timeLine.height + timeLine.heightBound);

                var ms = Math.abs(timeLine.maxDate.getTime() - timeLine.minDate.getTime());

                var pointWeight = ms / timeLine.pointCount;
                var pointWidthPx = timeLine.pointWidth / pointWeight;

                $.each(data, function () {
                    var date = new Date(this.date);
                    var offset = date.getTime() - timeLine.minDate.getTime();

                    var someX = offset * pointWidthPx;

                    var imageObj = new Image();

                    var tag = this.tag;
                    var title = this.title;
                    imageObj.onload = function() {

                        var height = (tag * timeLine.tagHeight + timeLine.tagHeight / 2) - imageObj.height / 2;
                        context.beginPath();
                        context.moveTo(someX, (tag + 1)* timeLine.tagHeight - 10);
                        context.lineTo(someX, height);
                        context.stroke();


                        var titleText = new Kinetic.Text({
                            x: someX,
                            y: height,
                            text: title,
                            fontSize: timeLine.labelFontSize,
                            fontFamily: fontFamily,
                            fill: timeLine.labelFill
                        });

                        var date2 = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
                        var dateText = new Kinetic.Text({
                            x: someX,
                            y: height + 10,
                            text: date2,
                            fontSize: timeLine.labelFontSize,
                            fontFamily: fontFamily,
                            fill: timeLine.labelFill
                        });

                        var image = new Kinetic.Image({
                            x: someX,
                            y: height,
                            image: imageObj
                        });


                        var group = new Kinetic.Group({
                            x: 0,
                            y: 0
                        });

                        group.add(image);
                        group.add(dateText);
                        group.add(titleText);

                        group.on('mouseover', function() {
                            group.moveToTop();
                            imageLayer.draw();
                        });

                        imageLayer.add(group);
                        imageLayer.draw();

                    };

                    imageObj.src = 'data:image/png;base64,' + this.thumbnail;

                    context.beginPath();
                    var i = 0;
                    for (var d = new Date(timeLine.minDate); d <= timeLine.maxDate; d.setTime(d.getTime() + pointWeight * 10)) {
                        var x = i * timeLine.pointWidth;
                        if (i % 10 == 0) {
                            x = x - timeLine.pointWidth/ 2;
                            if (x < 0)  {
                                x = 0;
                            }
                            context.fillText(d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear(), x, timeLine.height);
                        }
                        i++;
                    }
                    context.stroke();




                });

                context.fillStrokeShape(this);

            },
            fill: '#00D2FF',
            stroke: 'black',
            strokeWidth: 4
        });

        layer.add(shape);

        layer.draw();

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
