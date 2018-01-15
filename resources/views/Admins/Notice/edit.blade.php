@extends('Admins.Extends.common')
@section("zhuti")
<div id="urHere">DouPHP 管理中心<b>></b><strong>编辑公告</strong> </div>   <div id="manager" class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
    <h3><a href="/admin/notice" class="actionBtn">返回列表</a>编辑公告</h3>
            <form action="/admin/notice/{{$res['id']}}" method="post" class='form-group'>
            {{csrf_field()}}
            {{method_field('PUT')}}
  <table width="100%" class='table table-bordered table-striped table-hover'>
      
      <tr>
       <td width="100" align="right">公告标题</td>
       <td>
        <input   type="text" name="title" size="40" class="form-control"  value="{{$res['title']}}" />
       </td>
      </tr>
 
      <tr>
       <td align="right">公告内容</td>
       <td>
        <textarea    class='form-control' name='content'>{{$res['content']}}</textarea>
       </td>
      </tr>
     <!--  <tr>
       <td align="right">管理员id</td>
       <td> -->
        <input  readonly type="hidden" name="aid" size="40" class="inpMain" />
 <!--       </td>
      </tr> -->
 
      <tr>
       <td></td>
       <td>
        <!-- <input type="hidden" name="token" value="5a58b748" /> -->
        <input type="submit"   class="btn btn-success form-control" value="编辑" />
       </td>
      </tr>
     </table>
    </form>
                   </div>
 </div>
@endsection