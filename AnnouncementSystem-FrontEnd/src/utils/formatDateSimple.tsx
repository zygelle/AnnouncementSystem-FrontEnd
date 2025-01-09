export const formatDateSimple = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    };
    return new Date(date).toLocaleDateString('pt-BR', options);
};