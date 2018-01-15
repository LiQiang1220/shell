@extends('Admins.Extends.common')
@section("zhuti")


<div id="urHere">DouPHP 管理中心<b>></b><strong>广告位列表</strong> </div>   <div class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
        <h3><a href="/admin/ad/create" class="actionBtn add">添加广告位</a>广告位列表</h3>
    <div class="filter">
<!--     <form action="product.php" method="post">
     <select name="cat_id">
      <option value="0">未分类</option>
                  <option value="1"> 电子数码</option>
                        <option value="4">- 智能手机</option>
                        <option value="5">- 平板电脑</option>
                        <option value="2"> 家居百货</option>
                        <option value="3"> 母婴用品</option>
                 </select>
     <input name="keyword" type="text" class="inpMain" value="" size="20" />
     <input name="submit" class="btnGray" type="submit" value="筛选" />
    </form> -->
 
    </div>
        <div id="list">
    
    <table width="100%" class='table table-striped table-bordered table-hover'>
      <tr>
        <!-- <td  align="center"><input name='chkall' type='checkbox' id='chkall' onclick='selectcheckbox(this.form)' value='check'></td> -->
        <td  align="center">编号</td>
        <td  align="center">广告位名称</td>
        <td  align="center">广告位链接</td>
        <td  align="center">广告位图片</td>
        <td  align="center">广告位老板</td>
        
 
        <td   align="center">操作</td>
      </tr>
      @foreach($res as $v)
      <tr>
        <!-- <td align="center"><input type="checkbox" name="checkbox[]" value="15" /></td> -->
        <td align="center">{{$v['id']}}</td>
        <td align="center">{{$v['name']}}</td>
        <td align="center">{{$v['link']}}</td>
        <td align="center"><img width='80px' src="{{ltrim($v['pic'],'.')}}" alt="图片丢失"></td>
        <td align="center">{{$v['ad_boss']}}</td>
        <td align="center" >
                   
                       
                         <a href="/admin/ad/{{{$v['id']}}}/edit"><input type="submit" value='编辑' class='btn btn-info'></a> 
                       
                      <input class='btn btn-danger' type="button" value='删除' onclick="del({{$v['id']}},$(this))"> 

        </td>
      </tr>
      @endforeach
                    <!-- 通过ajax去删除 -->
                      <script>
                          
                         function del(id,obj){
                             $.post("/admin/ad/"+id,{'_method':'delete','_token':'{{csrf_token()}}'},function(data){
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
<!--     <div class="action">
     <select name="action" onchange="douAction()">
      <option value="0">请选择...</option>
      <option value="del_all">删除</option>
      <option value="category_move">移动分类至</option>
     </select>
     <select name="new_cat_id" style="display:none">
      <option value="0">未分类</option>
                  <option value="1"> 电子数码</option>
                        <option value="4">- 智能手机</option>
                        <option value="5">- 平板电脑</option>
                        <option value="2"> 家居百货</option>
                        <option value="3"> 母婴用品</option>
                 </select>
     <input name="submit" class="btn" type="submit" value="执行" />
    </div> -->

    </div>
    <div class="clear"></div>
 </div>
  

@endsection