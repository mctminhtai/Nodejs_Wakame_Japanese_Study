// const models = require('../models');
// exports.get_landing = function (req, res, next) {
//     res.render('landing', { title: 'Express' });
// }
// exports.submit_lead = function (req, res, next) {
//     console.log("lead_email:", req.body.lead_email);
//     return models.Lead.create({
//         email: req.body.lead_email
//     }).then(lead => {
//         res.redirect('/');
//     }).catch(error => {
//         console.log(error);
//     })
// }
exports.get_homePage = function (req, res, next) {
    res.render('homePage', { title: 'Express' });
}
