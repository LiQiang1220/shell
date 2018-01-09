@extends('admin.index')
@section("zhuti")

<div id="urHere">DouPHP 管理中心<b>></b><strong>设置模板</strong> </div>   <div id="theme" class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
   <h3>设置模板</h3>
   <ul class="tab">
    <li><a href="theme.php" class="selected">管理模板</a></li>
    <li><a href="theme.php?rec=install">获取更多模板</a></li>
   </ul>
      <div class="enable">
    <h2>当前启用的模板</h2>
    <p><img src="http://www.weiqing.com/theme/default/images/screenshot.png" width="280" height="175"></p>
    <dl>
     <dt>DouPHP Default</dt>
     <dd>版本：1.0</dd>
     <dd>作者：<a href="http://www.douco.com/" target="_blank">DouCo Co.,Ltd.</a></dd>
     <dd>简介：DouPHP 默认模板</dd>
    </dl>
   </div>
   <div class="themeList">
    <h2>可用模板</h2>
       </div>
         </div>
 </div>
 @endsection