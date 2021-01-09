function loginOrRegister() {
    if ($("#login-tab")[0].ariaSelected == 'true') {
        let email = $.trim($("#loginEmail").val());
        let password = $.trim($("#loginPassword").val());

        let param = "email=" + email;
        param += "&password=" + password;
        $.post('/login', param, function (data) {
            if (data == 'login success') {
                alert(data);
                setTimeout('location.reload()', 500)
                $("#loginEmail").val("");
                $("#loginPassword").val("");
            }else{
                alert(data);
            }
        })
    } else {
        let email = $.trim($("#registerEmail").val());
        let password = $.trim($("#registerPassword").val());
        let isStudent = document.getElementById('identityStudent').checked
        let identity = "";
        if (isStudent) {
            identity = "student";
        } else {
            identity = "staff";
        }
        let param = "email=" + email;
        param += "&password=" + password;
        param += "&identity=" + identity;
        $.post('/register', param, function (data) {
            if (data == 'register success') {
                alert(data);
                setTimeout('location.reload()', 500)
                $("#registerEmail").val("");
                $("#registerPassword").val("");
            }else{
                alert(data);
            }
        })
    }
}