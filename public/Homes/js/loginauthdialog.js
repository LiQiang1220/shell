/**
 *  主要用户支撑登录页面的二次认证。让二次认证能够正常化
 */

;
(function($, window, undefined) {
	var _password, _userAccount, _accountType;
	var resendCount = 0, secEmailCount = 0, secPhoneCount = 0, resendTime = 0, secEmailTime = 0, secPhoneTime = 0;
	var sendTimeout = 0, secPhoneTimeout, secEmailTimeout;

	var maxTimeDev = localInfo.maxTimeDev * 60 * 1000; //
	var maxCountDev = localInfo.maxCountDev;//4
	var recoverTimeDev = localInfo.recoverTimeDev * 60 * 1000; // 30*60*1000

	var maxTimePhone = localInfo.maxTimePhone * 60 * 1000; //
	var maxCountPhone = localInfo.maxCountPhone;//4
	var recoverTimePhone = localInfo.recoverTimePhone * 60 * 1000; // 30*60*1000

	var maxTimeEmail = localInfo.maxTimeEmail * 60 * 1000; //
	var maxCountEmail = localInfo.maxCountEmail;//4
	var recoverTimeEmail = localInfo.recoverTimeEmail * 60 * 1000; // 30*60*1000

	var resendDisabled = false, secPhoneDisabled = false;
	secEmailDisabled = false;
	// 用户帐号信息
	var userAcctInfoData = {};

	//  二次认证 1.0  Begin
	var secAuthDialog = function(param) {

		var accountInfoArr = param.accountInfoArr || [];
		var htmlStr = '';
		var useraccount = param.queryCond;
		var desc = param.desc;
		var operType = param.operType;
		var opType = param.opType;
		var isLogin = param.isLogin;
		var checkOperType = param.checkOperType;

		// 用户帐号归属站点号
		var accountSiteID = param.siteID;
		if (accountInfoArr.length == 0) {
			getAccountInfo(useraccount, 3, function(data, userID) {
				accountInfoArr = data;
				localInfo.userID = userID;
			}, localInfo.accountType);
		}

		// 针对二次认证的话，段首的标注是必然不空的
		htmlStr += '<div id="authenDialog"><p class="inptips2">' + desc
				+ '</p>';
		htmlStr += '<div class="margin10-EMUI5"><div id="accountDiv" class="fixAccountDrt"></div><input type="hidden" id="selectAccount" value="" /><input type="hidden" id="selectType" value="" /></div>';

		var items = [];

		if (accountInfoArr) {
			$.each(accountInfoArr, function(n, value) {
				var item = {
					value : JSON.stringify({
						type : value.accountType,
						account : value.userAccount
					}),
					label : getExpressPhone(value.userAccount)
				};
				items.push(item);
			});
		}

		htmlStr += '<div class="dinput" id="oldAuthCode-box"><input type="text" id="oldAuthCode" /><div id="getAuthCodeBtn" intervaltime="60" class="dbtn2 drtFix sbtn r"><span>'
				+ rss.sendAuthCode
				+ '</span><div id="authCodeError"></div></div></div><div id="oldAuthCode_error_info" class="error-tips-EMUI5"></div></div>';

		// 1、	所有验证身份处增加“没有收到验证码？”
		htmlStr += getAppealChangesLinkDiv(items);

		var authDialogTitle = rss.account_protect_tip;
		
		// 下述条件下走老的路子
		if(localInfo.curAccountSiteID != localInfo.currentSiteID || localInfo.isCurSiteOpenDeviceFinger == "false")
		{
			htmlStr += '<div class="rememberDiv"><input type="checkbox" style="position:absolute;left:-10000px;top:-10000px" id="rememberClientFlag"><label for="rememberClientFlag" class="check-box check-box-drt"><i id="rememberClientIcon"  class="check-icon tick-off drt-fix"></i></label><span style="vertical-align:middle;padding:5px">'
				+ rss.rememberBrowser + '</span></div>';
			htmlStr += '<p class="rememberRemark" style="clear:both;color:rgba(0,0,0,0.5);font-size:13px;margin-top: 10px;">'
				+ rss.rememberBrowserTip + '</p>';
		}

		var option = {

			title : authDialogTitle,
			btnRight : {
				text : param.rBtnTxt,
				fn : function() {
					var self = this;

					// span中的东西仅仅用于展示
					if (!ec.form.validator($("#authenDialog"), true)) {
						return false;
					}

					var remember_client_flag = "off";
					
					if($("#rememberClientIcon").length>0)
					{
						$('#rememberClientIcon').removeClass('tick-on').addClass(
								'tick-off')
						if ($("#rememberClientFlag:checked").length > 0) {
							remember_client_flag = "on";
							$('#rememberClientIcon').removeClass('tick-off')
									.addClass('tick-on')
						}
					}
					else
					{
						remember_client_flag = "";
					}
					
					var paramObj = {
						remember_client_flag : remember_client_flag,
						opType : "1"
					};
					param.callbackFn(paramObj, function() {
						self.hide();
					});

				}
			},
			btnLeft : {
				text : param.lBtnTxt,
				fn : function() {
				}
			},
			html : htmlStr,
			dialogStyle : localInfo.msgDialogStyle,
			beforeAction : function() {
				if (localInfo.beforeAction) {
					if (typeof (localInfo.beforeAction) == "function") {
						localInfo.beforeAction();
					}
				}

				$('#accountDiv').DropListEMUI5(
						{
							items : items,
							onChange : function(key, value) {
								$("#oldUserAccount").val(value);
								if (value.indexOf("@") >= 0) {
									$('.lb_opacity_Class').find('div').html(
											rss.emailAuthCode);
								} else {
									$('.lb_opacity_Class').find('div').html(
											rss.smsAuthCode);
								}
							}
						});
				var self = this;
				self.disabled();
				$("#oldAuthCode").on("keyup change paste", function() {
					setTimeout(function() {
						if ($("#oldAuthCode").val().trim() != "") {
							self.enable();
							return false;
						} else {
							self.disabled();
						}
					}, 0);

				});

				$("#getAuthCodeBtn").on(
						"click",
						function(e) {
							if ($("#getAuthCodeBtn").attr("disabled")) {
								return false;
							}
							if (!ec.form.validator($("#accountDiv"), true)) {
								return false;
							}

							// 这里得到了json字符串，将其转换为json对象
							var typeAndAccount = $.parseJSON($(
									"#accountDiv input").val());
							var param = {
								phoneOrEmail : typeAndAccount.account,
								authCodebtn : $("#getAuthCodeBtn")
							};
							if (localInfo.userID) {
								param.userID = localInfo.userID;
							}

							param.reqType = 6;
							param.account = useraccount;
							param.siteID = accountSiteID;
							param.operType = 2;
							param.accountType = getAccountType(useraccount);

							param.operType = operType;
							param.isLogin = isLogin;
							param.errorStyle = "EMUI5";
							param.errorTip = $("#oldAuthCode_error_info");
							param.errorDiv = '';
							param.failCustomize = true;
							getAuthCode(param);

						});
				$("#rememberClientFlag").change(
						function(event) {
							event.stopPropagation();
							var $this = $(this);
							if ($this.prop("checked")) {
								if ($("#rememberClientIcon")) {
									$("#rememberClientIcon").removeClass(
											'tick-off').addClass('tick-on');
								}
							} else {
								if ($("#rememberClientIcon")) {
									$("#rememberClientIcon").removeClass(
											'tick-on').addClass('tick-off');
								}
							}
						})
			}
		};
		$("<div>").Dialog(option).Dialog('show');

		// 账号列表展示完之后，针对placeholder进行特殊处理
		var curAccount = $("#accountDiv span").text();
		if (curAccount.indexOf("@") >= 0) {
			ec.form.input.label($('#oldAuthCode'), rss.emailAuthCode);
		} else {
			ec.form.input.label($('#oldAuthCode'), rss.smsAuthCode);
		}
		validateAuthCode($("#oldAuthCode"), $("#oldAuthCode-box"),
				$("#oldAuthCode_error_info"));
	};
	// 二次认证 1.0 End

	//验证身份
	var verifyIDDialog = function(param) {

		var accountInfoArr = param.accountInfoArr || [];
		var htmlStr = '';
		var useraccount = param.queryCond;
		var type = param.optType;
		var desc = param.desc;
		var operType = param.operType;
		var isLogin = param.isLogin;
		var checkOperType = param.checkOperType;
		var accountSiteID = param.siteID;
		var opType = param.opType;
		var accountSiteID = param.siteID;

		if (accountInfoArr.length == 0) {
			getAccountInfo(useraccount, 3, function(data, userID) {
				accountInfoArr = data;
				localInfo.userID = userID;
			}, localInfo.accountType);
		}

		htmlStr += '<div id="authenDialog">';

		htmlStr += '<div style="color:#ff3320;line-height:1.3;">' + desc
				+ '</div>';
		htmlStr += '<div class="margin10-EMUI5"><div id="accountDiv" class="fixAccountDrt"></div><input type="hidden" id="selectAccount" value="" /><input type="hidden" id="selectType" value="" /></div>';
		var items = [];

		if (accountInfoArr) {
			$.each(accountInfoArr, function(n, value) {
				var item = {
					value : JSON.stringify({
						type : value.accountType,
						account : value.userAccount
					}),
					label : getExpressPhone(value.userAccount)
				};
				items.push(item);
			});
		}

		htmlStr += '<div class="dinput" id="oldAuthCode-box"><input type="text" id="oldAuthCode"/><div id="getAuthCodeBtn" intervaltime="60" class="dbtn2 sbtn drtFix r"><span>'
				+ rss.sendAuthCode
				+ '</span><div id="authCodeError"></div></div></div><div id="oldAuthCode_error_info" class="error-tips-EMUI5"></div></div>';

		// 1、	所有验证身份处增加“没有收到验证码？”
		htmlStr += '<div style="width:100%;text-align:center;">'
				+ getAppealChangesLinkDiv(items)
				+ '</div>';

		var authDialogTitle = rss.enter_authcode_title;

		var option = {
			title : authDialogTitle,
			btnRight : {
				text : rss.next_step,
				fn : function() {

					var self = this;
					// span中的东西仅仅用于展示
					if (!ec.form.validator($("#authenDialog"), true)) {
						return false;
					}
					var authCode = $("#oldAuthCode").val();

					var typeAndAccount = $.parseJSON($("#accountDiv input")
							.val());

					// 下一步就是获取对应的  帐号
					var userAccountCode = typeAndAccount.account;
					var accountTypeCode = typeAndAccount.type;

					if (opType == "6") {
						chkAuthCodeLogin(
								accountSiteID,
								accountTypeCode,
								"7",
								"3",
								userAccountCode,
								authCode,
								$("#oldAuthCode_error_info"),
								function() {
									var paramObj = {
										userAccount : convPlusOfPhoneAccount($(
												"#login_userName").val().trim()),
										userAccountCode : userAccountCode,
										accountTypeCode : accountTypeCode,
										authCode : authCode,
										callbackFn : param.callbackFn,
										opType : param.opType,
										verifyID : "1",
										verifyself : self
									};

									updatePWDDialog(paramObj);
								});
					} else if (opType == "8") {
						var paramObj = {
							authCode : authCode,
							opType : "8"
						};

						paramObj.authAccountType = accountTypeCode;
						paramObj.authAccount = userAccountCode;

						param.callbackFn(paramObj, function() {
							self.hide();
						});
					}

				}
			},
			btnLeft : {
				text : rss.cancel,
				fn : function() {
				}
			},
			html : htmlStr,
			dialogStyle : localInfo.msgDialogStyle,
			beforeAction : function() {
				if (localInfo.beforeAction) {
					if (typeof (localInfo.beforeAction) == "function") {
						localInfo.beforeAction();
					}
				}

				$('#accountDiv').DropListEMUI5(
						{
							items : items,
							onChange : function(key, value) {
								$("#oldUserAccount").val(value);
								if (value.indexOf("@") >= 0) {
									$('.lb_opacity_Class').find('div').html(
											rss.emailAuthCode);
								} else {
									$('.lb_opacity_Class').find('div').html(
											rss.smsAuthCode);
								}
							}
						});
				var self = this;
				self.disabled();
				$("#oldAuthCode").on("keyup change paste", function() {
					setTimeout(function() {
						if ($("#oldAuthCode").val().trim() != "") {
							self.enable();
							return false;
						} else {
							self.disabled();
						}
					}, 0);

				});

				$("#getAuthCodeBtn").on(
						"click",
						function(e) {
							if ($("#getAuthCodeBtn").attr("disabled")) {
								return false;
							}
							if (!ec.form.validator($("#accountDiv"), true)) {
								return false;
							}

							// 这里得到了json字符串，将其转换为json对象
							var typeAndAccount = $.parseJSON($(
									"#accountDiv input").val());
							var param = {
								phoneOrEmail : typeAndAccount.account,
								authCodebtn : $("#getAuthCodeBtn")
							};
							if (localInfo.userID) {
								param.userID = localInfo.userID;
							}

							param.account = useraccount;
							param.siteID = accountSiteID;
							param.type = type;
							param.reqType = 3;
							param.accountType = typeAndAccount.type;

							param.operType = operType;
							param.isLogin = isLogin;
							param.errorStyle = "EMUI5";
							param.errorTip = $("#oldAuthCode_error_info");
							param.errorDiv = '';
							param.failCustomize = true;
							getAuthCode(param);

						});

			}
		};

		$("<div>").Dialog(option).Dialog('show');
		// 账号列表展示完之后，针对placeholder进行特殊处理
		var curAccount = $("#accountDiv span").text();
		if (curAccount.indexOf("@") >= 0) {
			ec.form.input.label($('#oldAuthCode'), rss.emailAuthCode);
		} else {
			ec.form.input.label($('#oldAuthCode'), rss.smsAuthCode);
		}
		validateAuthCode($("#oldAuthCode"), $("#oldAuthCode-box"),
				$("#oldAuthCode_error_info"));
	};

	//  下面的函数主要作用就是  发送 检验 验证码的 相关的 逻辑
	function chkAuthCodeLogin(accountSiteID, accountType, operType,
			authOprType, userAccount, authCode, infoElement, callback) {
		var params = {
			accountType : accountType,
			userAccount : userAccount,
			authCode : authCode,
			authOprType : authOprType,
			operType : operType,
			siteID : accountSiteID,
			reqClientType : 7
		};
		ajaxHandler("chkAuthCode", params, function(data) {
			if (data && data.isSuccess == 1) {
				callback();
			} else {
				var errorCode = data.errorCode;
				if (errorCode == "70002039") {
					showEMUIError($('#oldAuthCode-box'), infoElement,
							rss.error_70002039);
				} else if (errorCode == "70002057") {
					showEMUIError($('#oldAuthCode-box'), infoElement,
							rss.error_70002057_1);
				} else if (errorCode == "70002058") {
					showEMUIError($('#oldAuthCode-box'), infoElement,
							rss.error_70002058);
				} else {
					showEMUIError($('#oldAuthCode-box'), infoElement,
							rss.authCodeError);
				}
			}
		}, function() {
		}, true, "json");
	}

	// web风控弹框--设置新密码-start
	function updatePWDDialog(param) {

		var opType = param.opType;

		$("<div/>")
				.Dialog(
						{
							title : rss.set_newpassword,
							btnRight : {
								text : rss.next_step,
								fn : function() {
									var self = this;
									if (!ec.form.validator($("#newPassword"),
											true)
											|| !ec.form
													.validator(
															$("#confirmPassword"),
															true)) {
										return false;
									}

									if (param.verifyID) {
										var verifyself = param.verifyself;
										verifyself.hide();
									}

									var newPassword = $("#newPassword").val();

									var paramObj = {
										newPassword : newPassword,
										opType : param.opType
									};

									if (opType == "6") {
										paramObj.authCode = param.authCode;
										paramObj.authAccountType = param.accountTypeCode;
										paramObj.authAccount = param.userAccountCode;
									}

									param.callbackFn(paramObj, function() {
										self.hide();
									});
								}
							},
							btnLeft : {
								text : rss.cancel_btn,
								fn : function() {
								}
							},
							beforeAction : function() {

								$("#pwdLength span").html(
										$("#pwdLength span").html().format(8,
												32));
								$("#pwdNumber span").html(
										$("#pwdNumber span").html().format(1));

								ec.form.input.label.defaults.ifRight = "10px";
								ec.form.input.label($("#newPassword"),
										rss.newPwd);
								ec.form.input.label($("#confirmPassword"),
										rss.confirmNewPwd);
								validatorPassword.call(this);

								$("#pwdPic")
										.click(
												function() {
													var type = document
															.getElementById("newPassword").type;
													if (type == "password") {
														document
																.getElementById("newPassword").type = "text";
														document
																.getElementById("confirmPassword").type = "text";
														$("#pwdPic")
																.attr(
																		"src",
																		localInfo.eyeon);
													} else {
														document
																.getElementById("newPassword").type = "password";
														document
																.getElementById("confirmPassword").type = "password";
														$("#pwdPic")
																.attr(
																		"src",
																		localInfo.eyeoff);
													}
												});
								validatorPassword.call(this);

								$("#newPassword").keyup(function() {
									onPwdKeyUp(this);
								});

							},
							dialogStyle : localInfo.msgDialogStyle,
							html : '<p id="authenDialog" class="resetPwd-subtitle">'
									+ rss.risk_control_pwd
									+ '</p>'
									+ '<div class="dinput-UI5" id="passwordDivTip"><div class="ico-div"><img class="eyeoff" id="pwdPic" src="'
									+ localInfo.eyeoff
									+ '"></div>'
									+ '<div class="input-div"><input class="input-scroll" id="newPassword" type="password" onkeyup="onPwdKeyUp(this)"></div>'
									+ '</div><div id="new_pwd_error_info" class="dinput-UI5-tip error-tips-EMUI5"></div>'
									+ '<div class="dinput-UI5 confirmPwd" id="confirmPasswordDiv"><div class="input-div">'
									+ '<input class="input-scroll" id="confirmPassword" type="password"></div></div><div id="confirm_pwd_error_info" class="dinput-UI5-tip error-tips-EMUI5"></div>'
									+ '<div class="line-EMUI5 margin20-EMUI5">'
									+ '<div class="normal-tips-EMUI5 pwd-format-des-head">'
									+ rss.reset_pwd_format_title
									+ ' </div>'
									+ '<div id="pwdLength" class="gray-tips-EMUI5 "><img class="pwd-format l" src="'
									+ localInfo.formatNo
									+ '">'
									+ '<span>'
									+ rss.pwd_format_1
									+ '</span></div>'
									+ '<div id="pwdChar" class="gray-tips-EMUI5 "> <img class="pwd-format l" src="'
									+ localInfo.formatNo
									+ '">'
									+ '<span>'
									+ rss.pwd_format_2
									+ '</span></div>'
									+ '<div id="pwdNumber" class="gray-tips-EMUI5 "> <img class="pwd-format l" src="'
									+ localInfo.formatNo
									+ '"">'
									+ '<span>'
									+ rss.pwd_format_3
									+ '</span></div></div><div class="line8-EMUI5">'
									+ '<div class="normal-tips-EMUI5">'
									+ rss.pwd_strength
									+ '&nbsp;<span id="pwdComplexFlag"></span></div></div>'
									+ '<div class="line8-EMUI5"><div class="gray-tips-EMUI5"><div class="pwd-complex" style="margin-bottom:8px;">'
									+ '<div id="pwdStong"></div></div></div>'
									+ '<div style="margin-bottom:-8px;padding-left:8px">'
									+ rss.uc_change_pwd_safe_tip
									+ '</div></div>'

						}).Dialog('show');

		function validatorPassword() {
			var newPassword = $("#newPassword"), confirmPassword = $("#confirmPassword"), self = this;

			this.disabled();

			//validate new password
			ec.form.validator.bind(newPassword,
					{
						type : [ "require", "length", "password" ],
						trim : false,
						validOnChange : true,
						compareTo : confirmPassword,
						min : 8,
						max : 32,
						msg_ct : "#new_pwd_error_info",
						errorFunction : function(obj, options) {
							$("#passwordDivTip").addClass("input-error-EMUI5");
							switch (options.type) {
							case "require":
								$("#new_pwd_error_info").html(
										rss.common_js_inputpwd);
								break;
							case "length":
								$("#new_pwd_error_info").html(
										rss.common_js_pwdlimit);
								break;
							case "password":
								$("#new_pwd_error_info").html(rss.pwdInputTip);
								break;
							case "pwdEqual":
								$("#new_pwd_error_info").html(
										rss.common_js_pwdnotsame);
							}
						},
						successFunction : function(obj, options) {
						},
						reInputFunction : function() {
							$("#new_pwd_error_info").html("");
							$("#passwordDivTip").removeClass(
									"input-error-EMUI5");

						}
					});

			//validate confirm password
			ec.form.validator.bind(confirmPassword, {
				type : [ "require", "eq" ],
				trim : false,
				validOnChange : true,
				compareTo : newPassword,
				msg_ct : "#confirm_pwd_error_info",
				errorFunction : function(obj, options) {
					$("#confirmPasswordDiv").addClass("input-error-EMUI5");
					switch (options.type) {
					case "require":
						$("#confirm_pwd_error_info").html(
								rss.common_js_confirmpwd);
						break;
					case "eq":
						$("#confirm_pwd_error_info").html(
								rss.common_js_pwdnotsame);
					}
				},
				successFunction : function(obj, options) {
				},
				reInputFunction : function() {
					$("#confirm_pwd_error_info").html("");
					$("#confirmPasswordDiv").removeClass("input-error-EMUI5");

				}
			});

			newPassword.on("blur", function() {
			}).on("keyup", function(e) {
				updateBtnState();
			});
			confirmPassword.on("blur", function() {
			}).on("keyup", function(e) {
				updateBtnState();
			});

			function validatorPassword() {
				$("#new_pwd_error_info").empty();
				$("#confirm_pwd_error_info").empty();

				ec.form.validator($(this), true);
				updateBtnState();
			}

			function updateBtnState() {
				if (newPassword.val() && confirmPassword.val()) {
					self.enable();
				} else {
					self.disabled();
				}
			}
		}

		function onPwdKeyUp(obj) {
			var complex = getPwdComplexity(obj.value);
			var $complexEl = $("#pwdStong")

			if (complex.length && complex.upLowChar && complex.number) {
				isWeakPassword(obj.value, function(data) {
					if (data.isSuccess == 1) {
						$complexEl.addClass("pwd-strong")
								.removeClass("pwd-low").removeClass(
										"pwd-middle");
						$('#new_pwd_error_info').html("");
						$("#pwdComplexFlag").html(rss.strong);
					} else if (data.errorCode == "10000801") {
						$complexEl.addClass("pwd-low")
								.removeClass("pwd-middle").removeClass(
										"pwd-strong");
						$('#new_pwd_error_info').html(rss.error_70008001);
						$("#pwdComplexFlag").html(rss.weak);
					}
				})
			} else {
				$complexEl.removeClass("pwd-middle").removeClass("pwd-low")
						.removeClass("pwd-strong");
				$('#new_pwd_error_info').html("");
				$("#pwdComplexFlag").html("");
			}
			trriger($("#pwdLength"), complex.length);
			trriger($("#pwdChar"), complex.upLowChar);
			trriger($("#pwdNumber"), complex.number);

			function trriger($el, ok) {
				if (ok) {
					$el.find("img").attr("src", localInfo.formatOk);
					$el.removeClass("gay-tips-EMUI5").addClass(
							"success-tips-EMUI5");
				} else {
					$el.find("img").attr("src", localInfo.formatNo);
					$el.removeClass("success-tips-EMUI5").addClass(
							"gay-tips-EMUI5");
				}
			}
			if (complex.strong * 1 < 2) {
				$("#resetPwdBtn").addClass("disabled");
			} else {
				$("#resetPwdBtn").removeClass("disabled");
			}

		}
	}

	// 跨站点断点登录
	var crossSiteIDDialog = function(param)
	{

		var htmlStr = "<div>" + rss.new_cross_login_tip + "</div>";

		htmlStr += "<div id='crossSite_errDiv' style='margin-top:10px;font-size:12px;color:#ff3320'></div>";

		$("<div></div>").DialogSimple(
				{
					text : htmlStr,
					btnText : rss.common_go_on,
					dialogStyle : localInfo.msgDialogStyle,
					btnFn : function() {
						var self = this;
						if($("#login_userName").is(":hidden")){ //短信登录跨站
							var paramObj = {
								"mobilePhone" : param.mobilePhone,
								"smsAuthCode" : param.smsAuthCode,
								"authCode" : param.authCode
							}
						}else{//帐号登录跨站
							var paramObj = {
								"userAccount" : param.userAccount,
								"password" : param.password
							}
						}
						agreeCrossSiteAgr(paramObj, param.authcode,
								param.callbackFn, this);
						this.hide();
					},
					btnLeftText : rss.uc_common_cancel,
					btnLeftFn : function() {

					},
					html : htmlStr
				}).show()
	};

	function agreeCrossSiteAgr(param, authcode, callbackFn, parent) {
		if($("#login_userName").is(":hidden")){ //短信登录跨站
			var dataParams = {
				"userAccount" : param.mobilePhone,
				"smsAuthCode" : param.smsAuthCode,
				"authCode" : param.authCode,
				"operType":"11",
				"reqClientType":localInfo.reqClientType,
				"loginChannel":localInfo.loginChannel,
				"lang":localInfo.lang,
				"service":localInfo.service,
				"quickAuth":localInfo.quickAuth
			}
		}else{//帐号登录跨站
			var dataParams = {
				"userAccount" : param.userAccount,
				"password" : param.password,
				"operType" : 1,
				"reqClientType" : localInfo.reqClientType
			}
		}
		//  需要执行的 核心逻辑   Begin
		ajaxHandler("agreeCrossSiteAgrs", dataParams, function(data) {
			var isSuccess = data.isSuccess;
			var errorCode = data.errorCode;

			if (isSuccess == '1') {
				callbackFn({
					authcode : authcode
				});
				
				if(parent != undefined)
				{
					parent.hide();
				}
			} else {
				if (errorCode == "70002003") {
					// 应该写明 帐号和密码错误
					$("#crossSite_errDiv").html(rss.login_wrong);
				} else if (errorCode == "70002057") {
					$("#crossSite_errDiv").html(rss.error_70002057_2);
				} else if (errorCode == "70002058") {
					$("#crossSite_errDiv").html(rss.error_70002058);
				} else {
					// 写错误码
					$("#crossSite_errDiv").html(rss.overload);
				}
			}
		}, function() {
		}, false, "json");
	}

	// web端重置密码弹框-end

	var acctProtectV2Dialog = function(param) {

		_password = param.password;
		_userAccount = param.userAccount;
		_accountType = getAccountType(_userAccount);
		var authType = 1; // 1 安全验证码，2 安全帐号的验证码
		var authAccountType, authAccount;
		var desAccount = "";

		var deviceCount = 0;
		$.each(param.authCodeSentList, function(n, v) {
        	if (v.name)
        	{
        		v.name = htmlencode(v.name);
        	}
        	
			if (v.sent == 1) {
				if (v.accountType == "6" || v.type == "mobile") {
					authType = 2;
					authAccountType = 6;
					authAccount = v.name;
					desAccount = rss.sec_code_sent_phone_email
							.format(authAccount);
				} else if (v.accountType == "5" || v.type == "email") {
					authType = 2;
					authAccountType = 5;
					authAccount = v.name;
					desAccount = rss.sec_code_sent_phone_email
							.format(authAccount);
				} else {
					deviceCount++;
					authType = 1;
					authAccountType = -1;
					if (deviceCount == 1) {
						desAccount = rss.security_code_sent_xdevice
								.format(v.name);
					} else {
						desAccount = rss.security_code_sent_other_device;
					}
				}

			}
		})

		var htmlStr = "<div id='sendCodeWayTip'>" + desAccount + "</div>";
		htmlStr += '<div style="display:table;height:40px;width:100%;border-radius:20px" id="authCodeDiv">';

		htmlStr += '<div id="num1" class="securityCodeDiv securityCodeHead"><input type="tel" maxlength="2" class="securityCodeInput" data-index="1"/></div>';
		htmlStr += '<div id="num2" class="securityCodeDiv securityCode"><input type="tel" maxlength="2" class="securityCodeInput" data-index="2"/></div>';
		htmlStr += '<div id="num3" class="securityCodeDiv securityCode"><input type="tel" maxlength="2" class="securityCodeInput" data-index="3"/></div>';
		htmlStr += '<div id="num4" class="securityCodeDiv securityCode"><input type="tel" maxlength="2" class="securityCodeInput" data-index="4"/></div>';
		htmlStr += '<div id="num5" class="securityCodeDiv securityCode"><input type="tel" maxlength="2" class="securityCodeInput" data-index="5"/></div>';
		htmlStr += '<div id="num6" class="securityCodeDiv securityCodeTail"><input type="tel" maxlength="2" class="securityCodeInput" data-index="6"/></div>';

		htmlStr += '</div>';
		htmlStr += '<div id="msg_error_secAuth" class="error-tips-EMUI5"></div>'
		htmlStr += '<div id="notRevice" style="width:100%;text-align: center;color: #007dff;margin: 20px auto;"><a class="a-EMUI5" style="font-size:14px">'
				+ rss.no_receive_security_code + '</a></div>';

		if(localInfo.curAccountSiteID != localInfo.currentSiteID || localInfo.isCurSiteOpenDeviceFinger == "false")
		{
			htmlStr += '<div>';
			htmlStr += '<span id="secondAuthRemerberCheck"  style="width:16px;height:16px;vertical-align:middle;display:inline-block" class="tick-off" id="remember_name"></span> ';
			htmlStr += '<span style="vertical-align:middle">' + rss.rememberBrowser
					+ '</span>';
			htmlStr += '</div>';
			htmlStr += '<p class="line-EMUI5 marginTop8" style="clear:both;color:rgba(0,0,0,0.5);font-size:13px;margin: 10px auto 0px;">'
					+ rss.rememberBrowserTip + '</p>';
		}
		

		$("<div/>")
				.Dialog(
						{
							title : rss.account_protect_tip,
							btnLeft : {
								text : rss.cancel,
								fn : function() {

								}
							},
							btnRight : {
								text : rss.iKnowBtn,
								fn : function() {
									var self = this;
									var secCode = getCode();
									if (!secCode)
										return;
									var remember_client_flag = "off";
									
									//表示对应的控件存在
									if($("#secondAuthRemerberCheck").length>0)
									{
										if ($("#secondAuthRemerberCheck").hasClass(
												"tick-on")) {
											remember_client_flag = "on";
										} else {
											remember_client_flag = "off";
										}
									}
									else
									{
										// 将对应的参数置空，
										remember_client_flag="";
									}
									
									
									var loginParam = {
										remember_client_flag : remember_client_flag,
										authCode : secCode,
										opType : 4
									}
									if (authType == 2)// 安全帐号的验证码
									{
										loginParam.accountType = authAccountType;
										loginParam.account = authAccount;
									} else if (authType == 1) {
										loginParam.accountType = -1;
										loginParam.account = _userAccount;
									}
									param.callbackFn(loginParam, function() {
										self.hide();
									});
								}
							},
							html : htmlStr,
							dialogStyle : localInfo.msgDialogStyle,
							beforeAction : function() {
								var self = this;
								self.disabled();
								$("#num1 input").focus();
								$(".securityCodeInput").bind(
										"keypress",
										function(event) {
											event = event || window.event;
											var keyCode = event.keyCode
													|| event.which;

										})


								$(".securityCodeInput").bind(
										"keyup",
										function(event) {
											event = event || window.event;
											var keyCode = event.keyCode
													|| event.which;
											var _self = this;
											
												if(this.value=="")
												{
													focusPrevious($(this).data(
													"index"));
													return;
												}
												if(this.value.length==2)
												{
													var v="";
													if(/^\d$/.test(this.value[1]))
													{
														v=this.value[1];
													}
													else 
													{
														v=this.value[0];
													}
													this.value=v;
												}	
												if(/^\d$/.test(this.value))
												{
													
														focusNext($(_self).data(
																"index"));
													
												}
												else
												{
													this.value="";
												}	
												
											
											$("#authCodeDiv").removeClass(
													"input-error-EMUI5");
											$("#msg_error_secAuth").html("");
											if (getCode()) {
												self.enable();
											} else {
												self.disabled();
											}
										})

								$(".securityCodeDiv").click(function() {
									$("input", $(this)).focus();
								})

								//没有收到？
								$("#notRevice a")
										.click(
												function() {
													self.hide();

													noReviceSecCodeDialog(
															_userAccount,
															param.authCodeSentList,
															function(info) {
																self.show();
																if (!info) {
																	if ($(
																			"#sendCodeWayTip")
																			.html()
																			&& $(
																					"#sendCodeWayTip")
																					.html() != '') {
																		$(
																				"#sendCodeWayTip")
																				.css(
																						'margin-bottom',
																						'10px');
																	}
																	return;
																}
																if (info.type == 5
																		|| info.type == 6) {//发送到安全帐号
																	$(
																			"#sendCodeWayTip")
																			.html(
																					rss.sec_code_sent_phone_email
																							.format(info.account));
																	authType = 2;
																	authAccountType = info.type;
																	authAccount = info.account;
																	if (rss.sec_code_sent_phone_email
																			.format(info.account)
																			&& rss.sec_code_sent_phone_email
																					.format(info.account) != '') {
																		$(
																				"#sendCodeWayTip")
																				.css(
																						'margin-bottom',
																						'10px');
																	}
																} else if (info.type == 7) {//发送到一个设备
																	$(
																			"#sendCodeWayTip")
																			.html(
																					rss.security_code_sent_xdevice
																							.format(info.account));
																	if (rss.security_code_sent_xdevice
																			.format(info.account)
																			&& rss.security_code_sent_xdevice
																					.format(info.account) != '') {
																		$(
																				"#sendCodeWayTip")
																				.css(
																						'margin-bottom',
																						'10px');
																	}
																} else if (info.type == 8) {
																	//发送到多个设被
																	$(
																			"#sendCodeWayTip")
																			.html(
																					rss.security_code_sent_other_device);
																	if (rss.security_code_sent_other_device
																			&& rss.security_code_sent_other_device != '') {
																		$(
																				"#sendCodeWayTip")
																				.css(
																						'margin-bottom',
																						'10px');
																	}
																}

															})
												})

								$("#secondAuthRemerberCheck")
										.click(
												function() {
													if ($(
															"#secondAuthRemerberCheck")
															.hasClass(
																	"tick-off")) {

														$(
																"#secondAuthRemerberCheck")
																.removeClass(
																		"tick-off");
														$(
																"#secondAuthRemerberCheck")
																.addClass(
																		"tick-on");
													} else {

														$(
																"#secondAuthRemerberCheck")
																.removeClass(
																		"tick-on");
														$(
																"#secondAuthRemerberCheck")
																.addClass(
																		"tick-off");
													}

												});
							}
						}).Dialog("show");

		function focusNext(index) {
			index = index * 1;
			if (index >= 6) {

			} else
				index++;
			$("#num" + index + " input").focus();
		}
		function focusPrevious(index) {
			index = index * 1;
			if (index > 1)
				index--;

			$("#num" + index + " input").focus();
		}
		function getCode() {
			var code = "";
			$(".securityCodeDiv").each(function(n, value) {

				code += $("input", $(this)).val();
			})
			if (code.length != 6 || isNaN(code * 1)) {
				code = false;
			}
			return code;
		}
		if (desAccount && desAccount != '') {
			$("#sendCodeWayTip").css('margin-bottom', '10px');
		}

	}

	// 帐号保护 End

	//2.0 帐号保护，无法收到验证码
	function noReviceSecCodeDialog(userAccount, authCodeSentList, callback) {

		var accountType = getAccountType(userAccount);
		var sendTo = rss.send_seccode_to_sec;
		var htmlstr = "";
		var lineHtml = '<div class="uc-line" style="padding:0"><div></div></div>';
		var resendHtml = "";
		var secEmail, secPhone, sendToSecEmailHtml = "", sendToSecPhoneHtml = "";
		var option = {
			title : rss.no_receive_security_code,
			btnRight : {
				text : rss.cancel,
				fn : function() {
					this.hide();
					callback();
				}
			},
			dialogStyle : localInfo.msgDialogStyle,
			beforeAction : function() {
				var self = this;
				self.$dialog
						.find(
								".global_dialog_confirm_content,.global_dialog_alert_content")
						.css("padding-top", "0px");
				if (resendDisabled) {
					$("#resend").addClass("dialog-line-disabled");
				}

				if (secPhoneDisabled) {
					$("#secPhoneItem").addClass("dialog-line-disabled");
				}

				if (secEmailDisabled) {
					$("#secEmailItem").addClass("dialog-line-disabled");
				}

				if (secEmail && secPhone) {

				} else if (secPhone) {

					$("#canNotUseSecAccount").find("a").text(
							rss.resetPwd_inputSecAuthCode_unableUsePhone);

				} else if (secEmail) {

					$("#canNotUseSecAccount").find("a").text(
							rss.resetPwd_inputSecAuthCode_unableUseEmail);

				}

				var self = this;

				var howtodoHTML = $("#howtodo").html();
				$("#howtodo").parent().append(
						"<a class='a-EMUI5 howtodo' >" + howtodoHTML + "</a>");
				$("#howtodo").remove();

				//如何操作
				$(".howtodo").click(
						function() {

							window.open("/CAS/portal/faq/" + localInfo.lang
									+ "_secCodeAndSecondLoginFaq.html");

						})



				//发送安全吗
				$("#resend").click(
						function() {

							if ($(this).hasClass("dialog-line-disabled")) {
								return;
							}
							clearTimeout(sendTimeout);
							var currentTime = new Date().getTime();
							if (currentTime - resendTime > maxTimeDev) {
								resendTime = currentTime;
								resendCount = 1;
							} else {
								resendCount++;
							}
							if (resendCount >= maxCountDev) {
								$("#resend").addClass("dialog-line-disabled");
								resendDisabled = true;
								sendTimeout = setTimeout(function() {
									resendTime = 0;
									resendCount = 0;
									$("#resend").removeClass(
											"dialog-line-disabled");
									resendDisabled = false;
								}, recoverTimeDev);
							}

							if ($(this).attr("type") == "-1") // 重新发送获取安全码
							{
								getSecCode(self);
							} else if ($(this).attr("type") == "5")// 重新发送获取安全邮件验证码
							{

								getsecEmailOrPhoneCode(secEmail, 5, self,
										function() {
											self.hide();
											callback({
												type : 5,
												account : secEmail
											});
										});
							} else if ($(this).attr("type") == "6") //重新发送获取安全手机验证码
							{
								getsecEmailOrPhoneCode(secPhone, 6, self,
										function(accountType) {
											self.hide();
											callback({
												type : 6,
												account : secPhone
											});
										});
							}

						})

				//发送验证码到安全手机号
				$("#secPhoneItem").click(
						function() {
							if ($(this).hasClass("dialog-line-disabled")) {
								return;
							}
							clearTimeout(secPhoneTimeout);
							var currentTime = new Date().getTime();
							if (currentTime - secPhoneTime > maxTimePhone) {
								secPhoneTime = currentTime;
								secPhoneCount = 1;
							} else {
								secPhoneCount++;
							}
							if (secPhoneCount >= maxCountPhone) {
								$("#secPhoneItem").addClass(
										"dialog-line-disabled");
								secPhoneDisabled = true;
								secPhoneTimeout = setTimeout(function() {
									secEmailTime = 0;
									secEmailCount = 0;
									$("#secPhoneItem").removeClass(
											"dialog-line-disabled");
									secPhoneDisabled = false;
								}, recoverTimePhone);
							}
							getsecEmailOrPhoneCode(secPhone, 6, self, function(
									accountType) {
								self.hide();
								callback({
									type : 6,
									account : secPhone
								});
							});
						})

				//发送验证码到安全邮件
				$("#secEmailItem").click(
						function() {

							if ($(this).hasClass("dialog-line-disabled")) {
								return;
							}
							clearTimeout(secEmailTimeout);
							var currentTime = new Date().getTime();
							if (currentTime - secEmailTime > maxTimeEmail) {
								secEmailTime = currentTime;
								secEmailCount = 1;
							} else {
								secEmailCount++;
							}
							if (secEmailCount >= maxCountEmail) {
								$("#secEmailItem").addClass(
										"dialog-line-disabled");
								secEmailDisabled = true;
								secEmailTimeout = setTimeout(function() {
									secEmailTime = 0;
									secEmailCount = 0;
									$("#secEmailItem").removeClass(
											"dialog-line-disabled");
									secEmailDisabled = false;
								}, recoverTimeEmail);
							}
							getsecEmailOrPhoneCode(secEmail, 5, self,
									function() {
										self.hide();
										callback({
											type : 5,
											account : secEmail
										});
									});
						})

				addItemActive($(".dialog-line"), "dialog-line-active",
						"dialog-line-disabled");
				addItemActive($(".a-EMUI5"), "a-EMUI5-active")

			}
		};

		$
				.each(
						authCodeSentList,
						function(n, v) {
							if (v.sent == 1) {
								if (v.accountType == "6" || v.type == "mobile") {
									secPhone = v.name;
									sendToSecPhoneHtml = '<div class="dialog-line" id="secPhoneItem">'
											+ '<span class="item-name item-left"><a class="a-EMUI5">'
											+ sendTo.format(secPhone)
											+ '</a></span>'
											+ '<div class="item-right"><span class="info-value item-forward" ></span></div>'
											+ '</div>' + lineHtml;
								} else if (v.accountType == "5"
										|| v.type == "email") {
									secEmail = v.name;
									sendToSecEmailHtml = '<div class="dialog-line" id="secEmailItem">'
											+ '<span class="item-name item-left"><a class="a-EMUI5">'
											+ sendTo.format(secEmail)
											+ '</a></span>'
											+ '<div class="item-right"><span class="info-value item-forward" ></span></div>'
											+ '</div>' + lineHtml;
								} else {
									resendHtml = "<div class='dialog-line' id='resend' type='-1'> <a class='a-EMUI5'>"
											+ rss.send_to_device
											+ "</a></div>"
											+ lineHtml;
								}

							} else {
								if (v.accountType == "6" || v.type == "mobile") {
									secPhone = v.name;
									sendToSecPhoneHtml = '<div class="dialog-line" id="secPhoneItem">'
											+ '<span class="item-name item-left"><a class="a-EMUI5">'
											+ sendTo.format(secPhone)
											+ '</a></span>'
											+ '<div class="item-right"><span class="info-value item-forward" ></span></div>'
											+ '</div>' + lineHtml;
								} else if (v.accountType == "5"
										|| v.type == "email") {
									secEmail = v.name;
									sendToSecEmailHtml = '<div class="dialog-line" id="secEmailItem">'
											+ '<span class="item-name item-left"><a class="a-EMUI5">'
											+ sendTo.format(secEmail)
											+ '</a></span>'
											+ '<div class="item-right"><span class="info-value item-forward" ></span></div>'
											+ '</div>' + lineHtml;
								}
							}
							v.label = v.name;
						});
		
		var noReviceCodeHTml = "<div class='margin-t16-b16'><div>"
				+ rss.offline_device_problem
				+ "</div><div>"
				+ rss.getcode_onoffline
				+ "</div></div>"+getAppealChangesLinkDiv(authCodeSentList,true);
		htmlstr = resendHtml + sendToSecPhoneHtml + sendToSecEmailHtml
				+ noReviceCodeHTml;

		option.html = htmlstr;

		$("<div>").Dialog(option).Dialog('show');

		function getSecCode(dialog) {
			var getSecurityCodeParam = {
				reqClientType : localInfo.reqClientType,
				languageCode : localInfo.lang,
				accountType : _accountType,
				userAccount : _userAccount,
				password : _password,
				service : localInfo.service
			}

			getSecurityCodeFn(getSecurityCodeParam, function(data) {
				var param = {}
				if (data.length > 1) {
					param.type = "8";
				} else if (data.length == 1) {
					param.type = "7";
					param.account = data[0].name;
				}
				dialog.hide();
				callback(param);
			}, dialog);
		}
	}

	// 发送验证码太多了 Begin
	var sendVerifyCodeError = function(title, msg, dialog) {
		var htmlStr = "";
		htmlStr += '<div>' + msg + '</div>';
		htmlStr += '<div style="width:100%;height:16px;"></div>';

		$("<div/>").Dialog({
			title : title,
			btnLeft : false,
			btnRight : {
				text : rss.common_I_know,
				fn : function() {
					this.hide();
					dialog.show();
				}
			},
			html : htmlStr,
			dialogStyle : localInfo.msgDialogStyle,
			beforeAction : function() {

			}
		}).Dialog("show");
	};

	// 发送验证码太多了 End

	function getsecEmailOrPhoneCode(phoneOrEmail, accountType, dialog, callback) {

		var sendAccountType;
		if (phoneOrEmail.indexOf("@") != -1) {
			sendAccountType = 1;
			method = "getEMailAuthCode";
			param = {
				userAccount : _userAccount,
				accountType : accountType,
				reqClientType : localInfo.reqClientType,
				emailReqType : 6,
				operType : 9,
				email : phoneOrEmail,
				siteID : localInfo.curAccountSiteID,
				languageCode : localInfo.lang
			};
		} else {
			sendAccountType = 2;
			method = "getSMSAuthCode";
			param = {
				accountType : accountType,
				userAccount : _userAccount,
				reqClientType : localInfo.reqClientType,
				mobilePhone : phoneOrEmail,
				operType : 9,
				smsReqType : 3,
				siteID : localInfo.curAccountSiteID,
				languageCode : localInfo.lang
			};
		}

		ajaxHandler(method, param,
				function(data) {

					var flag = data.isSuccess;
					if (flag == "1") {

						callback(accountType);
					} else {
						dialog.hide();
						if (data.errorCode == "10000001") {
							sendVerifyCodeError(rss.hint, rss.error_10000001_1,
									dialog);

						} else if (data.errorCode == "70001102") {
							if (sendAccountType == 1 || sendAccountType == 5) {
								sendVerifyCodeError(
										rss.send_code_too_many_times,
										rss.error_70001102_0, dialog);
							} else if (sendAccountType == 2
									|| sendAccountType == 6) {
								sendVerifyCodeError(
										rss.send_code_too_many_times,
										rss.error_70001102_1, dialog);
							}

						} else if (data.errorCode == "70001104") {
							if (sendAccountType == 1 || sendAccountType == 5) {
								sendVerifyCodeError(
										rss.send_code_too_many_times,
										rss.error_70001104_0, dialog);
							} else if (sendAccountType == 2
									|| sendAccountType == 6) {
								sendVerifyCodeError(
										rss.send_code_too_many_times,
										rss.error_70001104_1, dialog);
							}
						} else if (data.errorCode == "70001401") {
							sendVerifyCodeError(rss.hint, rss.error_70001401,
									dialog);

						} else if (data.errorCode == "70002001") {
							sendVerifyCodeError(rss.hint, rss.error_70002001,
									dialog);

						} else if (data.errorCode == "70002030") {
							sendVerifyCodeError(rss.hint, rss.error_70002030,
									dialog);

						} else {
							sendVerifyCodeError(rss.hint, rss.error_70002030,
									dialog);

						}
					}

				}, function() {
				}, false, "json");

	}

	function getSecurityCodeFn(params, callback, dialog) {
		var method = "getSecurityCode";
		$.ajax({
			url : getWebUrlHttps() + method + "?reflushCode=" + Math.random(),
			type : "POST",
			data : params,
			success : function(data) {
				if (data.isSuccess == "1") {
					callback(data.authCodeSentList);
				} else {
					dialog.hide();
					if (data.errorCode == "70001105") {
						sendVerifyCodeError(rss.send_code_too_many_times,
								rss.send_code_toomany_tip, dialog);
					} else {
						sendVerifyCodeError(rss.hint, rss.error_10000001_1,
								dialog);
					}
				}
			}
		});
	}



	window.crossSiteIDDialog = crossSiteIDDialog;
	window.updatePWDDialog = updatePWDDialog;
	window.secAuthDialog = secAuthDialog;
	window.verifyIDDialog = verifyIDDialog;
	window.acctProtectV2Dialog = acctProtectV2Dialog;
	window.sendVerifyCodeError = sendVerifyCodeError;
	window.noReviceSecCodeDialog = noReviceSecCodeDialog;

})(jQuery, window);