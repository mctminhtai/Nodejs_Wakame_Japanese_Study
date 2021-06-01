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

exports.get_profileEditPage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('example', {
            title: 'Express',
            Authenticated: xacnhan,
            user_name: req.user.dataValues.fullName,
            user_email: req.user.dataValues.email
        });
    }
    else {
        return res.render('example', {
            title: 'Express',
            Authenticated: xacnhan
        });
    }
}

exports.post_profileEditPage = function (req, res, next) {

    console.log('dang body')
    console.log(req.body)
    console.log('dang token')
    console.log(req.session.token)
    models.USER.update(
        {
            fullName: req.body.fullName,
            gender: req.body.gender,
            dob: req.body.dob,
            phonenumber: req.body.phonenumber,
            level: req.body.level,
            country: req.body.country,
            address: req.body.address
        },
        {
            where: {
                email: req.body.email,
            }
        }
    );
    if (res.send(req.user.email) == req.user.dataValues.email) {
        res.send(req.user.email);
    }
    else {
        res.send('not ok');

    }
    // return res.render('profile', {
    //     title: 'Express',
    //     Authenticated: xacnhan
    // });
}