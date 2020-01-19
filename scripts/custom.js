
'use strict'

//Card variables
let suits = ["Hearts","Clubs","Diamonds","Spades"],
values = ["Ace", "King", "Queen", "Jack", "Ten", "Nine", "Eight", "Seven", "Six", "Five", "Four", "Three", "Two" ];
//Game variables
let playerScore = 0,
player,
gamesPlayed = 0,
counter = 0,
stacks = [[], [], [], [], [], [], [], [], [], [], [], [], []],
correctlyPlaced = [],
deck = [],
sound1 = new Audio("card.wav"),
sound2 = new Audio("success.wav"),
sound3 = new Audio("fanfar.mp3"),
sound4 = new Audio("lose.mp3");


storeName();
storeScore();


function storeName() {
    //Kolla om webbläsaren stöder localStorage
    if(typeof(Storage) !== "undefined") {
        //Om name är definierad
        if (localStorage.name) {
            player = localStorage.name;
            $("#game-info").html("Välkommen " + player + "!");
        //Om name inte är definierad
        } else {
            player = prompt("Vad trevligt att du är här! Vad heter du?");
        
            if(player){
                localStorage.setItem("name", player);
                $("#game-info").html("Välkommen " + player + "!");
            }  
        }
    } 
    else {
        player = "Gäst";
        $("#game-info").html("Välkommen!");  //Webbläsaren stöder ej localStorage
    }
  }


  function storeScore() {
    //Kolla om webbläsaren stöder localStorage
    if(typeof(Storage) !== "undefined") {
        //Om score är definierad
        if (localStorage.score) {
            playerScore = Number(localStorage.score);    
        }
        //Om score inte är definierad 
        else {
            localStorage.setItem("score", 0);    
        }
        if(localStorage.numGames){
            gamesPlayed = Number(localStorage.numGames);  
        }
        else{
            localStorage.setItem("numGames", 0);   
        }
    } 
  }

  function addScore(){
    playerScore++;
    if(typeof(Storage) !== "undefined"){
        localStorage.score = playerScore + "";
    }
  }

  function addGame(){
    gamesPlayed++; 
    if(typeof(Storage) !== "undefined"){
        localStorage.numGames = gamesPlayed + "";
    }  
  }




//Start game
$("#game-btn").click(function(){
    removeImages();
    $("#game-info").html("Spelare: " + player + "<br>Antal vunna spel: " + playerScore +
    "<br>Totalt antal spel: " + gamesPlayed);
    fillCorrectlyPlaced();
    $("#game-btn").hide();
    $("#card-btn").show();
    $("#stop-btn").show();
    $("#clear-btn").hide();
    deck = createDeck();
    shuffleDeck(deck);
    //testDeck();
});


//Place card in order
$("#card-btn").click(function(){
    do{
        counter++;
        if(counter > 13){counter = 1;}
    }while(correctlyPlaced[counter - 1]);

    let card = getNextCard();
    sound1.play();
    $("#c" + counter).html("<img src=" + getCardImage(card) + ">");
    if(getCardNumericValue(card) == counter){
        sound2.play();
        $("#c" + counter).addClass("shadow");
        correctlyPlaced[counter - 1] = true;
        
        $.each(stacks[counter - 1], function(idx, item){
            deck.push(item);
        });
        
    }
    else{
        stacks[counter - 1].push(card);
    }
    if(checkResult()){
        winGame();   
    }
    else if(!deck.length){
        gameOver();
    }
});


$("#stop-btn").click(function(){
    resetGame();
    removeImages();
});


$("#om-spelet").click(function(){
    $.ajax({
        url: "omspelet.txt",
        success: function(result){ alert(result); },
        error: function(xhr){ alert(xhr.status + ": " + xhr.statusText);}
    });
});

$("#clear-btn").click(function(){
    if(localStorage.name){
        localStorage.removeItem("name");
    }
    if(localStorage.score){
        localStorage.removeItem("score");
    }
    if(localStorage.numGames){
        localStorage.removeItem("numGames");
    }
    playerScore = 0;
    gamesPlayed = 0;
});


function resetGame(){
    $("#game-btn").show();
    $("#card-btn").hide();
    $("#stop-btn").hide(); 
    $("#clear-btn").show();
    $("#game-info").html("");
    $(".clockrow > div").removeClass("shadow");
    stacks = [[], [], [], [], [], [], [], [], [], [], [], [], []];
    correctlyPlaced = [];
    deck = []; 
    counter = 0; 
}


function winGame(){
    sound3.play();
    resetGame();
    addScore();
    addGame();
    $("#game-info").html("Grattis ");
}


function gameOver(){
    sound4.play();
    resetGame();
    addGame();
    $("#game-info").html("Slut på spelkort! Bättre lycka nästa gång ");
}

//Returns true if all correctly placed, otherwise false
function checkResult(){
    let result = true;
    $.each(correctlyPlaced, function(idx, item){
        if(!item){ result = false; }
    });
    return result;   
}

//false from start
function fillCorrectlyPlaced(){
    for(let i = 0; i < 13; i++){
        correctlyPlaced.push(false);    
    }
}


function createDeck(){
    //Creates the deck of cards
    let deck = [];
    let i = 0;
    for(let suitIdx = 0; suitIdx < suits.length; suitIdx++){
        for(let valueIdx = 0; valueIdx < values.length; valueIdx++){
            let card = {
                suit: suits[suitIdx],
                value: values[valueIdx],
                id: i   //for testing
            };
            deck.push(card);
            i++;
        }
    }
    return deck;
}




//Shuffle deck
function shuffleDeck(deck){
    deck.sort(randomize);
}

function randomize(a, b) {
    return Math.random() - 0.5;
}


function getNextCard(){
    //shift returns the first element from an array and removes it from the array
    return deck.shift();
}

function removeImages(){
    $("img").each(function(){
        $(this).remove();
    });   
}

//returns the string name of image source
function getCardImage(card){
    return "cardImg/" + card.suit + card.value + ".png";  
}


function getCardString(card){
    return card.value + ' of ' + card.suit;
}


function getCardNumericValue(card){
    switch(card.value){
        case "Ace" :
        return 1;
        case "Two" :
        return 2;
        case "Three" :
        return 3;
        case "Four" :
        return 4;
        case "Five" :
        return 5;
        case "Six" :
        return 6;
        case "Seven" :
        return 7;
        case "Eight" :
        return 8;
        case "Nine" :
        return 9;
        case "Ten" :
        return 10;
        case "Jack" :
        return 11;
        case "Jack" :
        return 11;
        case "Queen" :
        return 12;
        default :
        return 13;
    }
}


function testDeck(){
    for(var i = 0; i < deck.length; i++){
        console.log(deck[i].id);
    }
}








