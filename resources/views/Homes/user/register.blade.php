<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="renderer" content="webkit" />
<title>注册_华为帐号</title> <link href="/homes/user" type="image/x-icon" rel="shortcut icon" /> 
<link href="/homes/css/dialog.css" rel="stylesheet" type="text/css"> 
<link href="/homes/css/common_2.css" rel="stylesheet" type="text/css"> 
<link href="/homes/css/zh-cn_css.css" rel="stylesheet" type="text/css"> 
<!-- 
<script type="text/javascript">var localHttps="https://hwid1.vmall.com/CAS";var currentSiteID="1";</script>
-->
<script src="/homes/js/jsapi.js" namespace="ec"></script>
<script src="/homes/js/jquery-1.8.2.min.js" id=jsid></script>
<script src="/homes/js/ec.core.js"></script>
<script src="/homes/js/casui.js"></script>
<script src="/homes/js/ec.business.js"></script> 
<script src="/homes/js/commonjs.js"></script>
<script src="/homes/js/casajaxobj.js"></script>
<script src="/homes/js/reg_base.js"></script>
 

</head>

<body class="reg themeName-red" id="loginform">
		<!-- 头部  -->
<div class="head-background">
	<div class="head_center">
		
		     
			  	<div class="main-logo adHeadPicContainer" style="width:143px">
					<img src="/homes/picture/head-top.png" class="wihteBgPic">
				</div>
				<div class="website-name"  style="color:#fff;">
					<b style="font-size: 18px;margin-top: -3px;float: left;color:#cccccc;">|</b>
					<b style="font-size: 18px;margin-top: -1px;float: left; margin-left:18px;color:#ffffff">华为商城</b>
				</div>
			
		
	</div>
</div>
	

	<div class="wp1 relative">
		<div class="register-content" id="registerForm">

			<div class="login r">
				已有华为帐号
				<a href="/Homes/login/login" class="login-a"
					title="登录">登录</a><span class="ar-eg-opposite">&gt;</span>
			</div>
			<div class="reg-detail">
				<!-- 选择国家开始 -->

				<div class="input-container" id="chooseCountry">
					<div class="l input-left">
						国家
					</div>
					<div class="  input-right">
						&nbsp;&nbsp;中&nbsp;国
					</div>


					<!--
					<div class="input-content">

					 	<div class="node-input" id="selectCountryImg"></div>
						<div id="selectedCountry" style="display: none;"></div>

						提示正在登陆的帐号
						<div id="regXCountry" class="node-intro" style="display: none;">
							不同地区的华为帐号服务可能会有差异。
						</div> 
					</div>
					-->
				</div>



				<!--手机号码 -->
				<form action="/Homes/doregister" method="post">
				{{ csrf_field()}}
				<div class="input-container" id="phoneInputDiv-box">
					<div class="l input-left">
					 <input id="countryCode" type="hidden" name="" autocomplete="off" >
						<div id="input_languageCode"></div> 
						手机 
					</div>

					<div class="r input-right"></div>
					<div class="input-content">
						<input placeholder='请输入手机号' id="username" class="text" type="text"
							name="formBean.username" maxlength="50" tabindex="1" class=""
							autocomplete="off">
					</div>
				</div>
				<div id="msg_phone"></div>


			
			<div class="input-container" id="randomCodeDiv">
					<div class="l input-left">
						图形验证码
					</div>

					<div class="r input-right">
						<img style="height: 40px" src="http://www.qwe.com/kit/captcha/0.5273840518459909"
						alt="验证码" title="刷新图片" width="100" height="40" 
						id="c2c98f0de5a04167a9e427d883690ff6" border="0"
							onclick="javascript:re_captcha();"> 
							<b id="authCodeRight"	class="r" datavalue="false"></b>
					</div>
					<div class="input-content">
						<input id="randomCode" tabindex="2" class="text" type="text"
							name="formBean.randomCode" autocomplete="off">
					</div>

				</div>
				
				<div id="randomCode_msg"></div>


				<div class="input-container" id="errRandomCode-box">
					<div class="l input-left">
						短信验证码
					</div>
					<div class="r input-right">
						<input type="button" class="get-code dbtn2" autocomplete="off"
							id="getValiCode" IntervalTime="60"
							onclick="getMobileCode(4,'p_reg_phone_session_ramdom_code_key',26,'zh')"
							value="获取验证码" /> <span
							id="msg_getPhoneRandomCode"
							style="position: relative; top: 34px;"></span>
					</div>
					<div class="input-content">
						<input placeholder='请输入短信验证码' type="text" autocomplete="off"
							class="verify vam ime-disabled text" id="authCode" tabindex="3"
							style="vertical-align: middle;" name="formBean.authCode"
							maxlength="8" tabindex="3" />
					</div>
				</div>
				<div id="msg_phoneRandomCode"></div>



				<!-- 设置密码 -->
				<div class="set-password">
					<div class="input-container" id="pwdDiv">
						<div class="l input-left">
							密码
						</div>
						<div class="input-content">
							<input placeholder='请输入密码' type="password" autocomplete="off" class="pwd-input text"
								id="password" name="formBean.password" maxlength="32"
								tabindex="4" onkeyup="onPwdKeyUp(this)">
						</div>
					</div>
					<div id="msg_password"></div>
					<div id="pwd_check_dialog"></div>

					<div class="input-container " id="confirmpwdDiv">
						<div class="l input-left">
							确认密码
						</div>
						<div class="input-content">
							<input placeholder='请确认密码' id="confirmPwd" type="password" autocomplete="off"
								class="text vam" name="checkPassword" maxlength="32"
								tabindex="5">
						</div>
					</div>
					<div id="msg_checkPassword"></div>



				<div class="reg-btn" align="center">
					<input type="submit" class="btn btn-reg sel" id="btnSubmit"
						value="注册" tabindex="7" />
					<div id="register_msg" style="position: relative; left: 26%;"></div>
				</div>
			</div>
		</div>
		</form>
		<div class="box-shadow"></div>
		<input type="hidden" id="countryRegion" value="" />
		<div id="selectCountryCodeDiv"></div>
		<div id="notCurrentSiteWarning"></div>

		
			<!-- 底部  -->

