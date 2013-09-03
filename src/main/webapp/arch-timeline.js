var timeLine = new TimeLine(800, 100);
function refreshDataTable() {
    var wait = $("#wait");
    var dataTable = $("#dataTable");
    var targetTableBody = $('#targetTableBody');
    dataTable.addClass("hide");
    wait.removeClass("hide");
    $.getJSON('hello-world', function (data) {
        var items = [];
        $.each(data, function () {
            items.push('<tr><td>' + this.eventTitle + '</td><td>' + this.eventDate + '</td></tr>');
        });
        targetTableBody.html(items.join(''));
        wait.addClass("hide");
        dataTable.removeClass("hide");
    });
}
$("#btnGetData").click(function () {
    refreshDataTable();
});

$("#addBtn").click(function () {
    $.ajax('hello-world');
    refreshDataTable();
});