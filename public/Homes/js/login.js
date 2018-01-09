ec.ready(function() {
			$(".loginmask").hide();
			checkCookie("isRead");
			//短信登录开关--默认关闭
			if(localInfo.isOpenSMSLogin == "true"){
				$('.changeLoginType').css('visibility','visible');
			}
			//图形验证码添加下划线样式
			if(localInfo.displayCaptchaType == "0" && localInfo.isOpenImgCode == "true"){
				$('#picAuthCode').addClass('user-input-tr');
			}

			ec.time = getValue(document.location, 'delayrange');
			var showMsg = function(msg) {
				$("#login_msg").show().html(msg);
			};

			//帐号登录检查记住帐号
			var usernameIsHide = $("#login_userName").is(":hidden");
			var loginUserName = localInfo.rememberAccount;
			if (!usernameIsHide && loginUserName) {
				loginUserName = loginUserName.replace(/\"/g, "");
				$("#login_userName").val(loginUserName);
				$("#remember_name").attr("checked", true);
				if($("#remember_name_icon")){
					$("#remember_name_icon").removeClass('tick-off-icon').addClass('tick-on-icon');
				}
				//如果帐号是手机号，短信登录记住帐号
				if(isNumber(loginUserName)){
					$("#login_phoneNum").val(loginUserName);
					$("#remember_smsName").attr("checked", true);
					if($("#remember_smsName_icon")){
						$("#remember_smsName_icon").removeClass('tick-off-icon').addClass('tick-on-icon');
					}
				}	
			}
			
			var userName = $("#login_userName"), password = $("#login_password"),loginPhoneNum = $('#login_phoneNum'),smsAuthCode = $('#smsAuthCode'), s = function(
					obj) {
				$("#login_msg").hide();
				obj.removeClass("error");
			};
			
			// 如果存在跨站点问题，是否已同意
			var agreeOrNot = false;
			// 下述变量表示绑定已有华为帐号
			var bindThirdAndCrossSite =false;

			smsRandomeCodeInit();
			/*******************************************************************事件绑定***************************************************************/
			//华为帐号密码注册绑定

			/** *****************************************************************事件绑定************************************************************** */
			// 华为帐号密码注册绑定

			ec.form.input.label(userName, rss.login_js_hwaccount).label(
				password, rss.login_js_password);
			ec.form.validator.bind(userName, {
				type : [ "require", "length" ],
				min : 4,
				max : 50,
				validOnChange : true,
				errorFunction : function(obj, options) {
			            switch(options.type) {
				            case "require":
								showLoginError(rss.login_js_inputaccount,"userName",$("#login_userName"));
				                break;
				            case "emailormobile":
								showLoginError(rss.login_js_accountlimit,"userName",$("#login_userName"));
				                break;
				            case "length":
								showLoginError(rss.login_js_accountlength,"userName",$("#login_userName"));
				            	break;
			            }
						obj.focus();
		          },
				successFunction: function(){
					
				},
				reInputFunction:function()
				{
					showLoginErrorhide("userName");				
				}
			});
			ec.form.validator.bind(password,
				{
					type : [ "require"],
					trim : false,
					validOnChange : true,
					min : 8,
					max : 32,
					errorFunction : function(obj, options) {
						switch(options.type) {
							case "require":
								showLoginError(rss.common_js_inputpwd,"passWord",$("#login_password"));
								break;
						}
						obj.focus();
				},
				successFunction: s,
				reInputFunction:function()
				{
					showLoginErrorhide("passWord");					
				}
			});
			ec.ui.hover(userName).hover(password);
			userName.focus();
			// 手机号注册绑定
			ec.form.input.label(loginPhoneNum,rss.loginUserPhone);
			ec.form.validator.bind(loginPhoneNum, {
				type : [ "require","number","length" ],
				min : 4,
				max : 20,
				validOnChange : true,
				errorFunction : function(obj, options) {
			            switch(options.type) {
				            case "require":
								showLoginError(rss.emptyphone,"phoneNum",$("#login_phoneNum"));
				                break;
				            case "number":
								showLoginError(rss.phoneNumError,"phoneNum",$("#login_phoneNum"));
				                break;
				            case "length":
								showLoginError(rss.phoneNumError,"phoneNum",$("#login_phoneNum"));
				            	break;
			            }
						obj.focus();
		          },
				successFunction: function(){
					
				},
				reInputFunction:function()
				{
					$("#completePhoneNum").data('phone','');
					showLoginErrorhide("phoneNum");					
				}
			});

			// 短信验证码绑定验证
			ec.form.input.label(smsAuthCode,rss.smsAuthCode);
			ec.form.validator.bind(smsAuthCode, {
				type : ["require", "length", "number"],
				trim : true,
				min : 4,
				max : 8,
				validOnChange : true,
				msg : {
					require : rss.inputAuthCodeTip,
					length : rss.smsAuthCodeLength,
					number : rss.smsAuthCodeLength
				},
				errorFunction : function(obj, options) {
					switch(options.type) {
						case "require":
							showLoginError(rss.common_js_inputsmscode,"smsAuthCode",$("#smsAuthCode"));
							break;
						case "length":
							showLoginError(rss.smsAuthCodeLength,"smsAuthCode",$("#smsAuthCode"));
							break;
						case "number":
							showLoginError(rss.smsAuthCodeLength,"smsAuthCode",$("#smsAuthCode"));
							break;
					}
				},
				successFunction: function(obj, options) {
				},reInputFunction:function()
				{
					showLoginErrorhide("smsAuthCode");
				}
			});
			// 校验规则注册
			ec.form.validator.register("mobile", function(a) {
				if (a.length < 11) {
					return false;
				}
				return /^(\d{4})?(1[0-9])[0-9]{9}$/.test(a);
			});
			ec.form.validator.register("emailormobile", function(b, a) {
				if (a.allowEmpty && ec.util.isEmpty(b)) {
					return true;
				}
				if (b.length < 11) {
					return false;
				}
				return /^(1[0-9])[0-9]{9}$|^\s*([A-Za-z0-9_-]+(\.\w+)*@(\w+\.)+\w+)\s*$/
						.test(b);
			});

			ec.form.validator.register("chinaLang", function(b, a) {
				if (a.allowEmpty && ec.util.isEmpty(b)) {
					return true;
				}
				if (b.length != 4) {
					return false;
				} else {
					return true;
				}
			});
			ec.form.validator.register("number", function(b_val, a) {
				var regx = /^([0-9])+$/g;
				var ret = regx.test(b_val);
				return ret ? true : false;
			});
			//输入汉字，清空内容
			userName.keyup(function() {
				var that = $(this);
				if (that.val() != ""
						&& /^[\s\S]*[\u4e00-\u9fa5]+[\s\S]*$/.test(that
								.val())) {
					that.val("");
				}
			});
			loginPhoneNum.keyup(function() {
				var that = $(this);
				if (that.val() != ""
						&& /^[\s\S]*[\u4e00-\u9fa5]+[\s\S]*$/.test(that
								.val())) {
					that.val("");
				}
			});
			smsAuthCode.keyup(function() {
				var that = $(this);
				if (that.val() != ""
						&& /^[\s\S]*[\u4e00-\u9fa5]+[\s\S]*$/.test(that
								.val())) {
					that.val("");
				}
			});
			$(".cookie-pro").bind("click", function() {
				window.open(localInfo.cookiePrivacyPolicyUrl, "_blank");
			});
			
			if($("#randomCodeImg").length>0)
				{
				setTimeout(function(){
				
				$("#randomCodeImg")[0].onerror=function(){
					var self=this;
					
						
						if(self.src==""||!self.src.indexOf("authCodeImage"))
							return
							self.style.width='45px';
						self.src=localInfo.randomCodeImgLoading;
					
				
			   }
				},10);
				}
			//登录
			$(document).on("click","#btnLogin,#btnSMSLogin",function() {
				if($(this).data("type") == "accountLogin"){
					var form = $('.login-form-marginTop')[0];
					if (!ec.form.validator(form, true)) {
						return false;
					}
					if($('#captcha1').length>0 && !getRandomCode() && localInfo.displayCaptchaType == "1"){
						showLoginError(rss.common_js_inputgeetestcode,"randomCode",$('#captcha1'));
						return false;
					}
					$("#btnLogin").blur();
					//用户信息预存到本地
					localInfo.userAccount = userName.val().trim();
					localInfo.passWord = password.val();
					if((localInfo.isNeedImageCode || localInfo.normalLoginTooManyTimes) && typeof getRandomCode == "function")
					{	
						localInfo.captchaRandomCode = getRandomCode();
					}
					login();
				}else if($(this).data("type") == "smsLogin"){
					var form = $('.smsLogin-form')[0];
					if (!ec.form.validator(form, true)) {
						return false;
					}
					$("#btnSMSLogin").blur();
					smsLogin();
				}
			});
			//账号或手机号失焦事件---补全国家区号
			$(".form-edit-area").on("focusout","#login_userName,#login_phoneNum",function() {
				var loginUserName = convPlusOfPhoneAccount($(this).val().trim());
				if (loginUserName) {
					querySiteInfo(loginUserName,function(siteInfoObjArr, data) {
						
								if (siteInfoObjArr.length > 1) {
									openCountryCodeDialog(siteInfoObjArr);
								} else if (siteInfoObjArr.length == 0) {
									// 如果错误码为 10000507，那么进行提示
									var errorCode = data.errorCode;
									if (errorCode == "10000507") {
										openGotoOwnSiteDialog();
									}
								} else if (siteInfoObjArr.length == 1) {
									handleCrossSiteDialog(data.crossSiteModel,data.redirectSiteUrl,data.extInfo);
									//短信登录时,将区号+手机号写入隐藏域
									if($("#login_userName").is(":hidden")){
										var countryCode = "00" + data.siteInfoList[0].cy;
										var phoneNum = $('#login_phoneNum').val().trim();
										var isCompletePhone = new RegExp("^"+countryCode).test(phoneNum);
										if(!isCompletePhone){
											phoneNum = countryCode + phoneNum;
										}
										$('#completePhoneNum').data("phone",phoneNum);
										$('#completePhoneNum').data("site",data.siteInfoList[0].siteID);
									}
								}
							}, true);
					
					
				}

			});
			// 记住密码checkbox 勾选事件
			$(".form-edit-area").on('change','#remember_name,#remember_smsName',function(event) {
				var $this = $(this);
				var checkBoxicon = $this.next().find('.checkBox-icon');
				if ($this.prop("checked")) {
					if(checkBoxicon){
						checkBoxicon.removeClass('tick-off-icon').addClass('tick-on-icon');
					}

				}else{
					if(checkBoxicon){
						checkBoxicon.removeClass('tick-on-icon').addClass('tick-off-icon');
					}
				}
			});
			// 记住密码hoverTips事件
			$('.form-edit-area').on('mouseover mouseout','#rememberNameSpan,#sms-rememberNameSpan',function(event){
				if(event.type == "mouseover"){// 鼠标悬浮
					var tipsStr = '<div class="bubble-tip-content">'+
										'<div class="bubble-tip">'+
											'<div class="bubble-tip-img bubble-tip-left-top"></div>'+
											'<div class="bubble-tip-img bubble-tip-right-top"></div>'+
											'<div class="bubble-tip-img bubble-tip-top"></div>'+
											'<div class="bubble-tip-img bubble-tip-left"></div>'+
											'<div class="bubble-tip-img bubble-tip-right"></div>'+
											'<div class="bubble-tip-center">'+ rss.remeber_account_tip +'</div>'+
											'<div class="bubble-tip-img bubble-tip-left-bottom"></div>'+
											'<div class="bubble-tip-img bubble-tip-right-bottom"></div>'+
											'<div class="bubble-tip-img bubble-tip-underline"></div>'+
											'<div class="bubble-tip-img bubble-tip-bottomArrow"></div>'+
										'</div>'+
									'</div>';
					$(this).next().html(tipsStr).show();
					//动态设置气泡高度
					$('.bubble-tip-content').find('.bubble-tip-left,.bubble-tip-right').css('height',$('.bubble-tip-content').find('.bubble-tip-center').height()+'px');

                }else if(event.type == "mouseout"){  // 鼠标离开
                    $(this).next().html('').hide();;
                }
			});
			// 华为帐号登录和短信验证登录切换
			$('.changeLoginType').on('click',function(){
				var currentLoginType = $(this).data('type');
				if(currentLoginType == 'userAccountLogin'){
					$('.userAccountLogin').hide();
					$('.smsValidateLogin').show();
				}else if(currentLoginType == 'smsValidateLogin'){
					$('.smsValidateLogin').hide();
					$('.userAccountLogin').show();
				}
			});
			// 短信登录---获取短信验证码
			$("#getSmsRandomCode").on("click",function(e) {
				// 获取前清除错误提示
				//showLoginErrorhide();
				if ($("#getSmsRandomCode").attr("disabled")) {
					return false;
				}
				// 校验手机号
				if (!ec.form.validator($("#login_phoneNum"), true)) {
					return false;
				}
				//校验极验验证码
				if (!ec.form.validator($("#smsRandomCode"), true)) {
					return false;
				}
				// 验证无误，调用服务前，清除系统错误之类的提示信息
				showLoginErrorhide("allClean");
				//帐号被浏览器记住，触发失焦补全短信登录隐藏域
				if(!$("#completePhoneNum").data('phone')){
					$('.form-edit-area #login_userName').trigger('focusout');
				}
				
				getAuthCodeFN(0);
			});
			/** *****************************************************************扫码登录功能************************************************************** */
			// 扫码登录 功能 开始
			(function(){
                var canLoop=false;
				var canAnimate =true;
				var domain =location.origin; // 域名
				var qrurl =localInfo.getqrURL;
				var qrcodeInterval = 0; // 轮询定时器
				var ajaxHandar;
				if(isRightLang())
				{
					$("#qrcodeImg").css("right","109px");
				}else
				{
					$("#qrcodeImg").css("left","109px");
				}	
				
				// 点击扫码登录
				$(".loginTitle-right").click(function(){
					
					
					
					if($(this).hasClass("actived"))
					 {
					  return;	
					 }
					canLoop=true;
					$(".loginTitle-left").removeClass('actived');
					$(".loginTitle-right").addClass('actived');
					$(".b-account").hide();
					$(".b-qrCode").show();
					showQrcode(function(){loopCheck();});
	
					
			
				})
				
				 
				$(".loginTitle-left").click(function(){
					if($(this).hasClass("actived"))
					 {
					  return;	
					 }
					canLoop=false;
					ajaxHandar&&ajaxHandar.abort();
					
					$(".loginTitle-right").removeClass('actived');
					$(".loginTitle-left").addClass('actived');
					$(".b-account").show();
					$(".b-qrCode").hide();
	                $(".qrcode-over-time").hide();
	            
				})
				
	            // 图片help图片先设为透明
				$(".qrCode-help").css("opacity","0");
				// 鼠标扫过二维码动画
				$("#qrcodeImg").on("mouseover",".qrcode",function(){

					$("#qrcodeImg").stop();
					$(".qrCode-help").stop();
					if(isRightLang())
					{
					$("#qrcodeImg").animate({
						"right":"20px"
					},700,function(){
						
					});
					}
					else
					{
						$("#qrcodeImg").animate({
							"left":"20px"
						},400,function(){
							
						});
					}
					
					$(".qrCode-help").animate({
						"opacity":1
					},500,function(){
						
					});
					
				})
				// 鼠标滑出二维码动画
				 
				$("#qrcodeImg").on("mouseout",".qrcode",function(){
					
					$("#qrcodeImg").stop();
					$(".qrCode-help").stop();
					if(isRightLang())
					{
					$("#qrcodeImg").animate({
						"right":"109px"
					},700);
					}
					else
					{
						$("#qrcodeImg").animate({
							"left":"109px"
						},400,function(){
							canAnimate = true;
						});
					}	
					$(".qrCode-help").animate({
						"opacity":0
					},300);
					
				})
				
				// 刷新二维码
				$("#qrcodeImg .refush").click(function(e){
					
					 $(".qrcode-over-time").hide();
					 $(".refush-content").hide();
					 $(".scan-success-content").hide()
					 showQrcode(function(){qrcodeActive();});
					/*$("#qrcodeImg .qrcode").remove();
					$("#qrcodeImg").append("<img class='qrcode'/>")
					$("#qrcodeImg .qrcode").attr("src",qrurl+"&_t="+new Date().getTime()); 
				    $("#qrcodeImg .qrcode").one("load",function(){
				    	qrcodeActive();				    	
				     })*/
				    
				})
				
				// 二维码变的有效
				function qrcodeActive()
				{
					
				    	loopCheck();
				
					$(".qrcode-over-time").hide();
					 $(".refush-content").hide();
					 $(".scan-success-content").hide()

				}
				
				// 扫码成功
				function scanSuccess()
				{
					$(".qrcode-over-time").show();
					$(".scan-success-content").show();
					$(".refush-content").hide();
					
				}
				// 二维码失效
				function qrcodeTimeout()
				{       
 	                   $(".qrcode-over-time").show();
 	                  $(".scan-success-content").hide(); 
 	                  $(".refush-content").show();
 	                
				}
				
			
				// 轮询方法
				function loopCheck()
				{
	
					 ajaxHandar = $.ajax({
						url:localInfo.asyncURL+"&t="+Math.random(),
					    type:"post",
					    timeout:30000,
						success:function(data,status,xhr){
							
							// 确认登录
							if(data.resultCode=="0")
							{
								dimensionalCodeLogin(data);
							}
							// 二维码失效，刷新前的一次ajax请求不显示二维码失效
							else if(data.resultCode=="103000201")
							{
								qrcodeTimeout();
							}
							// 扫码成功
                            else if(data.resultCode=="103000202")
							{
                            	
								scanSuccess();
								loopCheck();
							}
                            else
                            {
                            	                          	
    						    loopCheck();
                            	
                            }	
						    	
						},
					error:function(){
						
						
						if(canLoop)
						{	
						loopCheck();
						}
					}
						
					})
					
					
				}
				//展示二维码
				function showQrcode(callback)
				{
					if(localInfo.createQrCodeType=="1")
					{
						
					var url=localInfo.getqrContent.split("?")[0];//"https://hwlf.hwcloudtest.cn/DimensionalCode/getqrInfo?appID=com.huawei.hwid&loginChannel=7000700&reqClientType=700&confirmFlag=1&version=12000";
					$.ajax({
						url:url,
						dataType:"json",
						type:"POST",
						data:{
							appID:getUrlParam(localInfo.getqrContent,"appID"),
							confirmFlag:getUrlParam(localInfo.getqrContent,"confirmFlag"),
							version:getUrlParam(localInfo.getqrContent,"version"),
							reqClientType:getUrlParam(localInfo.getqrContent,"reqClientType"),
							loginChannel:getUrlParam(localInfo.getqrContent,"loginChannel")
						},
						success:function(data){
							renderType="canvas";
							if($.browser.msie&&$.browser.version*1<=8)
							{
								renderType="table";
							}
							$(".qrcode").html("");
							$(".qrcode").qrcode({ 
								render:renderType,//table方式 
							    width: 150, //宽度 
							    height:150, //高度 
							    text: data.content //任意内容 
							});
							callback();
							
						}
					})
					
					}
					else
					{
						
						$("#qrcodeImg .qrcode").attr("src",qrurl+"&_t="+new Date().getTime());
						$("#qrcodeImg .qrcode").one("load",function(){
							callback();
				    		
				    })
					}
				}
				
				// 进行登录
				function dimensionalCodeLogin(data)
				{
					
					
					var html = '<form action="'+localInfo.postRemoteLogin+'" method="post" autocomplete="off"  style="display: none;">'+
								'<input type="hidden" id="form_submitType" name="submitType"  value="autoLoginInner"/>'+
								'<input type="hidden" name="loginUrl" value="'+localInfo.loginUrl+'" />'+
								'<input type="hidden" name="service" value="'+localInfo.service+'" />'+
								'<input type="hidden" name="deviceID" value="7894564633456649" />'+
								'<input type="hidden" name="deviceType" value="0" />'+
								'<input type="hidden" name="loginChannel" value="'+localInfo.loginChannel+'" /> '+
								'<input type="hidden" name="reqClientType" value="'+localInfo.reqClientType+'"/>' +
								'<input type="hidden" id="form_userAccount" name="userAccount" value="'+data.userAccount+'"/>'+
								'<input type="hidden" id="form_password" name="password" value="'+data.token+'"/>'+
								'<input type="hidden" id="form_authType" name="authType" value="1"/>'+
								'<input type="hidden" id="form_appID" name="appID" value="com.huawei.hwid"/>'+
								'<input type="hidden" id="form_opType" name="opType" value="3" />'+
								'<input type="submit" id="scanSmt" style="display: none;" />'+
								'</form>';
					
					$(document.body).append(html);
					$("#scanSmt").click()
				}
			})();
			
			// 扫码功能结束
			/** *****************************************************************方法注册************************************************************** */		
			function openCountryCodeDialog(siteInfoObjArr) {
				var targetDiv = $("#login_userName").is(":hidden")?$("#login_phoneNum"):$("#login_userName");
				var ifmDialogCss = (localInfo.isIfmLogin)?'ifmDialogCss':'';
				var htmlStr = '<div class="mask"></div>';
				htmlStr += '<div class="dialog '+ ifmDialogCss +'">';
				htmlStr += '<div class="dcent">';
				$.each(siteInfoObjArr,function(index, value) {
									var siteInfoObj = value;
									htmlStr += '<div class="code-node line mkcl">';
									htmlStr += '<b data-value="false" class="ccr radio roff r" data="'
											+ siteInfoObj.siteID + '"></b>';
									htmlStr += '<p class="item">';
									var countryCodeDisplay = "+"
											+ siteInfoObj.countryCode;
									htmlStr += '<span class="split cc" data-site="'+ value.siteID +'">'
											+ countryCodeDisplay
											+ '</span><span class="split">'
											+ targetDiv.val().trim()
											+ '</span>';
									htmlStr += '</p>';
									htmlStr += '</div>';

								});
				htmlStr += '</div>';
				htmlStr += '</div>';
				$("#selectCountryCodeDiv").html(htmlStr);

				$(".radio").on("click",function(e) {
							$(this).removeClass('roff');
							$(this).addClass('ron');
							var self = $(this);
							setTimeout(function() {
								var countrycode = self.parent().find(".cc")
										.text().trim().replace("+", "00");
								var newLoginName = countrycode
										+ targetDiv.val().trim();
								$("#selectCountryCodeDiv").html("");
								targetDiv.val(newLoginName);
								//选择区号时，如果是短信登录，补全隐藏域
								if($("#login_userName").is(":hidden")){
									$('#completePhoneNum').attr("data-phone",newLoginName);
									$('#completePhoneNum').attr("data-site",self.parent().find(".cc").data('site'));
								}
								localInfo.siteID = self.attr("data");
								
								// 在这个地方再次进行 风控查询
								querySiteInfo(newLoginName, function(siteInfoObjArr, data) {
									if (siteInfoObjArr.length == 1) {
											handleCrossSiteDialog(data.crossSiteModel,data.redirectSiteUrl,data.extInfo);
											//短信登录时,将区号+手机号写入隐藏域
											if($("#login_userName").is(":hidden")){
												var countryCode = "00" + data.siteInfoList[0].cy;
												var phoneNum = $('#login_phoneNum').val().trim();
												var isCompletePhone = new RegExp("^"+countryCode).test(phoneNum);
												if(!isCompletePhone){
													phoneNum = countryCode + phoneNum;
												}
												$('#completePhoneNum').data("phone",phoneNum);
												$('#completePhoneNum').data("site",data.siteInfoList[0].siteID);
											}
										}
									}, true);
								
							}, 200);

						});

			}

			function login(paramObj, callbackFn) {

				var dataParms = {
					loginUrl : localInfo.loginUrl,
					service : localInfo.service,
					loginChannel : localInfo.loginChannel,
					reqClientType : localInfo.reqClientType,
					lang : localInfo.lang,
					userAccount : convPlusOfPhoneAccount(localInfo.userAccount),
					password : localInfo.passWord,
					quickAuth : localInfo.quickAuth,
					isThirdBind : localInfo.isThirdBind == undefined ? 0
							: localInfo.isThirdBind,
					hwmeta : $("#hwmeta").val()
				};
				
				var crossSiteModel;
				crossSiteModel=localInfo.norCrossModel;
				
				if(crossSiteModel == undefined)
				{
					querySiteInfo(dataParms.userAccount, function(){}, false);
					crossSiteModel = localInfo.norCrossModel;
				}
				
				if(crossSiteModel==2)
				{
					// 需要进行跳转登录
					handleCrossSiteDialog(2,localInfo.redirectSiteUrl,localInfo.extInfo);
					return;
				}
				

				if ($("#remember_name").length > 0) {
					if ($("#remember_name").attr("checked") == "checked") {
						dataParms.remember_name = "on";
					} else {
						dataParms.remember_name = "off";
					}
				} else {
					if (localInfo.rememberAccount) {
						dataParms.remember_name = "on";
					} else {
						dataParms.remember_name = "off";
					}
				}

				

				var errorFlag = false;
				var needRedirect = false;
				
				
				if(localInfo.isNeedImageCode || localInfo.normalLoginTooManyTimes)
				{
					dataParms.authcode = localInfo.captchaRandomCode;
				}


				// 如果第三方账号绑定已有华为帐号，并且存在跨站点问题的话，那么就不要往下走了
				if(bindThirdAndCrossSite)
				{
					return;
				}
				
				if (errorFlag) {
					return;
				}
				if (paramObj && paramObj.remember_client_flag) {
					dataParms.remember_client_flag = paramObj.remember_client_flag;
				}
				if (paramObj && paramObj.agrIDs) {
					dataParms.agrIDs = paramObj.agrIDs;
				}
				if (paramObj && paramObj.guardianUserID) {
					dataParms.guardianUserID = paramObj.guardianUserID;
				}
				if (paramObj && paramObj.guardianPwd) {
					dataParms.guardianPassword = paramObj.guardianPwd;
				}
				if (paramObj && paramObj.newPassword) {
					dataParms.newPassword = paramObj.newPassword; // 修改完成之后以新密码进行登录
				}
				if (paramObj && paramObj.opType) {
					dataParms.opType = paramObj.opType;
				}
				// 跨站点登录弹框中调用登录传入验证码
				if(paramObj&&paramObj.authcode)
	            {
	                dataParms.authcode=	paramObj.authcode;
	            }	
				// 帐号保护2.0 开启
				if(paramObj && paramObj.opType==4)
				{
					dataParms.twoStepVerifyCode = paramObj.authCode;
					dataParms.verifyAccountType = paramObj.accountType;
					dataParms.verifyUserAccount = paramObj.account;
				}
				
				if ($("#authenDialog").length > 0
						|| $("#authAndUpdatediv").length > 0) {
					
					
					var txtTwoStepVerifyCode = $("#oldAuthCode").val();
					if (dataParms.opType == 5 || dataParms.opType == 6
							|| dataParms.opType == 7) {
						dataParms.authAccountType = paramObj.authAccountType;
						dataParms.authAccount = paramObj.authAccount;
						dataParms.authcode = paramObj.authCode;
					} else if (dataParms.opType == 8) {
						var typeAndAccount = $.parseJSON($("#accountDiv input")
								.val());
						dataParms.authAccountType = paramObj.authAccountType;
						dataParms.authAccount = paramObj.authAccount;
						dataParms.authcode = paramObj.authCode;
					} else if (txtTwoStepVerifyCode) {
						var typeAndAccount = $.parseJSON($("#accountDiv input")
								.val());
						dataParms.twoStepVerifyCode = txtTwoStepVerifyCode;
						dataParms.verifyAccountType = typeAndAccount.type;
						dataParms.verifyUserAccount = typeAndAccount.account;
					}
					
					
				}
			
				var ajaxMethod;
				if(dataParms.opType=="6" || dataParms.opType=="8" || dataParms.opType=="9")
				{
					ajaxMethod="riskLogin";
				}
				else
				{
					ajaxMethod="remoteLogin";
				}
				// 验证无误，调用服务前，清除系统错误之类的提示信息
				showLoginErrorhide("allClean");
				
				ajaxHandler(ajaxMethod, dataParms, function(data) {
					if (data.extInfo)
					{
						localInfo.extInfo = data.extInfo;
					}
					
					if ("1" == data.isSuccess) {
						if ($.isFunction(callbackFn)) {
							callbackFn();
						}
						$(".loginmask").show();
						gotoUrl(data.callbackURL);
						return false;
					} else {
						showErrorCode(data, dataParms, callbackFn,paramObj);
						//报错时，需刷新hwmate
						try{
							if(hwcap){
								hwcap.reload();
							}
						}catch(e){}
					}

				}, function(data) {

				}, false, "JSON");

			}
			//短信登录
			function smsLogin(paramObj, callbackFn){
				var dataParms = {
					userAccount:$("#completePhoneNum").data('phone'),
					authCode:$('#smsRandomCode').val(),
					smsAuthCode:$('#smsAuthCode').val(),
					opType:"11",
					reqClientType:localInfo.reqClientType,
					loginChannel:localInfo.loginChannel,
					lang:localInfo.lang,
					service:localInfo.service,
					quickAuth:localInfo.quickAuth
				}
				
				var crossSiteModel;
		        crossSiteModel = localInfo.phoneCrossModel;
		        
		        if(crossSiteModel == undefined)
		        {
		            querySiteInfo(dataParms.userAccount, function(){}, false);
		            crossSiteModel = localInfo.phoneCrossModel;
		        }
		        
		        if(crossSiteModel==2)
		        {
		            // 需要进行跳转登录
		            handleCrossSiteDialog(2,localInfo.redirectSiteUrl,localInfo.extInfo);
		            return;
		        }
				
				
				if ($("#remember_smsName").length > 0) {
					if ($("#remember_smsName").attr("checked") == "checked") {
						dataParms.remember_name = "on";
					} else {
						dataParms.remember_name = "off";
					}
				} else {
					if (localInfo.rememberAccount) {
						dataParms.remember_name = "on";
					} else {
						dataParms.remember_name = "off";
					}
				}
				// 验证无误，调用服务前，清除系统错误之类的提示信息
				showLoginErrorhide("allClean");
				ajaxHandler("smsLogin", dataParms, function(data) {		
					if ("1" == data.isSuccess) {
						if ($.isFunction(callbackFn)) {
							callbackFn();
						}
						$(".loginmask").show();
						gotoUrl(data.callbackURL);
						return false;
					} else {
						showErrorCode(data, dataParms, callbackFn,paramObj);
					}

				}, function(data) {

				}, false, "JSON");

			}
			/**
			 * 登录接口错误码统一展示
			 */
			function showErrorCode(data, dataParms, callbackFn, paramObj) {
				/**
				 * @params opType descript 0：正常登录、 1：帐号保护1.0、 4：帐号保护2.0、
				 *         5：验证身份+修改密码（风控）、 6：验证身份+修改密码（风控）、 7：验证身份+修改密码（风控）、
				 *         8：只验证身份（风控）、 9：修改密码（风控）、11：短信验证码登录
				 */
				// 默认登录操作opType:"0"
				var opType = dataParms.opType?dataParms.opType:"0";
				var errorCode = data.errorCode;
				// 滑动验证码---出错重置
				if(localInfo.displayCaptchaType == "1" && $('#captcha1').length > 0){
					resetRandomCode();
				}
				switch (errorCode) {
					/** **************************************弹窗校验部分*************************************** */
					// 1、需要二次登录---帐号保护V1.0
					case "70002072":{
						var param = {
							desc : rss.uc_common_second_protect,
							lBtnTxt : rss.cancel,
							rBtnTxt : rss.next_step,
							queryCond : convPlusOfPhoneAccount($(
									"#login_userName").val().trim()),
							optType : "secondAuth",
							callbackFn : login,
							siteID : localInfo.curAccountSiteID,
							accountInfoArr:initAccountList(data.errorDesc),
							operType:8
						};
						secAuthDialog(param);
						break;
					}
					// 2、需要二次登录---帐号保护V2.0
					case "70012072":{
						var authCodeSentList = $.parseJSON(data.errorDesc).authCodeSentList;
						var param = {
								userAccount: convPlusOfPhoneAccount($("#login_userName").val().trim()),
								callbackFn : login,
								siteID : localInfo.curAccountSiteID,
								password:$("#password").val(),
								operType:8,
								authCodeSentList:authCodeSentList
							};
						acctProtectV2Dialog(param);
						break;
					}
					// 3、 公有云IP黑名单,验证身份加修改密码
					case "10008001":{
						if ($.isFunction(callbackFn)) {
							callbackFn();
						}
						var param = {
								
							desc : rss.risk_control_high,
							queryCond : convPlusOfPhoneAccount($(
									"#login_userName").val().trim()),
							callbackFn : login,
							lBtnTxt : rss.cancel,
							rBtnTxt : rss.ok,
							opType : "6",
							siteID : localInfo.curAccountSiteID,
							operType:10,
							accountInfoArr:initAccountList(data.errorDesc),
							userAccount:$("#login_userName").val().trim()
						};
						verifyIDDialog(param);
						break;
					}
					case "10001015":{
						// 此时提醒用户 同意 使用 设备指纹
						var param;
						if ($("#login_userName").is(":hidden")) { //短信登录跨站
							param = {
								callbackFn: smsLogin,
		                        mobilePhone: $('#login_phoneNum').val(),
		                        authCode: $('#smsRandomCode').val(),
		                        smsAuthCode: $('#smsAuthCode').val()
							};
						}
						else
						{
							param = {
								callbackFn: login,
								userAccount: $("#login_userName").val().trim(),
	                            password: $("#login_password").val(),
	                            authcode: dataParms.authcode
							};
						}
						
						popAgreeDFDialog(param);
						break;
					}
					// 4、 高度疑,验证身份加修改密码
					case "10008002":{
						if ($.isFunction(callbackFn)) {
							callbackFn();
						}
						var param = {
							desc : rss.account_protect_tip,
							queryCond : convPlusOfPhoneAccount($(
									"#login_userName").val().trim()),
							callbackFn : login,
							opType : "6",
							siteID : localInfo.curAccountSiteID,
							operType:10,
							accountInfoArr:initAccountList(data.errorDesc),
							userAccount:$("#login_userName").val().trim()
						};
						verifyIDDialog(param);
						break;
					}
					// 5、 公有云IP黑名单,验证身份加修改密码
					case "10008003":{
						if ($.isFunction(callbackFn)) {
							callbackFn();
						}
						var param = {
								desc : rss.risk_control_high,
							queryCond : convPlusOfPhoneAccount($(
									"#login_userName").val().trim()),
							callbackFn : login,
							lBtnTxt : rss.cancel,
							rBtnTxt : rss.ok,
							opType : "6",
							siteID : localInfo.curAccountSiteID,
							operType:10,
							accountInfoArr:initAccountList(data.errorDesc),
							userAccount:$("#login_userName").val().trim()
						};
						verifyIDDialog(param);
						break;
					}
					// 6、 普通疑似非简单密码,验证身份
					case "10008004":
					case "100080041":
					case "100080042":{
						if ($.isFunction(callbackFn)) {
							callbackFn();
						}
						var desc = rss.risk_control_low;
						if("100080041" == errorCode||"100080042" == errorCode)	
						{
							desc = rss.login_error_100080041;
						}
						var param = {
			
							desc : desc,
							lBtnTxt : rss.cancel,
							rBtnTxt : rss.next_step,
							queryCond : convPlusOfPhoneAccount($(
									"#login_userName").val().trim()),
							optType : "identifyVerify",
							callbackFn : login,
							opType : "8",
							siteID : localInfo.curAccountSiteID,
							operType:9,
							accountInfoArr:initAccountList(data.errorDesc),
							userAccount:$("#login_userName").val().trim()
						};
						verifyIDDialog(param);
						break;
					}
					// 7、 简单密码的需要强制修改密码提醒，修改密码
					case "10008005":{
						if ($.isFunction(callbackFn)) {
							callbackFn();
						}
						var param = {
							opType : "9",
							newPassword : dataParms.newPassword,
							siteID : localInfo.curAccountSiteID,
							callbackFn : login
						};
						updatePWDDialog(param);
						break;
					}
					// 8、 激活手机/邮箱
					case "70002071":{
						showVerifyAccountDialog(userName.val(), "",rss.unverified_email_addr, rss.email_has_sendto
								.format(userName.val()),localInfo.emailPng, rss.resend, rss.exit,rss.verified);
						break;
					}
					// 9、 跨站点断点登录
					case "10000510":{
						if($("#login_userName").is(":hidden")){ //短信登录跨站
							var param = {
								callbackFn : smsLogin,
								mobilePhone:$('#login_phoneNum').val(),
								authCode:$('#smsRandomCode').val(),
								smsAuthCode:$('#smsAuthCode').val()
							};
						}else{//帐号登录跨站
							var param = {
								callbackFn : login,
								userAccount:$("#login_userName").val().trim(),
								password:$("#login_password").val(),
								authcode:dataParms.authcode
							};
						}
						crossSiteIDDialog(param);
						break;
					}
					// 10、允许跨站登录
					case "10000507":{
						openGotoOwnSiteDialog();
						break;
					}
					// 11、禁止跨站登录
					case "10000508":{
						openNoAllowCrossSiteDialog();
						break;
					}
					// 12、全球跨站点
					case "10000511":{
						handleCrossSiteDialog(2,data.callbackURL,data.extInfo);
						break;
					}
					/** **************************************错误提示部分*************************************** */
					// 13、 验证码已失效
					case "10000201":{
						localInfo.isNeedImageCode=true;
						if($('#captcha1').length<=0){
							// 调用getCaptcha获取html片段插入id为picAuthCode的td下
							getCaptcha();
						}
						if(opType == "0"){
							if ((localInfo.thirdLoginFlag) && (localInfo.thirdLoginFlag == true)) {
								window.location.href = localInfo.loginUrl;
							}
							if ($.isFunction(callbackFn)) {
								callbackFn();
							}
							// 验证码错误
							showLoginError(rss.randomCodeIsInvalid,"randomCode",$('#captcha1'));
							$("#randomCode").focus();
							chgRandomCodeForLogin();
						}else if(opType == "11"){
							showLoginError(rss.picCodeExpired,"smsRandomCode",$("#smsCaptcha"));
							$("#smsRandomCode").focus();
							chgRandomCodeForLogin("smsRandomCode");
						}
						break;
					}
					// 14、 用户名或密码错误
					case "10000400":{
						if(opType == "0"){
							// 用户名或密码错误
							showLoginError(rss.login_wrong,"loginErr","",true);
						}else if(opType == "1"){
							// 输入的验证码错误次数过多
							showEMUIError($('#oldAuthCode-box'),$("#oldAuthCode_error_info"),rss.error_70002057_1);
						}else if(opType == "4"){
							// 输入的验证码错误次数过多
							$("#authCodeDiv").addClass("input-error-EMUI5");
							$("#msg_error_secAuth").html(rss.error_70002057_1);
						}else if(opType == "8"){
							// 输入的验证码错误次数过多
							showEMUIError($('#oldAuthCode-box'),$("#oldAuthCode_error_info"),rss.error_70002057_1);
						}     
						break;
					}
					// 15、此帐号已被禁用，请联系客服。
					case "70002076":{
						$("div").DialogSimple({
							text:rss.error_70002076,
							btnText:rss.ok,
							btnFn:function(){
								location.href=localHttps+"/securitycenter/unfrozeAccount.html"+localInfo.queryString;
							},
							btnLeftText:rss.cancel
						}).show();
						break;
					}
					// 16、验证码不存在或已过期
					case "70002039":{
						if(opType == "0"){
							showLoginError(rss.error_70002039,"randomCode",$('#captcha1'));
						}else if (opType == "1") {
							showEMUIError($('#oldAuthCode-box'),$("#oldAuthCode_error_info"),rss.error_70002039);
						}else if(opType == "4"){
							$("#authCodeDiv").addClass("input-error-EMUI5");
							$("#msg_error_secAuth").html(rss.error_70002039);
						}else if(opType == "5" || opType == "6" || opType == "7"){
							showEMUIError($('#oldAuthCode-box'),$("#oldAuthCode_error_info"), rss.error_70002039);
						}else if(opType == "8"){
							showEMUIError($('#oldAuthCode-box'),$("#oldAuthCode_error_info"),rss.error_70002039);
						}
						break;
					}
					// 17、输入的验证码错误次数过多
					case "70002057":{
						if(opType == "0"){
							localInfo.normalLoginTooManyTimes=true;
							if($('#captcha1').length<=0){
								// 调用getCaptcha获取html片段插入id为picAuthCode的td下
								getCaptcha()
							}
							// 你的密码错误次数过多、请确认后再试
							showLoginError(rss.error_70002057_2,"loginErr");
						}else if(opType == "1") {
							showEMUIError($('#oldAuthCode-box'),$("#oldAuthCode_error_info"),
									rss.error_70002057_1);
						}else if(opType == "4"){
							$("#authCodeDiv").addClass("input-error-EMUI5");
							$("#msg_error_secAuth").html(rss.error_70002057_1);
						}else if(opType == "5" || opType == "6" || opType == "7"){
							showEMUIError($('#oldAuthCode-box'),$("#oldAuthCode_error_info"), rss.error_70002057_1);
						}else if(opType == "8"){
							showEMUIError($('#oldAuthCode-box'),$("#oldAuthCode_error_info"),rss.error_70002057_1);
						}else if(opType == "9"){
							// 你的密码错误次数过多、请确认后再试
							showEMUIError($('#passwordDivTip'),$("#new_pwd_error_info"), rss.error_70002057_2);
						}else if(opType == "11"){
							showLoginError(rss.smsLoginError_70002057,"loginErr");
						}
						break;
					}
					// 18、输入错误次数过多，请24小时后重试，或点击“忘记密码”重置密码后登录。
					case "70002058":{
						if(opType == "0"){
							localInfo.normalLoginTooManyTimes=true;      
							if($('#captcha1').length<=0){
								// 调用getCaptcha获取html片段插入id为picAuthCode的td下
								getCaptcha();
							}
							showLoginError(rss.error_70002058,"loginErr");
						}else if(opType == "1"){
							showEMUIError($('#oldAuthCode-box'),$("#oldAuthCode_error_info"),rss.uc_error_70002058_3);
						}else if(opType == "4"){
							$("#authCodeDiv").addClass("input-error-EMUI5");
							$("#msg_error_secAuth").html(rss.uc_error_70002058_3);
						}else if(opType == "5" || opType == "6" || opType == "7"){
							showEMUIError($('#passwordDivTip'),$("#new_pwd_error_info"), rss.uc_error_70002058_3);
							showEMUIError($('#oldAuthCode-box'),$("#oldAuthCode_error_info"), rss.uc_error_70002058_3);
						}else if(opType == "8"){
							showEMUIError($('#oldAuthCode-box'),$("#oldAuthCode_error_info"),rss.uc_error_70002058_3);
						}else if(opType == "9"){
							showEMUIError($('#passwordDivTip'),$("#new_pwd_error_info"), rss.uc_error_70002058_3);
						}else if(opType == "11"){
							showLoginError(rss.smsLoginError_70002058,"loginErr");
						}
						break;
					}
					// 19、不可是常见密码或弱密码
					case "70008001":{
						if(opType == "5" || opType == "6" || opType == "7"){
							showEMUIError($('#passwordDivTip'),$("#new_pwd_error_info"),rss.error_70008001);
						}else if(opType == "9"){
							showEMUIError($('#passwordDivTip'),$("#new_pwd_error_info"), rss.error_70008001);
						}
						break;
					}
					// 20、 密码复杂度过低
					case "70002070":{
						if(opType == "5" || opType == "6" || opType == "7"){
							showEMUIError($('#passwordDivTip'),$("#new_pwd_error_info"), rss.error_70002070);
						}else if(opType == "9"){
							showEMUIError($('#passwordDivTip'),$("#new_pwd_error_info"), rss.error_70002070);
						}
						break;
					}
					// 21、 新旧密码不能相同
					case "70002020":{
						if(opType == "5" || opType == "6" || opType == "7"){
							showEMUIError($('#passwordDivTip'),$("#new_pwd_error_info"), rss.error_70002020);
						}else if(opType == "9"){
							showEMUIError($('#passwordDivTip'),$("#new_pwd_error_info"), rss.error_70002020);
							ec.form.validator.bind(confirmPassword, {
								type : [ "require", "eq" ],
								trim : false,
								validOnChange : true,
								compareTo : newPassword,
								msg_ct : "#confirm_pwd_error_info",
								msg : {
									require : rss.common_js_confirmpwd,
									eq : rss.error_70002020
								}
							});
						}
						break;
					}
					// 22、设置的新密码不能与近几次历史密码相同，请重新设置
					case "70009016":{
						if(opType == "5" || opType == "6" || opType == "7"){
							showEMUIError($('#passwordDivTip'),$("#new_pwd_error_info"), rss.error_70009016);
						}else if(opType == "9"){
							showEMUIError($('#passwordDivTip'),$("#new_pwd_error_info"), rss.error_70009016);
						}
						break;
					}
					// 23、此帐号已被另一个同类型的第三方帐号绑定
					case "70005004":{
						if(opType == "0"){
							showLoginError(rss.error_70005004,"loginErr");
						}else if(opType == "1"){
							showEMUIError($('#oldAuthCode-box'),$("#oldAuthCode_error_info"), rss.error_70005004);
						}else if(opType == "4"){
							$("#authCodeDiv").addClass("input-error-EMUI5");
							$("#msg_error_secAuth").html(rss.error_70005004);
						}
						break;
					}
					// 24、第三方帐号绑定失败
					case "10000505":{
						if(opType == "0"){
							showLoginError(rss.error_10000505,"loginErr");
						}else if(opType == "1"){
							showEMUIError($('#oldAuthCode-box'),$("#oldAuthCode_error_info"), rss.error_10000505);
						}else if(opType == "4"){
							$("#authCodeDiv").addClass("input-error-EMUI5");
							$("#msg_error_secAuth").html(rss.error_10000505);
						}
						break;
					}
					//25、短信登录---帐号或者短信验证码错误，请重新输入---默认
					case "10000402":{
						if(opType == "11"){
							showLoginError(rss.smsLoginError_10000402,"loginErr","",true);
						}
						break;
					}
					//26、短信登录---系统繁忙，请稍后再试
					case "70001401":{
						if(opType == "11"){
							showLoginError(rss.smsLoginError_70001401,"loginErr");
						}
						break;
					}
					//27、短信登录---用户开启帐号保护2.0，则不支持短信登录
					case "70008805":{
						if(opType == "11"){
							showLoginError(rss.smsLoginError_70008805,"loginErr");
						}
						break;
					}			
					// 28、系统繁忙，请稍后再试！
					default:{
						if(opType == "0"){
							showLoginError(rss.error_10000001,"loginErr");       
						}else if(opType == "1"){
							showEMUIError('',$("#oldAuthCode_error_info"),rss.error_10000001);
						}else if(opType == "4"){
							$("#msg_error_secAuth").html(rss.error_10000001);
						}else if(opType == "5" || opType == "6" || opType == "7"){
							showEMUIError('',$("#oldAuthCode_error_info"),rss.error_10000001);
							showEMUIError('',$("#new_pwd_error_info"),rss.error_10000001);
						}else if(opType == "8"){
							showEMUIError('',$("#oldAuthCode_error_info"),rss.error_10000001);
						}else if(opType == "9"){
							showEMUIError('',$("#new_pwd_error_info"),rss.error_10000001);
						}else if(opType == "11"){
							showLoginError(rss.smsLoginError_70001401,"loginErr");
						}
						break;
					}
				}
			}
			function handleCrossSiteDialog(crossSiteModel,redirectSiteUrl,extInfo)
			{
				if (crossSiteModel == 2) {

				    if (redirectSiteUrl
				        .indexOf("oauth2") > 0) {
				        redirectSiteUrl = redirectSiteUrl +
				            localInfo.queryString;
				    } else {
				        redirectSiteUrl = redirectSiteUrl +
				            localInfo.requestURIQuery;
				    }

				    if (extInfo) {
				        if (redirectSiteUrl.indexOf("?") > 0) {
				            redirectSiteUrl = redirectSiteUrl + "&extInfo=" + extInfo;
				        } else {
				            redirectSiteUrl = redirectSiteUrl + "?extInfo=" + extInfo;
				        }
				    }
				    openGlobalCrossSiteDialog(redirectSiteUrl);
				}
			}
			function openGlobalCrossSiteDialog(globalCrossSiteUrl) {
				var htmlStr = rss.global_cross_page_redirect;
				$("<div>").Dialog({
					title : rss.prompt,
					btnLeft : {
						text : rss.cancel_btn,
						fn : function() {
							this.hide();
						}
					},
					btnRight : {
						text : rss.iKnowBtn,
						fn : function() {
							gotoUrl(globalCrossSiteUrl);
						}
					},
					html : htmlStr,
					dialogStyle: localInfo.msgDialogStyle,
					beforeAction : function() {

					}
				}).Dialog("show");
			}
			// 登录时,激活状态为-1的手机/email账号
			function showVerifyAccountDialog(userAccount, tip1, tip2, tip3,
					imgPath, btn1, btnLeft, btnRight) {

				if (userAccount == null) {
					return;
				}
				userAccount = userAccount.trim();

				var strReg = /^(\d{4,20})$/;
				var result = strReg.test(userAccount);

				if (result) {
					// 手机账号
					showVerifyPhoneAccountDialog(userAccount, tip1, tip2, tip3,
							imgPath, btn1, btnLeft, btnRight);
				} else {
					// 邮箱账号
					activateEmailAccount(tip1, tip2, tip3, imgPath, btn1,
							btnLeft, btnRight);
				}
			}

			// 登录时,激活状态为-1的手机账号
			function showVerifyPhoneAccountDialog(userAccount, tip1, tip2,
					tip3, imgPath, btn1, btnLeft, btnRight) {
				var phoneVal = userAccount;

				var htmlStr = "";
				htmlStr = htmlStr
						+ '<p class="inptips2">'
						+ rss.uc_verify_phone_tip
								.format(getExpressPhone(phoneVal)) + '</p>';
				htmlStr = htmlStr + '<div id="unactived_phone"></div>';
				htmlStr = htmlStr
						+ '<div class="dinput"  id="oldAuthCode-box"><input id="security_account_verify_code" type="text"/><div class="dbtn2 sbtn r" act="getVerificationCode" intervaltime="60" id="getAuthCodeBtn"><span>'+ rss.getAuthCode +'</span><div id="get_authcode_error_info"></div></div></div><div id="auth_code_error_info" class="error-tips-EMUI5"></div>';

				var option = {
					title : rss.uc_verify_phone,
					btnRight : {
						text : rss.verify,
						fn : function() {
							// 激活手机账号

							var self = this;

							if (!ec.form.validator(
									$("#security_account_verify_code"), true)) {
								return;
							}

							// 验证码初步合规之后，调用后台
							var smsAuthCode = $("#security_account_verify_code")
									.val();
							activatePhoneAccount(
									userAccount,
									smsAuthCode,
									function() {									
										self.hide();
										
									});
						}
					},
					btnLeft : {
						text : rss.cancel_btn,
						fn : function() {

						}
					},
					actions : {
						getVerificationCode : function() {

							var self = this;

							if (checkAuthCodeBtnState(this.$dialog)) {

								getAuthCodeForUnSMS(2, userAccount, 0,
										function(ret) {
											if (ret) {
												authCodeCountDown(self.$dialog,
														rss.resend);
											}
										});

							}
						}
					},
					html : htmlStr,
					dialogStyle: localInfo.msgDialogStyle,
					beforeAction : function() {
						var self=this;
						validateAuthCode($("#security_account_verify_code"),$("#oldAuthCode-box"),$("#auth_code_error_info"));
						self.disabled();
						var phoneActiveCode = $("#security_account_verify_code");
			    		
			    		phoneActiveCode.bind("keyup paste",function(){
			    			var self2 = this;
			    			
			    			setTimeout(function(){
			    				if($(self2).val().trim()!="")
				    			{
				    				self.enable();
				    			}
				    			else
				    		   {
				    				self.disabled();
				    		   }	
			    			},0);
			    				
			    			
			    		})
					}
				};
				$("<div>").Dialog(option).Dialog("show");
				ec.form.input.label($('#security_account_verify_code'),rss.smsAuthCode);
			}

			// 检查输入的校验码
			function checkAuthCodeBtnState(ele, text) {
				var authEle = ele.find("[act='getVerificationCode']");
				var disabled = authEle.attr("disabled");
				if (disabled) {
					return false;
				}
				return true;
			}

			/* 获取验证码,此处添加此函数仅仅为了支撑未激活手机号码 */
			function getAuthCodeForUnSMS(accountType, account, type, callback,
					mobilePhone) {
				if (!mobilePhone) {
					mobilePhone = account;
				}
				var params = {};
				var method = "";
				var infoElement = $("#auth_code_error_info");
				if (accountType == 1 || accountType == 5) {
					method = "getEMailAuthCode";
					params = {
						email : account,
						emailReqType : type,
						accountType : accountType,
						reqClientType : localInfo.reqClientType,
						languageCode : localInfo.lang
					};
				} else if (accountType == 2 || accountType == 6) {
					method = "getSMSAuthCode";
					params = {
						accountType : accountType,
						userAccount : account,
						reqClientType : localInfo.reqClientType,
						mobilePhone : mobilePhone,
						// operType : 12,
						smsReqType : type,
						languageCode : localInfo.lang
					};
				}

				ajaxHandler(method, params, function(data) {
					if (data && data.isSuccess == 1) {
						if (method == "getSMSAuthCode") {
							showMsgSuccess({obj:$("#get_authcode_error_info"), msg:rss.phoneMegHasSendTo
									.format(getExpressPhone(account)), leftPix:"-289px", rightPix:"-289px",bottom:"38px"});
						} else if (method == "getEMailAuthCode") {
							showMsgSuccess({obj:$("#get_authcode_error_info"), msg:rss.emialHasSendTo
									.format(account), leftPix:"-289px", rightPix:"-289px",bottom:"38px"});
							$(".userAccount").html(account);
						}
					} else {
						switch (data.errorCode) {
						case "10000001":
						case "10000002":
						case "10000003":
						case "70001201": {
							showEMUIError('',infoElement, rss.error_10000001);
							break;
						}
						case "70001401": {
							showEMUIError('',infoElement, rss.error_70001401);
							break;
						}
						case "70002002": {
							showEMUIError('',infoElement, rss.error_needcountrycode);
							break;
						}
						case "70002001": {
							showEMUIError('',infoElement, rss.error_70002001);
							break;
						}
						case "70002028": {
							showEMUIError('',infoElement, rss.error_70002028);
							break;
						}
						case "70002046": {
							showEMUIError('',infoElement, rss.error_70002046);
							break;
						}
						case "70002030": {
							showEMUIError('',infoElement, rss.error_70002030);
							break;
						}
						case "70001102": {
							if (method == "getEMailAuthCode") {
								showEMUIError('',infoElement, rss.error_70001102_0);
							} else if (method == "getSMSAuthCode") {
								showEMUIError('',infoElement, rss.error_70001102_1);
							}
							break;
						}
						case "70001104": {
							if (method == "getEMailAuthCode") {
								showEMUIError('',infoElement, rss.error_70001104_0,
										"left");
							} else if (method == "getSMSAuthCode") {
								showEMUIError('',infoElement, rss.error_70001104_1,
										"left");
							}
							break;
						}
						case "10000004": {
							showEMUIError('',infoElement, rss.error_10000004);
							break;
						}
						case "10000002": {
							showEMUIError('',infoElement, rss.error_10000002);
							break;
						}
						default: {
							showEMUIError('',infoElement, rss.get_authcode_error);
							break;
						}
						}
					}
					if (callback) {
						callback(data.isSuccess == 1 ? true : false);
					}
				}, function() {
				}, true, "json");
			}

			function authCodeCountDown(ele, text) {
				var authEle = ele.find("[act='getVerificationCode']");
				var disabled = authEle.attr("disabled");
				if (disabled) {
					return false;
				}
				authEle.addClass("auth_code_grey");
				jsInnerTimeout(authEle, text);
				return true;
			}

			// 激活手机账号
			function activatePhoneAccount(userAccount, authCode, callback) {
				var params = {
					mobilePhone : userAccount,// 激活手机，需要传入明文手机账号
					reqClientType : localInfo.reqClientType,
					smsAuthCode : authCode
				};

				ajaxHandler("activateMsisdn", params, function(data) {
					if (data && data.isSuccess == 1) {
						if (typeof callback == "function") {
							callback();
						}
					} else {

						switch (data.errorCode) {
						case '10000001':
						case '70001101':
						case '70001201': {
							showEMUIError($('#oldAuthCode-box'),$("#auth_code_error_info"), rss.error_10000001);
							break;
						}
						case '70002039': {
							showEMUIError($('#oldAuthCode-box'),$("#auth_code_error_info"),rss.error_70002039);
							break;
						}
						case '70001401': {
							showEMUIError($('#oldAuthCode-box'),$("#auth_code_error_info"), rss.error_70001401);
							break;
						}
						case '70002001': {
							showEMUIError($('#oldAuthCode-box'),$("#auth_code_error_info"), rss.error_70002001);
							break;
						}
						default: {
							showEMUIError($('#oldAuthCode-box'),$("#auth_code_error_info"), rss.error_10000001);
							break;
						}
						}
					}

				}, function() {
				}, true, "json");
			}


			function activateEmailAccount(tip1, tip2, tip3, imgPath, btn1,
					btnLeft, btnRight) {
				var htmlStr = ' ';
				htmlStr += '<div>';
				htmlStr += '<p class="inptips3 det-width">' + tip3 + '</p>';
				htmlStr += '<div style="margin-top: 10px">';
				htmlStr += '<div class="dbtn3 resendBtn" act="action"  intervaltime="60" id="getActive"><span>'
						+ btn1
						+ '</span></div>';
				htmlStr += '</div><div id="get_authcode_error_info" class="error-tips-EMUI5 emailValidFail"></div>';
				htmlStr += '</div>';

				var option = {
					title : rss.unverified_email_addr,
					btnRight : {
						text : btnRight,
						fn : function() {
							if (isActiveAccount(convPlusOfPhoneAccount($(
									"#login_userName").val().trim()))) {
								this.hide();
							} else {
								showEMUIError('',$("#get_authcode_error_info"),
										rss.verification_not_completed);
							}
						}
					},
					btnLeft : {
						text : btnLeft,
						fn : function() {
							this.hide();
						}
					},
					html : htmlStr,
					dialogStyle : localInfo.msgDialogStyle,
					actions : {
						'action' : function() {
							if ($("#getActive").attr("disabled")) {
								return false;
							}
							if (isActiveAccount(convPlusOfPhoneAccount($(
									"#login_userName").val().trim()))) {
								showEMUIError('',$("#get_authcode_error_info"),
										rss.error_70002019);
								return false;
							}
							getActivateEMailURL(convPlusOfPhoneAccount($(
									"#login_userName").val().trim()),
									localInfo.reqClientType, $("#getActive"));
						}
					}
				};
				$("<div>").Dialog(option).Dialog('show');
				getActivateEMailURL(convPlusOfPhoneAccount($("#login_userName")
						.val().trim()), localInfo.reqClientType,
						$("#getActive"));
				$(".userAccount").html(
						convPlusOfPhoneAccount($("#login_userName").val()
								.trim()));
			}
			function getAuthCodeFN(count){
				if(!$("#completePhoneNum").data('phone')){
					if(count < 5){
						count = count + 1;
						setTimeout(getAuthCodeFN, 1000,count);
					}else{
						//系统异常
						showLoginError(rss.error_10000001,"loginErr");
					}
					return;
				}
				//检查是否跨站
				var crossSiteModel;
				crossSiteModel = localInfo.phoneCrossModel;
				
				if(crossSiteModel == undefined)
				{
					querySiteInfo($("#completePhoneNum").data('phone'), function(){}, false);
					crossSiteModel = localInfo.phoneCrossModel;
				}
				
				if(crossSiteModel==2)
				{
					// 需要进行跳转登录
					handleCrossSiteDialog(2,localInfo.redirectSiteUrl,localInfo.extInfo);
					return;
				}
				//拼接参数
				var param = {
					phoneOrEmail : $("#completePhoneNum").data('phone'),                            
					authCodebtn : $("#getSmsRandomCode")
				};
				param.account = $("#completePhoneNum").data('phone');
				param.siteID = $("#completePhoneNum").data('site');
				param.reqType = 2;
				param.accountType = 2;
				param.errorTip = $("#smsAuthCode-errMsg");
				param.errorDiv = '';
				param.isSmsLogin = true;
				getAuthCode(param);
			}
			if(localInfo.extInfo)
			{
				$("#login_userName").val(localInfo.extInfo);
				if(isNumber(localInfo.extInfo)){
					$("#login_phoneNum").val(localInfo.extInfo);
				}
			}
			
			//更多
			$("#btn-more").on("click", function(event){
				var moreList = $("#more_list");
				moreList.css("display") == "none"? moreList.show():moreList.hide();
				event.stopPropagation();
			});
			$("#loginform").on("click", function(){
				var moreList = $("#more_list");
				if(moreList.css("display") != "none"){
					moreList.hide();
				}
			});
			$("#goSecurity").on("click", function(){
				window.top.location.href = localHttps + "/portal/securitycenter/securityCenter.html" + localInfo.queryString;
			});

});



// 提取url中的查询参数
function getValue(url, name) {
	var search = url.search, parts = (!search) ? [] : search.split('&'), params = {};

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

function chgRandomCodeForLogin(type) {
	if("smsRandomCode" == type){
		//短信登录验证码切换
		var smsRandomCode = $("#smsRandomCode");
		var smsRandomCodeImg = $('#smsRandomCodeImg');
		chgRandomCode(smsRandomCodeImg[0], localInfo.webssoSMSLoginSessionCode);
		smsRandomCode.val("");
		$('#smsAuthCodeRight').removeClass('poptips-yes');
	}else{
		//华为账号登录验证码切换
		var randomCode = $("#randomCode");
		var randomCodeImg = $('#randomCodeImg');
		chgRandomCode(randomCodeImg[0], localInfo.webssoLoginSessionCode);
		randomCode.val("");
		$('#authCodeRight').removeClass('poptips-yes');
	}
	//刷新验证码时，需刷新hwmate
	try{
		if(hwcap){
			hwcap.reload();
		}
	}catch(e){}
}

// 弹出框

function getAccountInfo(userAcct, operType, callback) {
	var dataParms = {
		"userAccount" : convPlusOfPhoneAccount(userAcct),
		"reqClientType" : localInfo.reqClientType,
		"operType" : operType
	};
	ajaxHandler("getUserAccInfo", dataParms, function(data) {
		var isSuccess = data.isSuccess;
		if (isSuccess == '1') {
			callback(data.userAcctInfoList);
		}
	}, function() {
	}, false, "json");
}

function isActiveAccount(userAccount) {
	var isExist = false;
	getAccountInfo(userAccount, 5, function(data) {
	
		
			for (var i = 0; i < data.length; i++) {
				var account = data[i];
				if ((account.accountType == 1 || account.accountType == 2)
						&& account.accountState == 1) {
					isExist = true;
					break;
				}
			}
		
	});
	return isExist;
}

/**
 * 仅是调用getActivateEMailURL接口
 */
function getActivateEMailURL(userAccount, reqClientType, activeBtn) {
	var param = {
		reqClientType:reqClientType,
		languageCode:localInfo.lang
	};
	casAjaxObj.getActivateEMailURLFn(param, function(data) {
		if (data.isSuccess == '1') {
			if (activeBtn != null) {
				activeBtn.attr("IntervalTime", 60);
				activeBtn.addClass("auth_code_grey");
				jsInnerTimeout(activeBtn, rss.resend);
				activeBtn.attr("disabled");
			}
		} else {
			if (activeBtn != null) {
				activeBtn.removeAttr("disabled");
			}
			if (data.errorCode == "10000001" || data.errorCode == "70001201") {
				showEMUIError('',$("#get_authcode_error_info"), rss.error_10000001);
			} else if (data.errorCode == "10000002") {
				showEMUIError('',$("#get_authcode_error_info"), rss.error_10000002);
			} else if (data.errorCode == "10000004") {
				showEMUIError('',$("#get_authcode_error_info"), rss.error_10000004);
			} else if (data.errorCode == "70002001") {
				showEMUIError('',$("#get_authcode_error_info"), rss.error_70002001);
			} else if (data.errorCode == "70001401") {
				showEMUIError('',$("#get_authcode_error_info"), rss.error_70001401);
			} else if (data.errorCode == "70002008") {
				showEMUIError('',$("#get_authcode_error_info"), rss.error_70002008);
			} else if (data.errorCode == "70001102") {
				// 进行了调整更新
				showEMUIError('',$("#get_authcode_error_info"), rss.error_70001102_2);
			} else if (data.errorCode == "70001104") {
				showEMUIError('',$("#get_authcode_error_info"), rss.error_70001104_3);
			} else if (data.errorCode == "70002019") {
				showEMUIError('',$("#get_authcode_error_info"), rss.error_70002019);
			} else if (data.errorCode == "70002009") {
				showEMUIError('',$("#get_authcode_error_info"), rss.error_70002009);
			} else {
				showEMUIError('',$("#get_authcode_error_info"),
						rss.get_activate_email_URL_Error);
			}
		}
	});

}

function checkCookie(cookie) {
	if (localInfo.cookiePrivateAgreement == "true") {
		if (!ec.util.cookie.get(cookie)) {
			$("#cookies_privacy").removeClass("hidden");
		}

		$("#cookies_privacy").find("img").click(function(e) {
			$("#cookies_privacy").addClass("hidden");
			ec.util.cookie.set(cookie, true);
		});
	}

}

function querySiteInfo(userAccount, callbackFn, asynOrNot) {
	// 账号为空，不需要访问后台
	if (!userAccount) {
		return;
	}

	var dataParms = {
		"userAccount" : convPlusOfPhoneAccount(userAccount),
		"reqClientType" : localInfo.reqClientType
	};
	if($("#login_userName").is(":hidden")){
		dataParms.operType = "11";
	}
	ajaxHandler("chkRisk", dataParms, function(data) {
		
		// 首先打桩开发
		var isSuccess = data.isSuccess;
		var errorCode = data.errorCode;
		var crossSiteModel = data.crossSiteModel;
		
		if($("#login_userName").is(":hidden"))
		{
			// 如果正常登录输入框被隐藏了,那么展示的就是短信登录的页面
			localInfo.phoneCrossModel = crossSiteModel;
		}
		else
		{
			localInfo.norCrossModel = crossSiteModel;
		}
		
		if(crossSiteModel==2){
			localInfo.redirectSiteUrl=data.redirectSiteUrl;
			localInfo.extInfo = data.extInfo;
		}
		
		var existAccountFlag = data.existAccountFlag;
		var isNeedImageCode = data.isNeedImageCode;
		
		// 下面信息属于打桩
		if (isSuccess == 1) {
			localInfo.curAccountSiteID = data.siteID;
			
			handleUserAccountChanged(convPlusOfPhoneAccount(userAccount));
			
			// 处理存在多个用户的情景
			if(existAccountFlag==1 || existAccountFlag==2)
			{
				var siteInfoObjArr = [];
				if (data.existAccountFlag == 1 || data.existAccountFlag == 2) {
					var siteInfoList = data.siteInfoList;
					if (siteInfoList) {
						for (var i = 0; i < siteInfoList.length; i++) {
							var siteInfo = siteInfoList[i];
							var siteInfoObj = {};
							siteInfoObj.siteID = siteInfo.siteID;
							siteInfoObj.countryCode = siteInfo.cy;
							siteInfoObj.loginUrl = siteInfo.loginUrl;
							siteInfoObjArr.push(siteInfoObj);
						}
					}
				}
				callbackFn(siteInfoObjArr, data);
				
				// 如果存在多个的话，下面的逻辑不进行判断，首选让用户进行选择，选择完之后再进行调整。
				if(existAccountFlag==2)
				{
					return;
				}
			}
			
			// 如果 需要 展示 验证码的话，那么控制相关的控件展示。
			if(isNeedImageCode==1 || localInfo.isOpenLocalCacheRisk=='true' || localInfo.normalLoginTooManyTimes)
			{
				
				localInfo.isNeedImageCode=true;
					if($('#captcha1').length<=0){
						// 调用getCaptcha获取html片段插入id为picAuthCode的td下
						getCaptcha();
					}
			}
			else
			{
				if($('#captcha1').length>0){
					$('#picAuthCode').empty().parent().removeClass("user-input-tr");
					$('#picAuthCode').removeClass('user-input-tr');
					showLoginErrorhide("randomCode");
				}
				localInfo.isNeedImageCode=false;
			}
			
			// 在此处处理设备指纹的问题
			if(crossSiteModel!=2){
				// 上面支持异步调用，那么查询DF的接口，可能会被大量调用
				isAgreeUsedDeviceFinger();
			}
			
		} else {
			
			// 是否要填充 randonCode,以保障randomCode能够正常的展示
			if($('#captcha1').length<=0)
			{
				$("#randomCode").val(1111);
				localInfo.isNeedImageCode=false;
			}
			else
			{
				localInfo.isNeedImageCode=true;
				$("#randomCode").val("");
			}
			
			callbackFn([], data);
		}

	}, function() {
	}, asynOrNot, "json");

}

function openGotoOwnSiteDialog() {
	var htmlStr = '<span class="font-EMUI6">'+ rss.noSupportService +'</span>';
	$("<div>").Dialog({
		title : rss.prompt,
		btnLeft : false,
		btnRight : {
			text : rss.iKnowBtn,
			fn : function() {
				this.hide();

			}
		},
		html : htmlStr,
		dialogStyle: localInfo.msgDialogStyle,
		beforeAction : function() {

		}

	}).Dialog("show");
}

function openNoAllowCrossSiteDialog() {
	var htmlStr = '<span class="font-EMUI6">'+ rss.no_allow_cross_site_login +'</span>';
	$("<div>").Dialog({
		title : rss.prompt,
		btnLeft : false,
		btnRight : {
			text : rss.IGetIt,
			fn : function() {
				this.hide();
			}
		},
		html : htmlStr,
		dialogStyle : localInfo.msgDialogStyle,
		beforeAction : function() {

		}
	}).Dialog("show");
}

// 转换电话号码前的加号
function convPlusOfPhoneAccount(account) {
	// The telephone number plus conversion
	if (account) {
		var temp = account.replace(/^\s+|\s+$/g, ''); // 去掉头尾空白字符

		var ch = temp.charAt(0);

		if (ch == '+') {
			return "00" + temp.substring(1);
		}

		return temp;
	}

	return account;
}

// 处理风控时，帐号发生变更的情景
function handleUserAccountChanged(newUserAccount)
{
	
	if(newUserAccount == null || newUserAccount.trim() == "")
	{
		return;
	}
	else
	{
		newUserAccount=newUserAccount.trim();
	}
		
	
	if(localInfo.lastInputAccount == "")
	{
		// 表明为第一次在该页面输入帐号
		localInfo.lastInputAccount=newUserAccount;
		localInfo.curInputAccount=newUserAccount;
	}
	else
	{
		// 表明不是第一次输入帐号
		localInfo.curInputAccount = newUserAccount;
		
		if(localInfo.curInputAccount!=localInfo.lastInputAccount)
		{
			// 如果前后两次帐号不相同，那么我们重新刷新登录过多的相关的状态
			localInfo.lastInputAccount=localInfo.curInputAccount;
			localInfo.normalLoginTooManyTimes=false;
		}
	}
}
// 新加错误提示
function showEMUIError(boxObj, tipObj, errorInfo,boxCss,tipCss)
{	
	boxCss = boxCss?boxCss:"input-error-EMUI5";
	tipCss = tipCss?tipCss:"error-tips-EMUI5";
	if(boxObj)
	{
		boxObj.addClass(boxCss);
		tipObj.html(errorInfo).addClass(tipCss);
	}
	else 
	{
		tipObj.html(errorInfo).addClass(tipCss);
	}
	
}
function hideEMUIError(boxObj,tipObj,boxCss,tipCss)
{
	boxCss = boxCss?boxCss:"input-error-EMUI5";
	tipCss = tipCss?tipCss:"error-tips-EMUI5";
	if(boxObj && boxObj != ''){boxObj.removeClass(boxCss);}
	tipObj.html("").removeClass(tipCss);
}
function getCaptcha(width,top,showType) {
	//图形验证码添加下划线样式
	if(localInfo.displayCaptchaType == "0"){
		$('#picAuthCode').addClass('user-input-tr');
	}
	var width = width?width:"100%";
	var top = top?top:"0px";
	var dataParms = {
		"captchaType":localInfo.displayCaptchaType,
		"width": width,
		"top": top,
		"lang":localInfo.lang,
		"clientType":"cas",
		"respType":"1"
	};
	if(showType){
		dataParms.showType = showType;
	}
	ajaxHandler("getCaptcha", dataParms, function(data) {
		var isSuccess = data.isSuccess;
		if (isSuccess == '1') {
			getCaptchaHtml = data.respContent;
			$('#picAuthCode').html(getCaptchaHtml);
			if(localInfo.displayCaptchaType == 0)
			{
				$('#picAuthCode').parent().addClass("user-input-tr");
			}
			
			if (window.captchaObj)
			{
				registerRandomCode();
			}
		}
	}, function() {
	}, false, "json");
}
// 校验验证码格式
function validateAuthCode($authCode,$authCodeDiv,$errorTip)
{
	ec.form.validator.bind($authCode, {
		type : ["require", "length", "number"],
		trim : true,
		min : 4,
		max : 8,
		validOnChange : false,
		msg : {
			require : rss.inputAuthCodeTip,
			length : rss.authCodeLength,
			number : rss.authCodeLength
		},
		errorFunction : function(obj, options) {
			$authCodeDiv.addClass("input-error-EMUI5");
				switch(options.type) {
					case "require":
						$errorTip.html(rss.inputAuthCodeTip);
						break;
					case "length":
						$errorTip.html(rss.authCodeLength);
						break;
					case "number":
						$errorTip.html(rss.authCodeLength);
				}
			},
		successFunction: function(obj, options) {
		},reInputFunction:function()
		{
			$errorTip.html("");
			$authCodeDiv.removeClass("input-error-EMUI5");
			
		}
	});	
}

function chkAuthCode(userAccount,oldAccountType,authCode, authOprType, callback,operType,isLogin,errorEl,errorDiv,errorStyle) {
        var param = {
            accountType : oldAccountType,
            userAccount : userAccount,
            authCode : authCode.trim(),
            authOprType : authOprType,
            reqClientType : reqClientType,
            operType:operType
        };
       var method = "chkAuthCode";
       var errorEl = errorEl || $(".errortip");
       if(isLogin)
       {
    	 method = "chkAuthCodeBySession";   
       } 
        ajaxHandler(method, param, function(data) {
            var isSuccess = data.isSuccess;
            var errorCode = data.errorCode;
            if (isSuccess == "1") {
                var oldAccountObj = {
                    oldAccountType : oldAccountType,
                    oldUserAccount : userAccount,
                    oldAuthCode : authCode,
                    reqClientType : reqClientType
                };
                callback(oldAccountObj);

            } else {
            	if(errorStyle =="EMUI5")
            	{
            		errorDiv.addClass("input-error-EMUI5");
            		 if (errorCode == "10000001") {
            			 errorEl.html(rss.authCodeError);
                     } else if (errorCode == "10000002") {
                    	 errorEl.html(rss.error_10000002);
                     } else if (errorCode == "10000004") {
                    	 errorEl.html(rss.error_10000004);
                     } else if (errorCode == "70001201") {
                    	 errorEl.html(rss.error_70001201_1);
                     } else if (errorCode == "70001401") {
                    	 errorEl.html(rss.error_70001401);
                     } else if (errorCode == "70002039") {
                    	 errorEl.html(rss.error_70002039);
                     } else if (errorCode == "70002058") {
                    	 errorEl.html(rss.error_70002058);
                     } else if (errorCode ==  "70002057") {
                    	 errorEl.html(rss.error_70002057_1);
                     }
                     
                     else {
                    	 errorEl.html(rss.authCodeError);
                     }
            	}
            	else
            	{	
                if (errorCode == "10000001") {
                    showError(errorEl, rss.authCodeError);
                } else if (errorCode == "10000002") {
                    showError(errorEl, rss.error_10000002);
                } else if (errorCode == "10000004") {
                    showError(errorEl, rss.error_10000004);
                } else if (errorCode == "70001201") {
                    showError(errorEl, rss.error_70001201_1);
                } else if (errorCode == "70001401") {
                    showError(errorEl, rss.error_70001401);
                } else if (errorCode == "70002039") {
                    showError(errorEl, rss.error_70002039);
                } else if (errorCode == "70002058") {
                    showError(errorEl, rss.error_70002058);
                } else if (errorCode ==  "70002057") {
                     showError(errorEl, rss.error_70002057_1);
                }
                
                else {
                    showError(errorEl, rss.authCodeError);
                }
            	}

            }
        }, function() {
        }, false, "json");
}
function getAuthCode(paraData) {
        var userID = paraData.userID;
        var account = paraData.account;
        var phoneOrEmail = paraData.phoneOrEmail;
        var accountType = paraData.accountType;
        var $btn = paraData.authCodebtn;
        var reqType = paraData.reqType;
        var accountSiteID = paraData.siteID;
        var errorStyle = paraData.errorStyle;
        var errorTip = paraData.errorTip;
        var errorDiv = paraData.errorDiv;
        var failCustomize = paraData.failCustomize?paraData.failCustomize:false;
        var operType = "0";
        operType = paraData.operType;
        var isLogin = paraData.isLogin;
        var param;
        var sendAccountType = 1;
        if (phoneOrEmail.indexOf("@") != -1) {
            sendAccountType = 1;
            method ="getEMailAuthCode";
            if(isLogin)
            {
            	method = "getEMailAuthCodeBySession";
            }	
            param = {
                userID : userID,
                accountType : accountType,
                reqClientType : localInfo.reqClientType,
                userAccount : account,
                emailReqType : reqType,
                operType : operType,
                email : phoneOrEmail,
                siteID : accountSiteID,
                languageCode:localInfo.lang
            };
        } else {
            sendAccountType = 2;
            method = "getSMSAuthCode";
            if(isLogin)
            {
            	method = "getSMSAuthCodeBySession";	
            }	
            param = {
                accountType : accountType,
                userAccount : account,
                reqClientType : localInfo.reqClientType,
                mobilePhone : phoneOrEmail,
                operType : operType,
                smsReqType : reqType,
                siteID : accountSiteID,
                languageCode:localInfo.lang
			};
			if(paraData.isSmsLogin){//短信登录，新加三个入参
				param.operType = "20";
				param.service = localInfo.service;
				param.loginChannel = localInfo.loginChannel;
				param.authCode = $('#smsRandomCode').val();
			}
            if(paraData.type=="identifyVerify") {
            	// param.userAccount = phoneOrEmail;
            	param.smsReqType = "3"; // 录入前
            }
        }

        ajaxHandler(method, param, function(data) {
            var flag = data.isSuccess;
            if (flag == "1") {
				$btn.attr("disabled");
				if(paraData.isSmsLogin){//短信登录
					if (param.email) {
						showMsgSuccess({obj:$("#smsAuthCodeTips"),msg:rss.emialHasSendTo.format(param.email), leftPix:"-243px", rightPix:"-228px",bottom:"38px"});
					} else {
						showMsgSuccess({obj:$("#smsAuthCodeTips"),msg:rss.phoneMegHasSendTo.format(getExpressPhone(param.mobilePhone)), leftPix:"-243px", rightPix:"-228px",bottom:"38px"});	
					}
				}else{
					if (param.email) {
						showMsgSuccess({obj:$("#authCodeError"),msg:rss.emialHasSendTo.format(param.email), leftPix:"-274px", rightPix:"-235px",bottom:"32px"});
					} else {
						showMsgSuccess({obj:$("#authCodeError"),msg:rss.phoneMegHasSendTo.format(getExpressPhone(param.mobilePhone)), leftPix:"-274px", rightPix:"-235px",bottom:"32px"});	
					}
				}
                $btn.addClass("auth_code_grey");
                jsInnerTimeout($btn, rss.resend);

            } else {
            	$btn.removeAttr("disabled");
            	
            	if(errorStyle)
            	{   
                    if(errorDiv && errorDiv != ''){errorDiv.addClass("input-error-EMUI5");}
                    if (data.errorCode == "10000001") {
                    	errorTip.html(rss.error_10000001_1);
                    } else if (data.errorCode == "10000002") {
                    	errorTip.html(rss.error_10000002);
                    } else if (data.errorCode == "10000004") {
                    	errorTip.html(rss.error_10000004);
                    } else if (data.errorCode == "70001102") {
                        if (sendAccountType == 1 || sendAccountType == 5) {
                        	errorTip.html(rss.error_70001102_0);
                        } else if (sendAccountType == 2 || sendAccountType == 6) {
                        	errorTip.html( rss.error_70001102_1);
                        }

                    } else if (data.errorCode == "70001104") {
                        if (sendAccountType == 1 || sendAccountType == 5) {
                        	errorTip.html(rss.error_70001104_0, "left");
                        } else if (sendAccountType == 2 || sendAccountType == 6) {
                        	errorTip.html(rss.error_70001104_1, "left");
                        }
                    } else if (data.errorCode == "70001201") {
                    	errorTip.html(rss.error_70001201_0);
                    } else if (data.errorCode == "70001101") {
                    	errorTip.html(rss.error_70001101);
                    } else if (data.errorCode == "70001401") {
                    	errorTip.html(rss.error_70001401);
                    } else if (data.errorCode == "70002001") {
                    	errorTip.html(rss.error_70002001);
                    } else if (data.errorCode == "70002002") {
                    	errorTip.html(rss.error_70002002);
                    } else if (data.errorCode == "70002028") {
                    	errorTip.html(rss.error_70002028);
                    } else if (data.errorCode == "70002046") {
                    	errorTip.html(rss.error_70002046);
                    } else if (data.errorCode == "70002030") {
                    	errorTip.html(rss.error_70002030);
                    } else {
                    	errorTip.html(rss.error_70002030);
                    }
            	}
            	else
            	{
            		
                    if (data.errorCode == "10000001") {
						showLoginError(rss.error_10000001_1,"loginErr");
                    } else if (data.errorCode == "10000002") {
						showLoginError(rss.error_10000002,"loginErr");
                    } else if (data.errorCode == "10000004") {
						showLoginError(rss.error_10000004,"loginErr");
                    } else if (data.errorCode == "70001102") {
                        if (sendAccountType == 1 || sendAccountType == 5) {
							showLoginError(rss.error_70001102_0,"loginErr");
                        } else if (sendAccountType == 2 || sendAccountType == 6) {
							showLoginError(rss.error_70001102_1,"loginErr");
                        }

                    } else if (data.errorCode == "70001104") {
                        if (sendAccountType == 1 || sendAccountType == 5) {
							showLoginError(rss.error_70001104_0,"loginErr");
                        } else if (sendAccountType == 2 || sendAccountType == 6) {
							showLoginError(rss.error_70001104_1,"loginErr");
                        }
                    } else if (data.errorCode == "70001201") {
						showLoginError(rss.error_70001201_0,"loginErr");
                    } else if (data.errorCode == "70001101") {
						showLoginError(rss.error_70001101,"loginErr");
                    } else if (data.errorCode == "70001401") {
						showLoginError(rss.error_70001401,"loginErr");
                    } else if (data.errorCode == "70002001") {
						showLoginError(rss.error_70002001,"loginErr");
                    } else if (data.errorCode == "70002002") {
						showLoginError(rss.error_70002002,"loginErr");
                    } else if (data.errorCode == "70002028") {
						showLoginError(rss.error_70002028,"loginErr");
                    } else if (data.errorCode == "70002046") {
						showLoginError(rss.error_70002046,"loginErr");
                    } else if (data.errorCode == "70002030") {
						showLoginError(rss.error_70002030,"loginErr");
					} else if (data.errorCode == "70008805") {
						showLoginError(rss.smsLoginError_70008805,"loginErr");
					}else if (data.errorCode == "70002076") {
						$("div").DialogSimple({
							text:rss.error_70002076,
							btnText:rss.ok,
							btnFn:function(){
								location.href=localHttps+"/securitycenter/unfrozeAccount.html"+localInfo.queryString;
							},
							btnLeftText:rss.cancel
						}).show();
					}else if(data.errorCode == "10000201"){
						showLoginError(rss.picCodeExpired,"smsRandomCode",$("#smsCaptcha"));
						$("#smsRandomCode").focus();
						chgRandomCodeForLogin("smsRandomCode");
					}else {
						showLoginError(rss.error_70002030,"loginErr");
                    }
            	}	
            	
                
            }
        }, function(data) {
            if(failCustomize){
                errorTip.html(rss.getAuthCodeError);
            }else{
				showLoginError(rss.getAuthCodeError,"loginErr");
            }
        }, true, "json");
}

function gotoRegister()
{
	window.top.location.href = localInfo.regseterLink;
}

function gotoresetpwd()
{
	window.top.location.href=localInfo.findPwd + localInfo.resetPwdLink;
}

function thirdAccountLogin(obj)
{
	var hrefObj=$("."+obj.className+" a");
	var a=localInfo.thirdLoginUrlAddrass;
	var b=hrefObj.attr("toUrl");
	var toUrl= a + b + localInfo.queryString;
	if(window != window.top){
		if (localInfo.bizIfmUrl)
		{
			toUrl = toUrl + "&bizIfmUrl=" + encodeURIComponent(localInfo.bizIfmUrl);
		}
		window.top.location.href = toUrl;
	}else{
		hrefObj.attr("href",toUrl);
	}
}

function thirdAccountBind(obj)
{
	var hrefObj=$("."+obj.className+" a");
	var a=localInfo.thirdLoginUrlAddrass;
	var b=hrefObj.attr("toUrl");
	var toUrl= a + b + localInfo.queryString;
	if(window != window.top){
		if (localInfo.bizIfmUrl)
		{
			toUrl = toUrl + "&bizIfmUrl=" + encodeURIComponent(localInfo.bizIfmUrl);
		}
		window.top.location.href = toUrl;
	}else{
		hrefObj.attr("href",toUrl);
	}
}

function smsRandomeCodeInit()
{
		//设置验证码的初始化属性
		$("#smsRandomCodeImg").attr("src",localInfo.webssoSMSLoginSessionCode).attr("alt",rss.authcode_name);
	   // 显示验证码
		var smsRandomCode = $("#smsRandomCode");
		ec.form.validator.bind(smsRandomCode, {
			type : [ "require", "chinaLang" ],
			validOnChange : true,
			max : 4,
			min : 4,
			errorFunction : function(obj, options) {
		            switch(options.type) {
			            case "require":
							showLoginError(rss.common_js_inputpiccode,"smsRandomCode",$("#smsCaptcha"));
			                break;
			            case "chinaLang":
							showLoginError(rss.picAuthCodeLength,"smsRandomCode",$("#smsCaptcha"));
			                break;
		            }
	          },
			successFunction:function(){
			},
			reInputFunction:function()
			{
				showLoginErrorhide("smsRandomCode");					
			}
		});
		ec.ui.hover(smsRandomCode);
		ec.form.input.label(smsRandomCode, rss.imgCode);

	     //绑定输入事件
	     smsRandomCode.bind("keyup",
			function(evt) {
				var smsRandomCode = $(this);
				var smsRandomCodeImg = $('#smsRandomCodeImg');
				if (typeof (smsRandomCode[0]) != "undefined"
						&& smsRandomCode.val().length == 4) {
					var thisValue = smsRandomCode.val();
					var dataParms = {
						randomCode : thisValue,
						session_code_key : "sms_login_session_ramdom_code_key"
					};
					ajaxHandler(
							"authCodeValidate",
							dataParms,
							function(data) {
								if ("1" == data.isSuccess) {
									$('#smsAuthCodeRight').addClass('poptips-yes');
									$("#btnSMSLogin").focus();
								} else {
									chgRandomCode(
										smsRandomCodeImg[0],
											localInfo.webssoSMSLoginSessionCode);
										smsRandomCode.focus();
										smsRandomCode.val("");
										
									//刷新验证码时，需刷新hwmate
									try{
										if(hwcap){
											hwcap.reload();
										}
									}catch(e){}
										
									switch (data.errorCode) {
										case '10000201': {
											showLoginError(rss.picAuthCodeLength,"smsRandomCode",$("#smsCaptcha"));
											break;
										}
										case '10000001': {
											showLoginError(rss.error_10000001,"smsRandomCode",$("#smsCaptcha"));
											break;
										}
										case '10000004': {
											showLoginError(rss.error_10000004,"smsRandomCode",$("#smsCaptcha"));
											break;
										}
										default: {
											showLoginError(rss.error_10000002,"smsRandomCode",$("#smsCaptcha"));
											break;
										}
									}
								}

							}, function(data) {

							}, false, "JSON");
				} else if (typeof (smsRandomCode[0]) != "undefined"
						&& smsRandomCode.val().length != 4) {
				}
			});
}

function showLoginError(errorMsg,errorType,$targetInput,isMutiUnderline){
	//错误信息默认展示在帐号登录界面，如果帐号登录被隐藏，则错误展示在短信登录界面
	var errorTipDiv = $('.userAccountLogin-errorTipsDiv');
	if($("#login_userName").is(":hidden")){
		errorTipDiv = $('.smsValidateLogin-errorTipsDiv');
	}
	errorTipDiv.html('<i class="loginErrorInfo marginR6"></i>'+ errorMsg).data('type',errorType);
	//先清理错误下划线
	if(errorTipDiv.next().find('tr').hasClass('error-underline')){
		errorTipDiv.next().find('.error-underline').removeClass('error-underline');
	}
	if($targetInput){
		$targetInput.parent().addClass('error-underline');
	}
	if("loginErr" == errorType && isMutiUnderline){
		if($("#login_userName").is(":hidden")){//短信登录
			$('#login_phoneNum').parent().addClass('error-underline');
			$('#smsAuthCode').parent().addClass('error-underline');
		}else{//帐号登录
			$('#login_userName').parent().addClass('error-underline');
			$('#login_password').parent().addClass('error-underline');
		}
	}
	//清除图片验证码打钩样式
	if(("smsRandomCode" == errorType || "randomCode" == errorType) && $targetInput){
		$targetInput.parent().parent().find('.poptips-yes').removeClass('poptips-yes');
	}
}
function showLoginErrorhide(modifyType){
	var errorTipDiv = $('.userAccountLogin-errorTipsDiv');
	var isCorrectModifyType = false;
	if($("#login_userName").is(":hidden")){//短信登录
		errorTipDiv = $('.smsValidateLogin-errorTipsDiv');
		if(modifyType == "phoneNum" || modifyType == "smsAuthCode"){
			isCorrectModifyType = true;
		}
	}else{//帐号登录
		errorTipDiv = $('.userAccountLogin-errorTipsDiv');
		if(modifyType == "userName" || modifyType == "passWord"){
			isCorrectModifyType = true;
		}
	}
	errorTipDiv=errorTipDiv||$("#msg_password");
	var errorType = errorTipDiv&&errorTipDiv.data('type');
	/* 1：登录返回的是帐号（手机号）或者密码（短信验证码）类型错误，修改指定类型输入框，清除错误提示
	*  2:修改指定错误类型的输入框，清除错误提示
	*  3：一些含义模糊的系统错误，允许使用特殊 指令allClean  清除错误提示
	*/
	if(( "loginErr" == errorType && isCorrectModifyType) || modifyType == errorType || modifyType == "allClean"){
		errorTipDiv.html('').removeClass('loginErrorInfo');
		if(errorTipDiv.next().find('td').hasClass('error-underline')){
			errorTipDiv.next().find('.error-underline').removeClass('error-underline');
		}
	}

	//如果图片验证码的内容被清空，清除打钩样式
	if("smsRandomCode" == modifyType && $('#smsRandomCode').val().length == 0){
		$('#smsAuthCodeRight').removeClass('poptips-yes');
	}else if("randomCode" == modifyType && localInfo.displayCaptchaType == "0" && getRandomCode().length== 0){
		$('#authCodeRight').removeClass('poptips-yes');
	}
}

function isAgreeUsedDeviceFinger()
{
	var inputUserAccount;
	
	//  判定是不是短信登录之类的
	if($("#login_userName").is(":hidden"))
	{
		inputUserAccount=$("#login_phoneNum").val();
	}
	else
	{
		inputUserAccount = $("#login_userName").val();
	}
	
	inputUserAccount = convPlusOfPhoneAccount(inputUserAccount);
	
	var dataParms = {
			userAccount:inputUserAccount
	}
	ajaxHandler("isAgreeUsedDeviceFinger", dataParms, function(data) {		
		if ("1" == data.isSuccess) {
			var isAgree = data.agree;
			if(!isAgree)
			{
				// 弹出同意使用设备指纹弹出框
				popAgreeDFDialog();
			}
			
		} else {
			
		}

	}, function(data) {

	}, true, "JSON");
}

function popAgreeDFDialog(param)
{
	var htmlStr = '<div class="font-EMUI6">' + rss.agree_DFVersion_login + '</div>';
	htmlStr += '<div class="font-EMUI6" style="margin-top:5px;">' + localInfo.agree_DFVersion_cliagree + '</div>';
	
	$("<div>").Dialog({
        title: rss.base_agr_update_title,
        btnLeft: {
        	text: rss.uc_common_no_agree,
        	fn:function(){this.hide();}
        },
        btnRight: {
            text: rss.uc_common_agree,
            fn: function() {
            	// 此时调用同意使用设备指纹的接口
            	var paramObj;
            	
            	if(param!=undefined)
            	{
            		paramObj = {
            				"userAccount":param.userAccount,
            				"password":param.password,
            				"authcode":param.authcode
            		}
            		agreeDFAgr(paramObj,param.callbackFn);
            		this.hide();
            	}
            	else
            	{
            		agreeDFAgr();
            		this.hide();
            	}
            }
        },
        html: htmlStr,
        dialogStyle: localInfo.msgDialogStyle,
        beforeAction: function() {

        }

    }).Dialog("show");
	
}

function agreeDFAgr(param,callbackFn)
{
	var inputUserAccount;

    //  判定是不是短信登录之类的
    if ($("#login_userName").is(":hidden")) {
    	inputUserAccount = $("#login_phoneNum").val();
    } else {
    	inputUserAccount = $("#login_userName").val();
    }
    
    inputUserAccount = convPlusOfPhoneAccount(inputUserAccount);
    
    var dataParms = {
        userAccount: inputUserAccount,
        isThird: "false"
    }
    
    ajaxHandler("agreeLatestDFVersion", dataParms, function(data) {
        if ("1" == data.isSuccess) {
        	if(callbackFn!=undefined)
        	{
        		callbackFn(param);
        	}
        } else {
        	// 错误场景
        }

    }, function(data) {

    }, false, "JSON");
}

function registerForImfLogin()
{
	window.top.location.href = localInfo.regseterLink;
}


function isNumber(val){
	var regx = /^([0-9])+$/g;
	var ret = regx.test(val);
	return ret ? true : false;
}