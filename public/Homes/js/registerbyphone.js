ec.load("ajax", {
	loadType : "lazy"
});
ec.load("ec.box", {
	loadType : "lazy"
});
ec.account = {};

var isCurrentSite = false;
var warningConfirmed = false;

var countryRegions = [];
var showCountryRegions = [];

//最初页面的js
$(document).ready(function(){
	//初始化输入框
	initInputContent();	
	//设置手机邮箱宽度--start
	(function(){
		var tabPhone = $("#tabPhone").width();
		var tabMail = $("#tabMail").width();
		var MaxWidth = tabPhone > tabMail? tabPhone : tabMail;
		$("#tabPhone").width(MaxWidth+2+"px");
		$("#tabMail").width(MaxWidth+2+"px");
		$(".reg-tab").css("visibility","visible");
		
		if(localInfo.urlCountrySiteID == localInfo.currentSiteID){
			isCurrentSite = true;
		}
		
		if(localInfo.urlCountrySiteID != '7'){
			changeBirthDayInput(true);
		}
		
		if(!isCurrentSite){
			notCurrentSiteWarningDialog();
		}
		
		var username= $("#username");
		var usernameOld = username.val();
		username.blur(function(){
			if(username.val() && usernameOld != username.val())
			{
				usernameOld = username.val();
				var countryCode = $("#countryCode").val();
				if(countryCode.indexOf("+") > -1) {
		    		countryCode = countryCode.replace("+", "00");
		    	}
				if(checkLengthByCountry(countryCode, username, "#msg_phone", rss.error))  {
					if(this.value.length>0 && valiMobile(this.value))
					{
						checkExistAuto(username);
					}else if(this.value.length == 0){
						showErrorNew($("#phoneInputDiv-box"),$("#msg_phone"), rss.emptyphone);
					}else if(!valiMobile(this.value)) {
						showErrorNew($("#phoneInputDiv-box"),$("#msg_phone"), rss.error);
					}
				}
			}
			
		});

	})();
	//密码眼睛图标设置				
	$("#passwdEye").click(function(){
		var type = document.getElementById("password").type;
		if (type == "password")
		{
			document.getElementById("password").type = "text";
			document.getElementById("confirmPwd").type = "text";
			$(this).attr("src",localInfo.eyeon);
		}
		else
		{
			document.getElementById("password").type = "password";
			document.getElementById("confirmPwd").type = "password";
			$(this).attr("src",localInfo.eyeoff);
		}
	});

	//国家下拉列表
 var contrysArr = localInfo.countryCodes.split(","); 
  changeInputCountryCode(contrysArr);
  
 if(localInfo.createChildFlag=="true"){//儿童注册帐号注册国家码不可选
		 $('#selectCountryImg').DropListEMUI5({
			items: [{label:localInfo.localCountryName,key:localInfo.countryCode}]
		 });
	}else{
	 	getCountryRegion();

	}
  displayCountry(); 
  
//图片验证码 --新加
	var randomCode = $('#randomCode');
		ec.form.validator.bind(randomCode,{
		type:["require","length"],
		trim:true,
		min:4,
		max:4,
		validOnChange:false,
		errorClassEMUI5:"input-error-EMUI5",
		errorBorder:$("#randomCodeDiv"),
		errorFunction:function(obj,options){
			
			switch(options.type){
				case "require":
					showRandomCodeError(rss.picture_verfication_code_null_error);
					break;
				case "length":
					showRandomCodeError(rss.login_js_codeerror);
					break;
			}
		},
		successFunction:function(obj,options){
			hideRandomCodeError();
		},
		reInputFunction:function()
		{
			hideRandomCodeError();
			$("#authCodeRight").removeClass("poptips-yes");
		}	
	}); 
	//图片验证码 --非儿童注册
	if(localInfo.createChildFlag!="true"){
		$("#randomCode").bind("keyup", function(evt) {
			validateInput();
			checkImgAuthCode();
			// 确保只弹出一个框 二次认证框
		});
		if ($("#randomCode").val().length > 0)
		{
			chgRandomCodeForReset();
		};
		validateInput();
	};
  
  //协议显示
  getAgreementContent(localInfo.countryCode);

	// 初始化日期 --新加
   if($("#birthDate").length>0)
   { 
	$("#birthDate").datePickEMUI5({
		yearChange:function(){
			$("#birthdayError").html("");
			$("#birthDateWrap").removeClass("input-error-EMUI5");
			if($("#birthDate").datePickEMUI5("M")) {
		 			if($("#birthDate").datePickEMUI5("D")) {
			 			checkBirthday();
		 			}
		 		}
		},
		monthChange:function(){
			$("#birthdayError").html("");
			$("#birthDateWrap").removeClass("input-error-EMUI5");
			if($("#birthDate").datePickEMUI5("Y")) {
					if($("#birthDate").datePickEMUI5("D")) {
			 			checkBirthday();
		 			} 
		 		}
			
		},
		dayChange:function(){
			$("#birthdayError").html("");
			$("#birthDateWrap").removeClass("input-error-EMUI5");
			if($("#birthDate").datePickEMUI5("D") && $("#birthDate").datePickEMUI5("M") && $("#birthDate").datePickEMUI5("Y")) {
		 			checkBirthday();
	 			}
		},
		format:"Y-M-D",
		yearSuffix:rss.year,
		monthSuffix:rss.month,
		yearSpace:false,
		daySuffix:rss.day
	});	
   }
			
});

