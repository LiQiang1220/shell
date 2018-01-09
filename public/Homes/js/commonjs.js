var tips = [];
var errorInfo = {};
var cfgRegex = {
    chinesePhone: /^(1[0-9])[0-9]{9}$|(^(\+|00)852[9865])[0-9]{7}$/,
    hwPhone: /^[0-9]{5,10}$/,
    email: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9\-]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i,
    anyPhoneAndMail: /^(1[0-9])[0-9]{9}$|^\s*([A-Za-z0-9_-]+(\.\w+)*@(\w+\.)+\w+)\s*$/,
    anyPhone: /^[0-9]{5,15}$/
};

var authCodeCountTimes = 0;
//  解决输入法框出来后页面无法被抬高
$(function () {
    var height = $("body").height();
    var largeHeight = height * 1.0;
    $(document).on("focus", "input", function () {
        $("body").height(largeHeight);

    })
    $(document).on("blur", "input", function () {
        $("body").height(height);
    })
})

function gotoUrl(strUrl) {
    location.href = strUrl;
}

//去掉左右空格
function Trim(text) {
    return text.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 用于验证表单
 * @param valiType 枚举的类型可以选择如下：email、mobile、password、mobilecode
 * @param strContent 被验证的字符内容
 * @returns 返回true、false
 **/
function valiRegular(valiType, strContent) {
    var regular = "";

    switch (valiType) {
        case "email":
            regular = /^\s*([A-Za-z0-9_-]+(\.\w+)*@(\w+\.)+\w+)\s*$/;
            break;
        case "mobile":
            regular = /^1\d{10}$/;
            break;
        case "password":
            regular = /^\S{6,32}$/;
            break;
        case "mobilecode":
            regular = /^\S{4}$/;
            break;
    }

    return regular.test(strContent);
}

/**
 |    locationSearch:字符串如:?a=b&b=2&c=3
 |    key:关键字
 |    return key所对应的value
 **/
function getParmPoint(locationSearch, key) {
    var strArray = locationSearch.split("#");

    for (var i = 0; i < strArray.length; i++) {
        var varTemp = strArray[i].split("=")[0];
        var varTempValue = strArray[i].split("=")[1];
        if (varTemp == key) {
            return varTempValue;
        }
    }
    return "";
}

function getUrlParam(url,key)
{
	var reg = new RegExp("(\\?|\\&)"+key+"\\=(.*?)($|\\&)"); 
	var result=reg.exec(url);
	if(result&&result.length>1)
		return result[2];
	return "";
}

/**
 * 获取手机验证码
 **/
function getMobileCode(smsReqType, reqClientType, lang) {
    var mobilephone = $("#username").val();
    var account = $("#account").val();
    var nationalcode = $("#input_languageCode").val();
    var getCodeButton = $("#getValiCode");
    getCodeButton.attr("IntervalTime", 60);
    getCodeButton.attr("disabled", "disabled");

    var pageTokenObj = $("#pageTokenID");

    if ("undefined" != typeof nationalcode) {
        mobilephone = nationalcode.replace("+", "00") + mobilephone;
    }
    if (mobilephone == "") {
        $("#msg_phone").html("<span class='vam icon-error'>手机号码不能为空！</span>");
        getCodeButton.removeAttr("disabled");
        return;
    }
    var parms = "getMobileValiCode";
    $
        .ajax({
            url: getWebUrl() + parms,
            data: {
                "account": account,
                "reqClientType": reqClientType,
                "smsReqType": smsReqType,
                "lang": lang,
                "mobile": mobilephone
            },
            type: "POST",
            dataType: "text",
            success: function (data) {
                if (data.errorCode == "10000004") {
                    $("<div>").Dialog({
                        title: rss.hint,
                        btnLeft: false,
                        btnRight: {
                            text: rss.IGetIt || "OK",
                            fn: function () {
                                this.hide();
                            }
                        },
                        html: "<p>" + rss.loginOverdue + "</p>"
                    }).Dialog("show");
                    return;
                }
                if (data == "success") {
                    getCodeButton.addClass("auth_code_grey");
                    jsInnerTimeout();
                } else if (data == "70001102") {
                    getCodeButton.removeAttr("disabled");
                    $("#showerror")
                        .html(
                            "<span class='vam icon-error'>一分钟内只允许请求一次，请稍后重试</span>");
                } else if (data == "70001103") {
                    getCodeButton.removeAttr("disabled");
                    $("#showerror")
                        .html(
                            "<span class='vam icon-error'>超出一周内6条发送验证码的最大次数</span>");
                } else if (data == "70001104") {
                    getCodeButton.removeAttr("disabled");
                    $("#showerror")
                        .html(
                            "<span class='vam icon-error'>超出一天发送验证码最大次数</span>");
                } else {
                    getCodeButton.removeAttr("disabled");
                    $("#showerror").html(
                        "<span class='vam icon-error'>获取验证码失败！</span>");
                }
            }
        });
}

function jsInnerTimeout() {
    var codeObj = $("#getValiCode");
    var intAs = parseInt(codeObj.attr("IntervalTime"));

    intAs--;
    codeObj.attr("disabled", "disabled");
    if (intAs <= -1) {
        codeObj.removeAttr("disabled");
        if (typeof codeObj.val() != "undefined") {
            codeObj.val(rss.resend);
        } else {
            codeObj.html(rss.resend);
        }
        codeObj.removeClass("auth_code_grey");
        return true;
    }
    if (typeof codeObj.val() != "undefined") {
        codeObj.val(rss.resend_time.format(intAs));
    } else {
        codeObj.html(rss.resend_time.format(intAs));
    }
    codeObj.attr("IntervalTime", intAs);

    setTimeout("jsInnerTimeout()", 1000);
}

function ajaxJSONP(axjxUrl, queryParms, callbackfun) {
    $.getJSON(axjxUrl + queryParms + "&reflushCode=" + Math.random()
        + "&callback=?", callbackfun);
}

function ajaxHandler(interfaceName, dataParms, successFun, errorFun, isAsync,
                     respnseDataType, dialogOptions) {
    removeAjaxDataAllSpace(dataParms);
    var responseData = $
        .ajax({
            url: getWebUrlHttps() + interfaceName + "?reflushCode="
            + Math.random(),
            type: "POST",
            data: dataParms,
            success: function (data) {
                if ($("#logoutUrl").attr("href")
                    && (data.errorCode == "10000302")) {
                    window.location.href = $("#logoutUrl").attr("href");
                    return;
                }

                var currentDialog = $(".global_dialog_confirm_main");

                if (data.errorCode == "10000004") {
                    currentDialog.hide();
                    $(".send-ajax").removeClass("send-ajax");
                    var defaultOptions = {
                        title: rss.hint,
                        btnLeft: false,
                        btnRight: {
                            text: rss.IGetIt || "OK",
                            fn: function () {
                                this.hide();
                                if (isMobile()
                                    || (window.location.pathname
                                        .indexOf("mobile") > -1)) {
                                    if (window.webLoader) {
                                        window.webLoader.intoApp("ok");// 如果在app打开
                                    } else if (localInfo.urlQurey) {
                                        gotoUrl(localHttps
                                            + "/mobile/standard/welcome.html"
                                            + localInfo.urlQurey);
                                    } else {
                                        gotoUrl(localHttps
                                            + "/mobile/standard/welcome.html");
                                    }

                                }
                                currentDialog.show();
                            }
                        },
                        html: "<p>" + rss.loginOverdue + "</p>"
                    };

                    if (dialogOptions) {
                        $.extend(defaultOptions, dialogOptions);
                    }

                    $("<div>").Dialog(defaultOptions).Dialog("show");
                    return;
                }

                if (data.errorCode == "70001105") {
                    currentDialog.hide();
                    $(".send-ajax").removeClass("send-ajax");
                    $("<div>")
                        .Dialog(
                            {
                                title: rss.hint,
                                btnLeft: false,
                                btnRight: {
                                    text: rss.IGetIt || "OK",
                                    fn: function () {
                                        this.hide();
                                        if (isMobile()
                                            || (window.location.pathname
                                                .indexOf("mobile") > -1)) {
                                            gotoUrl(localHttps
                                                + "/mobile/standard/welcome.html"
                                                + localInfo.urlQurey);
                                        }
                                        currentDialog.show();
                                    }
                                },
                                html: "<p>" + rss.overload
                                + "</p>"
                            }).Dialog("show");
                    return;
                }

                successFun(data);
            },
            error: errorFun,
            cache: false,
            dataType: respnseDataType,
            async: isAsync
        });

    return responseData;
}

function ajaxHandlerAny(url, dataParms, successFun, errorFun, isAsync,
                        respnseDataType) {
    var responseData = $
        .ajax({

            url: url,
            type: "POST",
            data: dataParms,
            success: function (data) {
                if (data.errorCode == "10000004") {
                    $("<div>")
                        .Dialog(
                            {
                                title: rss.hint,
                                btnLeft: false,
                                btnRight: {
                                    text: rss.IGetIt || "OK",
                                    fn: function () {
                                        this.hide();
                                        if (isMobile()
                                            || (window.location.pathname
                                                .indexOf("mobile") > -1)) {
                                            if (window.webLoader) {
                                                window.webLoader
                                                    .intoApp("ok");// 如果在app打开
                                            } else if (localInfo.urlQurey) {
                                                gotoUrl(localHttps
                                                    + "/mobile/standard/welcome.html"
                                                    + localInfo.urlQurey);
                                            } else {
                                                gotoUrl(localHttps
                                                    + "/mobile/standard/welcome.html");
                                            }
                                        }
                                    }
                                },
                                html: "<p>" + rss.loginOverdue
                                + "</p>"
                            }).Dialog("show");
                    return;
                }
                successFun(data);
            },
            error: errorFun,
            cache: false,
            dataType: respnseDataType,
            async: isAsync
        });

    return responseData;
}

/**
 |    函数名称： setCookie
 |    函数功能： 设置cookie函数
 |    入口参数： name：cookie名称；value：cookie 值
 **/
function setCookie(name, value) {
    var argv = setCookie.arguments;
    var argc = setCookie.arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    if (expires != null) {
        var LargeExpDate = new Date();
        LargeExpDate.setTime(LargeExpDate.getTime()
            + (expires * 1000 * 3600 * 24));
    }
    document.cookie = name
        + "="
        + escape(value)
        + ((expires == null) ? "" : ("; expires=" + LargeExpDate
            .toGMTString())) + "; path=" + "/";
}

/**
 |    函数名称： getCookie
 |    函数功能： 读取cookie函数
 |    入口参数： Name：cookie名称
 **/
function getCookie(Name) {
    var search = Name + "=";
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            end = document.cookie.indexOf(";", offset);
            if (end == -1)
                end = document.cookie.length;
            return unescape(document.cookie.substring(offset, end));
        } else
            return "";
    }
}

