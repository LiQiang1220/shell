@extends('Admins.Extends.common')
@section("zhuti")


<div id="urHere">DouPHP 管理中心<b>></b><strong>轮播图列表</strong> </div>   <div class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
        <h3><a href="/admin/lunbo/create" class="actionBtn add">添加轮播图</a>轮播图列表</h3>
    <div class="filter">

 
    </div>
        <div id="list">
    
    <table width="100%" class='table table-striped table-bordered table-hover'>
      <tr>
        <th   align="center">编号</th>
        <th  >图片</th>
        <th   >链接</th>
        <th   >排序</th>
        <th   >添加时间</th>
        <th   >修改时间</th>
        
 
        <th  align="center">操作</th>
      </tr>
      @foreach($res as $v)
      <tr>
         <td align="center">{{$v['id']}}</td>
         <td><img src="{{ltrim($v['pic'],'.')}}" alt="图片丢失" width='80'></td>
         <td align="center">{{$v['link']}}</td>
         <td align="center">{{$v['order']}}</td>
         <td align="center">{{$v['created_at']}}</td>
         <td align="center">{{$v['updated_at']}}</td>
         <td align="center" >
            <a href="/admin/lunbo/{{$v['id']}}/edit"><input type="submit" value='编辑' class='btn btn-info'></a> 
            <input class='del btn btn-danger' type="button" value='删除' onclick="del({{$v['id']}},$(this))"> 
          </td>
      </tr>
      @endforeach

                    <!-- 通过ajax去删除 -->
                      <script>
                          
                         function del(id,obj){
                             $.post("/admin/lunbo/"+id,{'_method':'delete','_token':'{{csrf_token()}}'},function(data){
                                if(data == 1){
                                    obj.parent().parent().remove();
                                    
                                    alert('删除成功！');
                                }else if(data == 0){
                                    alert('删除失败！');
                                }
                             });
                          }

                      </script>
           
          </table>


    </div>
    <div class="clear"></div>
 </div>
  

@endsection