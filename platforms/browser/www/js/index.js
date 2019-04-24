//funcion random array
(function($) {
    $.rand = function(arg) {
        if ($.isArray(arg)) {
            return arg[$.rand(arg.length)];
        } else if (typeof arg === "number") {
            return Math.floor(Math.random() * arg);
        } else {
            return 4;  // chosen by fair dice roll
        }
    };
})(jQuery);

var token = "e62b90a3-7ecf-b747-f6eb-f11079fcbacd";
var mensaje ="";
//validacion de formulario

$(document).ready(function() {
	//cargo la lista de canciones
	$.getJSON("http://simple2.cl/simple/save_puntos.php?lista=1", function( data ) {
	  
	  console.log(data);
	  var html = "";
	  $.each( data, function( key, val ) {		
		 html+="<li id='" + val.id + "'>" + val.artista +" - "+ val.titulo + "</li>";
	  });
	  
	  $('.listado ul').html(html);
		
	  $('#lista ul li').on('click', function(event){
		var ok = confirm('¿Deseas votar por:\n'+$(this).text().toUpperCase()+'?');
		var id = $(this).attr('id');
		if (ok == true) {
		  $.ajax({
			  method: "GET",
			  url: "http://simple2.cl/simple/save_puntos.php",
			  data: { id: id, puntos:'true'}
			})
			.done(function( msg ) {
				console.log( "Data Saved: " + msg );
			  	$('#lista').removeClass('fadeIn').addClass('fadeOut').css('display','none');
			    $('#final').addClass('fadeIn animated').css('display','block');			  
			});
		} else {
		  return false;
		}
	 });	
	  
	});
	
	$('#inicio a').on('click',function(event){
		$(this).removeClass('zoomIn').addClass('fadeOut').css('display','none');
		$('#formulario').addClass('fadeIn animated').css('display','block');
		
	});

	$('form').on('submit', function(Event){
    	// validation code here
		Event.preventDefault();
		var rut = $('#rut').val();
		// retorna true si es válido
		if($.validateRut(rut)) {
			var firstName 	= $( "#firstName" ).val();
			var lastName 	= $( "#lastName" ).val();
			var recibe_info	= $( "#recibe_info" ).val();
			var email 		= $( "#email" ).val();
			//var birthday 	= $( "#birthday" ).val();
			var birthday 	= $("#ano").val()+'-'+$("#mes").val()+'-'+$("#dia").val();	
			var acepta_politica 		= $( "#acepta_politica" ).val();
			/*
			var obj = {
				firstName 		: firstName,
				lastName 		: lastName,
				email : email,
				birthday		: birthday,
				gender : "M",
				countryCode		: "cl",
				languageCode : "es",
				city : "santiago",
				createdDate: '2019-10-30T08:49:00Z',
				updatedDate: '2019-10-30T08:49:00Z',
				activityID: 'ballantines_DJ_2019',
				activityRecordSource : "DJ",
				activityType: "event",
				activityName: "ballantines_DJ_2019",
				optIn_Chivas: "True",
				optInDate_Chivas: "2017-10-30T08:49:00Z",
				identifyNumber 	: rut,
				hash : "mnsdjidshjdsj"
			};
			*/
			var obj =
			{
			 "firstName": firstName,
			 "lastName": lastName,
			 "email": email,
			 "birthday": birthday,
			 "languageCode": "es",
			 "countryCode": "CL",
			 "address": {
			 "postCode": "7560910",
			 "line1" : "Av. Apoquindo 5400",
			 "city" : "Las Condes",
			 "state" : "Santiago"			 		 
			 },
			 "technicalFields": {
			 "optIns": [{
			 "brandId": "Ballantines",
			 "optInStatus": true
			 }],
			 "localAttributes": [{
				 "type": "Privacy Policy",
				 "value": "true",
				 "brandHierarchy": "NA",
				 "marketHierarchy": "CHILE",
				 identifyNumber : rut	
			 }
			 ]
			 }
			}

			var str = JSON.stringify(obj);
			str = JSON.stringify(obj, null, 4);
			
			//ajax pernod ricard
			console.log(obj);
			$.ajax({
				type: "POST",
				//url: "https://api.pernod-ricard.io/pr-latam/v1/consumers/",
				url : 'https://api.pernod-ricard.io/pr-latam/v1/interactions/simple/564031cbd4c6f405581cbd26',
				data: JSON.stringify(obj),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					'X-TOUCHPOINT-TOKEN': token,
					'api_key': 'q9qsv2ebnkrxky46p8wck33f'
				},
				success: function(data){
					console.log(data);
					console.log("Gracias por registrarte, ya puedes ingresar a Ballantine's Records");
					
				},
				failure: function(errMsg) {
					console.log(errMsg);

					if(errMsg.responseText=="{\"message\":\"hash invalid, the minimum length is 6\"}"){
						mensaje = "La contraseña debe tener al menos 6 caracteres.";
					}else if("{\"message\":\"The consumer already exists in Touchpoint\",\"code\":26}"){
						mensaje = "Este correo ya se encuentra registrado.";
					}else{
						mensaje = "Ha ocurrido un error, por favor vuelve a intentarlo";
					}
						console.log(mensaje);
						//alert(mensaje);
				},
				error: function(errMsg) {
					if(errMsg.responseText=="{\"message\":\"hash invalid, the minimum length is 6\"}"){
						mensaje = "La contraseÃ±a debe tener al menos 6 caracteres.";
					}else if("{\"message\":\"The consumer already exists in Touchpoint\",\"code\":26}"){
						mensaje = "Este correo ya se encuentra registrado.";
					}else{
						mensaje = "Ha ocurrido un error, por favor vuelve a intentarlo";
					}
					console.log(mensaje);
					//alert(mensaje);
					console.log(JSON.stringify(errMsg.responseText));

				}
			});
			
			
			//ajax simple ql
			
			$.ajax({
			  method: "GET",
			  url: "http://simple2.cl/simple/save.php",
			  data: { firstName: firstName, lastName: lastName, email: email, birthday: birthday,identifyNumber: rut,recibe_info:recibe_info,acepta_politica:acepta_politica}
			})
			.done(function( msg ) {
				console.log( "Data Saved: " + msg );
				$('#formulario').removeClass('fadeIn').addClass('fadeOut').css('display','none');
				$('#lista').addClass('fadeIn animated').css('display','block');
			});
			
			

		}else{
			alert('El rut no es válido');
		}


  	});	
	
	
});
