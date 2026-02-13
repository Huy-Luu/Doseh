// DOM Elements
const scrollBtn = document.getElementById('scroll-btn');
const cardSection = document.getElementById('card-section');
const book = document.querySelector('.book'); // Changed from .card
const gameSection = document.getElementById('game-section');

// Story Elements
const heroSection = document.getElementById('hero');
const storyText = document.getElementById('story-text');
const storyImage = document.getElementById('story-image');
const storyContainer = document.getElementById('story-container');

// Story Data
const storySteps = [
    { text: "Good morning Doseh! <span class='emoji'>❤️</span>", img: "https://placehold.co/250x250/ff9ebd/white?text=Morning", size: "normal" },
    { text: "How is your wisdom tooth doing?", img: "https://placehold.co/250x250/ff9ebd/white?text=Wisdom+Tooth", size: "normal" },
    { text: "I hope you are doing better!", img: "https://placehold.co/250x250/ff9ebd/white?text=Better", size: "normal" },
    { text: "You know what day today is right?", img: "https://placehold.co/250x250/ff9ebd/white?text=What+Day", size: "small" },
    { text: "Happy Valentines Day!", img: "https://placehold.co/250x250/ff9ebd/white?text=Valentines", size: "big" }
];

let currentStoryIndex = 0;
let isAnimating = false;

// 1. Hero Story Functionality
function renderStory(index) {
    if (index >= storySteps.length) return;

    const step = storySteps[index];

    // Fade out
    storyText.classList.add('fade-out');
    storyImage.classList.add('fade-out');

    // Wait for full transition (800ms)
    setTimeout(() => {
        // Update content
        storyText.innerHTML = step.text;
        storyImage.src = step.img;

        // Reset classes
        storyText.className = 'story-text';
        if (step.size) storyText.classList.add(step.size);

        // Force reflow to ensure browser registers the change if needed
        void storyText.offsetWidth;

        // Fade in (remove fade-out, default opacity is 1)
        storyText.classList.remove('fade-out');
        storyImage.classList.remove('fade-out');
        storyText.classList.add('fade-in');
        storyImage.classList.add('fade-in');

        // Confetti for Big Step
        if (step.size === 'big') {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#ff4d6d', '#ff8fa3', '#fff']
            });
        }

        isAnimating = false;

        // Clean up fade classes
        setTimeout(() => {
            storyText.classList.remove('fade-in');
            storyImage.classList.remove('fade-in');
        }, 800);

    }, 800); // Wait full 800ms for fade out
}

// Initial Render
renderStory(0);

// Click interaction
heroSection.addEventListener('click', (e) => {
    // Don't trigger if clicking the button
    if (e.target === scrollBtn) return;

    if (isAnimating) return;

    if (currentStoryIndex < storySteps.length - 1) {
        isAnimating = true;
        currentStoryIndex++;
        renderStory(currentStoryIndex);
    } else if (currentStoryIndex === storySteps.length - 1) {
        // Show button if not already shown
        if (scrollBtn.classList.contains('hidden')) {
            scrollBtn.classList.remove('hidden');
            scrollBtn.classList.add('fade-in');
        }
    }
});

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

    // Trigger Big Fireworks
    launchFireworks();

    memories.forEach(mem => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${mem.img}" alt="Memory">
            <span>${mem.text}</span>
        `;
        memoriesList.appendChild(li);
    });
}

function launchFireworks() {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

initGame();
