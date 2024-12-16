const cardImages = [
    'img/emoji_01.png',
    'img/emoji_02.png',
    'img/emoji_03.png',
    'img/emoji_04.png',
    'img/emoji_05.png',
    'img/emoji_06.png',
    'img/emoji_07.png',
    'img/emoji_08.png'
];

const gameContainer = document.querySelector('.memory-game');

let gameActive = false; 

const cards = [...cardImages, ...cardImages]
    .sort(() => Math.random() - 0.5)
    .map(img => createCard(img));

cards.forEach(card => gameContainer.appendChild(card));

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function createCard(imgSrc) {
    const card = document.createElement('div');
    card.classList.add('memory-card');

    const front = document.createElement('div');
    front.classList.add('front');
    const frontImg = document.createElement('img');
    frontImg.src = imgSrc;
    front.appendChild(frontImg);

    const back = document.createElement('div');
    back.classList.add('back');
    const backImg = document.createElement('img');
    backImg.src = 'img/star.png';
    back.appendChild(backImg);

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', flipCard);

    return card;
}

function flipCard() {
    if (!gameActive) return; 
    if (lockBoard || this === firstCard) return;

    this.classList.add('is-flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;

    turns++; 
    updateTurns(); 

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.querySelector('.front img').src === secondCard.querySelector('.front img').src;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('is-flipped');
        secondCard.classList.remove('is-flipped');

        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

const playResetButton = document.getElementById('play-reset');
const turnsCounter = document.getElementById('turns');

let turns = 0;

playResetButton.addEventListener('click', () => {
    if (playResetButton.textContent === 'PLAY') {
        playResetButton.textContent = 'RESET';
        startGame();
        gameActive = true; 
    } else {
        resetGame();
        gameActive = false; 
    }
});

function startGame() {
    turns = 0;
    updateTurns();
    shuffleCards();
    showAllCardsTemporarily(); 
}

function resetGame() {
    playResetButton.textContent = 'PLAY';
    turns = 0;
    updateTurns();
    gameActive = false; 
    const allCards = document.querySelectorAll('.memory-card');
    allCards.forEach(card => {
        card.classList.remove('is-flipped');
        card.addEventListener('click', flipCard);
    });
    shuffleCards();
}

function updateTurns() {
    turnsCounter.textContent = `Turns: ${turns}`; 
}

function shuffleCards() {
    const allCards = document.querySelectorAll('.memory-card');
    const shuffledCards = [...allCards].sort(() => Math.random() - 0.5);

    gameContainer.innerHTML = '';
    shuffledCards.forEach(card => gameContainer.appendChild(card));
}

function showAllCardsTemporarily() {
    const allCards = document.querySelectorAll('.memory-card');
    allCards.forEach(card => card.classList.add('is-flipped')); 
    setTimeout(() => {
        allCards.forEach(card => card.classList.remove('is-flipped'));
    }, 5000); 
}