ec.ready(function() {
	var e = function(g, f) {
		jQuery(g).show().html(f);
	};
	var d = jQuery("#registerForm input[name='formBean.username']");			
	var c = jQuery("#registerForm input[name='formBean.password']");
	var a = jQuery("#registerForm input[name='checkPassword']");
	var b = jQuery("#registerForm input[name='formBean.authCode']");
	var pp = jQuery("#registerForm input[name='parentPassword']");
	var rc = jQuery("#registerForm input[name='formBean.randomCode']");
	//初始化placeholder
	ec.form.input.label(pp,rss.enter_guardian_pwd);
	ec.form.input.label.defaults.ifRight="10px";
	ec.ui.hover(d).hover(b).hover(c).hover(a).hover(pp).hover(rc);
	ec.form.input.label(d,rss.uc_common_validator_phone_require).label(c, rss.uc_common_input_ling_pwd).label(a,rss.please_enter_password_again).label(b, rss.plaeseinputsmscode).label(rc, rss.picture_verfication_code_null_error);
	
	/**
	 * 检查帐号是否存在
	 * 不需要验证码的校验
	 */
	(function() {
		var a = ec.account.checkExist = function(g, f, e, b, d, c) {
			if (g == f.attr("acceptValue")) {
				b(f);
				return;
			}
			e();
			var cuntryCode= $("#countryCode").val();
			if(cuntryCode.indexOf("+") > -1) {
				cuntryCode = cuntryCode.replace("+","00");
			}
			var phone= cuntryCode+f.val();
		
			ec.Cache.get("checkExist_ajax", function() {
				return new ec.ajax();
			}).post(
					{
						url :getWebUrlHttps()+"isExsitUser?random="+new Date().getTime(),
						data:{
							"userAccount":phone
							},
						timeout : 12000,
						timeoutFunction : c,
						async:false,
						successFunction : function(data) {
							var resulte=data.existAccountFlag;
							if (resulte=="0") {
								f.attr("acceptValue", g);
								b(f);
							}
							else if(resulte=="1")
							{
								d(f);
							}
						},
						errorFunction :function(data){
							var resulte=data.existAccountFlag;
							if (resulte=="0") {
								f.attr("acceptValue", g);
								b(f);
							}
							else
							{
								c(f);
							}
						}
					});
		};
		ec.account.register = {
			submit : function(b) {
				if (!ec.form.validator(b, false)) {
					return false;
				}
				return true;
			}
		};
	})();
	//检查帐号--end
	
	//新加
	var rc = jQuery("#registerForm input[name='formBean.randomCode']");
	
	var btnSubmit = $("#btnSubmit");
	
	var countryCode = $("#countryCode").val()
	if(countryCode.indexOf("+") > -1) {
		countryCode = countryCode.replace("+", "00");
	}
	if(countryCode == "001") { //美国
		ec.form.validator.bind(d, {
			type : [ "require", "length" ],
			min : 10,
			max : 10,
			trim:true,
			validOnChange : true,
			msg_ct : "#msg_phone",
			msg : {
				require : rss.emptyphone,
				"default" :rss.error
			},
			errorFunction : function(obj,options){
				//注意红框的是取得相应的父级
				switch(options.type){
					case "require":
						showErrorNew($("#phoneInputDiv-box"),$("#msg_phone"),rss.emptyphone);
						break;
					default:
						showErrorNew($("#phoneInputDiv-box"),$("#msg_phone"),rss.error);
						break;
				}
			},
			successFunction : function(f) {
				hideErrorNew($("#phoneInputDiv-box"),$("#msg_phone"));
			},
			reInputFunction:function()
			{
				hideErrorNew($("#phoneInputDiv-box"),$("#msg_phone"));
			}	
		});
	} else {
		ec.form.validator.bind(d, {
			type : [ "require", "length" ],
			min : 5,
			max : 15,
			trim:true,
			validOnChange : true,
			msg_ct : "#msg_phone",
			msg : {
				require : rss.emptyphone,
				"default" :rss.error
			},
			errorFunction : function(obj,options){
				switch(options.type){
					case "require":
						showErrorNew($("#phoneInputDiv-box"),$("#msg_phone"),rss.emptyphone);
						break;
					default:
						showErrorNew($("#phoneInputDiv-box"),$("#msg_phone"),rss.error);
						break;
				}
			},
			successFunction : function(f) {
				hideErrorNew($("#phoneInputDiv-box"),$("#msg_phone"));
			},
			reInputFunction:function()
			{
				hideErrorNew($("#phoneInputDiv-box"),$("#msg_phone"));
			}
		});
	}
	
	c.blur(function(){
		$("#pwd_check_dialog").html("");
	});
	
	ec.form.validator.bind(c, {
		type : [ "require", "lengthLt8","lengthGt32","OnlyNumberOrLetter","missingUppercase","missingLowercase","pwdformat" ],
		trim : false,
		validOnChange : true,
		min : 8,
		max : 32,
		msg_ct : "#msg_password",
		msg : {
			require : rss.inputpwd,
			length : rss.modifyUserPwd_input_8_32_chars,
			password : rss.modifyUserPwd_input_8_32_complax_chars_desc,
			pwdformat : rss.common_js_pwd_account_same_reverse,
            lengthLt8 : rss.modifyUserPwd_length_min_8,
            lengthGt32 : rss.modifyUserPwd_length_max_32,
            missingUppercase : rss.modifyUserPwd_missing_uppercase,
            missingLowercase: rss.modifyUserPwd_missing_lowercase,
            OnlyNumberOrLetter : rss.modifyUserPwd_number_or_letter
		},
		errorFunction : function(obj,options){
			switch(options.type){
				case "require":
					showErrorNew($("#pwdDiv"),$("#msg_password"),rss.inputpwd);
					break;
				case "pwdformat":
					showErrorNew($("#pwdDiv"),$("#msg_password"),rss.common_js_pwd_account_same_reverse);
					break;
                case "lengthLt8":
                    showErrorNew($("#pwdDiv"),$("#msg_password"),rss.modifyUserPwd_length_min_8);
                    break;
                case "lengthGt32":
                    showErrorNew($("#pwdDiv"),$("#msg_password"),rss.modifyUserPwd_length_max_32);
                    break;
                case "missingUppercase":
                    showErrorNew($("#pwdDiv"),$("#msg_password"),rss.modifyUserPwd_missing_uppercase);
                    break;
                case "missingLowercase":
                    showErrorNew($("#pwdDiv"),$("#msg_password"),rss.modifyUserPwd_missing_lowercase);
                    break;
                case "OnlyNumberOrLetter":
                    showErrorNew($("#pwdDiv"),$("#msg_password"),rss.modifyUserPwd_number_or_letter);
                    break;
			}
		},
		successFunction : function(f) {
		//	hideErrorNew($("#pwdDiv"),$("#msg_password"));
			if(a.val())
			{
				ec.form.validator(a, true);
			}
		},
		reInputFunction:function()
		{
			hideErrorNew($("#pwdDiv"),$("#msg_password"));
		}
	});
	ec.form.validator.bind(a, {
		type : [ "require", "eq" ],
		trim : false,
		validOnChange : true,
		compareTo : c,
		msg_ct : "#msg_checkPassword",
		msg : {
			require :rss.confirmpwd,
			eq : rss.pwdnotsame
		},
		errorFunction : function(obj,options){
			switch(options.type){
				case "require":
					showErrorNew($("#confirmpwdDiv"),$("#msg_checkPassword"),rss.confirmpwd);
					break;
				case "eq":
					showErrorNew($("#confirmpwdDiv"),$("#msg_checkPassword"),rss.pwdnotsame);
					break;
			}
		},
		successFunction : function(f) {
			hideErrorNew($("#confirmpwdDiv"),$("#msg_checkPassword"));
		},
		reInputFunction:function()
		{
			hideErrorNew($("#confirmpwdDiv"),$("#msg_checkPassword"));
		}
	});
		
	ec.form.validator.bind(b, {
		type : [ "require", "length", "int"],
		trim:true,
		validOnChange : true,
		max : 8,
		min : 4,
		msg_ct : "#msg_phoneRandomCode",
		msg :{
			"require" : rss.inputsmscode,
			"int" : rss.wrongformatsmscode,
			"default" : rss.wrongformatsmscode
		},
		errorFunction : function(obj,options){
			switch(options.type){
				case "require":
					showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"),rss.inputsmscode);
					break;
				case "int":
					showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"),rss.wrongformatsmscode);
					break;
				default:
					showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"),rss.wrongformatsmscode);
					break;
			}
		},
		successFunction : function(f) {
			hideErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"));
		},
		reInputFunction:function(){
			hideErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"));
		}
	});
		
	ec.form.validator.register("pwdformat", function(b_val, a) {
		if (a.allowEmpty && ec.util.isEmpty(b_val)) {
			return true;
		}
		var username=$("#username").val();
		usernameReverse=username.split("").reverse().join("");
		
		if(b_val.toLowerCase()==username.toLowerCase() || b_val.toLowerCase()==usernameReverse.toLowerCase())
		{
			return false;
		}
		else
		{
			return true;
		}
	});

	ec.form.validator.register("lengthLt8", function(b_val, a) {
		if (a.allowEmpty && ec.util.isEmpty(b_val)) {
			return true;
		}
		if(getPwdComplexity(b_val).lengthLt8){
            return false;
		}else {
			return true;
		}

	});
	ec.form.validator.register("lengthGt32", function(b_val, a) {
		if (a.allowEmpty && ec.util.isEmpty(b_val)) {
			return true;
		}
		if(getPwdComplexity(b_val).lengthGt32){
			return false;
		}else {
			return true;
		}
	});

	ec.form.validator.register("missingUppercase", function(b_val, a) {
		if (a.allowEmpty && ec.util.isEmpty(b_val)) {
			return true;
		}
		if(getPwdComplexity(b_val).missingUppercase){
			return false;
		}else {
			return true;
		}
	});
	ec.form.validator.register("missingLowercase", function(b_val, a) {
		if (a.allowEmpty && ec.util.isEmpty(b_val)) {
			return true;
		}
		if(getPwdComplexity(b_val).missingLowercase){
			return false;
		}else {
			return true;
		}
	});
	ec.form.validator.register("OnlyNumberOrLetter", function(b_val, a) {
		if (a.allowEmpty && ec.util.isEmpty(b_val)) {
			return true;
		}
		if(getPwdComplexity(b_val).OnlyNumberOrLetter){
			return false;
		}else {
			return true;
		}
	});
		
	if(currentSiteID == "7") {
		ec.form.validator.bind(pp, {
			type : [ "require", "length","password","pwdformat"],
			trim:false,
			validOnChange : true,
			min : 8,
			max : 32,
			msg_ct : "#msg_checkPassword_parent",
			msg : {
				require : rss.inputpwd,
				length : rss.modifyUserPwd_input_8_32_chars,
				password : rss.modifyUserPwd_input_8_32_complax_chars_desc,
				pwdformat : rss.common_js_pwd_account_same_reverse
			},
			errorFunction : function(obj,options){
				switch(options.type){
					case "require":
						showErrorNew($("#passwordParentDiv"),$("#msg_checkPassword_parent"),rss.inputpwd);
						break;
					case "length":
						showErrorNew($("#passwordParentDiv"),$("#msg_checkPassword_parent"),rss.error_70002003);
						break;
					case "password":
						showErrorNew($("#passwordParentDiv"),$("#msg_checkPassword_parent"),rss.error_70002003);
						break;
					case "pwdformat":
						showErrorNew($("#passwordParentDiv"),$("#msg_checkPassword_parent"),rss.error_70002003);
						break;
				}
			},
			successFunction : function(f) {
				hideErrorNew($("#passwordParentDiv"),$("#msg_checkPassword_parent"));
			},
			reInputFunction : function(){
				hideErrorNew($("#passwordParentDiv"),$("#msg_checkPassword_parent"));
			}
		});
	
	}
		
	btnSubmit.bind("click",registerAgreement);
	//c.bind("blur",function(){onPwdKeyUp(c[0]);});

	ec.form.validator.register("pwdComplax", function(b_val, a) {
		if (a.allowEmpty && ec.util.isEmpty(b_val)) {
			return true;
		}

		return isPWDComplex(b_val);
	});
});	
//检查图片验证码方法  --新加	
function checkImgAuthCode() {
	var randomCode = $("#randomCode");
	var randomCodeImg = $('#randomCodeImg');
	var randomCodeError = $("#randomCode_msg");
	if (typeof (randomCode[0]) != "undefined"
			&& randomCode.val().length >= 4) {
		var thisValue = randomCode.val();
		var dataParms = {
			randomCode : thisValue,
			session_code_key : "p_reg_login_websso_session_ramdom_code_key"
		};

		ajaxHandler("authCodeValidate", dataParms, function(data) {
			if ("1" == data.isSuccess) {
				$("#authCodeRight").addClass("poptips-yes");
				hideRandomCodeError();
				
				validateInput();
			} else {
				chgRandomCode(randomCodeImg[0],
						localInfo.webssoLoginSessionCode);
				randomCode[0].value = "";
				
				$("#authCodeRight").removeClass("poptips-yes");
				validateInput();
				
				switch (data.errorCode) {
				case '10000201': {
					showRandomCodeError(rss.common_js_wrongcode);
					break;
				}
				case '10000001': {
					showRandomCodeError(rss.error_10000001);
					break;
				}
				case '10000004': {
					showRandomCodeError(rss.error_10000004);
					break;
				}
				default: {
					showRandomCodeError(rss.error_10000002);
					break;
				}
				}
			}

		}, function(data) {

		}, true, "JSON");

	} else if (typeof (randomCode[0]) != "undefined"
			&& randomCode.val().length != 4) {
	}
}

