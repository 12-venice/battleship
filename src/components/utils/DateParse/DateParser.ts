// Конфликт линтеров
/* eslint-disable prettier/prettier */
export const DateParser = (d: string | number | Date | undefined) => {
    if (!d) return '';
    const date = new Date(d);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
};
