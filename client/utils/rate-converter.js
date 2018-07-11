export function convert(amount, fromRate, toRate) {
    return amount * toRate * (1 / fromRate)
}