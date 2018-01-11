<!DOCTYPE html>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" >
<meta name="renderer" content="webkit" />
<title>登录</title>
<script type="text/javascript">

</script>

<link href="https://hwid1.vmallres.com/CAS/up/rss_15/../common/images/default/hwfavicon.ico" type="image/x-icon" rel="shortcut icon" /> 
<link href="/homes/css/ec.core_1.css" rel="stylesheet" type="text/css"> 
<link href="/homes/css/common.css" rel="stylesheet" type="text/css"> 
<link href="/homes/css/dialog.css" rel="stylesheet" type="text/css"> 
<link href="/homes/css/dialogemuiv6.css" rel="stylesheet" type="text/css"> 
<link href="/homes/css/common_1.css" rel="stylesheet" type="text/css"> 
<link href="/homes/css/zh-cn.css" rel="stylesheet" type="text/css"> 
<script type="text/javascript">var localHttps="https://hwid1.vmall.com/CAS";var currentSiteID="1";</script>
<script src="/homes/js/jsapi.js" namespace="ec"></script>
<script src="/homes/js/jquery-1.8.2.min.js" id=jsid></script>
<script src="/homes/js/ec.core.js"></script>
<script src="/homes/js/ec.business.js"></script> 
<script src="/homes/js/commonjs.js"></script>
<script src="/homes/js/lazyload-min.js"></script>
<script src="/homes/js/uc_base.js"></script>
<script src="/homes/js/casajaxobj.js"></script>
<script src="/homes/js/jquery.qrcode.min.js"></script>
<script src="/homes/js/casui.js"></script>

<script src="/homes/js/lazyload-min.js"></script>
</head>
<body class="login themeName-red">
	<div id="cookies_privacy" class="center cookie hidden">
		本站点使用cookies,继续浏览表示您同意我们使用cookies。
		<a class="cookie-pro" href="#">Cookies和隐私政策></a>
		<img src="/homes/picture/cookie-close.png"/>
	</div>
	<div>
			<!-- 头部  -->
<div class="customer-header">
	<div class="head_center">
			
		    
			    <div class="main-logo adHeadPicContainer">
					<img src="/homes/picture/huaweilogo.png" class="adHeadPic">
				</div>
				<div class="website-name"  style="color:#999;">
					<span class="logo_line"></span>
					<b style="font-size: 18px;margin-top: -2px;float: left;color:#cccccc;">|</b>
					<b style="font-size: 18px;margin-top: -1px;float: left; margin-left:18px;color:#333333">华为商城</b>
				</div>
			
		
	</div>	
