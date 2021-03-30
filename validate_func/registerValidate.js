const models = require('../models');
exports.valiReg = async function (data) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let error = [];
    if (users.length > 0) {
        error.push("Email này đã tồn tại");
    }
    if (!data.name) {
        error.push("Username không được để trống");
    }
    if (!re.test(data.email)) {
        error.push("Email không hợp lệ");
    }
    if (data.password != data.re_password) {
        error.push("Password1 và password2 không trùng nhau");
    }
    if (!data.agreeterm) {
        error.push("Bạn chưa đồng ý với các thoả thuận dịch vụ");
    }
    users = await models.User.findAll({
        attributes: ['email'],
        where: { email: data.email }
    });
}
