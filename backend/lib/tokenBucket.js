module.exports = Bucket;

function Bucket(options) {
    options = options || {};
    this.capacity = options.capacity || Infinity;
    this.refillRate = options.refillRate || 1;
    this.left = this.capacity;
    this.last = time();
}

/**
 *
 * @param tokens Consumed tokens
 * @param fn Function which to call
 * @returns {*}
 */
Bucket.prototype.throttle = function(tokens, fn) {
    if(this.capacity === Infinity) return fn();

    const now = time();
    const delta = Math.max(now - this.last, 0) / 1000;
    const amount = delta * this.refillRate; // Refill rate is per second

    this.last = now;
    this.left = Math.min(this.left + amount, this.capacity);

    if(this.left < tokens){
        return true;
    }

    this.left -= tokens;
    fn();
    return true;
};

function time() {
    return new Date().getTime();
}