</div>
			<!--登录 -->
			<div class="login_bg" id="loginform">
				<div style="background-image: url('/homes/images/login_default_bg.png');" class="g login_adBg">
					<div class="login-area login-right login-area-box"> 
						<div class="userAccountLogin">
							<div class="h">
							
								<span class="loginTitle actived loginTitle-left" data-type="account">帐号登录</span>
							
							
							</div>
							<form action="/Homes/dologin" method="post">
							{{ csrf_field()}}

							<div class="b-account">
								<div class="login-form-marginTop">
									<div class="form-edit-area">
										<div id="errorlogin"></div>
										<table border="0" cellpadding="0" cellspacing="0">
											<tbody>
												<tr>
													<td class="user-input-tr"><input id="login_userName" type="text" autocomplete="off"  class="text vam"  name="userAccount"   /></td>
												</tr>
												
												<tr>
													<td class="user-input-tr"><input id="login_password" type="password" autocomplete="off"  class="text vam" name="password"  /></td>
												</tr>
												
												<tr>
													<td class="mt-checkbox">
														<span id="rememberNameSpan"><input type="checkbox" class="checkbox vam" id="remember_name" name="remember_name" tabindex="4" /><label for="remember_name"><i id="remember_name_icon" class="checkBox-icon tick-off-icon marginR6"></i>记住华为帐号</label></span>
														<div class="hidden remeberTip"></div>
													</td>
												</tr>
												<tr>
													<td>
														<div style="margin-bottom:0px;"><span class="vam error" id="login_msg"  style="display:block"></span></div>
														<input type="submit" class="button-login" id="btnLogin" data-type="accountLogin" value="登录" tabindex="5" />
														<img class="load" src="picture/loading3.gif" />
													</td>
												</tr>
												<tr>
													<td class="mt-links lineHeightFix" id="operLinkTd">
														
													</td>
												</tr>
												<tr>
													<td class="mt-links p0">
														<div class="mt-links-float vam clearWidth">
															<span class="regist"><a class="btn-primary clearWidth" href="/Homes/register/register" title="注册帐号">注册帐号</a></span><span class="forgot"><a class="btn-primary clearWidth" href="javascript:void(0)" onclick="gotoresetpwd()" title="忘记密码？">忘记密码？</a></span>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
								
						
								
								
							</div>
							
						
							
						</div>
						<div class="smsValidateLogin hidden">
							<span class="changeLoginType callbackAcctLoginBtn" data-type="smsValidateLogin"><&nbsp;返回</span>
							<div class="b-account">
								<div class="login-form-marginTop smsLogin-form">
									<div class="form-edit-area">
										<div class="smsValidateLogin-errorTipsDiv"></div>
										<table border="0" cellpadding="0" cellspacing="0">
											<tbody>
												
												
												<tr>
													<td class="verify-td user-input-tr">
														<div id="smsCaptcha"></div>
														<table>
															<tr>
																<td>
																	<input type="text" autocomplete="off"  class="verify vam" id="smsRandomCode" name="authcode"  maxlength="4" tabindex="2" />
																</td>
																<td>
																	<img class="vam pointer random_padding r" id="smsRandomCodeImg" width="100" height="40" src="picture/87098d0af0344ee4926ffd97bf2b0e8f.gif" alt="验证码：" onClick="chgRandomCodeForLogin('smsRandomCode');" />
																</td>
																<td class="authCodeTd"><i id="smsAuthCodeRight" class="r"></i></td>
															</tr>
														</table>
													</td>
												</tr>
												
											
										
												
												<tr>
													<td>
														<div style="margin-bottom:0px;"><span class="vam error" id="login_msg"  style="display:block"></span></div>
														<input type="submit" class="button-login" id="btnSMSLogin" data-type="smsLogin" value="登录" tabindex="5" />
														<img class="load" src="picture/loading3.gif" />
													</td>
												</tr>
												</form>
												<tr>
													<td class="mt-links">
														<div class="mt-links-float  vam">
															<span class="regist"><a class="btn-primary" href="/homes/register/register" title="注册帐号">注册帐号</a></span><span class="forgot"><a class="btn-primary" href="javascript:void(0)" onclick="gotoresetpwd()" title="忘记密码？">忘记密码？</a></span>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>						
							</div>
						</div>
					</div>
				</div>	
			</div>
		</div>
	<div>
	<!-- 底部  -->

	<div class="wp ft">
		<p>
			
				<a href="https://hwid1.vmall.com/CAS/portal/agreements/userAgreement/zh-cn_userAgreement.html?version=china" class="rule" target="_blank">用户协议</a>
				<em class="foot_em">|</em>
				<a href="https://hwid1.vmall.com/CAS/portal/agreements/userPrivacyPolicy/zh-cn_userPrivacyPolicy.html?version=europe" class="rule" target="_blank">隐私政策</a>
				<em class="foot_em">|</em>
				<a href="https://hwid1.vmall.com/CAS/portal/faq/faq.html" class="ifaq" target="_blank">常见问题</a>
			
			
			
			
			
			
			
		</p>
			
		
				
			
				<p>Copyright © 2011-2017    华为技术有限公司   版权所有   保留一切权利&nbsp;&nbsp;苏B2-20070200号           |           苏ICP备09062682号-9</p>
				<p></p>	
			
			
		
	
		
	</div>
	</div>
	<div id="layer">
		<div class="mc"></div>
	</div>

	<div id="selectCountryCodeDiv"></div>

</body>

<script src="js/loginauthdialog.js"></script>
<script src="js/login.js"></script>
<script src="js/swfobject.js"></script>
<script src="js/acctguard-secure.min.js"></script>
<script>
	login_userName
	$('#login_userName').blur(function(){
		if ($('#login_userName').val() == "") {
		$("#errorlogin").html("<font color='red'>手机号码不能为空！</font>");
		}else if(!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test($('#login_userName').val()))){ 
		$("#errorlogin").html("<font color='red'>手机号码格式不正确！请重新输入！</font>");
		return false;
		}else{
		$("#errorlogin").html("");			
		}
		return true; 
	})
</script>


</html>