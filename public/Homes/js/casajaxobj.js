;
(function (factory) {
    //amd模式，可使用requirejs引用
    if (typeof define == "function" && define.amd) {
        define(factory);
    } else {
        //非amd模式，定义在windows上
        factory(window, jQuery);
    }
})(function (window, $) {
    var casAjaxObj = {
        //登录后验证密码
        verifyPasswordBySessionFn: verifyPasswordBySessionFn,
        //登录前验证密码
        verifyPasswordFn: verifyPasswordFn,
        //验证身份证后六位
        checkIdCardLast6Fn: checkIdCardLast6Fn,
        //登录前获取激活邮箱的邮件
        getActivateEMailURLFn:getActivateEMailURLFn,
       //登录后获取激活邮箱的邮件
        getActivateEMailURLBySessionFn:getActivateEMailURLBySessionFn
        

    };

    //登录后验证密码
    function verifyPasswordBySessionFn(dataParams, successFn, errorFn) {
        var params = {
            operType: dataParams.operType,//web销户 1;儿童帐号登录时，更新用户协议 2 wap 销户 3;
            reqClientType: dataParams.reqClientType,
            "languageCode": dataParams.languageCode,
            password: dataParams.password
        }

        ajaxHandler("verifyPasswordBySession", params, function (data) {
            if (typeof errorFn != "function" || data.isSuccess == "1") {
                successFn(data);
            }
            else if (typeof errorFn == "function") {
                var errorCode = data.errorCode;
                if (errorCode == "10000010") {
                    errorFn(rss.error_1000010);
                }
            }


        }, function (data) {

        }, true, "JSON");
    }

    //登录前验证密码
    function verifyPasswordFn(dataParams, callback) {
        var params = {
            operType: dataParams.operType,//web销户 1;儿童帐号登录时，更新用户协议 2 wap 销户 3;
            reqClientType: dataParams.reqClientType,
            "languageCode": dataParams.languageCode,
            password: dataParams.password
        }
        ajaxHandler("verifyPassword", params, function (data) {

            callback(data);

        }, function (data) {

        }, true, "JSON");
    }

    //验证身份证后六位
    function checkIdCardLast6Fn(dataParams, successFn, errorFn) {
        var params = {
            "iDCardNum": dataParams.iDCardNum
        }
        ajaxHandler("checkIDCard", params, function (data) {

            if (typeof errorFn != "function" || data.isSuccess == "1") {
                successFn(data);
            }
            else if (typeof errorFn == "function") {
                var errorCode = data.errorCode;
                if (errorCode == "10000001")//参数错误
                {
                    errorFn(rss.error_10000001);
                }
                else if (errorCode == "10000600")//session丢失 
                {
                    errorFn(rss.error_10000600);
                }
                else if (errorCode == "10001005")//身份证校验失败
                {
                    errorFn(rss.error_10001005.format(data.resIdCardTimes));
                }
                else if (errorCode == "10001006")//身份校验错误次数过多
                {
                    errorFn(rss.error_10001006);
                }
                else {
                    errorFn(rss.error_defualt);
                }
            }

        }, function (data) {

        }, true, "JSON");
    }
    
    
    function getActivateEMailURLFn(dataParams, successFn, errorFn)
    {
    	var param = {
    			reqClientType:dataParams.reqClientType,
    			languageCode:dataParams.languageCode
    	};
    	getActivateEMailURL(param,"getActivateEMailURL",successFn, errorFn)
    }
    
    function getActivateEMailURLBySessionFn(dataParams, successFn, errorFn)
    {
    	var param = {
    			accountType:dataParams.accountType,
    			reqClientType:dataParams.reqClientType,
    			email:dataParams.userAccount,
    			languageCode:dataParams.languageCode
    	};
    	getActivateEMailURL(param,"getActivateEMailURLBySession",successFn, errorFn)
    }
    
    function getActivateEMailURL(dataParams, interFace,successFn, errorFn)
    {
    	
            ajaxHandler(interFace, dataParams, function (data) {

                if (typeof errorFn != "function" || data.isSuccess == "1") {
                    successFn(data);
                }
                else if (typeof errorFn == "function") {
                    var errorCode = data.errorCode;
                    if (data.errorCode == "10000001" || data.errorCode == "70001201")
    				{
                    	errorFn(rss.error_10000001);
    				}
    				if (data.errorCode == "10000002")
    				{
    					errorFn(rss.error_10000002);
    				}
    				if (data.errorCode == "10000004")
    				{
    					errorFn(rss.error_10000004);
    				}
    				if (data.errorCode == "70002001")
    				{
    					errorFn(rss.error_70002001);
    				}
    				if (data.errorCode == "70001401")
    				{
    					errorFn(rss.error_70001401);
    				}
    				if (data.errorCode == "70002008")
    				{
    					errorFn(rss.error_70002008);
    				}
    				if (data.errorCode == "70001102")
    				{
    					errorFn(rss.error_70001102_2);
    				}
    				if (data.errorCode == "70001104")
    				{
    					errorFn(rss.error_70001104_3);
    				}
    				if (data.errorCode == "70002019")
    				{
    					errorFn(rss.error_70002019);
    				}
    				if (data.errorCode == "70002009")
    				{
    					errorFn(rss.error_70002009);
    				}
    				else
    				{
    					errorFn(rss.error_70002018);
    				}
                }

            }, function (data) {

            }, true, "JSON");
    }
    
    

    // 附加到window對象上
    if (window) {
        window.casAjaxObj = casAjaxObj;
    }
    return {
        casAjaxObj: casAjaxObj
    }

})