/**
 |    函数名称： deleteCookie
 |    函数功能： 删除cookie函数
 |    入口参数： Name：cookie名称
 **/
function delCookie(name) {
    var expdate = new Date();
    expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));
    setCookie(name, "", expdate);
}

/**
 |    locationSearch:字符串如:?a=b&b=2&c=3
 |    key:关键字
 |    return key所对应的value
 **/
function getParm(locationSearch, key) {
    var tempQurey = locationSearch.replace("?", "");
    var strArray = tempQurey.split("&");

    for (var i = 0; i < strArray.length; i++) {
        var varTemp = strArray[i].split("=")[0];
        var varTempValue = strArray[i].split("=")[1];
        if (varTemp == key) {
            return varTempValue;
        }
    }
    return "";
}

function isWeakPassword(pwd, callback) {

    var method = "isWeakPassword";
    var params = {
        password: pwd
    };
    ajaxHandler(method, params, function (data) {
        if (data) {
            callback(data);
        }
    }, function () {
    }, true, "json");

}

function chkPwdComplexity(pass) {
    if (pass.length < 8) {
        return 0;
    }
    var ls = 0;
    if (pass.length >= 8 && pass.length <= 32) {
        ls = 1;

    }
    if (pass.match(/([0-9])+/)) {
        ls = 1;

    }
    if (pass.match(/([A-Z])+/) && pass.match(/([a-z])+/)) {
        ls = 1;

    }
    if (pass.match(/([0-9])+/) && pass.match(/([A-Z])+/)
        && pass.match(/([a-z])+/) && pass.length >= 8 && pass.length <= 32) {
        ls = 2;
        if (getRepet(pass) > 3) {
            ls = 3;
        }
    }
    return ls;
}

//获得密码的复杂度对象
function getPwdComplexity(pass) {

    var complex = {
        strong: 0,
        upLowChar: false,
        length: false,
        number: false,
        lengthLt8: false,
        lengthGt32: false,
        missingUppercase: false,
        missingLowercase: false,
        OnlyNumberOrLetter: false
    };
    if (pass.length >= 8 && pass.length <= 32) {

        complex.length = true;
    }
    if (pass.match(/([0-9])+/)) {

        complex.number = true;
    }
    if (pass.match(/([A-Z])+/) && pass.match(/([a-z])+/)) {

        complex.upLowChar = true;
    }

    if (pass.length < 8) {
        complex.lengthLt8 = true;
    }
    if (pass.length > 32) {
        complex.lengthGt32 = true;
    }
    if (!pass.match(/([A-Z])+/)) {
        complex.missingUppercase = true;
    }
    if (!pass.match(/([a-z])+/)) {
        complex.missingLowercase = true;
    }
    if ((pass.match(/([0-9])+/) && !pass.match(/([a-zA-Z])+/))
        || (!pass.match(/([0-9])+/) && pass.match(/([a-zA-Z])+/))) {
        complex.OnlyNumberOrLetter = true;
    }

    complex.strong = chkPwdComplexity(pass);

    return complex;
}

