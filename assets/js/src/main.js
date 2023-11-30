var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchCoinData, fetchCoins } from "./api/rest.js";
import { reduceCoins } from "./reducers/reducer.js";
import { displayCoins } from "./ui/vcoins.js";
const moreInfoButton = document.getElementById('info-button');
const popUpBox = document.querySelector(".popup-box");
const closePupUp = document.querySelector(".close-btn");
const searchByName = document.getElementById('search-btn');
// searchByName.addEventListener('click', function(e){
//     e.preventDefault();
//     getCoinByName();
// });
function getAllCoins() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Loading Animation
            const loading = document.getElementById('loading');
            if (loading) {
                loading.style.display = 'block';
            }
            // const getCoins = await rest('https://api.coingecko.com/api/v3/coins/list');
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
//   async function getCoinByName(): Promise<void> {
//     const searchInput = document.getElementById('search-input') as HTMLInputElement;
//     const coinName = searchInput.value.trim();
//     if (coinName) {
//       try {
//         // Loading Animation
//         const loading = document.getElementById('loading');
//         if (loading) {
//             loading.style.display = 'block';
//         }
//         const getCoins = await fetchCoins(`https://api.coingecko.com/api/v3/coins/${coinName}`);
//         const coins = reduceCoins(getCoins);
//         displayCoins(coins);
//       } finally {
//         const loading = document.getElementById('loading');
//         if (loading) {
//             loading.style.display = 'none';
//         }
//       }
//     }
// }
function getCoinData(coinId) {
    return __awaiter(this, void 0, void 0, function* () {
        return fetchCoinData(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    });
}
function coinInfoClicked(e) {
    return __awaiter(this, void 0, void 0, function* () {
        if (e.target instanceof HTMLElement) {
            const element = e.target;
            if (element.id.startsWith('info-button-')) {
                const coinId = element.id.substring('info-button-'.length);
                const coinData = yield getCoinData(coinId);
                console.log(coinData);
                document.getElementById(`popup-box-${coinId}`).innerHTML = `
            <div class="popup">
              <div class="popup-content">
                <div class="popup-header">
                  <p>Bitcoin Information</p>
                  <div class="popup-icon">
                    <button class="close-btn"><i class="bi bi-x"></i></button>
                  </div> <!--popup-icon close div -->
                </div> <!--pop-header close div -->
                <div class="popup-info">
                  <span>USD:${coinData.market_data.current_price.usd}</span>
                  <span>EUR:${coinData.market_data.current_price.eur}</span>
                  <span>NIS:${coinData.market_data.current_price.ils}</span>
                </div>
              </div>
            </div>
            `;
                const showBox = document.getElementById(`popup-box-${coinId}`);
                showBox.classList.add("show");
            }
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    document.getElementById('boxContainer').addEventListener('click', coinInfoClicked);
    getAllCoins();
}))();
