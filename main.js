// AJAX
// asynchronous JavaScript and XMLHttpRequest

// we're going to send HTTP messages from JavaScript
// and process the results without ever reloading the page

// a synchronous operation blocks all other activity
// until it's done.

// an asynchronous operation allows other code to run
// and will proceed when the operation is done.

var game;

function ajax(url, success, failure) {
    let xhr = new XMLHttpRequest();

    // the "readyState" tells you the progress of
    // receiving the response.
    xhr.onreadystatechange = () => {
        console.log(xhr.readyState);
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
    console.log("end of ajax function.");
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

    newGame.addEventListener("click", event =>{
        ajax(
            "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6",
            obj => {
                console.log(obj);
                game = obj.deck_id;
            },
            (res, status) => {
                console.log(`Failure, status ${status}`);
            }
        );
    });
});

