const models = require('../models');
exports.get_homePage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('index', {
            title: 'Express',
            Authenticated: xacnhan,
            user_name: req.user.dataValues.fullName,
            user_email: req.user.dataValues.email
        });
    }
    else {
        return res.render('index', {
            title: 'Express',
            Authenticated: xacnhan
        });
    }

}
exports.get_aboutPage = function (req, res, next) {
    req.session.redirectTo = '/about';
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('about', {
            title: 'Express',
            Authenticated: xacnhan,
            user_name: req.user.dataValues.fullName,
            user_email: req.user.dataValues.email
        });
    }
    else {
        return res.render('about', {
            title: 'Express',
            Authenticated: xacnhan
        });
    }

}

exports.get_contactPage = function (req, res, next) {
    var xacnhan = false;
    req.session.redirectTo = '/contact';
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('contact', {
            title: 'Express',
            Authenticated: xacnhan,
            user_name: req.user.dataValues.fullName,
            user_email: req.user.dataValues.email
        });
    }
    else {
        return res.render('contact', {
            title: 'Express',
            Authenticated: xacnhan
        });
    }
}
exports.get_coursesPage = function (req, res, next) {
    var xacnhan = false;
    req.session.redirectTo = '/courses';
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('courses', {
            title: 'Express',
            Authenticated: xacnhan,
            user_name: req.user.dataValues.fullName,
            user_email: req.user.dataValues.email
        });
    }
    else {
        return res.render('courses', {
            title: 'Express', Authenticated: xacnhan
        });
    }
}

exports.get_profilePage = async function (req, res, next) {
    req.session.redirectTo = '/profile';
    var user = await models.USER.findOne({
        where: {
            email: req.user.email,
        }
    })
    console.log(user);
    return res.render('profile', {
        Authenticated: req.isAuthenticated(),
        user_name: req.isAuthenticated() ? req.user.dataValues.fullName : '',
        user_email: req.isAuthenticated() ? req.user.dataValues.email : '',
        user: user,
    })

}


exports.get_coursesDetailPage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('coursesdetail', {
            title: 'Express',
            Authenticated: xacnhan,
            user_name: req.user.dataValues.fullName,
            user_email: req.user.dataValues.email
        });
    }
    else {
        return res.render('coursesdetail', {
            title: 'Express', Authenticated: xacnhan
        });
    }
}

exports.get_tkbPage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('tkb', {
            title: 'Express',
            Authenticated: xacnhan, user_name: req.user.dataValues.fullName,
            user_email: req.user.dataValues.email
        });
    }
    else {
        return res.render('tkb', {
            title: 'Express',
            Authenticated: xacnhan
        });
    }
}

exports.get_booksPage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('books', {
            title: 'Express',
            Authenticated: xacnhan,
            user_name: req.user.dataValues.fullName,
            user_email: req.user.dataValues.email
        });
    }
    else {
        return res.render('books', {
            title: 'Express',
            Authenticated: xacnhan
        });
    }
}

exports.get_booksdetailPage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('booksdetail', {
            title: 'Express',
            Authenticated: xacnhan,
            user_name: req.user.dataValues.fullName,
            user_email: req.user.dataValues.email
        });
    }
    else {
        return res.render('booksdetail', {
            title: 'Express',
            Authenticated: xacnhan
        });
    }
}

exports.get_profileEditPage = async function (req, res, next) {
    var user = await models.USER.findOne({
        where: {
            email: req.user.email,
        }
    })
    console.log(user);
    return res.render('profile_edit', {
        Authenticated: req.isAuthenticated(),
        user_name: req.isAuthenticated() ? req.user.dataValues.fullName : '',
        user_email: req.isAuthenticated() ? req.user.dataValues.email : '',
        user: user,
    })
}
var CountryCodeToName = require('../utils/convertCountryCodeToCountryName');
exports.post_profileEditPage = function (req, res, next) {
    console.log(req.body)
    // console.log(CountryCodeToName.getCountryName(req.body.country));
    var saveObj = {
        fullName: req.body.fullName,
        gender: req.body.gender,
        phonenumber: req.body.phonenumber,
        level: req.body.level,
        country: CountryCodeToName.getCountryName(req.body.country),
        address: req.body.address,
    };
    for (const key in saveObj) {
        if (!saveObj[key]) {
            delete saveObj[key];
        }
    }
    delete saveObj.dobDate;
    delete saveObj.dobMonth;
    delete saveObj.dobYear;
    if (req.body.dobDate && req.body.dobMonth && req.body.dobYear) {
        saveObj.dob = new Date(req.body.dobYear, Number(req.body.dobMonth) - 1, req.body.dobDate.padStart(2, '0'));
        // saveObj.dob = req.body.dobDate.padStart(2, '0') + '/' + req.body.dobMonth + '/' + req.body.dobYear;
    }
    console.log(saveObj);
    models.USER.update(
        saveObj,
        {
            where: {
                email: req.user.email,
            }
        }
    );
    return res.redirect('/profile');
}