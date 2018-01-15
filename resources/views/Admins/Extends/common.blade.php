<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>六扇门后台首页</title>
<meta name="keywords" content="简洁,实用,后台管理,静态网页,模板下载" /> 
<meta name="description" content="简洁实用的后台管理静态网页模板下载。" /> 
<meta name="Copyright" content="Douco Design." />
<link href="/admins/css/public.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href='/bootstrap-3.3.7-dist/css/bootstrap.css'>
<script type="text/javascript" src="/Admins/js/jquery.min.js"></script>
<script src="/Admins/layer/layer.js"></script>
<script type="text/javascript" src="/Admins/js/global.js"></script>
</head>
<body>
<!-- 头部 -->
<div id="dcWrap"> <div id="dcHead">
 <div id="head">
  <div class="logo"><a href="/admin/index"><img src="/Admins/images/dclogo.gif" alt="logo"></a></div>
  <div class="nav">
 
   <ul class="navRight">
    <li class="M noLeft"><a href="JavaScript:void(0);">您好，{{session('admin_name')}}&nbsp;|&nbsp; {{session('admin_level')==1?'超级管理员':'普通管理员'}} </a>
 
    </li>
    <li class="noRight"><a href="/admin/logout">退出</a></li>
   </ul>
  </div>
 </div>
</div>
<!-- dcHead 结束 --> <div id="dcLeft"><div id="menu">

<!-- 左侧开始 -->

 <ul class="top my" >
  <li><a href="/admin/index"><i class="home"></i><em>管理首页</em></a></li>
 </ul>
 <ul class='my'>
  <li><a href="/admin/system"><i class="system"></i><em>系统设置</em></a></li>
  <li><a href="/admin/nav"><i class="nav"></i><em>自定义导航栏</em></a></li>
  <li><a href="/admin/lunbo"><i class="show"></i><em>轮播图</em></a></li>
  <!-- <li><a href="/admins/page"><i class="page"></i><em>单页面管理</em></a></li> -->
  <li><a href="/admin/user"><i class=""></i><em>用户管理</em></a></li>

 </ul>

 	<!-- 这里判断登陆者是超级管理还是普通管理员 -->
	@if(session('admin_level')==1)
   <ul class='my'>
  <li><a href="/admin/productcategory"><i class="productCat"></i><em>商品分类</em></a></li>
  <li><a href="/admin/good"><i class="product"></i><em>商品列表</em></a></li>
 </ul>
  <ul class='my'>
  <li><a href="/admin/notice"><i class="article"></i><em>网站公告</em></a></li>
 </ul>
   <ul class="bot my" >
  <li><a href="/admin/admin"><i class="manager"></i><em>网站管理员</em></a></li>
  <li><a href="/admin/order"><i class=""></i><em>订单管理</em></a></li>
  <li><a href="/admin/ad"><i class=""></i><em>广告位管理</em></a></li>
 </ul>
 @endif

</div></div>
 
 <div id="dcMain"> <!-- 当前位置 -->
@section("zhuti")
<div id="urHere">六扇门 管理中心</div> 
    
   <div id="douApi"></div>
      <div class="indexBox">
        <center>
    <h2>欢迎访问六扇门</h2>
    </center>
    <hr>
    <center>
     <button class='btn btn-default btn-lg'>李强</button>
     <button class='btn btn-primary btn-lg'>尹峰</button>
     <button class='btn btn-success btn-lg'>崔伟男</button>
     <button class='btn btn-info btn-lg'>薛永红</button>
     <button class='btn btn-warning btn-lg'>马超</button>
     <button class='btn btn-danger btn-lg'>安伟松</button>
  </center>

 <h3>未完成，待续......</h3>




 <!-- 主体结束位置 -->
 @show
 <div class="clear"></div>
<div id="dcFooter">
 <div id="footer">
  <div class="line"></div>
  <ul>
   版权所有 © 2018-2020 六扇门网络科技有限公司，并保留所有权利。
  </ul>
 </div>
</div><!-- dcFooter 结束 -->
<div class="clear"></div> </div>
</body>
</html>