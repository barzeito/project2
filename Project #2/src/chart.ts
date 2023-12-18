declare const Chart: any;

let chartInstance = null;
let dataIndex = 0; 

function getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function createMultiAxisChart(ctx: CanvasRenderingContext2D) {
    return new Chart(ctx, {
        type: 'line',  
        data: {
            datasets: []
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false, 

            scales: {
                x: {
                    type: 'linear', 
                    display: true,
                    title: {
                        display: true,
                        text: 'Time' 
                    }
                },
                y: {
                    type: 'linear', 
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Price in USD'
                    }
                }
            },
        }
    });
}

async function fetchDataForCoin(coinSymbol: string): Promise<any> {
    try {
        const response = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinSymbol}&tsyms=USD`);
        const data = await response.json();
        if (!data || !data[coinSymbol] || !data[coinSymbol].USD) {
            console.error(`No valid price data for ${coinSymbol}`);
            return null;
        }
        return { coin: coinSymbol, price: data[coinSymbol].USD };
    } catch (error) {
        console.error('Error fetching data for coin:', coinSymbol, error);
        return null;
    }
}

async function updateChartData(chart: typeof Chart, coins: string[]) {
    const results = await Promise.all(coins.map(coinSymbol => fetchDataForCoin(coinSymbol)));

    results.forEach((result) => {
        if (!result) return;
        let dataset = chart.data.datasets.find(d => d.label === `${result.coin} Price`);
        if (dataset) {
            dataset.data.push({ x: dataIndex, y: result.price });
        } else {
            chart.data.datasets.push({
                label: `${result.coin} Price`,
                data: [{ x: dataIndex, y: result.price }],
                yAxisID: 'y',
                borderColor: getRandomColor(),
                fill: false
            });
        }
    });

    dataIndex++;
    chart.update();
}

// export async function setupAndUpdateChart() {
//     const ctx = (document.getElementById('chartContainer') as HTMLCanvasElement).getContext('2d');
//     if (!chartInstance) {
//         chartInstance = createMultiAxisChart(ctx);
//     }

//     setInterval(async () => {
//         let storedCoins = JSON.parse(sessionStorage.getItem('selectedCoins') || '[]') as { symbol: string, id: string }[];
//         console.log('Stored Coins:', storedCoins);
//         if (Array.isArray(storedCoins)) {
//             let currentSelectedCoinSymbols = storedCoins.map(coin => coin.symbol?.toUpperCase());
//             await updateChartData(chartInstance, currentSelectedCoinSymbols);
//         } else {
//             console.error('Stored coins is not an array:', storedCoins);
//         }
//     }, 20000);
// }

export async function setupAndUpdateChart() {
    const ctx = (document.getElementById('chartContainer') as HTMLCanvasElement).getContext('2d');
    if (!chartInstance) {
        chartInstance = createMultiAxisChart(ctx);
    }

    setInterval(async () => {
        let storedCoins = JSON.parse(sessionStorage.getItem('selectedCoins') || '[]') as { symbol: string, id: string }[];
        console.log('Stored Coins:', storedCoins);

        if (Array.isArray(storedCoins)) {
            // Filter out items without corresponding spans
            const coinsWithSpans = storedCoins.filter(coin => {
                const span = document.querySelector(`#span-${coin.id}`) as HTMLSpanElement;
                return span !== null;
            });

            let currentSelectedCoinSymbols = coinsWithSpans.map(coin => coin.symbol?.toUpperCase());
            await updateChartData(chartInstance, currentSelectedCoinSymbols);
        } else {
            console.error('Stored coins is not an array:', storedCoins);
        }
    }, 20000);
}
