@extends('Admins.Extends.common')
@section("zhuti")
<div id="urHere">DouPHP 管理中心<b>></b><strong>添加商品</strong> </div>   <div class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
            <h3><a href="/admin/good" class="actionBtn">商品列表</a>添加商品</h3>
    <form action="/admin/good" method="post" enctype="multipart/form-data" class='form-group'>
    {{csrf_field()}}
     <table width="100%" class='table table-striped table-bordered table-hover'>
      <tr>
       <td   >商品名称</td>
       <td>
        <input type="text" name="name" value="{{old('name')}}"   class="form-control" />
       </td>
      </tr>
      <tr>
       <td >商品分类</td>
       <td>
        <select name="type" >
                          <option value="0">未分类</option>
                          <option value="1"> 电子数码</option>
                          <option value="4">- 智能手机</option>
                          <option value="5">- 平板电脑</option>
                          <option value="2"> 家居百货</option>
                          <option value="3"> 母婴用品</option>
        </select>
       </td>
      </tr>
      <tr>
       <td>商品价格</td>
       <td>
        <input type="text" name="price"  value="{{old('price')}}" size="40" class="form-control" />
       </td>
      </tr>
      <tr>
       <td >简单描述</td>
       <td>
        <input type="text" name="desc" value="{{old('desc')}}" size="50" class="form-control" />
       </td>
      </tr>
            <tr>
       <td   valign="top">商品内容</td>
       <td>
 
        <textarea id="content" name="content" style="width:780px;height:400px;" class="textArea">{{old('content')}}</textarea>
       </td>
      </tr>
      <tr>
       <td >缩略图</td>
         <td>
            <input   type="file" name="pic" size="38" class="inpFlie" />
         </td>
      </tr>
 
      <tr>
       <td></td>
       <td>
    
        <input   class="btn btn-success form-control" type="submit" value="提交" />
       </td>
      </tr>
     </table>
    </form>
           </div>
 </div>
@endsection