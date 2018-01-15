@extends('Admins.Extends.common')
@section("zhuti")
<div id="urHere">DouPHP 管理中心<b>></b><strong>添加管理员</strong> </div>   <div id="manager" class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
    <h3><a href="/admin/admin" class="actionBtn">返回列表</a>添加管理员</h3>
            <form action="/admin/admin" method="post">
            {{csrf_field()}}
  <table width="100%" class='table table-hover table-striped table-bordered'>
      
      <tr>
       <td >管理员名称</td>
       <td>
        <input   type="text" name="name" size="40" class="form-control" />
       </td>
      </tr>
 
      <tr>
       <td  >管理员密码</td>
       <td>
        <input   type="password" name="password" size="40" class="form-control" />
       </td>
      </tr>
      <tr>
       <td  >管理员级别</td>
       <td>
        <select name="level"  id='select'  class="inpMain" style='width:240px;'>

            <option value='0'>请选择...</option>
            <option value="2">普通管理员</option>
            <option value="1">超级管理员</option>
        </select>
        <script>
            
           
        </script>
       </td>
      </tr>
 
      <tr>
       
       <td colspan='2'>
        <input type="submit"   id='btn' class="btn btn-success form-control" value="添加" />
       </td>
      </tr>
     </table>
    </form>
                   </div>
 </div>
@endsection