// Numbers as the /en pages and their docs print them: thousands grouped (12,345), francs in millions (RWF 4.4M).
export const frw = (n: number) => n.toLocaleString("en-US")
export const rwf = (n: number) => `RWF ${(n / 1e6).toFixed(1)}M`
