const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1500;
canvas.height = 700;

const cardWidth = 180;
const cardHeight = 240;
const spacing = 20;
selectedCardIndex = null;
let enemies = [];
const enemyWidth = 200;
const enemyHeight = 300;
let isGameOver = false;

// Statystyki gracza
let player = {
    hp: 20,
    maxHp: 20,
    energia: 5,
    maxEnergia: 5,
    block: 0,
    statusy: [],   
    złoto: 0,
    przedmioty: [] 
};

// Template potworów (baza)
const allEnemies = [
    {
        nazwa: 'Dzika trawa',
        hp: 10,
        maxHp: 10,
        block: 0,
        imgSrc: '../images/minigame/enemies/dzika_trawa.png',
        nagrodaMin: 5,
        nagrodaMax: 15,
        kolejkaAtakow: ['atak_slaby', 'atak_slaby', 'atak_slaby'], 
        currentIntentIndex: 0,
        statusy: [],
        przedmioty: [] 
    },
    {
        nazwa: 'Żuk Truskawnik',
        hp: 12,
        maxHp: 12,
        block: 0,
        imgSrc: '../images/minigame/enemies/zuk.png',
        nagrodaMin: 5,
        nagrodaMax: 15,
        kolejkaAtakow: ['atak_slaby', 'obrona', 'atak_slaby'], 
        currentIntentIndex: 0,
        statusy: [],
        przedmioty: []
    },
    {
        nazwa: 'Żywy Miut',
        hp: 20,
        maxHp: 20,
        block: 1,
        imgSrc: '../images/minigame/enemies/miut.png',
        nagrodaMin: 10,
        nagrodaMax: 20,
        kolejkaAtakow: ['ladowanie', 'ladowanie', 'atak_mocny_2'], 
        currentIntentIndex: 0,
        statusy: [],
        przedmioty: []
    },
    {
        nazwa: 'Grzib Mocy',
        hp: 8,
        maxHp: 8,
        block: 0,
        imgSrc: '../images/minigame/enemies/grzib.png',
        nagrodaMin: 20,
        nagrodaMax: 30,
        kolejkaAtakow: ['atak_slaby', 'atak_mocny', 'atak_slaby'], 
        currentIntentIndex: 0,
        statusy: [],
        przedmioty: []
    }
];

// Template ataków potworów (baza)
const allAttacks = {
    'atak_slaby': { damage: 2, description: 'Słaby atak', statusEffect: null },
    'atak_mocny': { damage: 4, description: 'Mocny atak', statusEffect: null },
    'atak_mocny_2': { damage: 8, description: 'Bardzo mocny atak', statusEffect: null },
    'obrona': { damage: 0, description: 'Obrona', statusEffect: null },
    'ladowanie': { damage: 0, description: 'Ładowanie', statusEffect: null },
    'atak_ze_status': { damage: 3, description: 'Atak z efektem statusu', statusEffect: 'bleed' }
};

// Wszystkie karty w grze (baza)
const allCards = [
    { title: 'Kilof', cost: 2, attack: 2, defense: 0, status: 'brak', imgSrc: '../images/minigame/cards/kilof.png' },
    { title: 'Łopata', cost: 2, attack: 2, defense: 0, status: 'confuse', imgSrc: '../images/minigame/cards/lopata.png' },
    { title: 'Młot', cost: 3, attack: 4, defense: 0, status: 'brak', imgSrc: '../images/minigame/cards/mlot.png' },
    { title: 'Miecz', cost: 4, attack: 4, defense: 0, status: 'bleed', imgSrc: '../images/minigame/cards/miecz.png' },
    { title: 'Tarcza', cost: 1, attack: 0, defense: 2, status: 'brak', imgSrc: '../images/minigame/cards/tarcza.png' },
    { title: 'Łuk', cost: 3, attack: 2, defense: 0, status: 'blind', imgSrc: '../images/minigame/cards/luk.png' },
    { title: 'Topór', cost: 2, attack: 3, defense: 0, status: 'brak', imgSrc: '../images/minigame/cards/topor.png' },
    { title: 'Buława', cost: 3, attack: 2, defense: 0, status: 'stun', imgSrc: '../images/minigame/cards/bulawa.png' },
    { title: 'Widły', cost: 1, attack: 1, defense: 0, status: 'draw', imgSrc: '../images/minigame/cards/widly.png' },
    { title: 'Kij Bo', cost: 1, attack: 1, defense: 1, status: 'brak', imgSrc: '../images/minigame/cards/kijbo.png' }
];

