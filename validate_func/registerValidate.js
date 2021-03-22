exports.valiReg = function (data) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!data.name) {
        return "Username không được để trống";
    }
    if (!re.test(data.email)) {
        return "Email không hợp lệ";
    }
    if (data.password != data.re_password) {
        return "Password1 và password2 không trùng nhau";
    }
    if (!data.agreeterm) {
        return "Bạn chưa đồng ý với các thoả thuận dịch vụ";
    }
}