//校验密码强度
function onPwdKeyUp(obj)
{
	
	pwdStrengthHintDialog();
	var complex=getPwdComplexity(obj.value);
	var $complexEl =$("#pwdStong")
	if(complex.length&&complex.upLowChar&&complex.number)
		{
	isWeakPassword(obj.value,function(data){
		if(data.isSuccess ==1)
		{
			$complexEl.addClass("pwd-strong-div").removeClass("pwd-low-div").removeClass("pwd-middle-div");
			$('#msg_password').html("");
			$('#pwdDiv').removeClass('input-error-EMUI5');
			$("#pwdComplexFlag").html(rss.strong);
		}	
		else if(data.errorCode=="10000801")
		{
			$complexEl.addClass("pwd-low-div").removeClass("pwd-middle-div").removeClass("pwd-strong-div");
			$('#msg_password').html(rss.error_70008001);
			$('#msg_password').addClass('error-tips-EMUI5');
			$('#pwdDiv').addClass('input-error-EMUI5');
			$("#pwdComplexFlag").html(rss.weak);
		}
	})
	}else
	{
		$complexEl.removeClass("pwd-middle-div").removeClass("pwd-low-div").removeClass("pwd-strong-div");
		$('#msg_password').html("");
		$("#pwdComplexFlag").html("");
		$('#pwdDiv').removeClass('input-error-EMUI5');
		$('#msg_password').removeClass('error-tips-EMUI5');
	}

	trriger($("#pwdLength"),complex.length);
	trriger($("#pwdChar"),complex.upLowChar);
	trriger($("#pwdNumber"),complex.number);

	function trriger($el,ok){
		if(ok){
			$el.find("img").attr("src",localInfo.formatOk);
			$el.removeClass("gay-tips-EMUI5").addClass("success-tips-EMUI5");
		}else{
			$el.find("img").attr("src",localInfo.formatNo);
			$el.removeClass("success-tips-EMUI5").addClass("gay-tips-EMUI5");
		}
	}

	if(complex.strong*1<2){
		$("#resetPwdBtn").addClass("disabled");
	}
	else{
		$("#resetPwdBtn").removeClass("disabled");
	}
}
		
function chgRandomCodeForReset() {
	var randomCode = $("#randomCode");
	var randomCodeImg = $('#randomCodeImg');
	chgRandomCode(randomCodeImg[0], localInfo.webssoLoginSessionCode);
	randomCode.val("");
	$("#authCodeRight").removeClass("poptips-yes");
}

function validateInput()
{
	var randomCodeValue = $("#randomCode").val().trim();
	if (randomCodeValue && randomCodeValue.length >=4 && $("#authCodeRight").hasClass("poptips-yes"))
	{
		$("#authCodeRight").attr("datavalue","true");
	}
	else
	{
		$("#authCodeRight").attr("datavalue","false");
	}
}

function showRandomCodeError(errorMsg)
{
	$("#randomCode_msg").html(errorMsg);
	$("#randomCode_msg").addClass("error-tips-EMUI5");
	$("#randomCodeDiv").addClass("input-error-EMUI5");
}

function hideRandomCodeError()
{
	$("#randomCode_msg").html("");
	$("#randomCode_msg").removeClass("error-tips-EMUI5");	
	$("#randomCodeDiv").removeClass("input-error-EMUI5");
}

//错误提示
function showErrorNew(boxObj, tipObj, errorInfo)
{
	if(boxObj)
	{
		boxObj.addClass("input-error-EMUI5");
		tipObj.html(errorInfo).addClass("error-tips-EMUI5");
	}
	else 
	{
		tipObj.html(errorInfo).addClass("errorColor");
	}
	
}
function hideErrorNew(boxObj, tipObj)
{
	boxObj.removeClass("input-error-EMUI5");
	tipObj.html("").removeClass("error-tips-EMUI5");
}
function hideErrorBox(boxObj)
{
	boxObj.removeClass("input-error-EMUI5");
}
//弹窗提示错误
function showPopError(errorMsg)
{
	showSystemError(errorMsg,rss.iKnowBtn);
}
//生日提示错误
function jsGetAge(strBirthday)
{       
	var r = strBirthday.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/); // 格式检查
    if(r==null) {
  	  return -2;     
    }
	var returnAge;
	var strBirthdayArr=strBirthday.split("-");
	var birthYear = strBirthdayArr[0];
	var birthMonth = strBirthdayArr[1];
	var birthDay = strBirthdayArr[2];
	if(birthYear=="" || birthMonth=="" || birthDay=="") {
		return -2;
	}
	d = new Date();
	var nowYear = d.getFullYear();
	var nowMonth = d.getMonth() + 1;
	var nowDay = d.getDate();
	
	if(nowYear == birthYear)
	{
		if(nowMonth<birthMonth)
		{
			returnAge=-1;
		}
		
		if(nowMonth==birthMonth && nowDay<birthDay)
		{
			returnAge=-1;
		}
		
		if(nowMonth==birthMonth && nowDay>=birthDay)
		{
			returnAge=0;
		}
		
		if(nowMonth>birthMonth)
		{
			returnAge = 0;//同年 则为0岁
		}
	}
	else
	{
		var ageDiff = nowYear - birthYear ; //年之差
		if(ageDiff > 0)
		{
			if(nowMonth == birthMonth){
				var dayDiff = nowDay - birthDay;//日之差
				if(dayDiff < 0)
				{returnAge = ageDiff - 1;}
				else
				{returnAge = ageDiff ;}
			}else{
				var monthDiff = nowMonth - birthMonth;//月之差
				if(monthDiff < 0)
				{returnAge = ageDiff - 1;}
				else
				{returnAge = ageDiff ;}
			}
		}
	}
	return returnAge;//返回周岁年龄
}

