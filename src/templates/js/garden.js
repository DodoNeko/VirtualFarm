const regularActions = `<button id="waterBtn" class="blueBtn">Water</button><button id="careBtn" class="redBtn">Care</button>`;
const harvestActions = `<button id="harvestBtn" class="greenBtn"Harvest</button>`;
const deadActions = `<button id="deadBtn" class="blackBtn">Dead</button>`;
const evolveActions = `<button id="evolveBtn" class="yellowBtn">Evolve</button>`;

const addPlantBtn = document.getElementById('addPlantBtn');
//
const myInventory = [
    { itemNumber: 17, quantity: 5 }, { itemNumber: 1, quantity: 10 }
]

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('plantActions').innerHTML = regularActions;
    initModal();
});



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
            quantity: quantityInput.value
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
