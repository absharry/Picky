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
    showWaiting();
    getApiRequest('restaurants').then(function(data){
        restaurants = data.Restaurants;
        setUpRestaurants();
        setUpRecommendations();
        hideWaiting();
        $('#recommendations').show();
    });
}

function setUpRecommendations(){
    $('.recommendation').click(function(e){
        var value = parseInt(this.dataset.value);

        if(restaurantChoices.choice1 === null) {
            restaurantChoices.choice1 = value;
            this.classList.add('first');
        }else if(value !== restaurantChoices.choice1){
            restaurantChoices.choice2 = value;
            writeRestaurantData(userId);
            $('#recommendations').hide();
            showWaiting();
            var otherUserRestaurants = database.ref('users/' + otherUserId + '/restaurants');

            otherUserRestaurants.on('value', function(snapshot) {
                if(snapshot.val()) {
                    setUpWinningRestaurant();
                } else{
                    $('#restaurant').hide();
                }
            });
        }
    });
}

function showWaiting() {
    $('#waiting').show();
}

function hideWaiting(){
    $('#waiting').hide();
}

function setUpRestaurants(){
    $('#recommendations').append(
        '<div class="people container-fluid">'+
            '<img src="/content/img/people.png" alt="People">'+
            '<p>Your results</p>'+
            '<h2>Pick <b>two</b> of the three options below</h2>')
        '</div>'+
  restaurants.forEach(restaurant => {
    $('#recommendations').append(
      '<div class="row">'+
        '<div class="col-12">'+
            '<div class="card">'+
                '<div class="container-fluid">'+
                    '<div class="row">' +
                        '<div class="col-3">'+
                            '<img class="img-fluid" src="'+ restaurant.Image +'" />'+
                        '</div>'+
                        '<div class="col-6 restaurantInfo">'+
                                '<h4><b>' + restaurant.Name + '</b></h4>'+
                                '<p>' + restaurant.AverageRating + '</p>'+
                                '<p>' + restaurant.FoodType + '</p>'+
                        '</div>'+
                        '<div class="col-3">' +
                            '<img src="/content/img/justeat.png" class="right source" />'+
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="col-6">'+
                                '<p>' + restaurant.Address + ' ' + restaurant.Postcode + '</p>'+
                                '<p>' + restaurant.DeliveryDetails + '</p>' +
                        '</div>'+
                        '<div class="col-6">'+
                            '<div class="row right">'+
                                '<button type="button" class="btn' +
                ' btn-success recommendation" data-value="' + restaurant.Id + '">Select</button>' +
                            '</div>'+
                        '</div>'+
                    '</div>' +
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

            getMenu(chosenRestaurant).then(function(){
                hideWaiting();
                $('#restaurant').show();
            });;
        }); 
    });
}

function getApiRequest(endpoint){
    return $.get(`${baseURL}${endpoint}`);
}

function getMenu(chosenRestaurant){
    return getApiRequest('restaurant' + chosenRestaurant).then(function(data){
        var products = '';

        data.Products.forEach(product => {
            products += `<div class='product ${product.IsVegetarian ? 'vegetarian' : ''}' id='product${product.Id}'><img src='/content/img/remove.png'><h3>${product.Item + (product.Quantity > 1 ? ` x${product.Quantity}` : '')}</h3> <img src="/content/img/swap.png" class="swap"> <p class='price'>&pound;${product.Price}</p> <p class="productInfo"> ${product.Info}</p></div>`;
        });

        $('#restaurant').append('<div class="row">'+
        '<div class="col-12">'+
            '<div class="card">'+
                '<div class="container-fluid">'+
                    '<div class="row">' +
                        '<div class="col-3">'+
                            '<img class="img-fluid" src="'+ data.Image +'" />'+
                        '</div>'+
                        '<div class="col-6 restaurantInfo">'+
                                '<h4><b>' + data.Name + '</b></h4>'+
                                '<p>' + data.AverageRating + '</p>'+
                                '<p>' + data.FoodType + '</p>'+
                        '</div>'+
                        '<div class="col-3">' +
                            '<img src="/content/img/justeat.png" class="right source" />'+
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="col-8">'+
                                '<p>' + data.Address + ' ' + data.Postcode + '</p>'+
                                '<p>' + data.DeliveryDetails + '</p>' +
                        '</div>'+
                    '</div>' +
                    '<div class="row">' +
                        '<div class="col-12 addPadding"' +
                            '<p><strong>Picked for you</strong></p>' +
                            '<p>If you don\'t like an item swap it for a new one</p>' +
                            '<div class="products">'+
                            products +
                            '</div>' +
                            '<div class="total-container"><p>Total</p><p class="price">&pound;' + data.TotalCost + '</p></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'+
            '<div class="checkout">' +
                '<button class="btn btn-primary">Checkout</button>' +
            '</div>' +
        '</div>'+
    '</div>');
    });
}

function writeRestaurantData(userId) {
    database.ref('users/' + userId).set({
        restaurants: restaurantChoices
    });
  }
