$(document).ready(function () {
    $('#codesubmitbutton').click(function() {
        console.log("clicked");
        //$.getJSON('http://localhost:8081?jsoncallback=?', {code:$('#codefield').val()}, function(data) {
        $.getJSON('http://sridattalabs.com:8081?jsoncallback=?', {code:$('#codefield').val()}, function(data) {
            console.log(data);
            Exec(data)
        })  
    })
});
