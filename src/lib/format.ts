export function formatMoney(amount: number, currency = "CNY"): string {
  const formatted = new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  const symbol = currency === "CNY" ? "¥" : currency;
  return `${symbol}${formatted}`;
}

export function formatCompact(amount: number): string {
  if (Math.abs(amount) >= 10000) {
    return `${(amount / 10000).toFixed(amount % 10000 === 0 ? 0 : 1)}万`;
  }
  return formatMoney(amount);
}
