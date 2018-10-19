// AJAX
// asynchronous JavaScript and XMLHttpRequest

// we're going to send HTTP messages from JavaScript
// and process the results without ever reloading the page

// a synchronous operation blocks all other activity
// until it's done.

// an asynchronous operation allows other code to run
// and will proceed when the operation is done.

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
{
    name: "Nick"
    fn: () => 1;
}

// JSON:
// {
//      "name": "Nick",
//      "fn": "No functions allowed in JSON"
// }

document.addEventListener("DOMContentLoaded", () => {
    let joke = document.getElementById("joke");
    let jokeBtn = document.getElementById("jokeBtn");
    let jsonText = document.getElementById("inputText");
    let jsonBtn = document.getElementById("jsonBtn");
    let jsonOut = document.getElementById("jsonOut");

    jokeBtn.addEventListener("click", event => {
        // params: url, success, failure
        ajax(
            "https://deckofcardsapi.com/api/deck/new/draw/?count=1",
            obj => {
                console.log(obj);
                joke.innerHTML = obj.cards[0].value + " of " + obj.cards[0].suit;
            },
            (res, status) => {
                console.log(`Failure, status ${status}`);
            }
        );
    });

    jsonBtn.addEventListener("click", event => {
        let json = jsonText.value; // a string
        try {
            // convert JSON-format string into JS
            let data = JSON.parse(json);
            // now it's an object, or an array, or a number, etc.
            console.log(data);

            data.name = "Clark";
            data.innerObj = {};

            let newJson = JSON.stringify(data);
            jsonOut.innerText = newJson;
        } catch (err) {
            // recover from errors thrown in the
            // middle of the "try" block
            console.log(err);
        }
    });
});

//IIFE: "iffy"
//immediately invoked function expression

(function () {
    var innerData = 0;

    console.log(innerData);
})();

// innerData is out of scope

// the point is, to have code running directly in the script
// (not behind and event listener) but without our temporary
// variables getting into that global namespace.

//(because var gives us function scope.)

// these days we tend to use modules for this kind of thing instead.

//Closure

function newCounter(){

}

//in JS, when you have an inner function
//inside an outer function, and the
//inner function references some
//variable from the outer function,
//it "closes over" that variable
//and keeps it around even if it otherwise 
//would pass out of scope and be deleted

//this is called closure.

let a = newCounter();
console.log(`${a()} ${a()} ${a()}`);