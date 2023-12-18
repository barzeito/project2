var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchCoins } from "./api/rest.js";
import { reduceCoins } from "./reducers/reducer.js";
import { displayCoins } from "./ui/vcoins.js";
import Cache from "./cache.js";
import { setupAndUpdateChart } from "./chart.js";
const searchByName = document.getElementById("search-btn");
const cache = Cache.getInstance();
const selectedCoins = [];
searchByName.addEventListener("click", function (e) {
    e.preventDefault();
    getCoinByName();
});
// =================== Get The coins and the Data ================
function getAllCoins() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Loading Animation
            const loading = document.getElementById("loading");
            if (loading) {
                loading.style.display = "block";
            }
            //const getCoins = await fetchCoins('https://api.coingecko.com/api/v3/coins/list'); //TODO: Turn this on
            const getCoins = yield fetchCoins("coins.json");
            const coins = getCoins.slice(0, 100);
            const reducedCoins = reduceCoins(coins);
            displayCoins(reducedCoins);
        }
        finally {
            const loading = document.getElementById("loading");
            if (loading) {
                loading.style.display = "none";
            }
        }
    });
}
function getCoinByName() {
    return __awaiter(this, void 0, void 0, function* () {
        const searchInput = document.getElementById("search-input");
        const coinName = searchInput.value.trim();
        if (coinName) {
            try {
                // Loading Animation
                const loading = document.getElementById("loading");
                if (loading) {
                    loading.style.display = "block";
                }
                const getCoins = yield fetchCoins("coins.json");
                const filteredCoins = coinName
                    ? getCoins.filter((coin) => coin.name.toLowerCase().includes(coinName.toLowerCase()))
                    : getCoins;
                if (filteredCoins.length === 0) {
                    showNotification("No coins found for the entered value.");
                    console.log('No coins found for the entered value.');
                }
                else {
                    const reducedCoins = reduceCoins(filteredCoins);
                    displayCoins(reducedCoins);
                }
            }
            finally {
                const loading = document.getElementById("loading");
                if (loading) {
                    loading.style.display = "none";
                }
            }
        }
    });
}
function getCoinData(coinId) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheResponse = yield cache.getData(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        const coinData = cacheResponse;
        return coinData;
    });
}
// =================== Notification when user add / remove coin================
function showNotification(message) {
    const notificationContainer = document.getElementById("notification-container");
    notificationContainer.textContent = message;
    if (notificationContainer) {
        notificationContainer.style.display = "block";
    }
    setTimeout(() => {
        notificationContainer.style.display = "none";
    }, 2000);
}
// =================== Info about the coin ================
function coinInfoClicked(e) {
    return __awaiter(this, void 0, void 0, function* () {
        if (e.target instanceof HTMLElement) {
            const element = e.target;
            if (element.id.startsWith("info-button-")) {
                const coinId = element.id.substring("info-button-".length);
                try {
                    const coinData = yield getCoinData(coinId);
                    console.log(coinData); //TODO: REMOVE THIS
                    document.getElementById(`popup-box-${coinId}`).innerHTML = `
                  <div class="popup">
                      <div class="popup-content">
                          <div class="popup-header">
                              <span>${coinId} Information</span>
                              <img src="${coinData.image.thumb}"/>
                              <div class="popup-icon">
                                  <button id="close-${coinId}" class="close-btn"><i class="bi bi-x"></i></button>
                              </div>
                          </div>
                          <div class="popup-info">
                              <span>USD: $${coinData.market_data.current_price.usd}</span>
                              <span>EUR: €${coinData.market_data.current_price.eur}</span>
                              <span>NIS: ₪${coinData.market_data.current_price.ils}</span>
                          </div>
                      </div>
                  </div>
              `;
                    const showBox = document.getElementById(`popup-box-${coinId}`);
                    showBox.classList.add("show");
                }
                catch (error) {
                    // 1Move Token coin for example no info about.
                    document.getElementById(`error-${coinId}`).innerHTML = `
            Couldn't get the data about this coin! try again later`;
                }
            }
        }
    });
}
function coinInfoClose(e) {
    return __awaiter(this, void 0, void 0, function* () {
        if (e.target instanceof HTMLElement) {
            const element = e.target;
            const closeBtn = element.closest(".close-btn");
            if (closeBtn) {
                const coinId = closeBtn.id.substring("close-".length);
                const showBox = document.getElementById(`popup-box-${coinId}`);
                showBox.classList.remove("show");
            }
        }
    });
}
// =================== Add coin to the array ================
function addCoinToArray(e) {
    return __awaiter(this, void 0, void 0, function* () {
        if (e.target instanceof HTMLElement) {
            const element = e.target;
            if (element.id.startsWith("checked-")) {
                const coinId = element.id.substring("checked-".length);
                console.log(coinId);
                const checkbox = document.querySelector(`#checked-${coinId}`);
                const span = document.querySelector(`#span-${coinId}`);
                if (checkbox.checked) {
                    if (selectedCoins.length < 5) {
                        // Add the coin to the array
                        selectedCoins.push(coinId);
                        showNotification(`Coin ${coinId} added.`);
                        const spanText = span.textContent;
                        console.log(`Span Text: ${spanText}`);
                        saveData(spanText);
                    }
                    else {
                        selectedCoins.push(coinId);
                        showNotification(`Coin ${coinId} added.`);
                        showToggleLimit();
                    }
                }
                else {
                    // Remove the coin from the array
                    const index = selectedCoins.findIndex((selectedCoin) => selectedCoin === coinId);
                    selectedCoins.splice(index, 1);
                    showNotification(`Coin ${coinId} removed.`);
                }
                console.log(selectedCoins);
            }
        }
    });
}
// =================== Popup when user added more then 5 coins ================
function showToggleLimit() {
    try {
        document.getElementById(`toggle-popup-box`).innerHTML = `
                <div class="toggle-popup">
                    <div class="toggle-popup-content">
                        <div class="toggle-popup-header">
                            <div>You can select only 5 coins, choose 1 to remove</div>
                            <div class="toggle-popup-icon">
                                <button id="close" class="close-btn"><i class="bi bi-x"></i></button>
                            </div>
                        </div>
                        <div class="toggle-popup-info">
                        </div>
                    </div>
                </div>
            `;
        const popupInfo = document.querySelector(".toggle-popup-info");
        selectedCoins.forEach((coin) => {
            const coinElement = document.createElement("div");
            coinElement.innerHTML = `
                  <div class="toggle-pop-main-container">
                    <span id="coinName-${coin}">${coin}</span>
                    <div class="clickMe">Click my button, if you want to remove me.</div>
                    <div id="pop-toggle-container-${coin}">
                        <input class="pop-checkedInput" type="checkbox" id="pop-checked-${coin}" checked>
                        <label for="pop-checked-${coin}" class="pop-checkedButton"></label>
                    </div>
                  </div>
                `;
            popupInfo.appendChild(coinElement);
        });
        const showBox = document.getElementById(`toggle-popup-box`);
        showBox.classList.add("show");
    }
    catch (error) {
        // 1Move Token coin for example no info about.
        document.getElementById(`error`).innerHTML = `
          Couldn't get the data about this coin! try again later`;
    }
}
function closeToggleLimit(e) {
    return __awaiter(this, void 0, void 0, function* () {
        if (e.target instanceof HTMLElement) {
            const element = e.target;
            const closeBtn = element.closest(".close-btn");
            if (closeBtn) {
                const showBox = document.getElementById(`toggle-popup-box`);
                showBox.classList.remove("show");
            }
        }
    });
}
function addCoinToArrayToggle(e) {
    return __awaiter(this, void 0, void 0, function* () {
        if (e.target instanceof HTMLElement) {
            const element = e.target;
            if (element.id.startsWith("pop-checked-")) {
                const coinId = element.id.substring("pop-checked-".length);
                console.log(coinId);
                const checkbox = document.querySelector(`#pop-checked-${coinId}`);
                if (checkbox) {
                    if (checkbox.checked) {
                        // Add the coin to the array
                        selectedCoins.push(coinId);
                        showNotification(`Coin ${coinId} added.`);
                        document.querySelector(`#checked-${coinId}`).checked = true;
                    }
                    else {
                        // Remove the coin from the array
                        const index = selectedCoins.findIndex((selectedCoin) => selectedCoin === coinId);
                        selectedCoins.splice(index, 1);
                        showNotification(`Coin ${coinId} removed.`);
                        document.querySelector(`#checked-${coinId}`).checked = false;
                    }
                    console.log(selectedCoins);
                }
            }
        }
    });
}
function saveData(spanText) {
    // Retrieve existing data from sessionStorage
    const savedDataString = sessionStorage.getItem('selectedCoins');
    // Parse the existing data or initialize an empty array
    const savedData = savedDataString
        ? JSON.parse(savedDataString)
        : [];
    // Add the new spanText to the array
    savedData.push(spanText);
    // Convert the array to a string and save it in sessionStorage
    const savedDataStringUpdated = JSON.stringify(savedData);
    sessionStorage.setItem('selectedCoins', savedDataStringUpdated);
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    document.getElementById("coins-sections").addEventListener("click", coinInfoClicked);
    document.getElementById("isPopUp").addEventListener("click", coinInfoClose);
    document.getElementById("coins-sections").addEventListener("click", addCoinToArray);
    document.getElementById("toggle-popup-box").addEventListener("click", closeToggleLimit);
    document.getElementById("toggle-popup-box").addEventListener("click", addCoinToArrayToggle);
    getAllCoins();
    // displayGraph();
    setupAndUpdateChart();
}))();
