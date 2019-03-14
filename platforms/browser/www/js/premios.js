// JavaScript Document
var db_name="ballantines_games.db";

var premio;



function premiado(number){
	premio = number;
	console.log(premio);
	descontar(premio);
	$('.huevo p').text(premio);
	
}


function descontar(premio) {
	var db = window.openDatabase(db_name, "1.0", "Birkner Media", 200000);
	db.transaction(function(tx) {
		var sql = 'UPDATE premios SET number= number -1 WHERE name like "%'+premio+'%"; ';
		console.log(sql);	
		tx.executeSql(sql);
	}, errorCB);
	
}

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	var db = window.openDatabase(db_name, "1.0", "Birkner Media", 200000);
	db.transaction(function(tx){
		var sql = "SELECT * FROM premios where number > 0 ";	
		console.log(sql);	
		tx.executeSql(sql,
		[], function(tx, results) {
			console.log(results);
			total = results.rows.length;
			elegido = Math.floor((Math.random() * total) + 1);	
			
			console.log("salio el :"+elegido);
			
			if(results.rows.length>0){
				console.log('elegido :'+results.rows.item(elegido-1).name);
				premiado(results.rows.item(elegido-1).name);
			}

		});

	});
}


function errorCB(err) {
	//console.log("Error processing SQL: "+err.code);
}