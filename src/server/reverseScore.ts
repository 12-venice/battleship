export function reverseScore(score: number[]) {
    const reversedScore: number[] = [];
    [reversedScore[1], reversedScore[0]] = score;
    return reversedScore;
}
