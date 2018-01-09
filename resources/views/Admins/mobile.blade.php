
@extends('admin.index')
@section("zhuti")
<div id="urHere">DouPHP 管理中心<b>></b><strong>手机版系统设置</strong> </div>  <div id="mobileBox">
   <div id="mMenu">
    <h3>手机版</h3>
    <ul>
     <li><a href="mobile.php" class="cur">手机版系统设置</a></li>
     <li><a href="mobile.php?rec=nav">手机版导航</a></li>
     <li><a href="mobile.php?rec=show">手机版幻灯</a></li>
     <li><a href="mobile.php?rec=theme">手机版模板</a></li>
    </ul>
   </div>
   <div id="mMain">
    <div class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
          <h3>手机版系统设置</h3>
     <div class="system">
      <form action="mobile.php?rec=system&act=update" method="post" enctype="multipart/form-data">
       <table width="100%" border="0" cellpadding="8" cellspacing="0" class="tableBasic">
        <tr>
         <th width="141">名称</th>
         <th>内容</th>
        </tr>
                        <tr>
         <td align="right">手机版站名</td>
         <td>
                    <input type="text" name="mobile_name" value="DouPHP" size="80" class="inpMain" />
                             </td>
        </tr>
                                <tr>
         <td align="right">手机版标题</td>
         <td>
                    <input type="text" name="mobile_title" value="DouPHP触屏版" size="80" class="inpMain" />
                             </td>
        </tr>
                                <tr>
         <td align="right">手机版关键字</td>
         <td>
                    <input type="text" name="mobile_keywords" value="DouPHP,DouPHP触屏版" size="80" class="inpMain" />
                             </td>
        </tr>
                                <tr>
         <td align="right">手机版描述</td>
         <td>
                    <input type="text" name="mobile_description" value="DouPHP,DouPHP触屏版" size="80" class="inpMain" />
                             </td>
        </tr>
                                <tr>
         <td align="right">手机版标志</td>
         <td>
                    <input type="file" name="mobile_logo" size="18" />
          <img src="/admin/images/icon_no.png">                             </td>
        </tr>
                                <tr>
         <td align="right">是否关闭手机版</td>
         <td>
                    <label for="mobile_closed_0">
           <input type="radio" name="mobile_closed" id="mobile_closed_0" value="0" checked="true">
           否</label>
          <label for="mobile_closed_1">
           <input type="radio" name="mobile_closed" id="mobile_closed_1" value="1">
           是</label>
                             </td>
        </tr>
                                          <tr>
          <td align="right">手机版文章列表数量</td>
          <td>
           <input type="text" name="mobile_display[article]" value="10" size="80" class="inpMain" />
                     </td>
         </tr>
                  <tr>
          <td align="right">手机版首页展示文章数量</td>
          <td>
           <input type="text" name="mobile_display[home_article]" value="5" size="80" class="inpMain" />
                     </td>
         </tr>
                  <tr>
          <td align="right">手机版商品列表数量</td>
          <td>
           <input type="text" name="mobile_display[product]" value="10" size="80" class="inpMain" />
                     </td>
         </tr>
                  <tr>
          <td align="right">手机版首页展示商品数量</td>
          <td>
           <input type="text" name="mobile_display[home_product]" value="4" size="80" class="inpMain" />
                     </td>
         </tr>
                                 <tr>
         <td width="131"></td>
         <td>
          <input type="hidden" name="token" value="21e7d277" />
          <input name="submit" class="btn" type="submit" value="提交" />
         </td>
        </tr>
       </table>
      </form>
     </div>
      
      
      
      
    </div>
   </div>
  </div>
 </div>
@endsection