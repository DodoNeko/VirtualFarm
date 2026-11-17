const regularActions = `<button id="waterBtn" onclick="waterPlant()" class="blueBtn">Water</button><button id="careBtn" class="redBtn">Care</button>`;
const harvestActions = `<button id="harvestBtn" class="greenBtn"Harvest</button>`;
const deadActions = `<button id="deadBtn" class="blackBtn">Dead</button>`;
const evolveActions = `<button id="evolveBtn" class="goldBtn">Evolve</button>`;
const plantList = document.getElementById('plantList');

const addPlantBtn = document.getElementById('addPlantBtn');

let selectedPlant = 0;
let fetchedPlants = [];

// Placeholder
const myInventory = [
    { itemNumber: 17, quantity: 5 }, { itemNumber: 1, quantity: 10 }
]
const currentDay = 5;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('plantActions').innerHTML = regularActions;
    updateList();
    initModal();
});

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
            <td>${_BIOMES[_plant.biomeNumber]}</td>
            <td>${_SOILS[_plant.soilNumber]}</td>
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
    if (!token) {
        return;
    }

    const response = await fetch("/api/plant/change?action=water", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(
            {
                plantId: fetchedPlants[selectedPlant]._id
            }
        )
    });

    const data = await response.json();
    if (response.ok) {
        window.location.reload();
    } else {
        const plantAlert = document.getElementById('plantAlert');
        handleAlert(plantAlert, false, `${data.error}`);
    }
}

function showPlant(plant) {
    const _plant = _PLANTS.find(p => p.id == plant.plantNumber);
    let graphic = "dead.png";

    if (plant.phase <= 4) {
        graphic = _plant.growthPlan[0].graphics[plant.phase];
    }

    document.getElementById('plantPreview').src = '../images/plants/' + graphic;
    console.log(plant);
    document.getElementById('wateredSpan').textContent = plant.watering;
    document.getElementById('caredSpan').textContent = plant.care;
    document.getElementById('lastWateredSpan').textContent = plant.lastWateredAt ?? '--';
    document.getElementById('lastCaredSpan').textContent = plant.lastCaredSpan ?? '--';

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
    }
    selectedPlant = fetchedPlants.findIndex(p => p._id == plant._id);
}

function indicateStatus(plant, _plant) {
    if (plant.phase < 3) {
        if (plant.plantedAt + _plant.growthPlan[0].phases[plant.phase] <= currentDay) {
            return "to evolve";
        } else {
            if (plant.lastWateredAt == currentDay) {
                return "watered";
            } else {
                return "dry";
            }
        }
    } else if (plant.phase == 4) {
        return "to harvest";
    } else {
        return "dead";
    }
}

function initModal() {
    const seedSelect = document.getElementById('seedSelect');
    const biomeSelect = document.getElementById('biomeSelect');
    const quantityInput = document.getElementById('quantityInput');

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

    seedSelect.addEventListener('change', () => {
        quantityInput.value = 0;
        const selectedOption = seedSelect.options[seedSelect.selectedIndex];
        quantityInput.max = selectedOption.dataset.quantity;
    })

    quantityInput.addEventListener('input', () => {
        const max = parseInt(quantityInput.max) || 0;
        const current = parseInt(quantityInput.value) || 0;
        if (current > max) {
            quantityInput.value = max;
        }
        if (current < 0) {
            quantityInput.value = 0;
        }
    });
    document.querySelector('#addPlantForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const seedSelect = document.getElementById('seedSelect');
        const soilSelect = document.getElementById('soilSelect');
        const biomeSelect = document.getElementById('biomeSelect');
        const quantityInput = document.getElementById('quantityInput');

        const payload = {
            plant: seedSelect.value,
            biome: biomeSelect.value,
            soil: soilSelect.value,
            quantity: quantityInput.value,
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
            const plantAlert = document.getElementById('plantAlert');
            handleAlert(plantAlert, false, `${data.error}`);
        }

    });
}
