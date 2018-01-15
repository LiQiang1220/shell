@extends('Admins.Extends.common')
@section("zhuti")
<div id="urHere">DouPHP 管理中心<b>></b><strong>编辑管理员信息</strong> </div>   <div id="manager" class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
    <h3><a href="/admin/admin" class="actionBtn">返回列表</a>编辑管理员信息</h3>
            <form action="/admin/admin/{{$res['id']}}" method="post">
            {{csrf_field()}}
            {{method_field('PUT')}}
     <table width="100%" class='table table-hover table-striped table-bordered'>
      
      <tr>
       <td   >管理员名称</td>
       <td>
        <input value="{{$res['name']}}" type="text" name="name" size="40" class="form-control" />
       </td>
      </tr>
 
      <tr>
       <td  >管理员密码</td>
       <td>
        <input value="{{$res['password']}}" type="password" name="password"   class="form-control" />
       </td>
      </tr>
      <tr>
       <td  >管理员级别</td>
       <td>
        <!-- <input value="{{$res['level']}}" type="text" name="level" size="40" class="inpMain" /> -->
        <select name="level" id="">
            <option <?=$res['level']==1?'selected':'' ?> value="1">1</option>
            <option <?=$res['level']==2?'selected':'' ?> value="2">2</option>
        </select>
       </td>
      </tr>
 
      <tr>
        
       <td colspan='2'>
        <input type="submit"   class="btn btn-success form-control" value="编辑" />
       </td>
      </tr>
     </table>
    </form>
                   </div>
 </div>
@endsection