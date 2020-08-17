/**
 * Css init.
 */
$('html').css('overflow', 'hidden')

$(document).ready(function () {

    $('.toggle').on('click', function () {
        $('.container').stop().addClass('active')
    })

    $('.close').on('click', function () {
        $('.container').stop().removeClass('active')
    })

    /**
     * Init bcrypt.
     */
    var bcrypt = dcodeIO.bcrypt

    /**
     * Click the Login Button.
     * @param user
     * @param pswd
     */
    $("#login-btn").click(function () {
        let email = $("#email1").val()
        let pswd = $("#pswd1").val()
        if (email === '' || pswd === '') {
            alert("sorry, password doesn't match to the username.")
            return
        }
        let _data = { email, pswd }
        $.ajax({
            url: '/users/login',
            data: _data,
            dataType: 'json',
            type: 'POST',
            success: function (res) {
                if (res.failed) {
                    alert("sorry, password doesn't match to the username.")
                } else {
                    $.ajax({
                        url: "/", success: function (result) {
                            window.location.href = '/'
                        }
                    })
                }
            }
        })
    })
    /**
     * Click the Register Button.
     * @param user
     * @param pswd
     */
    $("#register-btn").click(function () {
        let pttr = /^.*@.*\..*/
        let email = $('#email2').val()
        let name = $('#name').val()
        let pswd = $('#pswd2').val()
        if (email === '' || name === '' || pswd === '') {
            alert("email exist, register failed :(")
            return
        } else if (!pttr.test(email)) {
            alert("Please input your email as 'example@website.suffix'.")
            return
        }
        let _data = { email, name, pswd: pswd }

        $.ajax({
            url: '/users/login',
            data: _data,
            dataType: 'json',
            type: 'POST',
            success: function (res) {
                if (res.success) {
                    $.ajax({
                        url: "/", success: function (result) {
                            window.location.href = '/'
                        }
                    })
                } else {
                    alert("Email exist, register failed :(")
                }
            },
            error: function (res) {
                console.log("oops, post failed")
            }
        })
    })
})
