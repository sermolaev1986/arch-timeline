var wait = $("#wait");
var dataTable = $("#dataTable");
var targetTableBody = $('#targetTableBody');
dataTable.addClass("hide");
wait.removeClass("hide");
$.getJSON('events/first-page/20', function (data) {
        var items = [];
        $.each(data, function () {
            items.push('<tr><td>' + this.title + '</td><td>' + this.date + '</td><td><img src="data:image/png;base64,' + this.thumbnail + '"/></td></tr>');
        });
        targetTableBody.html(items.join(''));
        wait.addClass("hide");
        dataTable.removeClass("hide");
    }
);


