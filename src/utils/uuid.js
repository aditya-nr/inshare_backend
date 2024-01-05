export function uuid() {
    return `${Date.now()}_${Math.floor(Math.random() * 10000)}}`;
}