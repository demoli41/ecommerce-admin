export function prettyDate(dateStr) {
    return (new Date(dateStr)).toLocaleString('uk-UA');
}