<style>

.selectCountryImg {
    display: block;
    width: 30px;
    height: 30px;
    background: url("images/down.png") no-repeat;
    background-position-y: 12px;
     
}

</style>
<div class="wp1 ft">
	<div class="reg-content">
		<p class="footer">
				
					<a id="foot_EULA" href="https://hwid1.vmall.com/CAS/portal/agreements/userAgreement/zh-cn_userAgreement.html?version=china" class="rule" target="_blank">用户协议</a>
					<em class="foot_em">|</em>
					<a id="foot_privacy" href="https://hwid1.vmall.com/CAS/portal/agreements/userPrivacyPolicy/zh-cn_userPrivacyPolicy.html?version=europe" class="rule" target="_blank">隐私政策</a>
				
				
				
				
				
				
				
			<a href="#" target="_blank"><em style='font-style: normal'>|</em> <a style="padding:0 10px;" target="blank" href="https://hwid1.vmall.com/CAS/portal/faq/faq.html">常见问题</a></a>
		</p>
		
		
			
			
				<p class="footer">Copyright © 2011-2017  华为软件技术有限公司  版权所有  保留一切权利  苏B2-20070200号 | 苏ICP备09062682号-9</p>	
			
			
			
		
		
		
		
		


	</div>
</div>


		

		<script src="/homes/js/registerbyphone.js"></script>
		<script src="/homes/js/swfobject.js"></script>
		<script src="/homes/js/acctguard-secure.min.js"></script>
	<script>
	arr = ['2','2','2'];
	//手机号js验证
	$('#username').blur(function(){
		if ($('#username').val() == "") {
		$("#msg_phone").html("<font color='red'>手机号码不能为空！</font>");
		arr.splice(0,1,"1")		
		}else if(!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test($('#username').val()))){ 
		$("#msg_phone").html("<font color='red'>手机号码格式不正确！请重新输入！</font>");
		
		arr.splice(0,1,"1")	
		}else{
		$("#msg_phone").html("");
		arr.splice(0,1,"0")	
	
		}
		 
	})
	//密码验证
		$('#password').blur(function(){
			regExp=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/;
    		if($('#password').val()==""){
			$("#msg_password").html("<font color='red'>密码不能为空!</font>");	
			arr.splice(1,1,"1")	
					
   			 }
			if(!regExp.test($('#password').val())){
			$("#msg_password").html("<font color='red'>密码格式错误！请重新输入！</font>");	
			arr.splice(1,1,"1")	
		
    		}else{
			$("#msg_password").html("");	
			arr.splice(1,1,"0")	
				
			}
		});
		$('#confirmPwd').blur(function(){
			if($('#password').val() !== $('#confirmPwd').val()){
				// $("#msg_checkPassword").text("密码不一致");
			$("#msg_checkPassword").html("<font color='red'>密码不一致！请重新输入！</font>");	
			arr.splice(2,1,"1")	
					
			}else{
			$("#msg_checkPassword").html("");			
			arr.splice(2,1,"0")	
			}
		});
		//验证码验证
		function re_captcha() {
			$url = "{{ URL('kit/captcha') }}";
				$url = $url + "/" + Math.random();
				document.getElementById('c2c98f0de5a04167a9e427d883690ff6').src=$url;
		}
		//短信验证
		

		//不提交进行返回
		$('#btnSubmit').click(function(){
			
			// alert(arr);
			// alert(arr.indexOf('2'));
			
			if(arr.indexOf("2") != '-1'){
				alert('请填入信息');
				return false;
			}else{
				alert('请修改信息');
				return false;
			}
			 if(arr == ['0','0','0']){
				alert('注册成功');
			}
			// if(arr == ['0','0','0']){
			// 	alert('注册成功');
			// }else {
			// 	alert('请填入信息');
			// 	return false;
			// }

		})
		
	</script>
</body>
</html>

