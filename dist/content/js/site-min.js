let user={points:0,name:"Charlie"};$(document).ready(function(){$(".question button").click(function(t){var e=parseInt(this.dataset.value);user.points+=e,console.log(user.points),$(this.parentElement).hide(),0===e||1===e?$("#question2").show():2===e||4===e?$("#question3").show():8!==e&&16!==e||(window.location.href=`/recommendation?total=${user.points}`)})});