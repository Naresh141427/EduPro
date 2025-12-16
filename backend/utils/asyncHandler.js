
// What this does
//     Catches async errors automatically
//     Forwards them to global error handler
//     Cleaner controllers

module.exports = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}