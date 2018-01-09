
@extends('admin.index')
@section("zhuti")
<div id="urHere">DouPHP 管理中心<b>></b><strong>网站管理员</strong> </div>   <div id="manager" class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
    <h3><a href="addmanager.html?rec=add" class="actionBtn">添加管理员</a>网站管理员</h3>
        <table width="100%" border="0" cellpadding="8" cellspacing="0" class="tableBasic">
     <tr>
      <th width="30" align="center">编号</th>
      <th align="left">管理员名称</th>
      <th align="center">E-mail地址</th>
      <th align="center">添加时间</th>
      <th align="center">最后登录时间</th>
      <th align="center">操作</th>
     </tr>
          <tr>
      <td align="center">1</td>
      <td>admin</td>
      <td align="center"></td>
      <td align="center">2016-02-25</td>
      <td align="center">2016-02-26 20:53:17</td>
      <td align="center"><a href="addmanager.html?rec=edit&id=1">编辑</a> | <a href="manager.html?rec=del&id=1">删除</a></td>
     </tr>
         </table>
                       </div>
 </div>
@endsection