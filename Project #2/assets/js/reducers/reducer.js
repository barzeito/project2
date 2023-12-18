// ============== Show Coins Box ===============
export function reduceCoins(coins, searchTerm) {
    const filteredCoins = searchTerm
        ? coins.filter(coins => coins.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
        : coins;
    const coinBox = filteredCoins.map(coin => `
      <div class="boxContainer">
      <div class="box">
        <div class="title">
          <h3>${coin.name}</h3>
          <div id="toggle-container-${coin.id}">
            <input class="checkedInput" type="checkbox" id="checked-${coin.id}">
            <label for="checked-${coin.id}" class="checkedButton"></label>
          </div>
        </div>
        <span id="span-${coin.id}">${coin.symbol}</span>
        <p id="info-button-${coin.id}">More Info</p>
        <div class="popup-box" id=popup-box-${coin.id}></div>
        <div class="error" id="error-${coin.id}"></div>
      </div>
    </div>
      `).reduce((acc, curr) => acc + curr, '');
    return coinBox;
}
