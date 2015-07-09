$(document).ready(function() {
    $('#left-menu').sidr({
        name: 'sidr-left',
        side: 'left', // By default
        source: function(){
            return loadLeftContent();
        }
    });
    $('#right-menu').sidr({
        name: 'sidr-right',
        side: 'right' // By default
    });
});

function loadLeftContent(){
    return  '' +
        '<div class="sidebar-header"></div>' +
        '<div class="user-name"> Jake </div> ' +
        '<button class="btn btn-default profile-button" href="app/profile">' +
            'Profile' +
        '</button>' +
        '<div class="reservation-header">' +
            'My Memes' +
        '</div>' +
        '<div class="reservation-container">' +
            '<button class="btn btn-default reservation-button">Da Bench</button>' +
        '</div>'

}