// Talia gracza w tej walce (Draw Pile)
let cards = [
    { title: 'Kilof', cost: 2, attack: 2, defense: 0, status: 'brak', imgSrc: '../images/minigame/cards/kilof.png' },
    { title: 'Łopata', cost: 2, attack: 2, defense: 0, status: 'confuse', imgSrc: '../images/minigame/cards/lopata.png' },
    { title: 'Młot', cost: 3, attack: 4, defense: 0, status: 'brak', imgSrc: '../images/minigame/cards/mlot.png' },
    { title: 'Tarcza', cost: 1, attack: 0, defense: 2, status: 'brak', imgSrc: '../images/minigame/cards/tarcza.png' }
];

// Ręka gracza (karty dostępne na ekranie w turze)
let availableCards = [];

// Stos odrzuconych kart 
let discardPile = [];

// Funkcja inicjalizująca obrazek dla karty
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

// Nakładanie statusów zgodnie
function applyStatus(target, statusType) {
    if (!statusType || statusType === 'brak') return;
    if (!target.statusy) target.statusy = [];

    if (statusType === 'bleed') {
        // Stakuje się, trwa 1 turę (zadaje np. 2 obrażenia od każdego stacka)
        target.statusy.push({ type: 'bleed', damage: 2, duration: 1 });
        console.log(`Nałożono BLEED na ${target.nazwa || 'Gracza'}!`);
    } else if (statusType === 'confuse') {
        // Nie stakuje się, trwa 2 rundy (odświeża czas jeśli już jest)
        const existing = target.statusy.find(s => s.type === 'confuse');
        if (existing) {
            existing.duration = 2;
        } else {
            target.statusy.push({ type: 'confuse', duration: 2 });
        }
        console.log(`Nałożono CONFUSE na ${target.nazwa || 'Gracza'}!`);
    } else if (statusType === 'blind') {
        // Nie stakuje się, trwa 1 turę
        const existing = target.statusy.find(s => s.type === 'blind');
        if (existing) {
            existing.duration = 1;
        } else {
            target.statusy.push({ type: 'blind', duration: 1 });
        }
        console.log(`Nałożono BLIND na ${target.nazwa || 'Gracza'}!`);
    } else if (statusType === 'stun') {
        // Nie stakuje się, trwa 1 turę
        const existing = target.statusy.find(s => s.type === 'stun');
        if (existing) {
            existing.duration = 1;
        } else {
            target.statusy.push({ type: 'stun', duration: 1 });
        }
        console.log(`Nałożono STUN na ${target.nazwa || 'Gracza'}!`);
    }
}

// Pomocnicza funkcja do dobierania określonej liczby kart na rękę 
function drawCards(amount = 1) {
    for (let i = 0; i < amount; i++) {
        if (availableCards.length >= 5) {
            console.log("Ręka pełna (max 5 kart)!");
            break;
        }
        if (cards.length === 0) {
            if (discardPile.length === 0) break; // Brak jakichkolwiek kart
            cards = discardPile;
            discardPile = [];
        }

        const randomIndex = Math.floor(Math.random() * cards.length);
        const drawnCard = cards.splice(randomIndex, 1)[0];

        if (drawnCard.img.complete) {
            drawnCard.isLoaded = true;
        }

        drawnCard.x = canvas.width + 200;
        drawnCard.y = canvas.height + 100;

        availableCards.push(drawnCard);
    }
    updateCardPositions();
}

