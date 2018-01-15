@extends('Admins.Extends.common')
@section("zhuti")
<div id="urHere">DouPHP 管理中心<b>></b><strong>编辑轮播图</strong> </div>   <div class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
            <h3><a href="/admin/lunbo" class="actionBtn">轮播图列表</a>编辑轮播图</h3>
    <form action="/admin/lunbo/{{$res['id']}}" method="post" enctype="multipart/form-data" class='form-group'>
    {{csrf_field()}}
    {{method_field('PUT')}}
     <table width="100%" class='table table-striped table-bordered table-hover'>
 
       <tr>
       <td >缩略图</td>
         <td>
            <input   type="file" name="pic" size="38" class="inpFlie" />
            <img src="{{ltrim($res['pic'],'.')}}" alt="图片丢失" width='80'>
         </td>
      </tr>


      <tr>
       <td >轮播图链接</td>
       <td>
        <input type="text" name="link" value="{{$res['link']}}" size="50" class="form-control" />
       </td>
      </tr>
      <tr>
       <td >轮播图排序</td>
       <td>
        <input type="text" name="order" value="{{$res['order']}}" size="50" class="form-control" />
       </td>
      </tr>
 

 
      <tr>
        
       <td colspan='2'>
    
        <input   class="btn btn-success form-control" type="submit" value="编辑轮播图" />
       </td>
      </tr>
     </table>
    </form>
           </div>
 </div>
@endsection