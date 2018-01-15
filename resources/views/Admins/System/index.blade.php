@extends('Admins.Extends.common')
@section("zhuti")

    <!-- 当前位置 -->
<div id="urHere">DouPHP 管理中心<b>></b><strong>系统设置</strong> </div>   <div class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
    <h3>系统设置</h3>
 
    <div class="idTabs">
 
      <div class="items">
       <form action="/admin/system" method="post" enctype="multipart/form-data" class='form-group'>
        <div id="main">
        {{csrf_field()}}
        <table width="100%" class='table table-striped table-hover table-bordered'>
         <tr>
           <th  >名称</th>
           <th>内容</th>
         </tr>
 
                  <tr>
          <td  >站点标题</td>
          <td>
                      <input type="text" name="title" value="{{$res['title']}}" size="80" class="form-control" />
                                </td>
         </tr>
                  <tr>
          <td  >站点关键字</td>
          <td>
                      <input type="text" name="keywords" value="{{$res['keywords']}}" size="80" class="form-control" />
                                </td>
         </tr>
                  <tr>
          <td  >站点描述</td>
          <td>
                      <input type="text" name="description" value="{{$res['description']}}" size="80" class="form-control" />
                                </td>
         </tr>
                  <tr>
          <td  >站点LOGO</td>
          <td>
                      <input type="file" name="logo" size="18" />
           <img src="{{ ltrim($res['logo'],'.') }}">                                </td>
           <!-- <img src="/uploads/20180112/img2018011217254914704.png">  
                                         </td> -->
         </tr>
 
         <tr>
                <td align="right">是否关闭网站</td>
          		<td>
                      <label for="a"> <input type="radio" name="status" id="a" value="0" {{ $res['status']==0?'checked':'' }}> 否</label>
      				  <label for="b"> <input type="radio" name="status" id="b" value="1" {{ $res['status']==1?'checked':'' }} > 是</label>
          		</td>
         </tr>
   
                   
  
 
                 </table>
        </div>
  
                                 
                  
                 </table>
        </div>
                <table width="100%" border="0" cellpadding="8" cellspacing="0" class="tableBasic">
         <tr>
         <!--  <td width="131"></td> -->
          <td>
           <input   class="form-control btn btn-success" type="submit" value="修改" />
          </td>
         </tr>
        </table>
        </form>
      </div>
    </div>
   </div>
 </div>
 

@endsection