// Funkcja kończąca turę: czyści rękę, dobiera określoną liczbę kart z talii (cards)
function endTurnAndDraw(amount = 3) {
    availableCards = []; // Czyszczenie aktualnej ręki
    drawCards(amount); 
}

function nextTurn() {
    console.log("--- Gracz kończy turę ---");
    while (availableCards.length > 0) {
        const card = availableCards.pop();
        discardPile.push(card);
    }
    updateCardPositions();
    executeEnemyTurn();
}

// Logika tury przeciwników ze wszystkimi statusami
function executeEnemyTurn() {
    console.log("--- Tura przeciwników się rozpoczyna ---");
    let enemyIndex = 0;

    function processNextEnemy() {
        if (enemyIndex >= enemies.length) {
            finishEnemyTurnAndStartPlayer();
            return;
        }

        const enemy = enemies[enemyIndex];

        // Krwawienie przed ruchem
        if (enemy.statusy && enemy.statusy.length > 0) {
            enemy.statusy.forEach(status => {
                if (status.type === 'bleed') {
                    enemy.hp -= status.damage;
                    console.log(`${enemy.nazwa} otrzymuje ${status.damage} obrażeń od Krwawienia! (HP: ${enemy.hp})`);
                    status.duration--; // Bleed trwa 1 turę, więc po zadaniu obrażeń się zużywa
                }
            });
            // Usuwamy zużyte stacki krwawienia
            enemy.statusy = enemy.statusy.filter(s => s.duration > 0);
        }

        // Sprawdzenie, czy wróg zginął od efektów statusu przed wykonaniem ruchu
        if (enemy.hp <= 0) {
            console.log(`${enemy.nazwa} ginie od efektów statusu przed wykonaniem ruchu!`);
            enemies.splice(enemyIndex, 1);
            updateEnemyPositions();
            setTimeout(processNextEnemy, 400);
            return;
        }

        // Ogłuszenie przed ruchem (pomija turę)
        const isStunned = enemy.statusy.some(s => s.type === 'stun');
        if (isStunned) {
            console.log(`${enemy.nazwa} jest OGŁUSZONY (Stun) i pomija swoją turę!`);
            // Zmniejszamy czas trwania stuna
            enemy.statusy.forEach(s => { if (s.type === 'stun') s.duration--; });
            enemy.statusy = enemy.statusy.filter(s => s.duration > 0);

            enemyIndex++;
            setTimeout(processNextEnemy, 500);
            return;
        }

        // Pobieranie akcji wroga z jego kolejki ataków
        const attackKey = enemy.kolejkaAtakow[enemy.currentIntentIndex];
        const attackData = allAttacks[attackKey];
        
        // Sprawdzamy pozostałe statusy aktywne na ten ruch
        const isBlinded = enemy.statusy.some(s => s.type === 'blind');
        const isConfused = enemy.statusy.some(s => s.type === 'confuse');

        // Oślepienie
        if (isBlinded && attackData.damage > 0) {
            console.log(`${enemy.nazwa} jest oślepiony i pudłuje!`);
            // Lekki ruch na boki żeby pokazać pudło
            enemy.animOffsetX = -15;
            setTimeout(() => { enemy.animOffsetX = 0; }, 500);
        } else {
            // Animacja normalnej akcji
            if (attackKey.includes('atak')) {
                enemy.animOffsetY = 25;
                setTimeout(() => { enemy.animOffsetY = 0; }, 900);
            } else if (attackKey === 'obrona') {
                enemy.animOffsetX = 15;
                setTimeout(() => { enemy.animOffsetX = 0; }, 900);
            } else if (attackKey === 'ladowanie') {
                enemy.animOffsetX = 0;
                enemy.animOffsetY = 0;
            }

            // Rozstrzygnięcie akcji
            if (attackData.damage > 0) {
                let target = player; // Domyślnie bije gracza

                // Dezorientacja
                if (isConfused) {
                    const allCombatants = [player, ...enemies];
                    target = allCombatants[Math.floor(Math.random() * allCombatants.length)];
                    console.log(`😵 ${enemy.nazwa} jest ZDEZORIENTOWANY i atakuje: ${target === player ? 'GRACZA' : target.nazwa}!`);
                }

                let finalDamage = attackData.damage;

                // Obsługa pancerza celu (działa i dla gracza, i dla wrogów)
                if (target.block > 0) {
                    if (target.block >= finalDamage) {
                        target.block -= finalDamage;
                        finalDamage = 0;
                        console.log(`Pancerz pochłonął obrażenia! Pozostały blok: ${target.block}`);
                    } else {
                        finalDamage -= target.block;
                        target.block = 0;
                        console.log(`Pancerz zniszczony! Obrażenia w HP: ${finalDamage}`);
                    }
                }

                if (finalDamage > 0) {
                    target.hp -= finalDamage;
                    if (target === player) {
                        console.log(`Gracz traci ${finalDamage} HP! Aktualne HP: ${player.hp} / ${player.maxHp}`);
                        if (player.hp <= 0) {
                            player.hp = 0;
                            console.log("=== KONIEC GRY (GAME OVER) ===");
                            isGameOver = true;
                        }
                    } else {
                        console.log(`${target.nazwa} traci ${finalDamage} HP od bratobójczego ognia! (HP: ${target.hp})`);
                        // Jeśli zdezorientowany wróg zabił siebie lub innego wroga:
                        if (target.hp <= 0) {
                            console.log(`${target.nazwa} został pokonany w wyniku dezorientacji!`);
                            const killedIdx = enemies.indexOf(target);
                            if (killedIdx !== -1) {
                                enemies.splice(killedIdx, 1);
                                updateEnemyPositions();
                                // Korekta indeksu pętli, żeby nie pominąć kolejnego wroga po przesunięciu tablicy
                                if (killedIdx <= enemyIndex) {
                                    enemyIndex--;
                                }
                            }
                        }
                    }
                }

                // Nałożenie statusu z ataku wroga (jeśli cel przeżył)
                if (attackData.statusEffect && target.hp > 0) {
                    applyStatus(target, attackData.statusEffect);
                }

            } else if (attackKey === 'obrona') {
                enemy.block = (enemy.block || 0) + 5;
                console.log(`${enemy.nazwa} zyskał 5 pancerza!`);
            }
        }

        // 5. ZMNIEJSZENIE CZASU TRWANIA STATUSÓW NA KONIEC RUCHU WROGA (blind, confuse)
        if (enemy.statusy && enemy.statusy.length > 0) {
            enemy.statusy.forEach(s => {
                if (s.type === 'blind' || s.type === 'confuse') {
                    s.duration--;
                }
            });
            enemy.statusy = enemy.statusy.filter(s => s.duration > 0);
        }

        // Przesunięcie kolejki intencji (tylko jeśli wróg nie zabił sam siebie przez confuse)
        if (enemies.includes(enemy)) {
            enemy.currentIntentIndex = (enemy.currentIntentIndex + 1) % enemy.kolejkaAtakow.length;
        }

        enemyIndex++;
        setTimeout(processNextEnemy, 500);
    }

    processNextEnemy();
}

