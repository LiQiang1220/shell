@extends('Admins.Extends.common')
@section("zhuti")
<div id="urHere">DouPHP 管理中心<b>></b><strong>编辑商品</strong> </div>   <div class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
            <h3><a href="/admin/good" class="actionBtn">商品列表</a>编辑商品</h3>
    <form action="/admin/good/{{$res['id']}}" method="post" enctype="multipart/form-data" class='form-group'>
    {{csrf_field()}}
    {{method_field('PUT')}}
     <table width="100%" class='table table-striped table-bordered table-hover'>
      <tr>
       <td   >商品名称</td>
       <td>
        <input type="text" name="name" value="{{$res['name']}}"   class="form-control" />
       </td>
      </tr>
      <tr>
       <td >商品分类</td>
       <td>
        <select name="type" >
                          <option   value="0">未分类</option>
                          <option {{$res['type']==1?'selected':''}} value="1"> 电子数码</option>
                          <option {{$res['type']==2?'selected':''}} value="2">- 智能手机</option>
                          <option {{$res['type']==3?'selected':''}} value="3">- 平板电脑</option>
                          <option {{$res['type']==4?'selected':''}} value="4"> 家居百货</option>
                          <option {{$res['type']==5?'selected':''}} value="5"> 母婴用品</option>
        </select>
       </td>
      </tr>
      <tr>
       <td>商品价格</td>
       <td>
        <input type="text" name="price"  value="{{$res['price']}}" size="40" class="form-control" />
       </td>
      </tr>
      <tr>
       <td >简单描述</td>
       <td>
        <input type="text" name="desc" value="{{$res['desc']}}" size="50" class="form-control" />
       </td>
      </tr>
            <tr>
       <td   valign="top">商品内容</td>
       <td>
 
        <textarea id="content" name="content" style="width:780px;height:400px;" class="textArea">{{$res['content']}}</textarea>
       </td>
      </tr>
      <tr>
       <td >缩略图</td>
         <td>
            <input   type="file" name="pic" size="38" class="inpFlie" />
            <img src="{{ltrim($res['pic'],'.')}}" alt="" width='80'>
         </td>
      </tr>
 
      <tr>
       <td></td>
       <td>
    
        <input   class="btn btn-success form-control" type="submit" value="编辑" />
       </td>
      </tr>
     </table>
    </form>
           </div>
 </div>
@endsection