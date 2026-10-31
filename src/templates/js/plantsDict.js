const _BIOMS = [
    'forest',    // 0
    'desert',    // 1
    'ocean',     // 2
    'snowy',     // 3
    'cave'       // 4
];

const _SOIL = [
    'loam',      // 0
    'sandish',   // 1
    'rocky',     // 2
    'gravel',    // 3
    'ice',       // 4
    'dripstone'  // 5
];



const _PLANTS = [
    // --- DRZEWA OWOCOWE ---
    {
        'id': 1,
        'name': 'Aeris apple', // Jabłka
        'dice': 6,
        'diceMultiplier': 3,
        'bonus': 3, // Średnio 13.5 - umiarkowana trudność
        'biomeNumber': 0, // forest
        'soilNumber': 0,  // loam
        'EXP': 20,
        'growthPlan': [{
            'phases': [4, 5, 6], // suma: 15 dni
            'watering': [2, 3, 2],
            'graphics': ['Tree-1.png', 'Tree-2.png', 'Tree-3.png', 'Tree-Apple.png']
        }]
    },
    {
        'id': 2,
        'name': 'Valori cherry', // Wiśnie
        'dice': 8,
        'diceMultiplier': 2,
        'bonus': 2,
        'biomeNumber': 0,
        'soilNumber': 0,
        'EXP': 25,
        'growthPlan': [{
            'phases': [3, 4, 5], // suma: 12 dni
            'watering': [1, 2, 2],
            'graphics': ['Tree-1.png', 'Tree-2.png', 'Tree-3.png', 'Tree-Cherry.png']
        }]
    },
    {
        'id': 3,
        'name': 'Pyrion pear', // Gruszki
        'dice': 6,
        'diceMultiplier': 3,
        'bonus': 2,
        'biomeNumber': 0,
        'soilNumber': 0,
        'EXP': 25,
        'growthPlan': [{
            'phases': [4, 6, 6], // suma: 16 dni
            'watering': [2, 3, 3],
            'graphics': ['Tree-1.png', 'Tree-2.png', 'Tree-3.png', 'Tree-Pear.png']
        }]
    },
    {
        'id': 4,
        'name': 'Lunar fig', // Figi (Trudniejsze)
        'dice': 10,
        'diceMultiplier': 2,
        'bonus': 1, // Wymaga szczęścia w rzutach (max 21, średnio 12)
        'biomeNumber': 1, // desert
        'soilNumber': 1,  // sandish
        'EXP': 45,
        'growthPlan': [{
            'phases': [5, 6, 7], // suma: 18 dni
            'watering': [1, 1, 2], // Małe zapotrzebowanie na wodę
            'graphics': ['Tree-1.png', 'Tree-2.png', 'Tree-3.png', 'Tree-Fig.png']
        }]
    },
    {
        'id': 5,
        'name': 'Silvare kiwi', // Kiwi
        'dice': 8,
        'diceMultiplier': 2,
        'bonus': 3,
        'biomeNumber': 0,
        'soilNumber': 0,
        'EXP': 35,
        'growthPlan': [{
            'phases': [5, 5, 5], // suma: 15 dni
            'watering': [3, 3, 3], // Duże zapotrzebowanie na wodę
            'graphics': ['Tree-1.png', 'Tree-2.png', 'Tree-3.png', 'Tree-Kiwi.png']
        }]
    },

    // --- KRZEWY / WARZYWA ---
    {
        'id': 6,
        'name': 'Midori tomato', // Pomidory (Łatwe)
        'dice': 4,
        'diceMultiplier': 4,
        'bonus': 4, // Bardzo stabilne (średnia 14)
        'biomeNumber': 0,
        'soilNumber': 0,
        'EXP': 15,
        'growthPlan': [{
            'phases': [3, 4, 4], // suma: 11 dni
            'watering': [2, 3, 2],
            'graphics': ['Plant-growing.png', 'Brake-1.png', 'Brake-2.png', 'Brake-Tomato.png']
        }]
    },
    {
        'id': 7,
        'name': 'Kiki corn', // Kukurydza
        'dice': 6,
        'diceMultiplier': 3,
        'bonus': 3,
        'biomeNumber': 0,
        'soilNumber': 0,
        'EXP': 20,
        'growthPlan': [{
            'phases': [4, 5, 5], // suma: 14 dni
            'watering': [2, 2, 2],
            'graphics': ['Plant-growing.png', 'Brake-1.png', 'Brake-2.png', 'Brake-Corn.png']
        }]
    },
    {
        'id': 8,
        'name': 'Azuri bean', // Fasola (Bardzo szybka i łatwa)
        'dice': 4,
        'diceMultiplier': 4,
        'bonus': 5, // Średnia 15, bardzo łatwo zdaje ST14
        'biomeNumber': 0,
        'soilNumber': 0,
        'EXP': 10, // Mało expa za coś tak banalnego
        'growthPlan': [{
            'phases': [2, 3, 3], // suma: 8 dni
            'watering': [1, 2, 1],
            'graphics': ['Plant-growing.png', 'Brake-1.png', 'Brake-2.png', 'Brake-Beans.png']
        }]
    },
    {
        'id': 9,
        'name': 'Rikka pepper', // Papryka
        'dice': 8,
        'diceMultiplier': 2,
        'bonus': 4,
        'biomeNumber': 0,
        'soilNumber': 0,
        'EXP': 20,
        'growthPlan': [{
            'phases': [3, 5, 4], // suma: 12 dni
            'watering': [2, 3, 2],
            'graphics': ['Plant-growing.png', 'Brake-1.png', 'Brake-2.png', 'Brake-Pepper.png']
        }]
    },
    {
        'id': 10,
        'name': 'Hekatka olives', // Oliwki (Najtrudniejsze, długie, wolne)
        'dice': 20, // Rzut d20, ogromna wariancja
        'diceMultiplier': 1,
        'bonus': 3,
        'biomeNumber': 1, // desert
        'soilNumber': 2,  // rocky
        'EXP': 55,
        'growthPlan': [{
            'phases': [6, 7, 7], // suma: 20 dni
            'watering': [1, 1, 1], // Prawie wcale nie pije
            'graphics': ['Plant-growing.png', 'Brake-1.png', 'Brake-2.png', 'Brake-Olives.png']
        }]
    },

    // --- POZOSTAŁE ---
    {
        'id': 11,
        'name': 'Nocturnus pumpkin', // Dynia
        'dice': 6,
        'diceMultiplier': 3,
        'bonus': 2,
        'biomeNumber': 0,
        'soilNumber': 0,
        'EXP': 30,
        'growthPlan': [{
            'phases': [10, 8], // suma: 18 dni (długo dojrzewa)
            'watering': [7, 3],
            'graphics': ['Planted-Seeds.png', 'Plant-growing.png','Plant-Pumpkin.png']
        }]
    },
    {
        'id': 12,
        'name': 'Vius carrot', // Marchew
        'dice': 6,
        'diceMultiplier': 3,
        'bonus': 4,
        'biomeNumber': 0,
        'soilNumber': 1, // sandish (marchew lubi luźną glebę)
        'EXP': 15,
        'growthPlan': [{
            'phases': [6, 4], // suma: 10 dni
            'watering': [3, 2],
            'graphics': ['Planted-Seeds.png', 'Plant-growing.png','Plant-Carrot.png']
        }]
    },
    {
        'id': 13,
        'name': 'Vorid mushrooms', // Grzyby
        'dice': 4,
        'diceMultiplier': 3,
        'bonus': 3,
        'biomeNumber': 4, // cave (jaskinia)
        'soilNumber': 5,  // dripstone
        'EXP': 25,
        'growthPlan': [{
            'phases': [2, 3], // suma: 7 dni (rosną szybko)
            'watering': [2, 4], // Ale muszą mieć bardzo wilgotno
            'graphics': ['Planted-Seeds.png', 'Mushroom-1.png','Mushroom-2.png']
        }]
    },

    // --- POZOSTAŁE 2 ---
    {
        'id': 14,
        'name': 'Sugar fruit', // Granat (Wymagający)
        'dice': 10,
        'diceMultiplier': 2,
        'bonus': 0,
        'biomeNumber': 1, // desert
        'soilNumber': 1,  // sandish
        'EXP': 45,
        'growthPlan': [{
            'phases': [5, 6, 6], // suma: 17 dni
            'watering': [2, 2, 1],
            'graphics': ['Plant-growing.png', 'Bush-1.png','Bush-2.png', 'Bush-Sugar.png']
        }]
    },
    {
        'id': 15,
        'name': 'Dragon blueberry', // Jagoda (Zimowa/leśna opcja)
        'dice': 6,
        'diceMultiplier': 3,
        'bonus': 2,
        'biomeNumber': 3, // snowy (można zmienić na 0 - forest)
        'soilNumber': 0,  // loam
        'EXP': 25,
        'growthPlan': [{
            'phases': [4, 4, 4], // suma: 12 dni
            'watering': [2, 2, 2],
            'graphics': ['Plant-growing.png', 'Bush-1.png','Bush-2.png', 'Bush-Berries.png']
        }]
    },
    {
        'id': 16,
        'name': 'Arome plum', // Śliwka
        'dice': 8,
        'diceMultiplier': 2,
        'bonus': 3,
        'biomeNumber': 0,
        'soilNumber': 0,
        'EXP': 25,
        'growthPlan': [{
            'phases': [4, 5, 5], // suma: 14 dni
            'watering': [2, 2, 2],
            'graphics': ['Plant-growing.png', 'Bush-1.png','Bush-2.png', 'Bush-Plum.png']
        }]
    }
];

/*
Lista owoców i warzyw
Drzewa owocowe:
Jabłka Aeris
Wiśnie Valori
Gruszki Pyrion
Figi lunarne
Kiwi Silvare

Krzewy warzywne:
Pomidory Midori
Kolby Kiki (kukurydza)
Fasola Azuri
Papryka Rikka
Oliwki Hekatki

Warzywa ziemne:
Dynia Nocturnus
Marchew Vius
Grzyby Vorid

Krzewy owocowe:
Owoce cukrowe
Smocze jagody
Śliwki Arome

*/

/**
        'id': 0,
        'name': '',
        'dice': 0,
        'diceMultiplier': 0,
        'biomeNumber': 0,
        'soilNumber': 0,
        'EXP': 0,
        'growthPlan': [
            {
                'phases': [0,1,2],
                'watering': [0,1,2],
            }
        ],
 * 
 */