// Start tury gracza + obsługa jego statusów
function finishEnemyTurnAndStartPlayer() {
    if (isGameOver) return;
    console.log("--- Tura przeciwników zakończona. Zaczyna się tura gracza ---");

    // Obsługa statusów na graczu (np. bleed nałożony przez potwora)
    if (player.statusy && player.statusy.length > 0) {
        player.statusy.forEach(status => {
            if (status.type === 'bleed') {
                player.hp -= status.damage;
                console.log(`Gracz otrzymuje ${status.damage} obrażeń od Krwawienia!`);
                status.duration--;
            }
        });
        player.statusy = player.statusy.filter(s => s.duration > 0);

        if (player.hp <= 0) {
            player.hp = 0;
            isGameOver = true;
            return;
        }
    }

    // Reset pancerza gracza na start nowej tury
    player.block = 0;
    // Odnowienie energii gracza
    player.energia = player.maxEnergia;
    // Dobranie nowej ręki kart
    endTurnAndDraw(3);
}

// Przeliczanie pozycji na ekranie dla kart na ręce
function updateCardPositions() {
    const totalWidth = (availableCards.length * cardWidth) + ((availableCards.length - 1) * spacing);
    const startX = (canvas.width - totalWidth) / 2;
    const baseStartY = canvas.height - cardHeight - 50;

    availableCards.forEach((card, index) => {
        card.targetX = startX + index * (cardWidth + spacing); 
        if (index === selectedCardIndex) {
            card.targetY = baseStartY - 30;
        } else {
            card.targetY = baseStartY;
        }
    });
}