function getRepet(s) {
    s = s + "";
    var i, length = s.length, count = 0, obj = {};
    for (i = 0; i < length; i++) {
        obj[s.charAt(i)] = 1;
    }
    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            count++;
        }
    }
    return count;

}

function onPwdKeyUp(obj) {
    var complex = getPwdComplexity(obj.value);
    var $complexEl = $("#pwdStong")
    if (complex.length && complex.upLowChar && complex.number) {
        isWeakPassword(obj.value, function (data) {
            if (data.isSuccess == 1) {
                $complexEl.addClass("pwd-strong-div")
                    .removeClass("pwd-low-div").removeClass(
                    "pwd-middle-div");
                $('#msg_password').html("");
                $('#pwdDiv').removeClass('input-error-EMUI5');
                $("#pwdComplexFlag").html(rss.strong);
            } else if (data.errorCode == "10000801") {
                $complexEl.addClass("pwd-low-div")
                    .removeClass("pwd-middle-div").removeClass(
                    "pwd-strong-div");
                $('#msg_password').html(rss.error_70008001);
                $("#pwdComplexFlag").html(rss.weak);
                $('#pwdDiv').addClass('input-error-EMUI5');
            }
        })
    } else {
        $complexEl.removeClass("pwd-middle-div").removeClass("pwd-low-div")
            .removeClass("pwd-strong-div");
        $('#msg_password').html("");
        $("#pwdComplexFlag").html("");
        $('#pwdDiv').removeClass('input-error-EMUI5');
    }

    trriger($("#pwdLength"), complex.length);
    trriger($("#pwdChar"), complex.upLowChar);
    trriger($("#pwdNumber"), complex.number);

    function trriger($el, ok) {
        if (ok) {
            $el.find("img").attr("src", localInfo.formatOk);
            $el.removeClass("gay-tips-EMUI5").addClass("success-tips-EMUI5");
        } else {
            $el.find("img").attr("src", localInfo.formatNo);
            $el.removeClass("success-tips-EMUI5").addClass("gay-tips-EMUI5");
        }
    }

    if (complex.strong * 1 < 2) {
        $("#resetPwdBtn").addClass("disabled");
    } else {
        $("#resetPwdBtn").removeClass("disabled");
    }

}

function onPwdKeyUp2(obj) {
    onPwdKeyUp(obj);
    var complex = getPwdComplexity(obj.value);
    trriger($("#pwdLength"), complex.length);
    trriger($("#pwdChar"), complex.upLowChar);
    trriger($("#pwdNumber"), complex.number);

    function trriger($el, ok) {
        if (ok) {

            $el.find("img").attr("src", localInfo.formatOk);
            $el.removeClass("gay-tips").addClass("success-tips");
        } else {
            $el.find("img").attr("src", localInfo.formatNo);
            $el.removeClass("success-tips").addClass("gay-tips");
        }
    }
}

function getUrlParm(name) {
    var search = document.location.search, parts = (!search) ? [] : search
        .split('&'), params = {};

    for (var i = 0, len = parts.length; i < len; i++) {
        var param = parts[i].split('=');
        var pname = param[0];
        if (i == 0) {
            pname = pname.split('?')[1];
        }
        if (name == pname)
            return param[1];
    }
    ;
    return "";
}

var localSites = {
    localUrl: location.href.split("?")[0]
};

function isIe() {
    return ("ActiveXObject" in window);
}

function isPWDComplex(strContent) {
    if ("" == strContent || strContent.length < 8 || strContent.length > 32) {
        return false;
    }

    var chkNumber = /[0-9]+/;
    var chkUpChar = /[A-Z]+/;
    var chklowChar = /[a-z]+/;

    var result = chkNumber.test(strContent) && chkUpChar.test(strContent)
        && chklowChar.test(strContent);
    return result
}

function chgRandomCode(ImgObj, randomCodeImgSrc) {
    if (typeof (ImgObj) != "undefined") {
        ImgObj.src = randomCodeImgSrc + "&_t=" + new Date().getTime();
    }
};

function jsInnerTimeout(codeObj, btnTxt, isNotFirst) {
    codeObj.attr("disabled", true);
    var intAs = parseInt(codeObj.attr("IntervalTime"));
    if (!isNotFirst) {
        $(".ddrop-EMU5").addClass("ddrop-disabled");
        $(".input-error-EMUI5").removeClass("input-error-EMUI5");
        $(".error-tips-EMUI5").html("");
    }
    intAs--;
    codeObj.attr("disabled", true);
    if (intAs <= -1) {
        codeObj.removeAttr("disabled");
        codeObj.removeClass("disabled"); //取消置灰
        codeObj.removeClass("auth_code_grey"); //取消置灰
        $(".ddrop-EMU5").removeClass("ddrop-disabled");
        if (codeObj.attr("type")
            && codeObj.attr("type").toLowerCase() == "button") {
            codeObj.val(btnTxt);
        } else {
            codeObj.find("span:first,a:first").text(btnTxt);
        }

        codeObj.attr("IntervalTime", 60);
        return true;
    }
    if (codeObj.attr("type") && codeObj.attr("type").toLowerCase() == "button") {
        codeObj.val(rss.resend_time.format(intAs));
    } else {
        codeObj.find("span:first,a:first").text(rss.resend_time.format(intAs));
    }

    codeObj.attr("IntervalTime", intAs);

    authCodeCountTimes = setTimeout(function () {
        codeObj.addClass("auth_code_grey");
        jsInnerTimeout(codeObj, btnTxt, true);
    }, 1000);
}

/**
 * transorf from string to JSON
 * @param Json
 * @returns
 */
function JSONstringify(Json) {
    if ($.browser.msie) {
        if ($.browser.version == "7.0" || $.browser.version == "6.0") {
            var result = jQuery.parseJSON(Json);
        } else {
            var result = JSON.stringify(Json);
        }
    } else {
        var result = JSON.stringify(Json);
    }
    return result;
}

$(function () {
    switch (currentSiteID) {
        case "9":
            (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start': new Date().getTime(),
                    event: 'gtm.js'
                });
                var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l='
                    + l
                    : '';
                j.async = true;
                j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-KM5CKL');
            break;
    }
});

//用于判断当前设备是否是移动设备
function isMobile() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Mobile", "Windows Phone",
        "iPad", "iPod"];

    var flag = false;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = true;
            break;
        }
    }
    return flag;
}

//给所有的String类型提供占位符函数  added by l00355523
String.prototype.format = function () {
    if (arguments.length == 0)
        return this;
    for (var s = this, i = 0; i < arguments.length; i++)
        s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    return s;
};

