const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1300;
canvas.height = 600;

const cardWidth = 140;
const cardHeight = 200;
const spacing = 20;

// Wszystkie karty w grze (baza)
const allCards = [
    { title: 'Kilof', cost: 1, attack: 6, defense: 0, status: 'brak', imgSrc: '../images/minigame/cards/kilof.png' },
    { title: 'Łopata', cost: 1, attack: 4, defense: 3, status: 'brak', imgSrc: '../images/minigame/cards/lopata.png' },
    { title: 'Młot', cost: 2, attack: 10, defense: 0, status: 'odrzucenie', imgSrc: '../images/minigame/cards/mlot.png' },
    { title: 'Miecz', cost: 3, attack: 12, defense: 0, status: 'brak', imgSrc: '../images/minigame/cards/miecz.png' },
    { title: 'Tarcza', cost: 2, attack: 0, defense: 2, status: 'brak', imgSrc: '../images/minigame/cards/tarcza.png' },
    { title: 'Łuk', cost: 2, attack: 7, defense: 1, status: 'brak', imgSrc: '../images/minigame/cards/luk.png' },
    { title: 'Topór', cost: 3, attack: 9, defense: 0, status: 'brak', imgSrc: '../images/minigame/cards/topor.png' },
    { title: 'Buława', cost: 4, attack: 11, defense: 0, status: 'brak', imgSrc: '../images/minigame/cards/bulawa.png' },
    { title: 'Widły', cost: 2, attack: 5, defense: 0, status: 'brak', imgSrc: '../images/minigame/cards/widly.png' },
    { title: 'Kij Bo', cost: 1, attack: 2, defense: 1, status: 'brak', imgSrc: '../images/minigame/cards/kijbo.png' }
];

// Talia gracza w tej walce (Draw Pile)
let cards = [
    { title: 'Kilof', cost: 1, attack: 6, defense: 0, status: 'brak', imgSrc: '../images/minigame/cards/kilof.png' },
    { title: 'Łopata', cost: 1, attack: 4, defense: 3, status: 'brak', imgSrc: '../images/minigame/cards/lopata.png' },
    { title: 'Młot', cost: 2, attack: 10, defense: 0, status: 'odrzucenie', imgSrc: '../images/minigame/cards/mlot.png' },
    { title: 'Tarcza', cost: 2, attack: 0, defense: 2, status: 'brak', imgSrc: '../images/minigame/cards/tarcza.png' }
];

// Ręka gracza (karty dostępne na ekranie w turze)
let availableCards = [];

// Stos odrzuconych kart (Discard Pile)
let discardPile = [];

// Pomocnicza funkcja inicjalizująca obrazek dla karty
function initCardImage(card) {
    card.img = new Image();
    card.img.src = card.imgSrc;
    card.isLoaded = false;
    card.img.onload = () => {
        card.isLoaded = true;
    };
}

// Inicjalizacja obrazków dla talii startowej
cards.forEach(initCardImage);

// Funkcja kończąca turę: czyści rękę, dobiera określoną liczbę kart z talii (cards)
function endTurnAndDraw(amount = 3) {
    availableCards = []; // Czyszczenie aktualnej ręki
    if (cards.length === 0) {
        cards = discardPile;
        discardPile = [];
    }
    for (let i = 0; i < amount; i++) {
        if (cards.length === 0) break;
        
        const randomIndex = Math.floor(Math.random() * cards.length);
        const drawnCard = cards.splice(randomIndex, 1)[0];

        // Sprawdzamy czy obrazek jest już załadowany (cache), żeby uniknąć mignięcia na biało
        if (drawnCard.img.complete) {
            drawnCard.isLoaded = true;
        }

        drawnCard.x = canvas.width + 200;
        drawnCard.y = canvas.height + 100;

        availableCards.push(drawnCard);
    }

    updateCardPositions();
}

// Przeliczanie pozycji wachlarza na ekranie dla kart na ręce
function updateCardPositions() {
    const totalWidth = (availableCards.length * cardWidth) + ((availableCards.length - 1) * spacing);
    const startX = (canvas.width - totalWidth) / 2;
    const startY = canvas.height - cardHeight - 50;

    availableCards.forEach((card, index) => {
        card.targetX = startX + index * (cardWidth + spacing);
        card.targetY = startY;
    });
}

// Usunięcie karty z ręki
function removeCard(index) {
    if (index >= 0 && index < availableCards.length) {
        const removedCard = availableCards.splice(index, 1)[0];
        discardPile.push(removedCard);
        updateCardPositions();
    }
}

// Dodanie nowej karty z ogólnej bazy (allCards) do talii gracza w walce (cards)
function addCardToDeck(min = 0, max = allCards.length - 1) {
    const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    const template = allCards[randomIndex];
    const newCard = { ...template };
    
    initCardImage(newCard);
    cards.push(newCard);
    console.log(`Dodano kartę ${newCard.title} do talii!`);
}

function addCard(min = 0, max = allCards.length - 1) {
    // Zabezpieczenie przed przekroczeniem limitu np. 5 kart na ręce
    if (availableCards.length >= 5) {
        console.log("Masz już maksymalnie 5 kart na ręce!");
        return;
    }
    const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    const template = allCards[randomIndex];
    
    // Tworzymy osobną kopię obiektu, żeby nie modyfikować oryginału w bazie
    const newCard = { ...template };
    initCardImage(newCard); // Używamy Twojej gotowej funkcji pomocniczej do obrazka

    // Pozycja startowa (z talii w prawym rogu)
    newCard.x = canvas.width + 200;
    newCard.y = canvas.height + 100;
    availableCards.push(newCard);

    updateCardPositions();
}

// Główna pętla renderująca (rysuje karty z ręki - availableCards)
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    availableCards.forEach(card => {
        if (card.x === undefined) card.x = card.targetX;
        if (card.y === undefined) card.y = card.targetY;
        card.x += (card.targetX - card.x) * 0.1;
        card.y += (card.targetY - card.y) * 0.1;

        // 1. Cień karty
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(card.x + 6, card.y + 6, cardWidth, cardHeight);

        // 2. Grafika karty
        if (card.isLoaded) {
            ctx.drawImage(card.img, card.x, card.y, cardWidth, cardHeight);
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(card.x, card.y, cardWidth, cardHeight);
        }

        // 3. Obramowanie karty
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.strokeRect(card.x, card.y, cardWidth, cardHeight);
    });

    requestAnimationFrame(draw);
}

// Podpięcie przycisków interfejsu
document.getElementById('btn-draw')?.addEventListener('click', () => {
    endTurnAndDraw(3); // Kliknięcie "Tura" dobiera 3 karty na rękę
});

document.getElementById('btn-add')?.addEventListener('click', () => {
    addCard(); // Dodaje nową kartę z bazy do talii
});

document.getElementById('btn-rmc')?.addEventListener('click', () => {
    if (availableCards.length > 0) {
        removeCard(availableCards.length - 1);
    }
});

document.getElementById('btn-end-turn')?.addEventListener('click', () => {
    while (availableCards.length > 0) {
        const card = availableCards.pop();
        discardPile.push(card);
    }
    updateCardPositions(); // Aktualizujemy pozycje (choć ręka jest pusta, dba to o czystość stanu)
});
draw();