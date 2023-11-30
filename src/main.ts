import { fetchCoinData , fetchCoins} from "./api/rest.js";
import CoinData from "./interfaces/coin-data.js";
import { reduceCoins } from "./reducers/reducer.js";
import { displayCoins } from "./ui/vcoins.js";
import Cache from "./cache.js";
import { VCoins } from "./interfaces/interface.js";


const searchByName = document.getElementById('search-btn');
const cache = Cache.getInstance();
const selectedCoins: VCoins[] = [];

searchByName.addEventListener('click', function(e){
    e.preventDefault();
    getCoinByName();
});

async function getAllCoins(): Promise<void> {
    try {
      // Loading Animation
      const loading = document.getElementById('loading');
      if (loading) {
        loading.style.display = 'block';
      }
      //const getCoins = await fetchCoins('https://api.coingecko.com/api/v3/coins/list'); //TODO: Turn this on
      const getCoins = await fetchCoins('coins.json');
      const coins = getCoins.slice(0,100);
      const reducedCoins = reduceCoins(coins);
      displayCoins(reducedCoins);
      
    } finally {
        const loading = document.getElementById('loading');
        if (loading) {
          loading.style.display = 'none';
      }
    }
  }

  async function getCoinByName(): Promise<void> {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const coinName = searchInput.value.trim();
    
    if (coinName) {
      try {
        // Loading Animation
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'block';
        }
        const getCoins = await fetchCoins(`https://api.coingecko.com/api/v3/coins/${coinName}`);
        const coins = reduceCoins(getCoins);
        displayCoins(coins);
      } finally {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
      }
    }
}

async function getCoinData(coinId: string): Promise<CoinData> {
    const cacheResponse = await cache.getData(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    const coinData: CoinData = (cacheResponse) as CoinData
    return coinData;
}

async function coinInfoClicked(e: MouseEvent) {
  if (e.target instanceof HTMLElement) {
      const element = e.target as HTMLElement;
      if (element.id.startsWith('info-button-')){
          const coinId = element.id.substring('info-button-'.length);
          try {
              const coinData = await getCoinData(coinId);
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
          } catch (error) {
            // 1Move Token coin for example no info about.
            document.getElementById(`error-${coinId}`).innerHTML = `
            Couldn't get the data about this coin! try again later`;
          }
      }
  }
}


async function coinInfoClose(e: MouseEvent) {
    if (e.target instanceof HTMLElement) {
        const element = e.target as HTMLElement;
        const closeBtn = element.closest('.close-btn');
        if (closeBtn) {
            const coinId = closeBtn.id.substring('close-'.length);
            const showBox = document.getElementById(`popup-box-${coinId}`);
            showBox.classList.remove("show");
        }
    }
}

async function addCoinToArray(e:MouseEvent, coin: VCoins){
  if (e.target instanceof HTMLElement) {
    const element = e.target as HTMLElement;
    if (element.id.startsWith('checked-')){
        const coinId = element.id.substring('checked-'.length);
        const checkbox = document.querySelector(`#checked-${coinId}`) as HTMLInputElement;
        
        if (checkbox.checked) {
          if (selectedCoins.length < 5) {
            // Add the coin to the array
            selectedCoins.push(coin);
          } else {
            checkbox.checked = false;
            alert("You can select up to 5 coins.");
          }
        } else {
          // Remove the coin from the array
          const index = selectedCoins.findIndex(selectedCoin => selectedCoin.id === coin.id);
          if (index !== -1) {
            selectedCoins.splice(index, 1);
          }
        }
        console.log(selectedCoins);
      }
    }
}
(async () => {
document.getElementById('coins-sections').addEventListener('click',coinInfoClicked);
document.getElementById('coins-sections').addEventListener('click',addCoinToArray);
document.getElementById('isPopUp').addEventListener('click',coinInfoClose);

getAllCoins();
})();