// 下面这个函数负责按照产品的需求显示手机账号  added by l00355523
function getExpressPhone(phone) {
    if (!phone || phone == "") {
        return "";
    }
    if (phone.indexOf("@") >= 0) {
        return phone;
    }

    phone = phone.trim();

    var cnPhonePatt = new RegExp("^(0086)(\\d{3,7}.{0,4}\\d{4})$");
    var countryCodes = new Array("297", "975", "387", "238", "240", "245",
        "691", "680", "250", "684", "86", "81", "91", "61", "852", "65",
        "60", "64", "507", "62", "92", "673", "66", "44", "33", "971",
        "966", "84", "94", "972", "30", "41", "46", "48", "49", "31", "32",
        "7", "353", "39", "45", "234", "263", "358", "265", "249", "357",
        "47", "43", "34", "380", "992", "351", "90", "98", "995", "375",
        "375", "961", "373", "359", "258", "244", "254", "242", "260",
        "968", "327", "372", "421", "36", "965", "352", "355", "370",
        "231", "501", "1268", "378", "40", "212", "213", "354", "1", "356",
        "220", "268", "261", "27", "973", "994", "20", "509", "591", "57",
        "256", "593", "52", "51", "504", "232", "223", "505", "977", "977",
        "1809", "233", "233", "502", "54", "58", "56", "93", "506", "55",
        "1246", "503", "1876", "595", "597", "592", "237", "675", "598",
        "962", "963", "386", "226", "224", "257", "248", "993", "241",
        "95", "974", "264", "235", "267", "230", "423", "252", "251",
        "221", "216", "967", "350", "376", "228", "853", "253", "266",
        "855", "976", "679", "960", "689", "53", "676", "239", "682",
        "1264");
    if (cnPhonePatt.test(phone)) {
        phone = phone.substring(4, 15);
    } else {
        //开始进行逐一的测试，看看传入的手机号码是否是设定数组中的国家码
        var hasFound = false;
        var countryCode;
        for (var i = 0; i < countryCodes.length; i++) {
            var foreignPhonePatt = new RegExp("^(00" + countryCodes[i]
                + ")(\\d*).*(\\d+)$");
            if (foreignPhonePatt.test(phone)) {
                hasFound = true;
                if (countryCode == null) {
                    countryCode = countryCodes[i];
                } else {
                    if (countryCode.length < countryCodes[i].length) {
                        countryCode = countryCodes[i];
                    }
                }
            }
        }
        //此处会得到countryCode，得到之后进行拆分
        if (hasFound) {
            var resPhoneAccount = phone.substring(2 + countryCode.length,
                phone.length);
            phone = "+" + countryCode + " " + resPhoneAccount;
        }
    }
    return phone;
}

function htmlencode(s) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(s));
    return div.innerHTML;
}

function htmldecode(s) {
    var div = document.createElement('div');
    div.innerHTML = s;
    return div.innerText || div.textContent;
}

function htmlDecodeJQ(str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    return div.innerText || div.textContent;
}

function getAccountType(userAccount) {
    if (!userAccount || userAccount == "") {
        return;
    }

    var phoneReg = new RegExp("^([0-9]|(\\+))\\d+(\\*)*\\d+$");

    if (userAccount.indexOf("@") > -1) {
        return 1;
    } else if (phoneReg.test(userAccount)) {
        return 2;
    } else {
        return 0;
    }
}

// 设定页面滚动展示错误的函数，如果错误展示不能在页面中，那么滚动页面，让错误能够让用户看到
function showErrorToBeSeen(srcObj, tipObj, errorInfo) {
    srcObj.parent().css("border", "1px solid #f90404");
    showError(tipObj, errorInfo);
}

function gid(id) {
    return document.getElementById(id);
}

// 让元素从错误状态回归正常
function turnErrorToNormal(srcObj) {
    srcObj.parent().css("border", "1px solid #c5c5c5");
}

