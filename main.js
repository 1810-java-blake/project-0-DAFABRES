// AJAX
// asynchronous JavaScript and XMLHttpRequest

// we're going to send HTTP messages from JavaScript
// and process the results without ever reloading the page

// a synchronous operation blocks all other activity
// until it's done.

// an asynchronous operation allows other code to run
// and will proceed when the operation is done.

var game;
var playerPoints;
var dealerPoints;

function ajax(url, success, failure) {
    let xhr = new XMLHttpRequest();

    // the "readyState" tells you the progress of
    // receiving the response.
    xhr.onreadystatechange = () => {
        
        //console.log(xhr.readyState);
        
        // TODO: handle the response
        if (xhr.readyState === 4) {
            // we've received the full response.
            // it's a JSON string
            let resJSON = xhr.response;
            if (xhr.status === 200) { // (success)
                let resObj = JSON.parse(resJSON);
                // use our callbacks
                success(resObj);
            } else {
                failure(resJSON, xhr.status);
            }
        }
    };

    // describing the request to be made
    xhr.open('GET', url);

    // construct and send the request
    xhr.send();
    // the next thing that'll happen is
    // readystatechange will fire a bunch of times
   
    //console.log("end of ajax function.");
}

// JSON: JavaScript object notation

// a little bit different from
// writing JS objects

//{
//    name: "Nick"
//    fn: () => 1;
//}

// JSON:
// {
//      "name": "Nick",
//      "fn": "No functions allowed in JSON"
// }

document.addEventListener("DOMContentLoaded", () => {
    let card = document.getElementById("card");
    let cardBtn = document.getElementById("cardBtn");
    let newGame = document.getElementById("newGame");
    let hitBtn = document.getElementById("hitBtn");
    let stayBtn = document.getElementById("stayBtn");

    cardBtn.addEventListener("click", event => {
        // params: url, success, failure
        ajax(
            `https://deckofcardsapi.com/api/deck/${game}/draw/?count=1`,
            obj => {
                console.log(obj);
                card.innerHTML = obj.cards[0].value + " of " + obj.cards[0].suit;
            },
            (res, status) => {
                console.log(`Failure, status ${status}`);
            }
        );
    });

    newGame.addEventListener("click", event => {
        ajax(
            "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
            // give this obj a new name
            obj => {
                // console.log(obj);
                game = obj.deck_id;
                drawCard("player", () => {
                    drawCard("dealer", () =>{
                        drawCard("player", (obj) => {
                            currentScore(obj.piles.player.cards, "player");
                            drawCard("dealer", (obj) => {
                                //ajax again for point calculation
                                console.log("success");
                                currentScore(obj.piles.dealer.cards, "dealer");
                            })
                        })
                    })
                });
            },
            (res, status) => {
                console.log(`Failure, status ${status}`);
            }
        );

    });


    hitBtn.addEventListener("click", event => {
        ajax(
            `http://deckofcardsapi.com/api/deck/${game}/pile/player/list/`,
            obj => {
                console.log(obj);
                drawCard("player", (obj) => {
                    currentScore(obj.piles.player.cards, "player");
                    if(playerPoints > 21){
                        dealerTurn();
                    }
                });    
            },
            (res, status) => {
                console.log(`Failure, status ${status}`);
            }
        );
    });
    
    stayBtn.addEventListener("click", event => {
        dealerTurn();
    });
});