function checkBirthday(submitOrNot) {

	var birthday = $("#birthDate").datePickEMUI5("Y")+"-"+$("#birthDate").datePickEMUI5("M")+"-"+$("#birthDate").datePickEMUI5("D");
	var age = jsGetAge(birthday);
	if(age == -2) {
		showErrorNew($("#birthDateWrap"),$("#birthdayError"), rss.chooseDateTip);
		return false;
	}
	if(age == -1) {
		showErrorNew($("#birthDateWrap"),$("#birthdayError"), rss.birthdayLimitTip);
		return false;
	}
	// localInfo.createChildFlag!="true"  的作用为如果是儿童账号注册，那么13岁的这个限定就不需要考虑了
	if(age < 13 && localInfo.createChildFlag!="true") {
		under13GOChild();
		return false;
		
	} if(age > 13 && localInfo.createChildFlag=="true") {
		over13GONormal();
		return false;
		
	} else if(age < 0) {
		showErrorNew(null,$("#birthdayError"), rss.age_error);
		return false;
	
	}
	
	return true;
}

// 注册页面用于最后的同意协议的页面
function registerAgreement()
{
	// 监测输入数据是否正确。
	if(!checkInputLegality())
	{
		return;
	}
	
	var noticeJSONArr = localInfo.agreementContents;
	var htmlStr = "";
	htmlStr += "<div class='agreementInfo1 agreementInfo5'>";
	for(var i=0;i<noticeJSONArr.length;i++)
	{
		var agreement = noticeJSONArr[i];
		htmlStr += "<div class='reg-tip'>";
		if(agreement.agrID == '10'  && localInfo.createChildFlag!="true")
		{
			if (agreement.defaultAgreeOrNot) 
			{
				htmlStr += "<div class='check-tip clearFix'>";
				htmlStr +="<label class='regCheck reg-check l reg-select' datavalue='true'></label>";
				htmlStr += agreement.agrBrief 
				htmlStr +="</div>";
			}
			else
			{
				htmlStr += "<div class='check-tip clearFix'>";
				htmlStr +="<label class='regCheck reg-check l' datavalue='false'></label>";
				htmlStr += agreement.agrBrief 
				htmlStr +="</div>";
			}
		}
		
		if(agreement.agrID != '10')
		{
			htmlStr += agreement.agrBrief;
		}
		htmlStr += "</div>";
	}
	htmlStr += "</div>";
	
	$("<div>").Dialog({
		title:rss.service_terms,
		btnLeft:{
			text: rss.uc_common_no_agree,
			fn:function(){
				this.hide();
			}
		},
		btnRight:{
			text: rss.agree,
			fn:function(){
				if($("#btnSubmit").hasClass("send-ajax"))
				{
				return;
				}
				submitFun(this);
			}
		},
		html:htmlStr,
		beforeAction: function(){
			$(".regCheck").off();
			$(".regCheck").on("click", function() {
			    if ($(this).hasClass("reg-select")) {
			        $(this).removeClass("reg-select");
			        $(this).attr("datavalue", "false");
			        $("#adMarketChecked").attr("checked", false);
			    } else {
			        $(this).addClass("reg-select");
			        $(this).attr("datavalue", "true");
			        $("#adMarketChecked").attr("checked", true);
			    }
			});
		}
		
	}).Dialog('show'); 
}


//年龄小于13岁，请走儿童帐号
function under13GOChild()
{
	var htmlStr='<div>' + rss.uc_cantcreateunder13_content + '</div>';
	
 	$("<div>").Dialog({
		title:rss.uc_cantcreateunder13_title,
		btnLeft:false,
		btnRight:{
			text: rss.iKnowBtn,
			fn:function(){
				this.hide();
			}
		},
		html:htmlStr,
		beforeAction: function(){
			
		}
		
	}).Dialog('show'); 
 	
 	// 对应的  id为 websettingurl
 	$("#websettingurl").attr('href',localInfo.createChildUrl);
}

//年龄大于13岁，请走正常流程
function over13GONormal()
{
	var htmlStr='<div>' + rss.uc_ageover13_gonormal + '</div>';
	
 	$("<div>").Dialog({
		title:rss.hint,
		btnLeft:false,
		btnRight:{
			text: rss.iKnowBtn,
			fn:function(){
				this.hide();
			}
		},
		html:htmlStr,
		beforeAction: function(){
			
		}
		
	}).Dialog('show'); 
}


// 检查输入的合法性 
function checkInputLegality()
{
	if(!isCurrentSite && !warningConfirmed){
		notCurrentSiteWarningDialog();
		return false;
	}
	
	if($("#btnSubmit").attr("class").indexOf("sel") == -1||$("#btnSubmit").hasClass("send-ajax")) {
		return false;
	}
	var hasError = false;
	$(".error-tips-EMUI5").each(function(){
		if($(this).text().trim().length>1)
			{
			hasError=true;
			}
		
	})
	if(hasError)
	 {
		return false;
	 }
	if(!ec.form.validator($("#registerForm"), true))
	{
		return false;
	}

	if(localInfo.currentCountrySiteID=="7") {
		if(!checkBirthday(true)) {
			return false;
		}
	}
   
	var countryCode = $("#countryCode").val()
	if(countryCode.indexOf("+") > -1) {
		countryCode = countryCode.replace("+", "00");
	}
	if(!checkLengthByCountry(countryCode, $("#username"), "#msg_phone", rss.error)) {
		return false;
	}
	
	var usernameObject =$("#username");
	if(!valiMobile(usernameObject.val())) {
		showErrorNew($("#phoneInputDiv-box"),$("#msg_phone"),rss.error);
		return false;
	}
	return true;
}

function submitFun(agrDialog)
{
	checkExistAuto($("#username"),"regPost","","","","","",agrDialog);
}

function getbirthDate() {
	if(localInfo.currentCountrySiteID != "7") {
		return "";
	}
	var year = $("#birthDate").datePickEMUI5("Y").toString();
    var month = $("#birthDate").datePickEMUI5("M").toString();
    var day = $("#birthDate").datePickEMUI5("D").toString();
    if(month.length == 1) {
    	month = "0" + month;
    }
    if(day.length == 1) {
    	day = "0" + day;
    }
    var birth = year+month+day;
    return birth;
}

function getGuardianAccount() {
	if(currentSiteID != "7") {
		return "";
	}
	return localInfo.userAccount;
}

/**
 * reg mobile userAccount
 */