// 从uc_base.js, m_base.js, base.js中转移过来
function showError(obj, msg, direction, leftPix, rightPix) {

    if (typeof CLOUD != "undefined") {
        obj
            .html('<div class="secpwd-error-tip" style="display: block;"><div class="cloudPagePop">'
                + msg
                + '</div><div class="panel-arrow-bottoms"><div class="panel-arrow-bodys"></div></div></div>');
        autoHide(obj);
    } else {

        if (direction && direction == "left" && leftPix && rightPix) {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left' style='margin-left:"
                    + leftPix
                    + "px;margin-right:"
                    + rightPix
                    + "px;'><table class='popMsg cas_error'><tr><td><b class='poptips-no'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        } else if (direction && direction == "right" && leftPix && rightPix) {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips' style='margin-left:"
                    + leftPix
                    + "px;margin-right:"
                    + rightPix
                    + "px;'><table class='popMsg cas_error'><tr><td><b class='poptips-no'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        } else if (direction && direction == "left" && leftPix) {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left' style='margin-left:"
                    + leftPix
                    + "px;'><table class='popMsg cas_error'><tr><td><b class='poptips-no'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        } else if (direction && direction == "right" && leftPix) {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips' style='margin-left:"
                    + leftPix
                    + "px;'><table class='popMsg cas_error'><tr><td><b class='poptips-no'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        } else if (direction && direction == "left") {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left'><table class='popMsg cas_error'><tr><td><b class='poptips-no'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        } else {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips'><table class='popMsg cas_error'><tr><td><b class='poptips-no'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        }
        autoHide(obj);

    }

}

$(document).click(function () {

    $.each(tips, function () {
        this.html("");
    })
    tips = [];
})

function showSuccess(obj, msg, direction, leftPix, rightPix) {
    if (typeof CLOUD != "undefined") {
        obj
            .html('<div class="secpwd-error-tip" style="display: block;"><div class="cloudPagePop">'
                + msg
                + '</div><div class="panel-arrow-bottoms"><div class="panel-arrow-bodys"></div></div></div>');
        autoHide(obj);
    } else {

        if (direction && direction == "left" && leftPix && rightPix) {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left' style='margin-left:"
                    + leftPix
                    + "px;margin-right:"
                    + rightPix
                    + "px;'><table class='popMsg cas_ok'><tr><td><b class='poptips-yes'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        } else if (direction && direction == "right" && leftPix && rightPix) {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips' style='margin-left:"
                    + leftPix
                    + "px;margin-right:"
                    + rightPix
                    + "px;'><table class='popMsg cas_ok'><tr><td><b class='poptips-yes'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        } else if (direction && direction == "left" && leftPix) {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left' style='margin-left:"
                    + leftPix
                    + "px;'><table class='popMsg cas_ok'><tr><td><b class='poptips-yes'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        } else if (direction && direction == "right" && leftPix) {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips' style='margin-left:"
                    + leftPix
                    + "px;'><table class='popMsg cas_ok'><tr><td><b class='poptips-yes'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        } else if (direction && direction == "left") {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left'><table class='popMsg cas_ok'><tr><td><b class='poptips-yes'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        } else {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips'><table class='popMsg cas_ok'><tr><td><b class='poptips-yes'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        }
        autoHide(obj);
    }

}

/*
 * 验证码发送消息
 option={
 obj:显示消息的jquery对象,  （必填）
 msg:"", //消息正文  （必填）
 leftPix:-50,// 常规语的向左偏移（选填）
 rightPix:-50,//反向语的向右偏移量（选填）
 topPix:-10 , //向上的偏移量（选填）
 lang:lang // 语言（选填）
 }
 */

var showMsgSuccess = function () {
    function showMsgSuccess(option)//
    {

        var maxWidth = 236;
        var defaultOption = {
            leftPix: "0px",
            rightPix: "0px",
            bottom: "20px",
            contentType:"text",
            autoHide:true
        }
        option = $.extend(defaultOption, option);

        var obj = option.obj;
        var language = option.lang || localInfo.lang || lang;
        var contentHtml = "";
        var left = option.leftPix;
        var right = option.rightPix;
        var style = "font-size:14px;line-height:1.5;";
        var bottom = option.bottom;
        var contentClass="tip-center";
        if(option.contentType=="text")
        {	
        var msgWidth = countLength(option.msg, style);
        var width;
        var contentWidth;
        var msgWidth;
        if (msgWidth > maxWidth) {
            width = maxWidth;
            style += "width:" + width + "px";
        } else {
            width = msgWidth;
        }
        contentWidth = (width + 50) + "px";
        width += "px";
        var height = countHeight(option.msg, style); 
        height += "px";
        }
        else
        { 
        	//contentClass="html-content";
        	var htmlSize = countHtmlSize(option.msg);
        	height=htmlSize.height+"px";
        	width = htmlSize.width+"px";
        	contentWidth = (htmlSize.width+50)+"px"; 
        }	
        if (language == "ar-eg" || language == "iw-il" || language == "fa-ir"
            || language == "ur-pk") {
            contentHtml = '<div class="success-tip" style="right:' + right
                + ';bottom:' + bottom + ';width:' + contentWidth + '">'
        } else {
            contentHtml = '<div class="success-tip" style="left:' + left
                + ';bottom:' + bottom + ';width:' + contentWidth + '">'
            if(option.contentType=="text")
            {	
            option.msg = getMsg(option.msg);
            }
        }

        var html = '<div class="success-tip-content">' + contentHtml
            + '<div class="tip-left-top"></div>'
            + '<div class="tip-right-top"></div>'
            + '<div class="tip-top" style="width:' + width + '"></div>'
            + '<div class="tip-left" style="height:' + height + '"></div>'
            + '<div class="tip-right" style="height:' + height + '"></div>'
            + '<div class="'+contentClass+'" style="width:' + width + ';height:'
            + height + ';padding-right:5px;">' + option.msg + '</div>'
            + '<div class="tip-left-bottom"></div>'
            + '<div class="tip-right-bottom"></div>'
            + '<div class="tip-bottom" style="width:' + width
            + '"></div></div></div>';

        obj.html(html);
        if(option.autoHide)
        {	
        autoHide(obj);
        }
   
        function countLength(msg, style) {
            var id = "count" + new Date().getTime();
            style += ";visibility:hidden;word-wrap:break-word;word-break:break-all;"
            var html = "<span id='" + id + "' style='" + style + "'>" + msg
                + "</span>"
            $("body").append(html);
            var width = $("#" + id)[0].offsetWidth;
            $("#" + id).remove();
            return width;
        }

        function countHeight(msg, style) {
            var id = "count" + new Date().getTime();
            style += ";visibility:hidden;word-wrap:break-word;word-break:break-all;font-family:"
                + $("body").css("font-family");
            var html = "<div id='" + id + "' style='" + style + "'>" + msg
                + "</div>"
            $("body").append(html);
            var height = $("#" + id)[0].offsetHeight;
            $("#" + id).remove();
            return height;
        }
        
        function countHtmlSize(el)
        {
        	var id = "count" + new Date().getTime();
            var html = "<div id='" + id + "' style='position:absolute;font:"+obj.css("font")+"' >" + el+ "</div>"
            $("body").append(html);
            var height = $("#" + id)[0].offsetHeight;
            var width = $("#"+id)[0].offsetWidth;
            $("#" + id).remove();
            return {
            	height:height,
            	width:width
            };	
        }
        
    }

    
    
    function getMsg(msg) {
        var id = "count" + new Date().getTime();
        var html = "<div id='" + id + "'>" + msg + "</div>"
        $("body").append(html);
        var text = $("#" + id).text();
        $("#" + id).remove();
        return text;
    }

    return showMsgSuccess;

}();

function showWarning(obj, msg, direction, leftPix, rightPix) {
    if (typeof CLOUD != "undefined") {
        obj
            .html('<div class="secpwd-error-tip" style="display: block;"><div class="cloudPagePop">'
                + msg
                + '</div><div class="panel-arrow-bottoms"><div class="panel-arrow-bodys"></div></div></div>');
        autoHide(obj);
    } else {
        if (direction && direction == "left" && leftPix && rightPix) {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left' style='margin-left:"
                    + leftPix
                    + "px;margin-right:"
                    + rightPix
                    + "px;'><table class='popMsg cas_warn'><tr><td><b class='poptips-warn'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        } else if (direction && direction == "right" && leftPix && rightPix) {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips' style='margin-left:"
                    + leftPix
                    + "px;margin-right:"
                    + rightPix
                    + "px;'><table class='popMsg cas_warn'><tr><td><b class='poptips-warn'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        } else if (direction && direction == "left" && leftPix) {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left' style='margin-left:"
                    + leftPix
                    + "px;'><table class='popMsg cas_warn'><tr><td><b class='poptips-warn'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        } else if (direction && direction == "right" && leftPix) {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips' style='margin-left:"
                    + leftPix
                    + "px;'><table class='popMsg cas_warn'><tr><td><b class='poptips-warn'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        } else if (direction && direction == "left") {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left'><table class='popMsg cas_warn'><tr><td><b class='poptips-warn'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        } else {
            obj
                .html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips'><table class='popMsg cas_warn'><tr><td><b class='poptips-warn'></b></td><td>"
                    + msg + "</td></tr></table></div></div></div>");
        }
        autoHide(obj);
    }

}

//检测 agreementContentsStr，当营销未被选中的时候，将影响的ver调整为ignore。
function checkAdMarketAgreedAgrContent(agreementContentsStr) {

    if (agreementContentsStr == undefined) {
        return agreementContentsStr;
    }

    var jsonAgr = eval(agreementContentsStr);
    var arrayObj = new Array();

    for (var i = 0; i < jsonAgr.length; i++) {
        if (jsonAgr[i].id != 10) {
            arrayObj.push(jsonAgr[i]);
        } else {
            // 如果是营销的话，将营销的ver调整为 ignore
            jsonAgr[i].ver = "ignore";
            arrayObj.push(jsonAgr[i])
        }
    }

    return JSON.stringify(arrayObj);
}

function loadDefaultPic(thisEle) {
    // 如果加载失败的话，自动调整为默认的图片
    thisEle.src = localInfo.defaultPic;
}

window.getHeight = function () {
    if (window.innerHeight != undefined) {
        return window.innerHeight;
    } else {
        var B = document.body, D = document.documentElement;
        return Math.min(D.clientHeight, B.clientHeight);
    }
}
window.getWidth = function () {
    if (typeof window.innerWidth != "undefined") {
        return window.innerWidth;
    } else {
        return Math.min(document.body.clientWidth,
            document.documentElement.clientWidth);
    }
}

String.prototype.trim = function () {
    if (this == "") {
        return this;
    }
    return this.replace(/^\s*|\s*$/g, "");
}

function initEMUI5WapLayout() {
    /*
     * 绿色区域为21:9
     * title到appbar的间距为绿色区域的27%
     */
    var initLayout = (function () {
        return function () {
            var head = document.getElementById("head");
            var headContent = document.getElementById("headContent");
            var width = document.body.clientWidth;
            var headHeight = width * 9 / 21;
            head.style["min-height"] = headHeight + "px";
            headContent.style["padding-top"] = headHeight * 0.27 + "px";
            headContent.style["padding-bottom"] = "8px";
            var bodyHeight = document.body.clientHeight;
            var htmlHeight = document.documentElement.clientHeight;
            var htmlWidth = document.documentElement.clientWidth;
        //    $("#headContent").html("bodyHeight="+bodyHeight+"  htmlHeight="+htmlHeight+"  htmlWidth="+htmlWidth)

            if (bodyHeight+48> htmlHeight) {
                $("body").css("position", "relative");
                $(".footBtn-div").css("position", "relative");
                window.scrollTo(0,35);
            } else {
                $("body").css("position", "static");
                $(".footBtn-div").css("position", "absolute");
            }

        }
    })();
    initLayout();

    var evt = "resize";
    window.addEventListener(evt, function () {
        setTimeout(function () {
            initLayout();
        }, 100);
    }, false);

}

function initEMUI5WapLayout_3_2() {
    /**
     * 绿色区域比例为3:2
     */
    var initLayout = (function () {
        return function () {
            var head = document.getElementById("head");
            var width = document.body.clientWidth;
            var headHeight = width * 2 / 3;
            head.style.height = headHeight + "px";
            var bodyHeight = document.body.clientHeight;
            var htmlHeight = document.documentElement.clientHeight;
            var htmlWidth = document.documentElement.clientWidth;

            if (bodyHeight > htmlHeight || htmlWidth > htmlHeight) {
                $("body").css("position", "relative");

            } else {
                $("body").css("position", "static");
            }

        }
    })();
    initLayout();

    var evt = "resize";
    window.addEventListener(evt, function () {
        setTimeout(function () {
            initLayout();
        }, 100);
    }, false);

}

/**
 * 获取”没有收到验证码？“页面的超链接Div
 */
function getNoAuthCodeLinkDiv(styleValue, openInCurrentPage) {
    if (!localInfo) {
        return '';
    }

    if (localInfo.isOpenApealSelf != 'true') {
        return '';
    }

    var link;
    if (styleValue) {
        link = '<div class="representation_div center" style="' + styleValue
            + '">';
    } else {
        link = '<div class="representation_div center">';
    }

    if (openInCurrentPage) {
        link = link + '<a class="representation_link" href="'
            + localInfo.representationLink + '&extInfo='
            + localInfo.extInfo + '">'
            + rss.representation_not_receive_verification_code
            + '</a></div>';
    } else {
        link = link
            + '<a target="_blank"  class="representation_link a-EMUI5" href="'
            + localInfo.representationLink + '&extInfo='
            + localInfo.extInfo + '">'
            + rss.representation_not_receive_verification_code
            + '</a></div>';
    }

    return link;
}

function htmlDecodeJQ(str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    return div.innerText || div.textContent;
}

function wapToast(msg) {

    var contStyle = "font-size:13px;padding:0 12px";
    var width = countLength(msg, contStyle);
    var msgStyle = "font-size:13px;text-align:center;background-color:rgba(209,209,209,0.9);border-radius: 16px;min-width: 76px;margin:0 auto;max-width: 236px;width:"
        + width + "px;"
    if (width > 260) {
        msgStyle += "padding:6px 12px;";
    } else {
        msgStyle += "padding:0 12px;height:32px;line-height:32px;";
    }

    var id = "toast" + new Date().getTime();
    var html = "<div  id='" + id + "' style='" + msgStyle + "'>" + msg
        + "</div>";
    if ($("#toastContent").length > 0) {
        if ($("#toastContent div").length > 0) {
            html = "<div  id='" + id + "' style='" + msgStyle
                + "margin-top:10px'>" + msg + "</div>";
        }
        $("#toastContent").append(html);
    } else {
        var toastContenHtml = "<div id='toastContent' style='position:fixed;bottom:64px;width:100%;z-index:100000'></div>"
        $("body").append(toastContenHtml);
        $("#toastContent").append(html);
    }

    setTimeout(function () {
        $("#" + id).remove();
    }, 2000);

    function countLength(msg, style) {
        msg = msg.trim();
        var id = "count" + new Date().getTime();
        style += ";visibility:hidden;word-wrap:break-word;word-break:break-all;"
        var html = "<span id='" + id + "' style='" + style + "'>" + msg
            + "</span>"
        $("body").append(html);
        var width = $("#" + id)[0].offsetWidth;
        $("#" + id).remove();
        return width;
    }

}

// 手机号只允许输入数字      

$(document).on("keyup", ".input-number", function () {

    var reg = /\D/g;
    if (reg.test(this.value)) {
        this.value = this.value.replace(reg, "");
    }
})
$(document).on("paste", ".inuput-number", function () {
    var reg = /\D/g;
    if (reg.test(this.value)) {
        this.value = this.value.replace(reg, "");
    }
})


function autoHide(obj) {
    var attr = obj.attr("tiptimer");
    if (!attr) {
        attr = "tiptimer" + new Date().getTime();
        obj.attr("tiptimer", attr);
    }

    if (errorInfo[attr]) {
        window.clearTimeout(errorInfo[attr]);
    }

    errorInfo[attr] = window.setTimeout(function () {
        errorInfo[attr] = null;
        obj.html("");
    }, 3000);
}


//计算一段字符的长度
function countLength(str, fontSize) {
    if (str) {
        str = str.trim();
    }
    var id = "count" + new Date().getTime();
    var style = "visibility:hidden;word-wrap:break-word;word-break:break-all;font-size:" + fontSize;
    var html = "<span id='" + id + "' style='" + style + "'>" + str + "</span>"
    $("body").append(html);
    var width = $("#" + id)[0].offsetWidth;
    $("#" + id).remove();
    return width;
}

//给页面元素添加按下效果。移动端，对active伪类支持不好，（特别是华为手机内置浏览器，不管进行怎样的特殊处理（body上加上touchstart空事件），都不支持active）
function addCssActive(targetEl, activeClass, disabledClass) {
    disabledClass = disabledClass || "disabled";
    targetEl.bind("touchstart", function (event) {
        var _$this = $(this);
        if (_$this.hasClass(disabledClass))
            return;
        _$this.addClass(activeClass);

    })

    targetEl.bind("touchend", function () {
        $(this).removeClass(activeClass);
    })

    // 必须在document上加上toucend进行处理(有些浏览器如uc，在元素上滑动离开时不会触发 该元素上的touchend事件)
    $(document).bind("touchend", function () {
        targetEl.removeClass(activeClass);

    })
}

//给页面item添加按下效果。
function addItemActive(targetEl, activeClass, disabledClass) {
    disabledClass = disabledClass || "disabled";
    targetEl.bind("touchstart", function (event) {

        var _$this = $(this);
        if (_$this.hasClass(disabledClass))
            return;
        var pre = _$this.prev();
        var next = _$this.next();
        if (pre.hasClass("uc-line")) {
            pre.hide();
        }
        if (next.hasClass("uc-line")) {
            next.hide();
        }

        _$this.addClass(activeClass);

    })

    targetEl.bind("touchend", function () {
        var _$this = $(this);

        var pre = _$this.prev();
        var next = _$this.next();
        if (pre.hasClass("uc-line")) {
            pre.show();
        }
        if (next.hasClass("uc-line")) {
            next.show();
        }
        $(this).removeClass(activeClass);
    })

    // 必须在document上加上toucend进行处理(有些浏览器如uc，在元素上滑动离开时不会触发 该元素上的touchend事件)
    $(document).bind("touchend", function () {
        targetEl.removeClass(activeClass);
        targetEl.each(function () {
            var _$this = $(this);
            var pre = _$this.prev();
            var next = _$this.next();
            if (pre.hasClass("uc-line")) {
                pre.show();
            }
            if (next.hasClass("uc-line")) {
                next.show();
            }
        })
    })
}

function showSystemError(msg, btnText) {
    $("div").DialogSimple({
        text: msg,
        btnText: btnText
    }).show();
}

function isRightLang(lang) {
    lang = lang || localInfo.lang;
    if (lang == "ar-eg" || lang == "iw-il" || lang == "fa-ir"
        || lang == "ur-pk")
        return true;
    return false;
}

function showTipDialog(title, btnText, content, callback) {
    $("<div>").DialogSimple(
        {
            btnFn: function () {
                this.hide();
                if (typeof callback == "function") {
                    callback();
                }

            },
            btnText: btnText,

            text: '<div class="center" style="margin-bottom:10px">'
            + '<img  src="' + localInfo.successImgPath + '">'
            + '<p class="inptips2">' + content + '</p>' + '</div>'
        }).show();
}


function chkSecurityRiskFn(option) {
	if(localInfo.needCompleteThirdInfo == "true")
		return;
    var defaultOption = {
        showRiskError: function (errorCode) {
            if (errorCode == "70008800") {
                showSystemError(rss.error_risk_70008800, rss.iKnowBtn);
            } else {
                showSystemError(rss.overload, rss.iKnowBtn);
            }
        },
        accountType: localInfo.accountType,
        userAccount: localInfo.userAccount,
        reqClientType: localInfo.reqClientType

    }
    option = $.extend(defaultOption, option);

    var dataParms = {
        accountType: option.accountType,
        userAccount: option.userAccount,
        sceneID: option.sceneID,
        reqClientType: option.reqClientType
    }

    var method = "chkSecurityRiskBySession";
    if (option.noLogin) {
        method = "chkSecurityRisk";
    }
    ajaxHandler(method, dataParms, function (data) {
        if ("1" == data.isSuccess) {
            option.callback(data);
        } else {
            option.showRiskError(data.errorCode);
        }

    }, function (data) {

    }, true, "JSON");

}

function get4FactorsListFn(sceneID, callback, noLogin) {
    var dataParms = {
        sceneID: sceneID
    }
    var method = "get4FactorsListBySession";
    if (noLogin) {
        method = "get4FactorsList";
    }
    ajaxHandler(method, dataParms, function (data) {
        if ("1" == data.isSuccess) {
            callback(data);
        } else {

        }

    }, function (data) {

    }, true, "JSON");
}

function initAccountList(des) {
    var obj = $.parseJSON(des);
    var accountList = [];
    $.each(obj.authCodeSentList, function (i, v) {
        if (v.accountType == 1 || v.accountType == 2 || v.accountType == 5
            || v.accountType == 6) {
            accountList.push({
                userAccount: v.name,
                accountType: v.accountType
            });
        }
    })
    return accountList;
}

/*兼容性FormData*/
var myFormData = (function () {


   
	if($.browser.msie&&$.browser.version*1<=9)
		return null;

    // 判断是否需要blobbuilder
    var needsFormDataShim = (function () {
            var bCheck = ~navigator.userAgent.indexOf('Android')
                && ~navigator.vendor.indexOf('Google')
                && !~navigator.userAgent.indexOf('Chrome');

            return bCheck && navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;
        })(),
        blobConstruct = !!(function () {
            try {
                return new Blob();
            } catch (e) {
            }
        })(),
        XBlob = blobConstruct ? window.Blob : function (parts, opts) {
            var bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
            parts.forEach(function (p) {
                bb.append(p);
            });

            return bb.getBlob(opts ? opts.type : undefined);
        }, 
        myFormData = (function () {

            return needsFormDataShim ? FormDataShim : FormData;

        })();

    function FormDataShim() {
        // Store a reference to this
        var o = this,
            parts = [],// Data to be sent
            boundary = Array(5).join('-') + (+new Date() * (1e16 * Math.random())).toString(32),
            oldSend = XMLHttpRequest.prototype.send;

        this.append = function (name, value, filename) {
            parts.push('--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"');

            if (value instanceof Blob) {
                parts.push('; filename="' + (filename || 'blob') + '"\r\nContent-Type: ' + value.type + '\r\n\r\n');
                parts.push(value);
            } else {
                parts.push('\r\n\r\n' + value);
            }
            parts.push('\r\n');
        };

        // Override XHR send()
        XMLHttpRequest.prototype.send = function (val) {
            var fr,
                data,
                oXHR = this;

            if (val === o) {
                //注意不能漏最后的\r\n ,否则有可能服务器解析不到参数.
                parts.push('--' + boundary + '--\r\n');
                data = new XBlob(parts);
                fr = new FileReader();
                fr.onload = function () {
                    oldSend.call(oXHR, fr.result);
                };
                fr.onerror = function (err) {
                    throw err;
                };
                fr.readAsArrayBuffer(data);

                this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
                XMLHttpRequest.prototype.send = oldSend;
            }
            else {
                oldSend.call(this, val);
            }
        };
    }

    return myFormData;
})()


/*将 base64转换为blob对象*/
function dataURLtoBlob(data) {
    var tmp = data.split(',');

    tmp[1] = tmp[1].replace(/\s/g, '');
    var binary = atob(tmp[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new newBlob(new Uint8Array(array), 'image/jpeg');
}

function newBlob(data, datatype) {
    var out;
    try {
        out = new Blob([data], {type: datatype});
    }
    catch (e) {
        window.BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;

        if (e.name == 'TypeError' && window.BlobBuilder) {
            var bb = new BlobBuilder();
            bb.append(data.buffer);
            out = bb.getBlob(datatype);
        }
        else if (e.name == "InvalidStateError") {
            out = new Blob([data], {type: datatype});
        }
        else {
        }
    }
    return out;
}

String.prototype.removeAllSpace = function () {
    return this.replace(/\s+/g, "");
}

function removeAjaxDataAllSpace(data) {
    var items = [ "authCode",  "oldAuthCode",  "email",   "eMailAuthCode", "smsAuthCode", "newAuthCode", "twoStepVerifyCode"
        ,"vAuthCode", "eMail", "eMailActivateCode", "smsAuthCode", "newAuthCode","secVerifyCode","randomCode","randomAuthCode"];
    $.each(items, function (i, v) {
        if (data.hasOwnProperty(v) && typeof data[v] == "string") {
            data[v] = data[v].removeAllSpace();
        }
    })
}
	
	
function getCversion() {
	var userAgentInfo = navigator.userAgent;

	if (!userAgentInfo) {
		return;
	}

	userAgentInfo = userAgentInfo.toLowerCase();

	var fromindex = userAgentInfo.indexOf('cversion=');

	if (fromindex < 0) {
		return;
	}
	
	// cversion=HwID_2.5.3
	var toIndex = userAgentInfo.indexOf('_', fromindex);
	
	if (toIndex < 0) {
		return;
	}
	
	var start = toIndex + 1;
	
	var length = 5;
	
	var cversion = userAgentInfo.substr(start, length);// 在字符串中抽取从 start 下标开始的指定数目的字符

	return cversion;
}	

function wapUploadPic(formData,successFn,errorFn)
{
	$.ajax({
		url:localInfo.localHttps+"/ajaxHandler/displayPic?reflushCode="+Math.random() + "&iswap=1",
		type:"POST",
		data:formData,
		dataType:"json",
		processData: false,
		contentType: false,
		success:successFn,
		error:errorFn
	})
	
}

$(function(){
//ie9及以下去除眼睛
	if($.browser.msie&&$.browser.version*1<=9)
	{
		$("#passwdEye").remove();
	}	
	
	
})

function isApp(){
	return /phoneservice/.test(navigator.userAgent)||/huaweimessager/.test(navigator.userAgent)	
}

//将一个字串中的英文转换为大写
function toUperCaseStr(str)
{
	 var lang = localInfo.lang||getUrlParm("lang");
	 if(!/^en-/.test(lang)||!str)
		 return str;
	 var orign=htmldecode(str);
	 var upperStr = orign.toUpperCase(orign);
	 str=str.replace(orign,upperStr);
	 return str;
}

//导航编号Ctrl
function initStepNavigation($stepContainerDom,selectedStep,totalStep){
    var stepNavStr = '<div class="stepNav-container">';
    var totalStep = totalStep?((totalStep > 0)?totalStep:4):4;
    var selectedStep = selectedStep?((selectedStep > 0 && selectedStep <= totalStep)?selectedStep:1):1;
    var index = 1;
    for(;index < totalStep;index++){
        stepNavStr += '<div class="stepNav'+ index +'"></div><div class="tepNav-split"></div><div class="stepNav-dot"></div><div class="tepNav-split"></div><div class="stepNav-dot"></div><div class="tepNav-split"></div>'
    }
    stepNavStr += '<div class="stepNav'+ index +'"></div></div>';
    if($stepContainerDom){
        $stepContainerDom.html(stepNavStr);    
        $stepContainerDom.find('.stepNav'+selectedStep).addClass('stepNav'+selectedStep+'-selected');
    }  
}

//动态生成申诉更改链接DOM
function getAppealChangesLinkDiv(accountList,isSecAccount,openInCurrentPage,fixStyle){
    var hasPhone = false, hasEmail = false, linkStr = '';
    if(accountList && accountList.length > 0){
        $.each(accountList,function(index,item){
            if(item.label.indexOf("@") != -1){
                hasEmail = true; 
            }else{
                hasPhone = true;
            }
        });
    }
    linkStr = '<div class="appealChangeLink_div center" style="'+ fixStyle +'">';
    //同时存在手机号和邮件地址
    if(hasPhone && hasEmail){
        if(isSecAccount){
            linkStr += '<div class="cantReciveTips">'+ rss.appeal_label_cantReceiveBysecPhoneOrsecEmail +'</div>';
        }else{
            linkStr += '<div class="cantReciveTips">'+ rss.appeal_label_cantReceiveByPhoneOrEmail +'</div>';
        }
    }else if(hasPhone && !hasEmail){
        if(isSecAccount){
            linkStr += '<div class="cantReciveTips">'+ rss.appeal_label_cantReceiveBysecPhone +'</div>';
        }else{
            linkStr += '<div class="cantReciveTips">'+ rss.appeal_label_cantReceiveByPhone +'</div>';
        }
    }else if(hasEmail && !hasPhone){
        if(isSecAccount){
            linkStr += '<div class="cantReciveTips">'+ rss.appeal_label_cantReceiveBysecEmail +'</div>';
        }else{
            linkStr += '<div class="cantReciveTips">'+ rss.appeal_label_cantReceiveByEmail +'</div>';
        }
    }
    
    if (openInCurrentPage) {
        linkStr = linkStr + '<a class="representation_link a-EMUI5" href="'
            + localInfo.representationLink + '&extInfo='
            + localInfo.extInfo + '">'
            + rss.appeal_label_appealChange
            + '</a></div>';
    } else {
        linkStr = linkStr + '<a target="_blank"  class="representation_link a-EMUI5" href="'
            + localInfo.representationLink + '&extInfo='
            + localInfo.extInfo + '">'
            + rss.appeal_label_appealChange
            + '</a></div>';
    }
    
    return linkStr;
}
/**/
function showInputError($inputEl,msg,$errorTipEl)
{
	$errorTipEl = $errorTipEl||$inputEl.next();
	$inputEl.addClass("error-underline");
	$errorTipEl.addClass("underline-error-tips").html(msg);
}
function hideInputError($inputEl,$errorTipEl)
{
	$errorTipEl = $errorTipEl||$inputEl.next();
	$inputEl.removeClass("error-underline");
	$errorTipEl.html("");
}
