$(document).ready(function() {
    $("#left-menu").on('click', function(){
        if ($('.left-sidebar').css("left") != "0px") {
            $('.left-sidebar').animate({
                left : "0px"
            }, 500);
        } else {
            $('.left-sidebar').animate({
                left : "-275px"
            }, 500);
        }
    });
    $("#right-menu").on('click', function(){
        $('.right-sidebar').animate({
            right : "0px"
        }, 500);
    });
    $('.close-right-sidebar').on('click', function(){
        $('.right-sidebar').animate({
            right : "-275px"
        }, 500);
    });
});