var currentCard;
function drawCard(pileId, success){
    ajax(
        `https://deckofcardsapi.com/api/deck/${game}/draw/?count=1`,
        obj => {
            //console.log(obj);
            currentCard = obj.cards[0].code;
            var x = `https://deckofcardsapi.com/api/deck/${game}/pile/${pileId}/add/?cards=${currentCard}`;
            //console.log(x);
            ajax(
                x,
                obj => {
                    //console.log(obj);
                    ajax(
                        `http://deckofcardsapi.com/api/deck/${game}/pile/${pileId}/list/`,
                        obj => {
                            console.log(obj);
                            success(obj);
                        },
                        (res,status) => {
                            console.log(`Failure, status ${status}`);
                        }
                    );
                },
                (res,status) => {
                    console.log(`Failure, status ${status}`);
                }
            );
            
        },
        (res, status) => {
            console.log(`Failure, status ${status}`);
        }
    );   
}
    // either promise or have drawCard accept a function as a parameter

    /* var x = `https://deckofcardsapi.com/api/deck/${game}/pile/${pileId}/add/?cards=${currentCard}`;
    console.log(x);
    ajax(

        x,
        obj => {
            console.log(obj);
        },
        (res,status) => {
            console.log(`Failure, status ${status}`);
        }
    ); */


//old value function

/* function valueTranslation(hand){
    var i;
    for (i = 0; i < hand.length; i++){
        if (hand[i].value === 'ACE'){
            hand[i] = 11;
        }
        else if (hand[i].value === 'KING'){
            hand[i] = 10;
        }
        else if (hand[i].value === 'QUEEN'){
            hand[i] = 10;
        }
        else if (hand[i].value === 'JACK'){
            hand[i] = 10;
        }
        else{
            hand[i] = hand[i].value;
        }
    }
    //console.log(hand);
}
*/

function handTranslation(card){
    //console.log(card);
    if (card.value === 'ACE'){
        return 11;
    }
    else if (card.value === 'KING'){
        return 10;
    }
    else if (card.value === 'QUEEN'){
        return 10;
    }
    else if (card.value === 'JACK'){
        return 10;
    }
    else{
        return +card.value;;
    }
}

function currentScore(hand, agent){
    var points = hand.map(handTranslation);
    var total = 0;
    var i;
    for (i = 0; i < points.length; i++){
        total = total + points[i];
    }


    while((points.includes(11)) && (total > 21)){
        var loc = points.findIndex((element) => {
            return element === 11;
        });
        points[loc] = 1;
        total = total - 10;
    }
    console.log(total);
    if (agent === "dealer") {
        dealerPoints = total;
    } else if (agent === "player") {
        playerPoints = total;
    }
}

function dealerTurn(){
    ajax(
        `http://deckofcardsapi.com/api/deck/${game}/pile/dealer/list/`,
        obj => {
            if (playerPoints > 21){
                console.log("You busted, the house wins, try again?")
                return 0;
            }
            
            if (dealerPoints < 17){
                drawCard("dealer", (obj) => {
                    currentScore(obj.piles.dealer.cards, "dealer");
                    dealerTurn();
                });
            }
            /* while(dealerPoints < 17){
                dealerPoints = dealerPoints + 1;
                console.log(dealerPoints);
                drawCard("dealer", (obj) => {
                    currentScore(obj.piles.dealer.cards, "dealer");
                });
            } */

            if ((dealerPoints < playerPoints) && dealerPoints >= 17){
                console.log("You win!!!");
            } else if ((dealerPoints === playerPoints) && dealerPoints >= 17) {
                console.log("It's a draw");
            } else if ((dealerPoints > playerPoints) && (dealerPoints < 22) && dealerPoints >=17){
                console.log("The house wins, try again?");
            } else if ((dealerPoints > 21) && dealerPoints >= 17){
                console.log("The house busted, you win!!!");
            } 
        },
        (res,status) => {
            console.log(`Failure, status ${status}`);            
        });
}
//disable = true
//use array.includes!!!!!!!!!!!!!!!!!!!!!!!!!!
//array.map!!!!!!!!!!!!!!!!!!!!!!!!
//for-of loop


//promise
//callbacks


/*
    fetchBtn.addEventListener("click", event => {
        fetch("http://api.icndb.com/jokes/random/")
            // .json() method returns a Promise
            // of the response body parsed from JSON
            .then(res => res.json())
            .then(data => {
                joke.innerHTML = data.value.joke;
            })
            .catch(err => console.log(err));
    });
*/