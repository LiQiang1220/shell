@extends('Admins.Extends.common')
@section("zhuti")
<div id="urHere">DouPHP 管理中心<b>></b><strong>添加公告</strong> </div>   <div id="manager" class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
    <h3><a href="manager.html" class="actionBtn">返回列表</a>添加公告</h3>
            <form action="/admin/notice" method="post" class='form-group'>
            {{csrf_field()}}
  <table width="100%" class='table table-striped table-hover table-bordered'>
      
      <tr>
       <td width="100" align="right">公告标题</td>
       <td>
        <input   type="text" name="title"   class="form-control" />
       </td>
      </tr>
 
      <tr>
       <td align="right">公告内容</td>
       <td>
        <textarea   class="form-control"   name='content'></textarea>
       </td>
      </tr>
     <!--  <tr> -->
       <!-- <td align="right">管理员id</td> -->
       <!-- <td> -->
        <input  readonly type="hidden" name="aid"    />
       <!-- </td> -->
      <!-- </tr> -->
 
      <tr>
       <td></td>
       <td>
        <!-- <input type="hidden" name="token" value="5a58b748" /> -->
        <input type="submit"   class="btn btn-success form-control"   value="添加" />
       </td>
      </tr>
     </table>
    </form>
                   </div>
 </div>
@endsection