function updateEnemyPositions() {
    const slotsX = [650, 250, 1050];
    enemies.forEach((enemy, index) => {
        if (index < slotsX.length) {
            enemy.targetX = slotsX[index];
        }
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
    if (availableCards.length >= 5) {
        console.log("Masz już maksymalnie 5 kart na ręce!");
        return;
    }
    const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    const template = allCards[randomIndex];
    
    const newCard = { ...template };
    initCardImage(newCard);

    newCard.x = canvas.width + 200;
    newCard.y = canvas.height + 100;
    availableCards.push(newCard);

    updateCardPositions();
}

function spawnEnemy(index) {
    if (enemies.length >= 3) {
        console.log("Może być maksymalnie 3 przeciwników!");
        return;
    }

    const template = allEnemies[index];
    const newEnemy = { ...template, statusy: [] }; 
    
    newEnemy.img = new Image();
    newEnemy.img.src = newEnemy.imgSrc;
    newEnemy.isLoaded = false;
    newEnemy.img.onload = () => {
        newEnemy.isLoaded = true;
    };
    const slotsX = [650, 250, 1050];

    const currentCount = enemies.length;
    newEnemy.targetX = slotsX[currentCount];
    newEnemy.targetY = 80;

    newEnemy.x = newEnemy.targetX;
    newEnemy.y = -350;
    enemies.push(newEnemy);

    updateEnemyPositions();
}

function isInside(x, y, rectX, rectY, rectW, rectH) {
    return x >= rectX && x <= rectX + rectW && y >= rectY && y <= rectY + rectH;
}

// Zagrywanie karty z obsługą efektów statusu
function playCardToEnemy(cardIndex, enemyIndex) {
    const card = availableCards[cardIndex];
    const targetEnemy = enemies[enemyIndex];

    // Sprawdzenie energii gracza
    if (player.energia < card.cost) {
        console.log("Za mało energii!");
        return;
    }

    // Opłacenie kosztu
    player.energia -= card.cost;

    // Najpierw usuwamy zagraną kartę z ręki (ważne, jeśli karta ma efekt 'draw', żeby zrobić miejsce)
    availableCards.splice(cardIndex, 1);
    discardPile.push(card);
    selectedCardIndex = null;

    // Atak
    if (card.attack > 0) {
        targetEnemy.hp -= card.attack;
        console.log(`Zadano ${card.attack} obrażeń dla ${targetEnemy.nazwa}!`);
    }

    // Tarcza
    if (card.defense > 0) {
        player.block += card.defense;
        console.log(`Gracz zyskał ${card.defense} punktów tarczy! (Razem: ${player.block})`);
    }

    // Obsługa statusów z karty
    if (card.status && card.status !== 'brak') {
        if (card.status === 'draw') {
            console.log("Efekt karty: Dobierz 1 kartę!");
            drawCards(1);
        } else if (targetEnemy.hp > 0) {
            // Nakładamy status na wroga (tylko jeśli przeżył atak)
            applyStatus(targetEnemy, card.status);
        }
    }

    // Sprawdzenie czy wróg zginął
    if (targetEnemy.hp <= 0) {
        console.log(`${targetEnemy.nazwa} został pokonany!`);
        enemies.splice(enemyIndex, 1);
        updateEnemyPositions();
    }

    updateCardPositions();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    enemies.forEach(enemy => {
        if (enemy.x === undefined) enemy.x = enemy.targetX;
        if (enemy.y === undefined) enemy.y = enemy.targetY;
        enemy.x += (enemy.targetX - enemy.x) * 0.1;
        enemy.y += (enemy.targetY - enemy.y) * 0.1;

        if (enemy.animOffsetX === undefined) enemy.animOffsetX = 0;
        if (enemy.animOffsetY === undefined) enemy.animOffsetY = 0;
        
        enemy.animOffsetX += (0 - enemy.animOffsetX) * 0.2;
        enemy.animOffsetY += (0 - enemy.animOffsetY) * 0.2;

        const renderX = enemy.x + enemy.animOffsetX;
        const renderY = enemy.y + enemy.animOffsetY;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(renderX + 6, renderY + 6, enemyWidth, enemyHeight);

        if (enemy.isLoaded || enemy.img.complete) {
            ctx.drawImage(enemy.img, renderX, renderY, enemyWidth, enemyHeight);
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(renderX, renderY, enemyWidth, enemyHeight);
        }

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.strokeRect(renderX, renderY, enemyWidth, enemyHeight);

        ctx.fillStyle = '#ffffff';
        ctx.font = '18px Segoe UI';
        ctx.fillText(enemy.nazwa, renderX, renderY - 30);
        ctx.fillText(`HP: ${enemy.hp} / ${enemy.maxHp} ${enemy.block > 0 ? `(🛡️${enemy.block})` : ''}`, renderX, renderY - 10);

        // Rysowanie aktywnych statusów pod wrogiem
        if (enemy.statusy && enemy.statusy.length > 0) {
            const statusText = enemy.statusy.map(s => `${s.type.toUpperCase()}(${s.duration})`).join(', ');
            ctx.fillStyle = '#ffeb3b';
            ctx.font = 'bold 14px Segoe UI';
            ctx.fillText(statusText, renderX, renderY + enemyHeight + 20);
        }
    });

    availableCards.forEach(card => {
        if (card.x === undefined) card.x = card.targetX;
        if (card.y === undefined) card.y = card.targetY;
        card.x += (card.targetX - card.x) * 0.1;
        card.y += (card.targetY - card.y) * 0.1;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(card.x + 6, card.y + 6, cardWidth, cardHeight);

        if (card.isLoaded) {
            ctx.drawImage(card.img, card.x, card.y, cardWidth, cardHeight);
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(card.x, card.y, cardWidth, cardHeight);
        }

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.strokeRect(card.x, card.y, cardWidth, cardHeight);
    });

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(50, 450, 260, 150); 

    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 450, 260, 150);

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Segoe UI';
    ctx.fillText(`Gracz HP: ${player.hp} / ${player.maxHp}`, 70, 485);
    ctx.fillText(`Energia:  ${player.energia} / ${player.maxEnergia}`, 70, 520);
    ctx.fillText(`Pancerz: ${player.block}`, 70, 555);

    // Rysowanie statusów gracza
    if (player.statusy && player.statusy.length > 0) {
        const pStatusText = player.statusy.map(s => `${s.type.toUpperCase()}(${s.duration})`).join(', ');
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 14px Segoe UI';
        ctx.fillText(`Statusy: ${pStatusText}`, 70, 585);
    }

    if (isGameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ff4d4d';
        ctx.font = 'bold 50px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText("KONIEC GRY", canvas.width / 2, canvas.height / 2 - 60);

        ctx.fillStyle = '#ffffff';
        ctx.font = '22px Segoe UI';
        ctx.fillText("Twoje nasiona zostały zniszczone w starciu...", canvas.width / 2, canvas.height / 2 - 10);

        const btnX = canvas.width / 2 - 100;
        const btnY = 400;
        const btnW = 200;
        const btnH = 60;

        ctx.fillStyle = '#2e7d32';
        ctx.fillRect(btnX, btnY, btnW, btnH);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(btnX, btnY, btnW, btnH);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Segoe UI';
        ctx.fillText("RESTART", canvas.width / 2, btnY + 38);

        ctx.textAlign = 'left';
    }

    requestAnimationFrame(draw);
}

function restartGame() {
    player.hp = player.maxHp;
    player.energia = player.maxEnergia;
    player.block = 0;
    player.statusy = [];
    
    enemies = [];
    availableCards = [];
    discardPile = [];
    
    cards = [
        { title: 'Kilof', cost: 2, attack: 2, defense: 0, status: 'brak', imgSrc: '../images/minigame/cards/kilof.png' },
        { title: 'Łopata', cost: 2, attack: 2, defense: 0, status: 'confuse', imgSrc: '../images/minigame/cards/lopata.png' },
        { title: 'Młot', cost: 3, attack: 4, defense: 0, status: 'brak', imgSrc: '../images/minigame/cards/mlot.png' },
        { title: 'Tarcza', cost: 1, attack: 0, defense: 2, status: 'brak', imgSrc: '../images/minigame/cards/tarcza.png' }
    ];
    cards.forEach(initCardImage);

    isGameOver = false;
    
    spawnEnemy(0);
    endTurnAndDraw(3);
    console.log("Gra zrestartowana!");
}

// Obsługa kliknięć na canvasie
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isGameOver) {
        if (isInside(mouseX, mouseY, canvas.width / 2 - 100, 400, 200, 60)) {
            restartGame();
        }
        return;
    }

    let clickedCardIndex = -1;
    for (let i = availableCards.length - 1; i >= 0; i--) {
        const card = availableCards[i];
        if (isInside(mouseX, mouseY, card.x, card.y, cardWidth, cardHeight)) {
            clickedCardIndex = i;
            break;
        }
    }

    if (clickedCardIndex !== -1) {
        if (selectedCardIndex === clickedCardIndex) {
            selectedCardIndex = null;
        } else {
            selectedCardIndex = clickedCardIndex;
        }
        updateCardPositions();
        return;
    }

    if (selectedCardIndex !== null) {
        let clickedEnemyIndex = -1;
        
        enemies.forEach((enemy, index) => {
            if (isInside(mouseX, mouseY, enemy.x, enemy.y, enemyWidth, enemyHeight)) {
                clickedEnemyIndex = index;
            }
        });

        if (clickedEnemyIndex !== -1) {
            playCardToEnemy(selectedCardIndex, clickedEnemyIndex);
        }
    }
});

// Podpięcie przycisków interfejsu - Testy
document.getElementById('btn-draw')?.addEventListener('click', () => {
    nextTurn();
});

document.getElementById('btn-add')?.addEventListener('click', () => {
    addCard();
});

document.getElementById('btn-rmc')?.addEventListener('click', () => {
    if (availableCards.length > 0) {
        if(selectedCardIndex !== null && selectedCardIndex >= 0 && selectedCardIndex < availableCards.length) {
            removeCard(selectedCardIndex);
            selectedCardIndex = null;
        }
        else {
            removeCard(availableCards.length - 1);
        }
    }
});

document.getElementById('btn-end-turn')?.addEventListener('click', () => {
    nextTurn();
});

document.getElementById('btn-add-enemy')?.addEventListener('click', () => {
    rnd = Math.floor(Math.random() * allEnemies.length);
    spawnEnemy(rnd);
});

document.getElementById('btn-heal')?.addEventListener('click', () => {
   player.hp = 20;
});

draw();