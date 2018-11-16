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

    $('#set-user-1').click(function(){
        userId = 1;
        otherUserId = 2;
        getRestaurants();
        $('#user-set').hide();
    });

    $('#set-user-2').click(function(){
        userId = 2;
        otherUserId = 1;
        getRestaurants();
        $('#user-set').hide();
    });
});

function getRestaurants(){
    getApiRequest('restaurants').then(function(data){
        $('#waiting').show();
        restaurants = data.Restaurants;
        setUpRestaurants();
        setUpRecommendations();
        $('#waiting').hide();
        $('#recommendations').show();
    });
}

function setUpRecommendations(){
    $('.recommendation').click(function(e){
        var value = parseInt(this.dataset.value);

        if(restaurantChoices.choice1 === null) {
            restaurantChoices.choice1 = value;
            this.classList.add('first');
        }else{
            restaurantChoices.choice2 = value;
            writeRestaurantData(userId);
            $(this.parentElement).hide();

            var otherUserRestaurants = database.ref('users/' + otherUserId + '/restaurants');

            otherUserRestaurants.on('value', function(snapshot) {
                if(snapshot.val()) {
                    setUpWinningRestaurant();
                    $('#waiting').hide();
                    $('#restaurant').show();
                } else{
                    $('#restaurant').hide();
                    $('#waiting').show();
                }
            });
        }
    });
}

function setUpRestaurants(){
  restaurants.forEach(restaurant => {
    $('#recommendations').append('      <div class="row">'+
        '<div class="col-12">'+
            '<div class="card">'+
                '<div class="container">'+
                    '<h4><b>' + restaurant.Name + '</b></h4>'+
                    '<p>' + restaurant.AverageRating + '</p>'+
                    '<p>' + restaurant.FoodType + '</p>'+
                    '<p>' + restaurant.Address + '</p>'+
                    '<p>' + restaurant.Postcode + '</p>'+
                    '<button type="button" class="btn' +
    ' btn-success">Select</button>' +
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>');
    });
}

function setUpWinningRestaurant(){
    database.ref('/users/' + userId).once('value').then(function(currentUserSnapshot) {
        database.ref('/users/' + otherUserId).once('value').then(function(otherUserSnapshot) {
            var chosenRestaurant;
            var currentUser = currentUserSnapshot.val().restaurants;
            var otherUser = otherUserSnapshot.val().restaurants;

            if(currentUser.choice1 === otherUser.choice1) {
                chosenRestaurant = currentUser.choice1
            } else if(currentUser.choice1 === otherUser.choice2) {
                chosenRestaurant = currentUser.choice1;
            }else {
                chosenRestaurant = currentUser.choice2;
            }

            getApiRequest('restaurant' + chosenRestaurant).then(function(data){
                $('#restaurant').append(`<div>${data.Name}</div>`);
            });
        }); 
    });
}

function getApiRequest(endpoint){
    return $.get(`${baseURL}${endpoint}`);
}

function getMenu(){
    $.get(`${baseUrl}`, function(data) {

    });
}

function writeRestaurantData(userId) {
    database.ref('users/' + userId).set({
        restaurants: restaurantChoices
    });
  }
