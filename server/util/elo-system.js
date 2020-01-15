module.exports = function(K) {
    this.K = K;
    this.getNewRating = (ratingA, ratingB, score) => calculateNewRating(this.K, ratingA, ratingB, score);
}

const calculateNewRating =
    (K, rA, rB, sA) =>
        Math.round(rA + K * (sA - calculateExpectedScore(rA, rB)));

const calculateExpectedScore =
    (rA, rB) =>
        1 / (1 + (Math.pow(10, (rB - rA) / 400)));

// const dummyTeam = [0, 1, 2]