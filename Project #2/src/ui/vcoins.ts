export function displayCoins(html: string): void{
    document.getElementById('coins-sections').innerHTML = html;
}

export function displayGraph(html: string): void{
    document.getElementById('liveReports').innerHTML = html;
}