@extends('Admins.Extends.common')
@section("zhuti")
<div id="urHere">DouPHP 管理中心<b>></b><strong>添加广告位</strong> </div>   <div id="manager" class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
    <h3><a href="/admin/ad" class="actionBtn">返回列表</a>添加广告位</h3>
            <form action="/admin/ad" method="post" enctype="multipart/form-data">
            {{csrf_field()}}
  <table width="100%" class='table table-striped table-bordered table-hover'>
      
      <tr>
       <td width="100" align="right">广告位名称</td>
       <td>
        <input   type="text" name="name" size="40" class="form-control" value="{{old('name')}}" />
       </td>
      </tr>
 
      <tr>
       <td align="right">广告位链接</td>
       <td>
        <input   type="text" name="link" size="40" class="form-control" value="{{old('link')}}" />
       </td>
      </tr>
      <tr>
       <td align="right">广告位图片</td>
       <td>
        <input   type="file" name="pic" size="40" class="form-control" />
       </td>
      </tr>
      <tr>
       <td align="right">广告位BOSS</td>
       <td>
        <input   type="text" name="ad_boss" size="40" class="form-control"  value="{{old('ad_boss')}}" />
       </td>
      </tr>
 
      <tr>
        
       <td colspan='2'>
        <input type="submit"   class="btn btn-success form-control" value="添加广告位" />
       </td>
      </tr>
     </table>
    </form>
                   </div>
 </div>
@endsection