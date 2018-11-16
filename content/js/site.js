let user = {
    points: 0,
    name: "Charlie"
};

$(document).ready(function(){
    $('.question button').click(function(e){
        var value = parseInt(this.dataset.value);
        user.points += value;
        console.log(user.points);

        $(this.parentElement).hide();
        if(value === 0 || value === 1) {
            $('#question2').show();
        } 
        else if(value === 2 || value === 4) {
            $('#question3').show();
        }
        else if(value === 8 || value === 16) {
            window.location.href = `/recommendation?total=${user.points}`;
        }
    });

    if(window.location)
});