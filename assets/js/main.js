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
const searchByName = document.getElementById('search-btn');
const cache = Cache.getInstance();
const selectedCoins = [];
searchByName.addEventListener('click', function (e) {
    e.preventDefault();
    getCoinByName();
});
function getAllCoins() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Loading Animation
            const loading = document.getElementById('loading');
            if (loading) {
                loading.style.display = 'block';
            }
            //const getCoins = await fetchCoins('https://api.coingecko.com/api/v3/coins/list'); //TODO: Turn this on
            const getCoins = yield fetchCoins('coins.json');
            const coins = getCoins.slice(0, 100);
            const reducedCoins = reduceCoins(coins);
            displayCoins(reducedCoins);
        }
        finally {
            const loading = document.getElementById('loading');
            if (loading) {
                loading.style.display = 'none';
            }
        }
    });
}
function getCoinByName() {
    return __awaiter(this, void 0, void 0, function* () {
        const searchInput = document.getElementById('search-input');
        const coinName = searchInput.value.trim();
        if (coinName) {
            try {
                // Loading Animation
                const loading = document.getElementById('loading');
                if (loading) {
                    loading.style.display = 'block';
                }
                const getCoins = yield fetchCoins(`https://api.coingecko.com/api/v3/coins/${coinName}`);
                const coins = reduceCoins(getCoins);
                displayCoins(coins);
            }
            finally {
                const loading = document.getElementById('loading');
                if (loading) {
                    loading.style.display = 'none';
                }
            }
        }
    });
}
function getCoinData(coinId) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheResponse = yield cache.getData(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        const coinData = (cacheResponse);
        return coinData;
    });
}
function coinInfoClicked(e) {
    return __awaiter(this, void 0, void 0, function* () {
        if (e.target instanceof HTMLElement) {
            const element = e.target;
            if (element.id.startsWith('info-button-')) {
                const coinId = element.id.substring('info-button-'.length);
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
            const closeBtn = element.closest('.close-btn');
            if (closeBtn) {
                const coinId = closeBtn.id.substring('close-'.length);
                const showBox = document.getElementById(`popup-box-${coinId}`);
                showBox.classList.remove("show");
            }
        }
    });
}
function addCoinToArray(e, coin) {
    return __awaiter(this, void 0, void 0, function* () {
        if (e.target instanceof HTMLElement) {
            const element = e.target;
            if (element.id.startsWith('checked-')) {
                const coinId = element.id.substring('checked-'.length);
                const checkbox = document.querySelector(`#checked-${coinId}`);
                if (checkbox.checked) {
                    if (selectedCoins.length < 5) {
                        // Add the coin to the array
                        selectedCoins.push(coin);
                    }
                    else {
                        checkbox.checked = false;
                        alert("You can select up to 5 coins.");
                    }
                }
                else {
                    // Remove the coin from the array
                    const index = selectedCoins.findIndex(selectedCoin => selectedCoin.id === coin.id);
                    if (index !== -1) {
                        selectedCoins.splice(index, 1);
                    }
                }
                console.log(selectedCoins);
            }
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    document.getElementById('coins-sections').addEventListener('click', coinInfoClicked);
    // document.getElementById('coins-sections').addEventListener('click',addCoinToArray);
    document.getElementById('isPopUp').addEventListener('click', coinInfoClose);
    getAllCoins();
}))();
