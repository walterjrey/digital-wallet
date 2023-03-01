export const currencyFormat = (num) => {
    return Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const currencySymbol = (currency) => {
    if(currency === 'usd') return '$';
    return '€';
}

export const getCurrencyRate = (currency) => {
    return localStorage.getItem('rate_' + currency);
}

export const formatBalance = (balance) => {
    return parseFloat(Number(balance).toString().replace('e', '')).toFixed(2);
}