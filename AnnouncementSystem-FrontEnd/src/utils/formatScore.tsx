export const formatScore = (score: number) => {
    return score.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
};