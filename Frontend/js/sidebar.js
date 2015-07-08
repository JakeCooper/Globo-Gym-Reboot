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
    return "<h1>Testing</h1>"
}