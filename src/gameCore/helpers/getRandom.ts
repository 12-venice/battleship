/** Максимальное значение, которое хотим получить */
type Limit = number;

/** Случайное число от 0 до n */
export const getRandom = (n: Limit) => Math.floor(Math.random() * (n + 1));