function regPostAction(agrDialog)
{
	var authcode=$("#authCode").val().trim(),
	newpassword=$("#password").val(),
	username=$("#username").val();
	var parentPassword = jQuery("#registerForm input[name='parentPassword']");
	var countryCode="";
	if($("#countryCode").val().indexOf("+") >-1) {
		countryCode=$("#countryCode").val().replace("+","00");
	} else {
		countryCode=$("#countryCode").val();
	}
	username=countryCode+username;
	var countryRegion = $("#countryRegion").val();
	
	var countryCode1 = "";
	var siteC = "";
	if(countryRegion.split("-").length > 1) {
		countryCode1 = countryRegion.split("-")[1];
		siteC = countryRegion;
	}
	
	if(localInfo.createChildFlag=="true")
    {
		siteC=localInfo.currentSiteID+"-"+localInfo.countryCode;
    }
	
	var agreementContentsStr = localInfo.agreementContentsStr;
	
	if(currentSiteID=="7" && $("#adMarketChecked").is(":checked")==false)
	{
		agreementContentsStr=checkAdMarketAgreedAgrContent(agreementContentsStr);
	}
	
	agreementContentsStr = agreementContentsStr.replace(/\$countryCode/g,siteC);
	agreementContentsStr = agreementContentsStr.replace(/\'/g,"\"");
	
	var strParms="registerCloudAccount";
	var parmsData={
			"password":newpassword,
			"userAccount":username,
			"accountType":"2",
			"reqClientType":localInfo.reqClientType,
			"registerChannel":localInfo.loginChannel,
			"authCode":authcode,
			"languageCode":localInfo.lang,
			"countryCode":countryCode1,
			"agrVers": agreementContentsStr,
			"thirdLoginFlag":localInfo.thirdLoginFlag==""?false:localInfo.thirdLoginFlag,
			"birthDate":localInfo.currentCountrySiteID == '7' ? getbirthDate() : "",
			"guardianAccount":getGuardianAccount(),
			"guardianPassword":parentPassword.val(),
			"randomCode": $("#randomCode").val()
	};
	if(parmsData.guardianAccount && !checkBirthdayWhenCreateChildAcct())
	{
		return;
	}
	
	if(parmsData.guardianAccount)
	{
		parmsData.countryCode=localInfo.countryCode;
		parmsData.operType=1;
	}
	else
	{
		parmsData.operType=0;
		parmsData.randomAuthCode=$("#randomCode").val();
	}
	
	if(localInfo.currentSiteID=="7" && parmsData.birthDate!="" && parmsData.birthDate!=undefined)
	{
		if(isPastToday(parmsData.birthDate))
		{
			showErrorNew(null,$("#birthdayError"), rss.birthdayLimitTip);
			return;
		}
	}
	
	var dialogOptions;
	if (rss.msgDialogOverlayClass)
	{
		dialogOptions = {
			overlayClass: rss.msgDialogOverlayClass// 背景层的样式
		};
	}
	
	
	 // 如果成功，并且 是在注册儿童账号，那么进行协议的最后的更新  agreeLetterOfConsent
	 if(localInfo.agreeLetterOfConsent=="false")
	 {
		 var updateSuccessOrNot=false;
		 // 如果没有同意家长同意书，那么这边进行同意
		 updateUserAgrsForParent("[7,13]",function(){
			 updateSuccessOrNot=true;
		 });
		 
		 if(!updateSuccessOrNot)
		 {
			 // 更新家长同意书失败,此时函数整体停止执行。不进行最后的注册。
			showPopError(rss.uc_error_agreeletterofconsent_error);
			 return;
		 }
	 }
	
	 $("#btnSubmit").addClass("send-ajax");
	ajaxHandler(strParms,parmsData,function(data){
		 if(data.isSuccess=="1")
		 {
			 setTimeout(function(){
				 
				 if(localInfo.createChildFlag=="true") {
					 gotoUrl(localHttps + "/portal/userCenter/setting.html" + localInfo.urlQurey);
				 }else {
					 $("#register_msg").show().html("");
					 // 登录
					 /*** begin*auto login*****/
					 var dataRarmsReg={
							 userAccount:username,
							 password:newpassword,
							 reqClientType:localInfo.reqClientType,
							 loginChannel:localInfo.loginChannel,
							 authcode:data.regToken,
							 service:htmldecode(localInfo.service),
							 loginUrl:localInfo.loginUrl
					 };
					 
					 ajaxHandler("remoteLogin",dataRarmsReg,function(data){			
						 if("1"==data.isSuccess)
						 {
							 gotoUrl(data.callbackURL);
							 return false;
						 }
						 else
						 {
							 showErrorByCode(data.errorCode,agrDialog);
						 }
						 
					 },function(data){
						 
					 },false,"JSON");
					 
					 /*** end*auto login*****/
					 
					 return true;
				 }
				 
				 
			 }, 2000);
			 
			 
			 
		 }
		 else
		 {
			 $("#btnSubmit").removeClass("send-ajax");
			 showErrorByCode(data.errorCode,agrDialog);
		 }
	},function(){},true,"json", dialogOptions);
}

function isPastToday(ymd) {
	
	var year = ymd.substring(0, 4);
    var month = ymd.substring(4,6);
    var day = ymd.substring(6,8);
	
   var childrenDay = new Date(year, parseInt(month) - 1, day);
   childrenDay.setFullYear(parseInt(year) + 0);
   var childrenDayTime = childrenDay.getTime();
   var thisDayTime = new Date().getTime();
   return childrenDayTime >= thisDayTime;
}

function checkLengthByCountry(countryCode, username, errorDiv, errorMsg) {
	if(countryCode.indexOf("+") > -1) {
		countryCode = countryCode.replace("+", "00");
	}
	var names = username.val().trim();
	var len = names.length;
	if(countryCode == "001" && len!=10) { //美国
		showErrorNew($("#phoneInputDiv-box"),$(errorDiv), errorMsg);
		return false;
	}
	return true;
}

function showErrorByCode(errorCode,agrDialog) {
	chgRandomCodeForReset();
	if(errorCode=="70001201")
	 {
		//  系统繁忙，请稍后再试！
		showPopError(rss.error_70001201);
	 }
	else if(errorCode=="70008800")
	{
		$("#randomCode").val("");
		$("#msg_randomCode").show().html("");
		showPopError(rss.error_risk_70008800);
		$("#authCodeRight").removeClass("poptips-yes");
		chgRandomCode($('#randomCodeImg')[0],localInfo.webssoLoginSessionCode);
	}	
	else if(errorCode=="10000704")
	 {
			// 验证码输入存在错误
			showPopError(rss.error_70001201_1);
			$("#randomCode").val("");
			$("#randomCode").focus();
			$("#authCode").val("");
			$("#authCodeRight").removeClass("poptips-yes");
			chgRandomCode($('#randomCodeImg')[0],localInfo.webssoLoginSessionCode);
	 }
	else if(errorCode=="70008001")
	 {
		 //  不可是常见密码或弱密码
		 window.setTimeout(function(){
			 showErrorNew($("#pwdDiv"),$("#msg_password"),rss.error_70008001);
		 },100);
	 }
	 else if(errorCode=="70002070")
	 {
		// 密码复杂度过低
		 window.setTimeout(function(){
			 showErrorNew($("#pwdDiv"),$("#msg_password"),rss.error_70002070);
		 },100);
	 }
	 else if(errorCode=="10000001")
	 {
		 // 系统繁忙，请稍后再试！
		showPopError(rss.error_10000001);
	 }
	 else if(errorCode=="70001401")
	 {
		 // 系统内部错误
		 showPopError(rss.error_70001401);
	 }
	 else if(errorCode=="70002002")
	 {
		 // 帐号已存在
		 window.setTimeout(function(){
			 showErrorNew($("#phoneInputDiv-box"),$("#msg_phone"),rss.error_70002002);
		 },100);
	 }
	 else if(errorCode=="70007007")
	 {
		 //  儿童不能同意“家长同意书”
		 showPopError(rss.error_70007007);
	 }
	 else if(errorCode=="10000201")
	 {
		 $("#randomCode").val("");
		 showRandomCodeError(rss.common_js_wrongcode);
		 $("#authCodeRight").removeClass("poptips-yes");
		 chgRandomCode($('#randomCodeImg')[0],localInfo.webssoLoginSessionCode);
	 }
	 else if(errorCode=="70002003")
	 {
		 // 监护人帐号或者密码错误
		 showErrorNew($("#passwordParentDiv"), $("#msg_checkPassword_parent"), rss.error_70002003);
	 }
	 else if(errorCode=="70006006")
	 {
		 // 监护人帐号不能为用户名帐号（非邮箱非手机）
		 showPopError(rss.error_70006606);
	 }
	 else if(errorCode=="70007003")
	 {
		 // 监护人年龄必须大于18岁 
		 showPopError(rss.error_70007003);
	 }
	 else if(errorCode=="70007004")
	 {
		 // 监护人没有同意“家长同意书”
		 showPopError(rss.error_70007004);
	 }
	 else if(errorCode=="70007001")
	 {
		 // 监护人监护的儿童超过上限
		 showPopError(rss.error_70007001);
	 }
	 else if(errorCode=="70002067")
	 {
		 // 不在服务区(您所在的地方暂未开通服务)
		 showPopError(rss.error_70002067);
	 }
	 else if(errorCode=="70002033")
	 {
		 // 不能注册@inner.up.huawei后缀的邮件地址
		 showPopError(rss.error_70002033);
	 }
	 else if(errorCode=="70002018")
	 {
		 // 发送激活邮件失败。
		 showPopError(rss.error_70002018);
	 }
	 else if(errorCode=="70002057")
	 {
		 // 验证码已连续错误超过三次
		 window.setTimeout(function(){
			 showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"),rss.error_70002057);
		 },100);
	 }
	 else if(errorCode=="10002073")
	 {
		 // 密码不符合规则
		 window.setTimeout(function(){
			 showErrorNew($("#pwdDiv"),$("#msg_password"),rss.error_10002073);
		 },100);
	 }
	 else if(errorCode=="70002058")
	 {
		 // 输入的验证码错误次数过多，请明天再试
		 showPopError(rss.error_70002058);
	 }
	 else if(errorCode=="70002039")
	 {
		 // 验证码不存在或已过期
		 window.setTimeout(function(){
			 showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"),rss.error_70002039);
		 },100);
	 }
	 else if(errorCode=="10000004")
	 {
		 // 非法操作!
		 showPopError(rss.error_10000004);
	 }
	 else if(errorCode=="10000002")
	 {
		 // 不提供服务!
		 showPopError(rss.error_10000002);
	 } 
	 else if(errorCode=="10000505")
	 {
		 
		 showPopError(rss.error_10000505);
	 }  
	 else {
		 //  需要二次登录认证。
		 showPopError(rss.smsSendDefErr);
	 }
	agrDialog.hide();
}

function checkExistAuto(f,flagPost,smsReqType,session_code_key,reqClientType,lang,param,agrDialog)
	{
		var e = function(g, x) {
			jQuery(g).show().html(x);
		};
		
		ec.account.checkExist(f.val(),f,
				function() {
					hideErrorNew($("#phoneInputDiv-box"), $("#msg_phone"));
				},
				function() {
					
					if(flagPost != "regPost" && flagPost != "getAuthCodePost")
					{
						hideErrorNew($("#phoneInputDiv-box"), $("#msg_phone"));
						f.removeClass("error");
					}
					if(flagPost=="regPost")
					{
						regPostAction(agrDialog);
					}
					if(flagPost=="getAuthCodePost")
					{
						var strUserAccount="";
						if($("#countryCode").val().indexOf("+") >-1) {
							strUserAccount=$("#countryCode").val().replace("+","00")+f.val();
						} else {
							strUserAccount=$("#countryCode").val()+f.val();
						}
						sendSMS(strUserAccount,reqClientType,lang,param);
					}
				},
				function() {
					showErrorNew($("#phoneInputDiv-box"),$("#msg_phone"), rss.phoneexist);
				},
				function() {
					showErrorNew($("#phoneInputDiv-box"),$("#msg_phone"), rss.timeout);
					f.removeClass("error");
		  });
	}	

function sendSMS(phoneNumber,reqClientType,lang,param){
		var getCodeButton=$("#getValiCode");
		if($("#randomCode").length>0&&!ec.form.validator($("#randomCode"), true))
					{
						return false;
					}
		var strParms="getSMSAuthCode";
		var operType = 14;
		var dataParms={
				"userAccount":phoneNumber,
				"smsReqType":"4",
				"reqClientType":reqClientType,
				"accountType":2,
				"siteID":localInfo.currentCountrySiteID,
				"languageCode":localInfo.lang,
				"randomAuthCode":$("#randomCode").val(),
				 operType:operType
		};
		if(param)
		{
			operType = param.operType || 6;
			strParms = param.method||"getSMSAuthCode";
			var dataParms={
					"mobilePhone":phoneNumber,
					"smsReqType":"4",
					"reqClientType":reqClientType,
					"accountType":2,
					"siteID":localInfo.currentSiteID,
					"languageCode":localInfo.lang,
					 operType:operType
			};
		}	
		
		
		var dialogOptions;
		if (rss.msgDialogOverlayClass)
		{
			dialogOptions = {
				overlayClass: rss.msgDialogOverlayClass// 背景层的样式
			};
		}
		
		if(localInfo.createChildFlag=="true")
		{
			dataParms.operType=6;
		}
		
		ajaxHandler(strParms,dataParms,function(data) {
			  if(data.isSuccess=="1")
				{
					hideErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"));
					showMsgSuccess({obj:$("#msg_getPhoneRandomCode"), msg:rss.smsHasSendTo.format(getExpressPhone(dataParms.userAccount)), leftPix:'-255px', rightPix:'-255px', bottom:'63px'});
					getCodeButton.attr("IntervalTime",60);
					getCodeButton.attr("disabled",true);
					getCodeButton.addClass("auth_code_grey");
					jsInnerTimeout();
				}
			  else
			    {
				  switch(data.errorCode) {
				  	case '10000001':
	 				case '70001201': {
	 					showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"), rss.error_70001201);
	 					break;
	 				}
	 				case '10000201':{
	 					// 图片验证码的相关的逻辑
	 					showRandomCodeError(rss.common_js_wrongcode);
	 					//清除图片验证码输入框，刷新图片验证码,去掉绿色勾勾.
	 					chgRandomCodeForReset();
	 					break;
	 				}
	 				case '70001401': {
	 					showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"), rss.error_70001401);
	 					break;
	 				}
	 				case '70002002': {
	 					showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"), rss.error_70002002);
	 					break;
	 				}
	 				case '70002001': {
	 					showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"), rss.error_70002001);
	 					break;
	 				}
	 				case '70002028': {
	 					showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"), rss.error_70002028);
	 					break;
	 				}
	 				case '70002046': {
	 					showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"), rss.error_70002046);
	 					break;
	 				}
	 				case '70002030': {
	 					showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"), rss.error_70002030);
	 					break;
	 				}
	 				case '70001102': {
	 					showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"), rss.error_70001102);
	 					break;
	 				}
	 				case '70001104': {
	 					showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"), rss.error_70001104);
	 					break;
	 				}
	 				case '10000004': {
	 					showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"), rss.error_10000004);
	 					break;
	 				}
	 				case '10000002': {
	 					showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"), rss.error_70001201);
	 					break;
	 				}
	 				default: {
	 					showErrorNew($("#errRandomCode-box"),$("#msg_phoneRandomCode"), rss.error_70001201);
	 					break;
	 				}
				}
		    }	
		  },function(){},true,"JSON", dialogOptions);
	}

//转化成下拉格式 里面其他参数还有用吗？
function listToDropListCountry(list){
   	var itemsNew = [];
	   	if(list)
	   	{
	   		$.each(list,function(n,value){
	   			var item = {
		 					value:value.siteID + "-" + value.regionID,
		 					label:value.mulitLangRegion
		 				};
		 			itemsNew.push(item);	
	   		});
	   	}
	   	return itemsNew;
   
   }

function getdefaultCountryByCurrentSiteID() {
		var defaultCountry = "";
		switch (currentSiteID) {
		case "9":
			defaultCountry = currentSiteID+"-" + "en-us";
			break;
		case "5":
			defaultCountry = currentSiteID+"-" + "zh-hk";
			break;
		case "8":
			defaultCountry = currentSiteID+"-" + "ru-ru";
			break;
		case "7":
			defaultCountry = currentSiteID+"-" + "de-de";
			break;
		case "6":
			defaultCountry = currentSiteID+"-" + "pt-br";
			break;
		case "1":
			defaultCountry = currentSiteID+"-" + "zh-cn";
			break;
		case "3":
			defaultCountry = currentSiteID+"-" + "en-in";
			break;
		}
		return defaultCountry;
	}
	
/**
 * 获取国家列表
 */
function getCountryRegion(){
        var dataParms={
                "lang":localInfo.lang,
                "reqClientType":localInfo.reqClientType
        };
        
        // 第三方帐号不涉及跨站的相关的问题。
        if(localInfo.thirdLoginFlag=="true" || localInfo.isQuickReg=="true")
        {
        	dataParms.reqClientType=7;
        }
        
        var strParms="getCountryRegion";
        ajaxHandler(strParms,dataParms,function(data) {
              if(data.isSuccess=="1")
                {
                  countryRegions = data.countryRegions;
                  showCountryRegions = listToDropListCountry(countryRegions);
                }
          },function(){},false,"JSON");

        //新加  
         $('#selectCountryImg').DropListEMUI5({
			items: showCountryRegions,
			defaultValue:localInfo.currentCountrySiteID+"-"+localInfo.countryCode,
			onChange: function(key, value) {
	            var inputVal = key.split('-');
	            localInfo.currentCountrySiteID = inputVal[0];//站点
	            localInfo.countryCode = inputVal[1];//国家代号
	            var flag = inputVal[0] != '7';
	            if(inputVal[0] != localInfo.currentSiteID && !warningConfirmed){
	            	isCurrentSite = false;
	            	notCurrentSiteWarningDialog();
	            }
	            changeBirthDayInput(flag);
	            var dataParms = {
	            	lang: localInfo.lang,
	            	siteID: inputVal[0]
	            }
	            ajaxHandler('getCountryCallingCode', dataParms, function(data){
	            	if(data.isSuccess){
	            		changeInputCountryCode(data.countryCallingCodeList);

	    			    //不需要再请求

	    		 	    displayCountry();
	            	} else {
	            		return;
	            	}
	            });

                $("#selectedCountry").text(value);
                $("#regXCountry").text(rss.now_register_x_account.format(value));
                var country = key;
                $("#selectCountryCodeDiv").html("");
                getAgreementContent(country.split("-")[1]);
                 $("#countryRegion").val(country);
                 displayAgreeTwoByCD(country.split("-")[1]);
				}
		    });
    }
    
function displayCountry() {
        var inputCountryCode = localInfo.countryCode;
        var ipCountryCode = getIPCountry();
        var defaultCountry = getdefaultCountryByCurrentSiteID();
        var defaultCountryCode = defaultCountry.split("-")[2];
        var country = "";
        
        if(localInfo.createChildFlag=="true")
        {
        	$("#selectedCountry").text(localInfo.localCountryName); 
            $("#regXCountry").text(rss.now_register_x_account.format(localInfo.localCountryName));
            $("#countryRegion").val(localInfo.urlCountrySiteID+"-"+localInfo.countryCode);
        }
        else
        {	
        
	        if (countryRegions.length>0) {
	        	
	        	
	        	var hasFound=false;
	        	
	        	if(inputCountryCode)
	        	{
	        		$.each(countryRegions,function(n,value) { 
	        			if (inputCountryCode.toLowerCase() == value.regionID) {
	                        $("#selectedCountry").text(value.mulitLangRegion); 
	                        $("#regXCountry").text(rss.now_register_x_account.format(value.mulitLangRegion));
	                        hasFound=true;
	                        country = localInfo.urlCountrySiteID+"-"+value.regionID;
	                        replaceAgreeAge(value.ageLimit);
	                        return false;
	                    }
	        		});
	        	}
	        	
	        	
	        	if(ipCountryCode && !hasFound)
	        	{
	        		$.each(countryRegions,function(n,value) { 
	        			if (ipCountryCode.toLowerCase() == value.regionID) {
	                        $("#selectedCountry").text(value.mulitLangRegion);
	                        $("#regXCountry").text(rss.now_register_x_account.format(value.mulitLangRegion));
	                        hasFound=true;
	                        country = localInfo.currentSiteID+"-"+value.regionID;
	                        replaceAgreeAge(value.ageLimit);
	                        return false;
	                    }
	        		});
	        	}
	        	
	        	if(defaultCountryCode && !hasFound)
	        	{
	        		$.each(countryRegions,function(n,value) { 
	        			if (defaultCountryCode.toLowerCase() == value.regionID) { 
	                        $("#selectedCountry").text(value.mulitLangRegion); 
	                        $("#regXCountry").text(rss.now_register_x_account.format(value.mulitLangRegion));
	                        hasFound=true;
	                        country = defaultCountry;
	                        replaceAgreeAge(value.ageLimit);
	                        return false;
	                    }
	        		});
	        	}
	
	        }
        }
        
        $("#countryRegion").val(country);

 	   if(countryRegions.length >= 1) {
		   $("#chooseCountry").css("display","");
		   $("#chooseCountryShadow").css("display","");
	   }
    }
function getIPCountry() {
        var ipcountry="";
var dataParms = {
    "reqClientType" : localInfo.reqClientType
};
var strParms = "getIPCountry";
ajaxHandler(strParms, dataParms, function(data) {
    if (data.isSuccess == "1") {
        if (data.countryCode != "") { //
            ipcountry = localInfo.currentSiteID+"-"+data.countryCode;
        }   
    }
}, function() {
}, false, "JSON");
    return ipcountry;
}

//根据选择的国家更新手机号国家列表
function changeInputCountryCode(countrysArr){ 
	var items = [];
	if (countrysArr)
	{
		$.each(countrysArr, function(n, value) {
			var temp = value.split("(");	
			var key = temp[0];
			 var label = value.split("|")[0];
            var countryCode = value.split("|")[1];
            key = key.replace("+", "00");
            if(countryCode==localInfo.countryCode)
            {
            	localInfo.default_country_code = key;	
            }
			
			if (key) {
 				var item = {
 					value:key,
 					label:label
 				};
				items.push(item);
			}
		});
		
	}
	$("#countryCode").val(localInfo.default_country_code);
	$('#input_languageCode').DropListEMUI5({
		items: items,
		defaultValue:localInfo.default_country_code,
		onChange: function(key, value) {
			var temp = value.split("(");
			if (temp.length > 1)
			{
				$("#countryCode").val(temp[0]);
				var phone = $("#username").val();
				if(phone != "") {
					checkLengthByCountry($("#countryCode").val(), $("#username"), "#msg_phone", rss.error);
				if(!valiMobile(phone))
				{
					showErrorNew($("#phoneInputDiv-box"),$("#msg_phone"), rss.error);
					return;
				}
				}
			}
		}
    });
}
//针对非7站点的国家，填写生日信息，避免表单无法提交，表单提交时会将信息去掉。

//怎么设置新的组件值来避免表单提交？有表单提交？
function changeBirthDayInput(flag){
	if(flag){
    	$('#birthDateWrap').hide();
    	
    } else {
    	$('#birthDateWrap').show();
    }
}

//全球注册情况下，根据当前URL中countryCode的值更改 国家/地区 栏位的值
function changeCountryLocation(countryRegions){
   
  	var urlCountryCode = /countryCode=([a-zA-Z]{2})/.exec(window.location.href)[1];
	var countryName = "", urlCountrySiteID = "";
	if(countryRegions.length > 0){
		for(var i = 0; i < countryRegions.length; i++){
			if(countryRegions[i].regionID == urlCountryCode){
				countryName = countryRegions[i].mulitLangRegion;
				urlCountrySiteID = countryRegions[i].siteID;
				break;
			}
		}
	}
	$('#selectedCountry').text(countryName);
	$('#countryRegion').val(urlCountrySiteID + '-' + urlCountryCode);
    
	var birthFlag = urlCountrySiteID != '7';
	changeBirthDayInput(birthFlag);
}

function notCurrentSiteWarningDialog(){
	var htmlStr = "<div style='text-align:left;line-height:18px'>"+rss.notCurrentSiteWarning+"</div>";
	var Pop = $("div").DialogSimple({text:htmlStr,btnText:rss.iKnowBtn,
	  	btnFn:function(){
	  		warningConfirmed = true;
	  		this.hide();
	  	}}).show();
	  $(".global_black_overlay").off("click").on("click",function(){
	  	Pop.hide();
	  });
	//根据是否有头部判断是否嵌入，更改弹窗的top值
	if(localInfo.isIfm == "false")
	{
		$(".global_dialog_confirm_main").css("top","32%");
	}
}

//这个函数的主要功能就是展示  对应的agreeTwo
function displayAgreeTwoByCD(countryCode)
{
    if (countryRegions.length>0) {
        $.each(countryRegions,function(n,value) {                 
              if (countryCode.toLowerCase() == value.regionID) {
            	  replaceAgreeAge(value.ageLimit);
              } 
          });
    }
}
	
function getAgreementContent(country) {
	var agrContentArr =[];
	var dataParms = {
		"reqClientType" : localInfo.reqClientType,
		"lang" : localInfo.lang,
		"countryCode":country,
		"operType":0
	};
	
	if(localInfo.createChildFlag=="true")
	{
		dataParms.isChild = "true";
	}
	
	var strParms = "getAgreementContent";
	ajaxHandler(strParms, dataParms, function(data) {
		if (data.isSuccess == "1") {
			
			localInfo.agreementContentsStr=data.agreeForReg;
			localInfo.agreementContents = data.agreementContents;
			localInfo.ageLimit=data.ageLimit;
			
			
			// 更新页脚的链接地址
			$("#foot_EULA").attr("href",data.huaweiIDAgrUrl);
			$("#foot_privacy").attr("href",data.privacyPolicyUrl);
			
		}
	}, function() {
	}, true, "JSON");
}
	
function getMobileCode(smsReqType,session_code_key,reqClientType,lang,param)
{
	var mobilephone= $("#username").val();
	if(mobilephone=="")
	{
		showErrorNew($("#phoneInputDiv-box"),$("#msg_phone"), rss.phoneemptyfail);
		return;
	}
	
	if(!valiMobile(mobilephone))
	{
		showErrorNew($("#phoneInputDiv-box"),$("#msg_phone"), rss.error);
		return;
	}
	
	var countryCode = $("#countryCode").val()
	if(countryCode.indexOf("+") > -1) {
		countryCode = countryCode.replace("+", "00");
	}
	if(!checkLengthByCountry(countryCode, $("#username"), "#msg_phone", rss.error)) {
		return;
	}
	
	$("#msg_phone").html("");
	$("#msg_phoneRandomCode").html("");
	$("#register_msg").html("");
	
	var useraccountcheck=$("#username");
	checkExistAuto(useraccountcheck,"getAuthCodePost",smsReqType,session_code_key,reqClientType,lang,param);
}

function jsInnerTimeout()
{
	var codeObj=$("#getValiCode");
	
	var intAs=parseInt(codeObj.attr("IntervalTime"));

	intAs--;
	codeObj.attr("disabled",true);
	if(intAs<=-1)
	{
		codeObj.attr("disabled",false);
		codeObj.removeClass("auth_code_grey");
		codeObj.val(rss.resend);
		return true;
	}
	
	codeObj.val(rss.resend_time.format(intAs));
	codeObj.attr("IntervalTime",intAs);
	
	setTimeout("jsInnerTimeout()",1000);
}

function changePhoneCode (){
	var userAcount=$("#username").val();
	var lang_select= jQuery("#input_languageCode").find("option:selected").val();
	var msg_phone_obj=$("#msg_phone");
	var flagValiResult=true;
	
	if(lang_select == "+86")
	{
		if (userAcount.length < 11) {
			flagValiResult= false;
		}
		else
		{
			flagValiResult= /^(1[0-9])[0-9]{9}$|(^(\+|00)852[9865])[0-9]{7}$/.test(userAcount);
		}
	}
	else
	{
		flagValiResult= /^[0-9]{5,15}$/.test(userAcount);
	}
	
	if(userAcount=="")
	{
		msg_phone_obj.html("");
		return false;
	}
	
	if(!flagValiResult)
	{
		showErrorNew($("#phoneInputDiv-box"),msg_phone_obj, rss.error);
		return false;
	}
	
	userAcount=lang_select.replace("+","00")+userAcount;
	var strParms="isExsitUser";
	var parmsData={
			"userAccount":userAcount
	};
	
	ajaxHandler(strParms,parmsData,function(data){
		 if(data.isSuccess=="1" && data.existAccountFlag=="0")
		 {
			hideErrorNew($("#phoneInputDiv-box"), $("#msg_phone"));
			showMsgSuccess({obj:msg_phone_obj, msg:rss.unregisteredphone, leftPix:"68px", rightPix:"68px", bottom:"39px"});
		 }
		 else if(data.existAccountFlag=="1")
		 {
			 showErrorNew($("#phoneInputDiv-box"),msg_phone_obj, rss.phoneexist);
		 }
	},function(){},true,"json");
	
}
function valiMobile(b)
{
	if(b.indexOf(" ")>-1) {
		return false;
	}
	b=$.trim(b);
	if(b.length==0)
	{
		return true;
	}
	var lang_select= jQuery("#countryCode").val();
	
	if(lang_select == "0086" || lang_select == "+86")
	{
		if (b.length < 11) {
			return false;
		}
		return /^(1[0-9])[0-9]{9}$|(^(\+|00)852[9865])[0-9]{7}$/.test(b);
	}
	else
	{
		return /^[0-9]{5,15}$/.test(b) ;
	}
}

function replaceAgreeAge(ageLimit)
{
	if(ageLimit>0)
    {
  	  $("#clickAgree").text(rss.common_agree_two_age.format(ageLimit));
    }
    else
    {
  	  $("#clickAgree").text(rss.common_agree_two);
    }
}

function checkBirthdayWhenCreateChildAcct() {
	var birthday = $("#birthDate").datePickEMUI5("Y")+"-"+$("#birthDate").datePickEMUI5("M")+"-"+$("#birthDate").datePickEMUI5("D");
	var age = jsGetAge(birthday);
	if(age == -2) {
		showErrorNew($("#birthDateWrap"), $("#birthdayError"), rss.chooseDateTip);
		return false;
	}
	if(age == -1) {
		showErrorNew($("#birthDateWrap"), $("#birthdayError"), rss.age_error);
		return false;
	}
	
	if(age >= 13) {
		//  如果生日大于13岁，那么需要提醒用户走正常注册流程
		over13GONormal();
		return false;
	} else if(age < 0) {
		showErrorNew(null, $("#birthdayError"), rss.age_error);
		return false;
	}
	return true;
}
function updateUserAgrsForParent(agrID, callback) {
 		
		var jsonArrObj=JSON.parse(agrID);	 		
 		var agrIDs = [];
 		for(var i=0;i<jsonArrObj.length;i++)
 		{
 			agrIDs.push(jsonArrObj[i]);
 		}
 		
 		var dataParms = {
 		        reqClientType : localInfo.reqClientType,
 		        agrIDs:JSON.stringify(agrIDs)
 		    };
 		    ajaxHandler("updateUserAgrs", dataParms, function(data) {
 		        var isSuccess = data.isSuccess;
 		        if (isSuccess == '1') {
 		        	 if(callback) {
 		        		 callback();
 		        	 }
 		        }
 		        else {
 		        	if (data.errorCode == "10000001") {
 		        		showErrorNew(null, $("#register_msg"), rss.error_10000001);
 		            }
 		        	else {
 		        		showErrorNew(null, $("#register_msg"), rss.common_error);
 		        	}
 		        }
 		    }, function() {
 		    }, false, "json");
 	}

function initInputContent()
{
	var maxWidth=0;
    var maxLeftWidth =0;
	if(!navigator.userAgent.match(/Chrome/)&&navigator.userAgent.match(/Safari/)&&localInfo.lang=="zh-cn")
   {		
   $(".input-container .input-left").each(function(){
		if($(this).parent().attr("id")=="phoneInputDiv-box")
		return;
		var text=$(this).text();
		text=text.split("").join(" ");
		$(this).text(text);
	})
   }
	$(".input-container .input-left").each(function(){
		
		var width = $(this).width();
		var leftWidth = $(this).outerWidth();
		if(maxWidth<width)
		{
			maxWidth=width;
		}
		if(maxLeftWidth<leftWidth)
		{
			maxLeftWidth=leftWidth;
		}
	})
	var containerWidth = $(".input-container").outerWidth();
	var rightWidth = containerWidth-maxLeftWidth;
	
	if(isRightLang(localInfo.lang))
	{	
	$("#chooseCountry .input-content,.input-content.birthDateContent").css("margin-right",maxLeftWidth+"px");
	}
	else
	{
	$("#chooseCountry .input-content,.input-content.birthDateContent").css("margin-left",maxLeftWidth+"px");	
	}	
	
	$("#chooseCountry .dpmenu-EMUI5-down").css("width",rightWidth+"px");
	$("#chooseCountry .dpmenu-EMUI5-down").css("max-width",(rightWidth-16)+"px");
	if(!(localInfo.lang=="zh-cn"||localInfo.lang=="zh-tw"||localInfo.lang=="zh-hk"||localInfo.lang=="en-us"))
	{
    $(".input-container .input-left").width(maxWidth+1);
	}
    

}


//密码强度提示框的内容
function pwdStrengthHintDialog()
{
	var pwdCheckDialog = $("#pwd_check_dialog").html();
	
	if(!pwdCheckDialog){
		var hintHtml = '<div class="pwd-info-indialog">';
		hintHtml += '<div class="normal-tips-EMUI5 pwd-format-des-head normal-tips">' + rss.reset_pwd_format_title + '</div>';
		hintHtml += '<div id="pwdLength" class="gray-tips-EMUI5 "><img class="pwd-format l" src=""> <span>' + rss.pwd_format_1 + '</span></div>';
		hintHtml += '<div id="pwdChar" class="gray-tips-EMUI5 "> <img class="pwd-format l" src=""> <span>' + rss.pwd_format_2 + '</span></div>';
		hintHtml += '<div id="pwdNumber" class="gray-tips-EMUI5"> <img class="pwd-format l" src=""> <span>' + rss.pwd_format_3 + '</span></div>';
		hintHtml += '</div>'
		
		hintHtml += '<div class="pwd-info" style="margin-top: 16px;">';
		hintHtml += '<div class="normal-tips">' + rss.pwd_strength + '<span id="pwdComplexFlag"></span></div>';
		hintHtml += '<div class="line8-EMUI5">';
		hintHtml += '<div class="gray-tips">';
		hintHtml += '<div class="pwd-complex">';
		hintHtml += '<div id="pwdStong" class="pwd-stro"></div>';
		hintHtml += '</div>';
		hintHtml += '</div>';
		hintHtml += '</div>';
		hintHtml += '<div id="pwd-tips" class="normal-tips-EMUI5 color66">' + rss.uc_change_pwd_safe_tip + '</div>';
		hintHtml += '</div>';
		
		showMsgSuccess({obj:$("#pwd_check_dialog"),msg:hintHtml, leftPix:'55px', rightPix:'0px',bottom:'38px',autoHide:false,contentType:"html"});
		
		// 开始针对添加对应的现象
		$("#pwdLength > img.pwd-format").attr("src",localInfo.formatNo);
		$("#pwdChar > img.pwd-format").attr("src",localInfo.formatNo);
		$("#pwdNumber > img.pwd-format").attr("src",localInfo.formatNo);
	}
}