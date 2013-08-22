$("#btnGetData").click(function () {
    $.getJSON('hello-world', function (data) {
        var items = [];
        $.each(data, function () {
            items.push('<tr><td>' + this.eventTitle + '</td><td>' + this.eventDate + '</td></tr>');
        });
        $('#targetTableBody').html(items.join(''))
    });
});