let userId = 1;
let otherUserId = 2;
var restaurantChoices = {
    choice1: null,
    choice2: null
}
let baseURL = "https://bnqukaif.apiadmin.co.uk/api/";
var database;
var restaurants = null;



$(document).ready(function(){
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB47VwRgy6QFWAl6uJeFEeO_dedKERTiM8",
        authDomain: "pickyapp-1.firebaseapp.com",
        databaseURL: "https://pickyapp-1.firebaseio.com",
        projectId: "pickyapp-1",
        storageBucket: "pickyapp-1.appspot.com", 
        messagingSenderId: "779693509357"
    };

    firebase.initializeApp(config)

    database = firebase.database();

    getApiRequest('restaurants').then(function(data){
        restaurants = data;
        $('#recommendations').show();
    });

    $('.recommendation').click(function(e){
        var value = parseInt(this.dataset.value);

        if(restaurantChoices.choice1 === null) {
            restaurantChoices.choice1 = value;
            this.classList.add('first');
        }else{
            restaurantChoices.choice2 = value;
            writeRestaurantData(userId);
            $(this.parentElement).hide();

            var starCountRef = database.ref('users/' + otherUserId + '/restaurants');

            starCountRef.on('value', function(snapshot) {
                if(snapshot.val()) {
                    $('#restaurant-waiting').hide();
                    $('#restaurant').show();
                } else{
                    $('#restaurant').hide();
                    $('#restaurant-waiting').show();
                }
            });
            
        }
    });
});

function getApiRequest(endpoint){
    return $.get(`${baseURL}${endpoint}`);
}

function getRestaurants() {
    
}

function getMenu(){
    $.get(`${baseUrl}`, function(data) {

    });
}

function getOtherRestaurantData(userId) {

}

function writeRestaurantData(userId) {
    database.ref('users/' + userId).set({
        restaurants: restaurantChoices
    });
  }