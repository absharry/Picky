const axios = require("axios");

const HEADERS = {
  "Accept-Tenant": "uk",
  "Accept-Language": "en-GB",
  "Authorization": "Basic VGVjaFRlc3RBUEk6dXNlcjI=",
  "Host": "public.je-apis.com"
};

const BASE_URL = "https://public.je-apis.com";

module.exports = {
  //Discovery: Operations about Discovery
    discoveryRestaurant: function(data, cb){
      axios.get(`${BASE_URL}/discovery/${data.postcode}/restaurants/${data.catId}`,{
        headers: HEADERS
      })
      .then(function (response) {
        cb(null, response.data);
      })
      .catch(function (error) {
        cb(error);
      });
    },

    discoveryMeta: function(data, cb){
      axios.get(`${BASE_URL}/discovery/metadata`,{
        headers: HEADERS,
        params: data
      })
      .then(function (response) {
        cb(null, response.data);
      })
      .catch(function (error) {
        cb(error);
      });
    },

  //Health: Operations about Health
    healthCheck: function(cb){
    axios.get(`${BASE_URL}/internal/health/all`,{
      headers: HEADERS
    })
    .then(function (response) {
      cb(null, response);
    })
    .catch(function (error) {
      cb(error);
    });
  },

  //Menus: Operations about menus
    menuData: function(data, cb){
      if(['deliveryareas','productcategories'].includes(data.type)){
        axios.get(`${BASE_URL}/menus/${data.menuId}/${data.type}`,{
          headers: HEADERS
        })
        .then(function (response) {
          cb(null, response.data);
        })
        .catch(function (error) {
          cb(error);
        });
      } else cb('Type Not Found');
    },

    menuProducts: function(data, cb){
      axios.get(`${BASE_URL}/menus/${data.menuId}/productcategories/${data.catId}/products`,{
        headers: HEADERS
      })
      .then(function (response) {
        cb(null, response.data);
      })
      .catch(function (error) {
        cb(error);
      });
    },

  //Restaurants:  Operations about restaurants
    restaurants: function(data, cb){
      axios.get(`${BASE_URL}/restaurants`,{
        params : data,
        headers: HEADERS
      })
      .then(function (response) {
        cb(null, response.data);
      })
      .catch(function (error) {
        cb(error);
      });
    },

    restaurantData: function(data, cb){
      if(['details','menus','reviews','productcategories','availablemenus'].includes(data.type)){
        if(data.type == 'availablemenus') data.type = 'menus/available';
        axios.get(`${BASE_URL}/restaurants/${data.id}/${data.type}`,{
          headers: HEADERS,
          params: data.params
        })
        .then(function (response) {
          cb(null, response.data);
        })
        .catch(function (error) {
          cb(error);
        });
      } else cb('Type Not Found');
    },

    restaurantBadges: function(cb){
      axios.get(`${BASE_URL}/restaurants/available_badges`,{
        headers: HEADERS
      })
      .then(function (response) {
        cb(null, response.data);
      })
      .catch(function (error) {
        cb(error);
      });
    },

  //Terms: Operations about Terms
    terms: function(cb){
      axios.get(`${BASE_URL}/terms`,{
        headers: HEADERS
      })
      .then(function (response) {
        cb(null, response.data);
      })
      .catch(function (error) {
        cb(error);
      });
    },
  };