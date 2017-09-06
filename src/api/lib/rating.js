// An implementation of the ELO ranking system
module.exports = function (k = 32) {

    this.k = k;

    this.expected = function (A, B) {
        /*  A: Rating of player A
            B: Rating of player B
            returns: expected score */

        return 1 / (1 + Math.pow(10, ((B - A) / 400)));
    };

    this.calculateElo = function (current, expected, actual) {
        /*  current: current Rating
            expected: calculated expected score
            actual: actual score
            returns: new Rating */

        return current + this.k * (actual - expected);
    };

};