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
          <button><i class="bi bi-toggle-on"></i></button>
        </div>
        <span>${coin.symbol}</span>
        <p id="info-button-${coin.id}" onclick="coinInfoClicked()>Don't Click</p>
      </div>
    </div>
    <div id="popup-box-${coin.id}">What is that</div>
      `).reduce((acc, curr) => acc + curr, '');
    // Combine the title and rows
    return coinBox;
}
