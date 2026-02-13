// DOM Elements
const scrollBtn = document.getElementById('scroll-btn');
const cardSection = document.getElementById('card-section');
const book = document.querySelector('.book'); // Changed from .card
const gameSection = document.getElementById('game-section');

// 1. Scroll Functionality
scrollBtn.addEventListener('click', () => {
    cardSection.scrollIntoView({ behavior: 'smooth' });
});

// 2. Card/Book Flip Functionality
// We click the book (or specifically the cover) to open it
// 2. Card Flip (Now handled by CSS Hover)
// const bookCover = document.querySelector('.book-cover');
// bookCover.addEventListener('click', () => {
//     book.classList.toggle('open');
// });

// 3. Game Logic
const gameGrid = document.getElementById('game-grid');
const popup = document.getElementById('memory-popup');
const popupImg = document.getElementById('popup-img');
const popupText = document.getElementById('popup-text');
const closePopupBtn = document.getElementById('close-popup');
const completionView = document.getElementById('completion-view');
const memoriesList = document.getElementById('memories-list');

// Data (Expanded to 10 pairs = 20 cards)
const memories = [
    { id: 1, text: "Remember that time we went to the beach?", img: "https://placehold.co/300x300/ff4d6d/white?text=Beach" },
    { id: 2, text: "Our first coffee date.", img: "https://placehold.co/300x300/ff8fa3/white?text=Coffee" },
    { id: 3, text: "Hiking up that big mountain!", img: "https://placehold.co/300x300/ff4d6d/white?text=Hike" },
    { id: 4, text: "Cooking dinner together.", img: "https://placehold.co/300x300/ff8fa3/white?text=Dinner" },
    { id: 5, text: "Watching the sunset.", img: "https://placehold.co/300x300/ff4d6d/white?text=Sunset" },
    { id: 6, text: "That funny movie we saw.", img: "https://placehold.co/300x300/ff8fa3/white?text=Movie" },
    { id: 7, text: "Stargazing at the park.", img: "https://placehold.co/300x300/ff4d6d/white?text=Stars" },
    { id: 8, text: "Our road trip.", img: "https://placehold.co/300x300/ff8fa3/white?text=Trip" },
    { id: 9, text: "Baking cookies (and burning them).", img: "https://placehold.co/300x300/ff4d6d/white?text=Cookies" },
    { id: 10, text: "Dancing in the rain.", img: "https://placehold.co/300x300/ff8fa3/white?text=Rain" },
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
const totalPairs = memories.length;

// Heart shape grid pattern (7x5 grid for 20 cards)
/*
    0xx0xx0  (Row 1: 0 1 1 0 1 1 0)
    xxxxxxx  (Row 2: 1 1 1 1 1 1 1)
    0xxxxx0  (Row 3: 0 1 1 1 1 1 0)
    00xxx00  (Row 4: 0 0 1 1 1 0 0)
    000x000  (Row 5: 0 0 0 1 0 0 0)
*/
const heartPattern = [
    0, 1, 1, 0, 1, 1, 0,
    1, 1, 1, 1, 1, 1, 1,
    0, 1, 1, 1, 1, 1, 0,
    0, 0, 1, 1, 1, 0, 0,
    0, 0, 0, 1, 0, 0, 0
];

function initGame() {
    // Duplicate memories to create pairs
    const pairs = [...memories, ...memories];
    // Shuffle
    pairs.sort(() => 0.5 - Math.random());

    // Create grid
    gameGrid.innerHTML = '';
    let cardIndex = 0;

    heartPattern.forEach((val) => {
        if (val === 1 && cardIndex < pairs.length) {
            createCard(pairs[cardIndex]);
            cardIndex++;
        } else {
            const spacer = document.createElement('div');
            spacer.classList.add('hidden-cell');
            gameGrid.appendChild(spacer);
        }
    });

    // Handle leftover cards if grid logic is off/resized (fallback)
    while (cardIndex < pairs.length) {
        createCard(pairs[cardIndex]);
        cardIndex++;
    }
}

function createCard(memory) {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.id = memory.id;

    const img = document.createElement('img');
    img.src = memory.img;
    img.alt = "Memory";

    // Back of card design (default color/icon)
    const icon = document.createElement('span');
    icon.innerText = "?"; // Could be a heart icon

    card.appendChild(img);
    // card.appendChild(icon); // Logic handles display via CSS

    card.addEventListener('click', () => flipCard(card, memory));
    gameGrid.appendChild(card);
}

function flipCard(card, memory) {
    if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flippedCards.push({ card, memory });

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [first, second] = flippedCards;

    if (first.memory.id === second.memory.id) {
        // Match!
        first.card.classList.add('matched');
        second.card.classList.add('matched');
        matchedPairs++;

        // Show Popup
        setTimeout(() => showPopup(first.memory), 500);

        flippedCards = [];

        if (matchedPairs === totalPairs) {
            setTimeout(showCompletion, 1000);
        }
    } else {
        // No Match
        setTimeout(() => {
            first.card.classList.remove('flipped');
            second.card.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function showPopup(memory) {
    popupImg.src = memory.img;
    popupText.innerText = memory.text;
    popup.classList.remove('hidden');
}

closePopupBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
});

function showCompletion() {
    completionView.classList.remove('hidden');
    gameGrid.classList.add('hidden'); // Optional: hide grid

    memories.forEach(mem => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${mem.img}" alt="Memory">
            <span>${mem.text}</span>
        `;
        memoriesList.appendChild(li);
    });
}

initGame();
