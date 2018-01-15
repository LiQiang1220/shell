@extends('Admins.Extends.common')
@section("zhuti")


<div id="urHere">DouPHP 管理中心<b>></b><strong>管理员列表</strong> </div>   <div class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
        <h3><a href="/admin/admin/create" class="actionBtn add">添加管理员</a>管理员列表</h3>
    <div class="filter">

<!--     <span>
    <a class="btnGray" href="product.php?rec=re_thumb">更新商品缩略图</a>
        <a class="btnGray" href="product.php?rec=sort">开始筛选首页商品</a>
        </span> -->
    </div>
        <div id="list">
    
    <table width="100%" class='table table-striped table-bordered table-hover'>
      <tr>
        <th width="40" align="center">编号</th>
        <th align="left">管理员</th>
        <th  align="center">密码</th>
        <th  align="center">级别</th>
        <th  align="center">添加时间</th>
        <th  align="center">修改时间</th>
        
 
        <th  align="center">操作</th>
      </tr>
      @foreach($res as $v)
      <tr>
        <!-- <td align="center"><input type="checkbox" name="checkbox[]" value="15" /></td> -->
        <td align="center">{{$v['id']}}</td>
        <td>{{$v['name']}}</td>
        <td align="center">{{md5($v['password'])}}</td>
        <td align="center">
        @if($v['level'] == 1)
                 超级管理员 (表示：1)
        @else
                  普通管理员 (表示：2)
        @endif

        </td>
        <td align="center">{{$v['created_at']}}</td>
        <td align="center">{{$v['updated_at']}}</td>
        <td align="center" >
                   
                       
                         <a href="/admin/admin/{{{$v['id']}}}/edit"><input type="submit" value='编辑' class='btn btn-info'></a> 
                       
                      <input class='del btn btn-danger' type="button" value='删除' onclick="del({{$v['id']}},$(this))"> 

        </td>
      </tr>
      @endforeach
                    <!-- 通过ajax去删除 -->
                      <script>
                          
                         function del(id,obj){
                             $.post("/admin/admin/"+id,{'_method':'delete','_token':'{{csrf_token()}}'},function(data){
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