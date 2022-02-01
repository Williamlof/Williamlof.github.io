const wordEl = document.querySelector('.word');
const wrongLettersEl = document.querySelector('.wrong-letters');
const playAgainBtn = document.querySelector('#play-button');
const popup = document.querySelector('.popup');
const notification = document.querySelector('.notification-container');
const finalMessage = document.querySelector('#final-message');
const bodyEl = document.querySelector('body');
const timerBtn = document.querySelector('.toggle-timer');
const timerEl = document.querySelector('.timer');
const timerContainerEl = document.querySelector('.timer-container')
const figure = document.querySelector('.figure');
const words = ['dolphin', 'diamond', 'tool', 'overthink', 'concept', 'cowboy', 'artillery', 'narrow', 'radiator', 'boomer'];

let lost = 0;
let timeLeft = document.querySelector('.time-left');
let selectedWord = words[Math.floor(Math.random() * words.length)];
let incorrectGuess = 0;
let timerModeActive = false;
let wonGame = false;
let gameTime = 30;
let gameTimer

const correctLetters = [];
const wrongLetters = [];
// låter hemsidan ta in tangenttryck.
window.addEventListener('keydown', keyboardInput);

// Funktion som ändar innehållet i wordEl till att motsvara inmatade 
function displayWord() {
    wordEl.innerHTML = `
    ${selectedWord.split('')
            .map(
                letter => `
    <span class="letter">
    ${correctLetters.includes(letter) ? letter : ''}
    </span>
    `
            ).join('')}
    `;
                            // replace all newline characters globally, with nothing.
    const innerWord = wordEl.innerText.replace(/\n/g, '');

    if (innerWord === selectedWord) {
        finalMessage.innerText = 'You win!';
        popup.style.display = 'flex';
        wonGame = true;
        bodyEl.style.backgroundColor = 'rgba(66, 214, 91, 0.8)';
        window.removeEventListener('keydown', keyboardInput);
    }
};

// Update the wrong Letters
function updateWrongLetter() {
    // Display wrong letters
    wrongLettersEl.innerHTML = `
    ${wrongLetters.map(letter => `<span class="letters">${letter}</span>`).join('') }
    `;

    // Kör funktionen showHangman
    showHangman();
    //+1 på variabeln incorrectGuess
    incorrectGuess++;
};
// visar del av hänggubben beroende på hur många gånger updateWrongLetter har körts.
function showHangman() {
    if (incorrectGuess == 1) {
        document.querySelector('figure').classList.add('scaffold');
    }
    else if (incorrectGuess == 2) {
        document.querySelector('figure').classList.add('head');
    }
    else if (incorrectGuess == 3) {
        document.querySelector('figure').classList.add('body');
    }
    else if (incorrectGuess == 4) {
        document.querySelector('figure').classList.add('arms');
    }
    else if (incorrectGuess == 5) {
        document.querySelector('figure').classList.add('legs');
        youLost();
    }
};

// check if lost
function youLost() {
    finalMessage.innerText = `You lost! ;) The correct word was "${selectedWord}".`;
    popup.style.display = 'flex';
    bodyEl.style.background = 'rgba(0, 0, 0, 0.8)'
    window.removeEventListener('keydown', keyboardInput);
};

// show notification for pressing an already pressed letter.
function showNotification() {
    notification.classList.add('show');

// removes notification after 1500ms
    setTimeout(() => {
        notification.classList.remove('show');

    }, 2000);
};


// restart game and play again

playAgainBtn.addEventListener('click', resetGame);

function resetGame(){
    //empty arrays
    correctLetters.splice(0);
    wrongLetters.splice(0);
    //reset amount of guesses
    incorrectGuess = 0;
    //remove hangman
    document.querySelector('figure').classList.remove('arms');
    document.querySelector('figure').classList.remove('legs');
    document.querySelector('figure').classList.remove('body');
    document.querySelector('figure').classList.remove('head');
    document.querySelector('figure').classList.remove('scaffold');

    //reset timer mode
    timerModeActive = false;
    wonGame = false;
    timerContainerEl.style.display = 'none';
    clearInterval(gameTimer)
    gameTime = 29;

    // reset styles
    bodyEl.style.background = '#4f1d96'
    popup.style.display = 'none';
    window.addEventListener('keydown', keyboardInput);

    //new word
    selectedWord = words[Math.floor(Math.random() * words.length)];

    displayWord();
    updateWrongLetter();


};
// tar in tangent tryck motsvarande keyCode 65-90, utlämnar resterande.
function keyboardInput() {
    if (event.keyCode >= 65 && event.keyCode <= 90) {
        const letter = event.key;

        if (selectedWord.includes(letter)) {
            if (!correctLetters.includes(letter)) {
                correctLetters.push(letter);

                displayWord();
            } else {
                showNotification();
            }
        } else {
            if (!wrongLetters.includes(letter)) {
                wrongLetters.push(letter);

                updateWrongLetter();
            } else {
                showNotification();
            }
        }
        console.log(letter)
    }
};

displayWord();

// funktion som startar timer mode ifall den är avstängt, eller stänger av den ifall den är på.
timerBtn.addEventListener('click', timerMode)
function timerMode(){
    if(timerModeActive == true){
    resetGame();
    return;
    } else{
    resetGame();
    timerModeActive = true;
    timerContainerEl.style.display = 'inline-block';
    gameTimer = setInterval( function() {
    if(gameTime == lost){
        clearInterval(gameTimer);
        youLost();
     } else if (wonGame == true){
        clearInterval(gameTimer);
    } else {
        timeLeft.innerHTML = (`${gameTime} s`);
    }
    gameTime--;
    }, 1000);

};
}

