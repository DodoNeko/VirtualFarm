const regularActions = `<button id="waterBtn" class="blueBtn">Water</button><button id="careBtn" class="redBtn">Care</button>`;
const harvestActions = `<button id="harvestBtn" class="greenBtn"Harvest</button>`;
const deadActions = `<button id="deadBtn" class="blackBtn">Dead</button>`;
const evolveActions = `<button id="evolveBtn" class="yellowBtn">Evolve</button>`;


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('plantActions').innerHTML = regularActions;
});