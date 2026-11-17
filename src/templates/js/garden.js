const regularActions = `<button id="waterBtn" onclick="waterPlant()" class="blueBtn">Water</button><button id="careBtn" onclick="carePlant()" class="redBtn">Care</button>`;
const harvestActions = `<button id="harvestBtn" onclick="harvestPlant()" class="greenBtn">Harvest</button>`;
const deadActions = `<button id="deadBtn" onclick="deadPlant()" class="blackBtn">Remove</button>`;
const evolveActions = `<button id="evolveBtn" onclick="evolvePlant()" class="goldBtn">Evolve</button>`;
const plantList = document.getElementById('plantList');

const addPlantBtn = document.getElementById('addPlantBtn');

let selectedPlant = 0;
let fetchedPlants = [];

// Placeholder
const myInventory = [
    { itemNumber: 17, quantity: 5 }, { itemNumber: 1, quantity: 10 }
];
let currentDay = 1;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('nextDayBtn').addEventListener('click', nextDay);
    updateList();
    initModal();
});

async function nextDay() {
    const token = localStorage.getItem("token");
    if (!token) {
        return;
    }

    const response = await fetch("/api/plant/nextDay", {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`
        },
    });

    //const data = await response.json();
    if (response.ok) {
        window.location.reload();
    }
}

async function updateList() {
    const token = localStorage.getItem("token");
    if (!token) {
        return;
    }

    const response = await fetch("/api/plant/", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
        currentDay = data.day;
        document.getElementById("dayCounter").innerHTML = currentDay;
        plantList.innerHTML = "";
        fetchedPlants = data.results;
        let first = true;
        data.results.forEach((plant) => {
            const tr = document.createElement('tr');
            if (first) {
                tr.classList.add('selected');
                first = false;
            }
            const _plant = _PLANTS.find(p => p.id == plant.plantNumber);
            tr.innerHTML = `
            <td>${_plant.name}</td>
            <td>${_BIOMES[plant.biomeNumber]}</td>
            <td>${_SOILS[plant.soilNumber]}</td>
            <td>${_PHASES[plant.phase]}</td>
            <td>${indicateStatus(plant, _plant)}</td>
            `;

            tr.dataset.plantid = plant._id;
            tr.classList.add('selectPlant');
            tr.addEventListener('click', selectPlant);
            plantList.appendChild(tr);
        });
        if (fetchedPlants.length > 0) {
            showPlant(fetchedPlants[0]);
        }
    }
}

function updatePlantRow(plant) {
    const tr = plantList.querySelector(`tr[data-plantid="${plant._id}"]`);
    if (!tr) return;

    const _plant = _PLANTS.find(p => p.id == plant.plantNumber);
    const cells = tr.querySelectorAll('td');
    if (cells.length >= 5) {
        cells[3].textContent = _PHASES[plant.phase];
        cells[4].textContent = indicateStatus(plant, _plant);
    }
}

function removePlantFromUI(plantId) {
    fetchedPlants = fetchedPlants.filter(p => p._id !== plantId);
    const tr = plantList.querySelector(`tr[data-plantid="${plantId}"]`);
    if (tr) {
        tr.remove();
    }

    if (fetchedPlants.length > 0) {
        selectedPlant = 0;
        const firstRow = plantList.querySelector('tr');
        if (firstRow) {
            firstRow.classList.add('selected');
        }
        showPlant(fetchedPlants[0]);
    } else {
        selectedPlant = 0;
        document.getElementById('plantPreview').src = '../images/plants/dead.png';
        document.getElementById('wateredSpan').textContent = 'X';
        document.getElementById('caredSpan').textContent = 'X';
        document.getElementById('lastWateredSpan').textContent = 'X';
        document.getElementById('lastCaredSpan').textContent = 'X';
        document.getElementById('plantActions').innerHTML = '';
    }
}

function selectPlant(event) {
    const tr = event.target.closest('tr');
    if (!tr) { return; }
    const plantId = tr.dataset.plantid;

    const allRows = tr.closest('tbody').querySelectorAll('tr');
    allRows.forEach(row => row.classList.remove('selected'));
    tr.classList.add('selected');

    const plant = fetchedPlants.find(p => p._id == plantId);
    showPlant(plant);
}

async function waterPlant() {
    const token = localStorage.getItem("token");
    const plant = fetchedPlants[selectedPlant];
    if (!token || !plant || plant.lastWateredAt == currentDay) {
        return;
    }

    const waterBtn = document.getElementById('waterBtn');
    if (waterBtn) waterBtn.disabled = true;

    const response = await fetch("/api/plant/change?action=water", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            plantId: plant._id,
            currentDay: currentDay
        })
    });

    const data = await response.json();
    if (response.ok) {
        plant.watering = (plant.watering || 0) + 1;
        plant.lastWateredAt = currentDay;
        updatePlantRow(plant);
        showPlant(plant);
    } else {
        if (waterBtn) waterBtn.disabled = false;
        const plantAlert = document.getElementById('plantAlert');
        handleAlert(plantAlert, false, `${data.error}`);
    }
}

async function carePlant() {
    const token = localStorage.getItem("token");
    const plant = fetchedPlants[selectedPlant];
    if (!token || !plant || plant.lastCaredAt == currentDay) {
        return;
    }

    const careBtn = document.getElementById('careBtn');
    if (careBtn) careBtn.disabled = true;

    const response = await fetch("/api/plant/change?action=care", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            plantId: plant._id,
            currentDay: currentDay
        })
    });

    const data = await response.json();
    if (response.ok) {
        plant.care = (plant.care || 0) + 1;
        plant.lastCaredAt = currentDay;
        updatePlantRow(plant);
        showPlant(plant);
    } else {
        if (careBtn) careBtn.disabled = false;
        const plantAlert = document.getElementById('plantAlert');
        handleAlert(plantAlert, false, `${data.error}`);
    }
}

async function deadPlant() {
    const token = localStorage.getItem("token");
    const plant = fetchedPlants[selectedPlant];
    if (!token || !plant) {
        return;
    }

    const response = await fetch("/api/plant/change?action=dead", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            plantId: plant._id
        })
    });

    const data = await response.json();
    if (response.ok) {
        removePlantFromUI(plant._id);
    } else {
        const plantAlert = document.getElementById('plantAlert');
        handleAlert(plantAlert, false, `${data.error}`);
    }
}

async function evolvePlant() {
    const token = localStorage.getItem("token");
    const plant = fetchedPlants[selectedPlant];
    if (!token || !plant) {
        return;
    }

    const _plant = _PLANTS.find(p => p.id == plant.plantNumber);

    // 1. Poziom trudności zależny od fazy
    let difficulty = 8;
    if (plant.phase === 1) {
        difficulty = 11;
    } else if (plant.phase === 2) {
        difficulty = 14;
    }

    // 2. Rzuty kośćmi (1 - dice) razy diceMultiplier + bonus + care
    let diceSum = 0;
    for (let i = 0; i < _plant.diceMultiplier; i++) {
        diceSum += Math.floor(Math.random() * _plant.dice) + 1;
    }

    let score = diceSum;
    const phaseDuration = _plant.growthPlan[0].phases[plant.phase];
    if ((plant.care || 0) >= phaseDuration) {
        score += _plant.bonus;
        console.log("Bonus za pielęgnację");
    }

    // 3. Sprawdzenie zgodności ziemi i biomu
    if (plant.soilNumber !== _plant.soilNumber) {
        console.log("Kara za glebę");
        score -= 1;
    }
    if (plant.biomeNumber !== _plant.biomeNumber) {
        console.log("Kara za biom");
        score -= 1;
    }

    // 4. Sprawdzenie zgodności podlewania w obecnej fazie
    const expectedWatering = _plant.growthPlan[0].watering[plant.phase];
    if (plant.watering !== expectedWatering) {
        score -= 1;
    }
    console.log(score);
    const success = score >= difficulty;
    console.log(`Evolve -> Suma z kości ${diceSum} Wynik: ${score}, Poziom trudności: ${difficulty} (Success: ${success})`);

    const response = await fetch("/api/plant/evolve", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            success: success,
            plantId: plant._id
        })
    });

    const data = await response.json();
    if (response.ok) {
        if (success) {
            plant.phase += 1;
            plant.watering = 0;
            plant.care = 0;
            plant.lastWateredAt = 0;
            plant.lastCaredAt = 0;
        } else {
            plant.phase = 4;
        }
        updatePlantRow(plant);
        showPlant(plant);
    } else {
        const plantAlert = document.getElementById('plantAlert');
        handleAlert(plantAlert, false, `${data.error}`);
    }
}

async function harvestPlant() {
    const token = localStorage.getItem("token");
    const plant = fetchedPlants[selectedPlant];
    if (!token || !plant) {
        return;
    }

    const _plant = _PLANTS.find(p => p.id == plant.plantNumber);
    const response = await fetch("/api/plant/harvest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            exp: _plant.EXP,
            plantId: plant._id
        })
    });

    const data = await response.json();
    if (response.ok) {
        removePlantFromUI(plant._id);
    } else {
        const plantAlert = document.getElementById('plantAlert');
        handleAlert(plantAlert, false, `${data.error}`);
    }
}

function showPlant(plant) {
    const _plant = _PLANTS.find(p => p.id == plant.plantNumber);
    let graphic = "dead.png";

    if (plant.phase <= 3) {
        graphic = _plant.growthPlan[0].graphics[plant.phase];
    }

    document.getElementById('plantPreview').src = '../images/plants/' + graphic;
    document.getElementById('wateredSpan').textContent = plant.watering;
    document.getElementById('caredSpan').textContent = plant.care;
    document.getElementById('lastWateredSpan').textContent = plant.lastWateredAt || '--';
    document.getElementById('lastCaredSpan').textContent = plant.lastCaredAt || '--';

    switch (indicateStatus(plant, _plant)) {
        case 'dead':
            document.getElementById('plantActions').innerHTML = deadActions;
            break;
        case 'to evolve':
            document.getElementById('plantActions').innerHTML = evolveActions;
            break;
        case 'to harvest':
            document.getElementById('plantActions').innerHTML = harvestActions;
            break;
        default:
            document.getElementById('plantActions').innerHTML = regularActions;

            const waterBtn = document.getElementById('waterBtn');
            const careBtn = document.getElementById('careBtn');

            if (plant.lastWateredAt == currentDay) {
                waterBtn.disabled = true;
            }
            if (plant.lastCaredAt == currentDay) {
                careBtn.disabled = true;
            }
    }
    selectedPlant = fetchedPlants.findIndex(p => p._id == plant._id);
}

function indicateStatus(plant, _plant) {
    if (plant.phase < 3) {
        const totalDaysNeeded = _plant.growthPlan[0].phases
            .slice(0, plant.phase + 1)
            .reduce((sum, days) => sum + days, 0);

        if (plant.plantedAt + totalDaysNeeded <= currentDay) {
            return "to evolve";
        } else {
            if (plant.lastWateredAt == currentDay) {
                return "watered";
            } else {
                return "dry";
            }
        }
    } else if (plant.phase == 3) {
        return "to harvest";
    } else {
        return "dead";
    }
}

function initModal() {
    const addPlantModal = document.getElementById('addPlantModal');
    const addPlantForm = document.getElementById('addPlantForm');
    const seedSelect = document.getElementById('seedSelect');
    const soilSelect = document.getElementById('soilSelect');
    const biomeSelect = document.getElementById('biomeSelect');
    const quantityInput = document.getElementById('quantityInput');
    const plantAlert = document.getElementById('plantAlert');

    myInventory.forEach((item) => {
        const _item = _ITEMS.find(it => it.id == item.itemNumber);
        if (_item.type == 'seed') {
            const node = document.createElement('option');
            node.value = _item.plantNumber;
            node.textContent = _item.name;
            node.dataset.quantity = item.quantity;
            seedSelect.appendChild(node);
        } else if (_item.type == 'biome') {
            const node = document.createElement('option');
            node.value = _item.biomeNumber;
            node.textContent = _item.name;
            biomeSelect.appendChild(node);
        }
    });

    // Usuwanie czerwonego obramowania po poprawieniu pola
    [seedSelect, soilSelect, biomeSelect, quantityInput].forEach((field) => {
        field.addEventListener('input', () => field.classList.remove('is-invalid'));
        field.addEventListener('change', () => field.classList.remove('is-invalid'));
    });

    seedSelect.addEventListener('change', () => {
        quantityInput.value = 0;
        const selectedOption = seedSelect.options[seedSelect.selectedIndex];
        const maxQty = parseInt(selectedOption?.dataset.quantity, 10) || 0;
        quantityInput.max = maxQty;
    });

    quantityInput.addEventListener('input', () => {
        if (quantityInput.value === '') return;
        const max = parseInt(quantityInput.max, 10) || 0;
        const current = parseInt(quantityInput.value, 10);
        if (!isNaN(current) && max > 0 && current > max) {
            quantityInput.value = max;
        }
    });

    // Resetowanie błędów po zamknięciu modala
    addPlantModal.addEventListener('hidden.bs.modal', () => {
        addPlantForm.reset();
        [seedSelect, soilSelect, biomeSelect, quantityInput].forEach((field) => {
            field.classList.remove('is-invalid');
        });
        plantAlert.classList.add('d-none');
    });

    addPlantForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isValid = true;
        [seedSelect, soilSelect, biomeSelect, quantityInput].forEach((field) => {
            field.classList.remove('is-invalid');
        });

        // 1. Sprawdzenie wyboru z list (uwzględnia wartość "0")
        if (seedSelect.value === '' || seedSelect.value === '--- Choose ---') {
            seedSelect.classList.add('is-invalid');
            isValid = false;
        }
        if (soilSelect.value === '' || soilSelect.value === '--- Choose ---') {
            soilSelect.classList.add('is-invalid');
            isValid = false;
        }
        if (biomeSelect.value === '' || biomeSelect.value === '--- Choose ---') {
            biomeSelect.classList.add('is-invalid');
            isValid = false;
        }

        // 2. Sprawdzenie quantity (>= 1 oraz <= dostępna ilość w ekwipunku)
        const quantity = parseInt(quantityInput.value, 10);
        const maxQuantity = parseInt(quantityInput.max, 10) || 0;

        if (isNaN(quantity) || quantity < 1 || (maxQuantity > 0 && quantity > maxQuantity)) {
            quantityInput.classList.add('is-invalid');
            isValid = false;
        }

        if (!isValid) {
            handleAlert(plantAlert, false, "All fields are required and quantity must be at least 1.");
            return;
        }

        const payload = {
            plant: Number(seedSelect.value),
            biome: Number(biomeSelect.value),
            soil: Number(soilSelect.value),
            quantity: quantity,
            currentDay: currentDay,
        };

        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }

        const response = await fetch("/api/plant/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (response.ok) {
            window.location.reload();
        } else {
            handleAlert(plantAlert, false, `${data.error}`);
        }
    });
}