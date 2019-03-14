var timeleft = 30;
var abrido = 0;

//si esta seteado, usamos el valor
if (localStorage.memoriza) {
	timeleft = parseInt(localStorage.memoriza);
}

var empezo = false;
var downloadTimer;

var fixed = document.getElementById('fixed');
fixed.addEventListener('touchmove', function(e) {
        e.preventDefault();
}, false);

(function($) {



  /************ Start hard coded settings ******************/

  // How long a non matching card is displayed once clicked.
  var nonMatchingCardTime = 1000;

  /************ End hard coded settings ******************/

  // Handle clicking on settings icon
  var settings = document.getElementById('memory--settings-icon');
  var modal = document.getElementById('memory--settings-modal');
  var handleOpenSettings = function (event) {
    event.preventDefault();
    modal.classList.toggle('show');
  };
  settings.addEventListener('click', handleOpenSettings);

  // Handle settings form submission
  var reset = document.getElementById('memory--settings-reset');
  var handleSettingsSubmission = function (event) {
    event.preventDefault();

    //var selectWidget = document.getElementById("memory--settings-grid").valueOf();
	var selectWidget = document.getElementById("memory--settings-grid").valueOf();
    //var grid = selectWidget.options[selectWidget.selectedIndex].value;
	var grid = "4x3";
    var gridValues = grid.split('x');
    var cards = $.initialize(Number(gridValues[0]), Number(gridValues[1]));

    if (cards) {
      document.getElementById('memory--settings-modal').classList.remove('show');
      document.getElementById('memory--end-game-modal').classList.remove('show');
      document.getElementById('memory--end-game-message').innerText = "";
      //document.getElementById('memory--end-game-score').innerText = "";
      buildLayout($.cards, $.settings.rows, $.settings.columns);
	  inicio();
    }

  };


  reset.addEventListener('click', handleSettingsSubmission);

  // Handle clicking on card
  var handleFlipCard = function (event) {
	event.preventDefault();
   	var status = $.play(this.index);
    console.log(status);
		console.log("intentos:"+$.attempts);

		if (status.code != 0 ) {
		  this.classList.toggle('clicked');
		  console.log("abierto:"+ abrido);

		}

		if (status.code == 3 ) {
		  setTimeout(function () {
			var childNodes = document.getElementById('memory--cards').childNodes;
			childNodes[status.args[0]].classList.remove('clicked');
			childNodes[status.args[1]].classList.remove('clicked');

		  }.bind(status), nonMatchingCardTime);
		}

		if($.puntos>0){
			status.code = 4;
		}

		if($.attempts==3){
			status.code = 4;
		}

		if (status.code == 4) {
		  //aca se acaba el juego
			console.log("puntos:"+$.puntos);

			if($.puntos>0){
				setTimeout(function(){
					location.href = "premio.html"; }, 1000);

			}else{
				setTimeout(function(){
					location.href = "perdio.html"; }, 1000);

			}

			/*

			var score = parseInt((($.attempts - $.mistakes) / $.attempts) * 100, 10);
		  var message = getEndGameMessage($.puntos);

		  document.getElementById('memory--end-game-message').textContent = message;

		  //document.getElementById('memory--end-game-score').textContent = 'Score: ' + score + ' / 100';

		  document.getElementById("memory--end-game-modal").classList.toggle('show');
			*/

		}



  };

  var getEndGameMessage = function(score) {
    var message = "";
		if(score>=1){
			message = "¡Felicitaciones!";
		  document.getElementById("memory--end-game-message").href="premio.html";
	 }else{
		 message = "Fín del juego";
	 }

	 //clearInterval(downloadTimer);
	/*
    if (score == 100) {
      message = "¡Felicitaciones!"
	  document.getElementById("memory--end-game-message").href="premio.html";
    }
    else if (score >= 70 ) {
		console.log('70');
      message = "Fin del juego"
    }
    else if (score >= 50) {
		console.log('50');
      message = "Fin del juego"
    }
    else {
	  console.log('malo ql');
      message = "Fin del juego";
    }*/

    return message;
  }

  // Build grid of cards
  var buildLayout = function (cards, rows, columns) {
    if (!cards.length) {
      return;
    }

    var memoryCards = document.getElementById("memory--cards");
    var index = 0;

    var cardMaxWidth = document.getElementById('memory--app-container').offsetWidth / columns;
    var cardHeightForMaxWidth = cardMaxWidth * (3 / 4);

    var cardMaxHeight = document.getElementById('memory--app-container').offsetHeight / rows;
    var cardWidthForMaxHeight = cardMaxHeight * (4 / 3);

    // Clean up. Remove all child nodes and card clicking event listeners.
    while (memoryCards.firstChild) {
      memoryCards.firstChild.removeEventListener('click', handleFlipCard);
      memoryCards.removeChild(memoryCards.firstChild);
    }

    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        // Use cloneNode(true) otherwise only one node is appended
        memoryCards.appendChild(buildCardNode(index, cards[index],
          (100 / columns) + "%", (100 / rows) + "%"));
        index++;
      }
    }

    // Resize cards to fit in viewport
    if (cardMaxHeight > cardHeightForMaxWidth) {
      // Update height
		/*
      memoryCards.style.height = (cardHeightForMaxWidth * rows) + "px";
      memoryCards.style.width = document.getElementById('memory--app-container').offsetWidth + "px";
      memoryCards.style.top = ((cardMaxHeight * rows - (cardHeightForMaxWidth * rows)) / 2) + "px";
	  */
      //ajuste para juego vertical
	memoryCards.style.height = "96%";
    }
    else {
      // Update Width
      memoryCards.style.width = (cardWidthForMaxHeight * columns) + "px";
      //memoryCards.style.height = document.getElementById('memory--app-container').offsetHeight + "px";
			memoryCards.style.height = "98%";
      memoryCards.style.top = 0;
    }

  };

  // Update on resize
  window.addEventListener('resize', function() {
    buildLayout($.cards, $.settings.rows, $.settings.columns);
  }, true);

  // Build single card
  var buildCardNode = function (index, card, width, height) {
    var flipContainer = document.createElement("li");
    var flipper = document.createElement("div");
    var front = document.createElement("a");
    var back = document.createElement("a");

    flipContainer.index = index;
    flipContainer.style.width = width;
    flipContainer.style.height = height;
    flipContainer.classList.add("flip-container");
    if (card.isRevealed) {
      flipContainer.classList.add("clicked");
    }

    flipper.classList.add("flipper");
    front.classList.add("front");
    front.setAttribute("href", "#");
    back.classList.add("back");
    back.classList.add("card-" + card.value);
    if (card.isMatchingCard) {
      back.classList.add("matching");
    }
    back.setAttribute("href", "#");

    flipper.appendChild(front);
    flipper.appendChild(back);
    flipContainer.appendChild(flipper);

    flipContainer.addEventListener('click', handleFlipCard);

    return flipContainer;
  };

})(MemoryGame);


function inicio(){
  /*
	if(!empezo){
		document.getElementById("cronometro").style.display="block";
	    console.log('inicio el juego');
		empezo = true;
		setTimeout(function(){

			downloadTimer = setInterval(function(){
			timeleft--;
			document.getElementById("cronometro").textContent = timeleft;
			if(timeleft <= 0){
				//
				//final();
				clearInterval(downloadTimer);
				console.log('se acabó el tiempo');
				 document.getElementById('memory--end-game-message').textContent = "Fin del juego";
                 document.getElementById("memory--end-game-modal").classList.toggle('show');
			}
			},1000);
		},
		500);
		return;
	}else{
		return false;
	}
	*/
}
