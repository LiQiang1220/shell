@extends('Admins.Extends.common')
@section("zhuti")


<div id="urHere">DouPHP 管理中心<b>></b><strong>商品列表</strong> </div>   <div class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
        <h3><a href="/admin/good/create" class="actionBtn add">添加商品</a>商品列表</h3>
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

    <form action="/admin/good" method='get' class='form-group' style='display:inline;width:100%'>
        <input type="text" name='name' class='form-control' placeholder='请输入商品名称'>
         <br>
        <input type="submit" class='form-control btn btn-success' value='搜索' >

    </form>
    <span>
<!--     <a class="btnGray" href="product.php?rec=re_thumb">更新商品缩略图</a>
        <a class="btnGray" href="product.php?rec=sort">开始筛选首页商品</a> -->
        </span>
    </div>
        <div id="list">
    <form name="action" method="post" action="product.php?rec=action">
    <table width="100%" class='table table-striped table-bordered table-hover'>
      <tr>
        <th align="center"><input name='chkall' type='checkbox' id='chkall' onclick='selectcheckbox(this.form)' value='check'></th>
        <th align="center">编号</th>
        <th align="left">商品名称</th>
        <th  align="center">分类</th>
        <th  align="center">价格</th>
        <th  align="center">图片</th>
        <!-- <th  align="center">描述</th> -->
       <th align="center">添加时间</th>
       <th align="center">更新时间</th>
        <th align="center">操作</th>
      </tr>
      @foreach($res as $v)
      <tr>
        <td align="center"><input type="checkbox" name="checkbox[]" value="15" /></td>
        <td align="center">{{$v['id']}}</td>
        <td>{{$v['name']}}</td>
        <td align="center">{{$v['type']}}</td>
        <td align="center">{{$v['price']}}</td>
        <td align="center"><img src="{{ltrim($v['pic'],'.')}}" alt="文件丢失" width='65px'></td>

        <td align="center">{{$v['created_at']}}</td>
        <td align="center">{{$v['updated_at']}}</td>
        <td align="center">
                  <!-- <a href="product.php?rec=edit&id=15">编辑 |  -->
                  <input type="button" class='btn btn-info' value='编辑' onclick="location.href='/admin/good/{{$v['id']}}/edit'">

                  <!-- <a href="/admin/good/{{$v['id']}}">删除</a> -->
                  <input type="button"  class='btn btn-danger ' value='删除' onclick="del({{$v['id']}},$(this))">
                  <script>
                      function del(id,obj){
                        // alert(1);
                          $.post('/admin/good/'+id,{'_method':'delete','_token':'{{csrf_token()}}'},function(data){
                              if(data == 1){
                                  obj.parent().parent().remove();
                                  alert('删除成功！');
                              }else{
                                alert('删除失败！');
                              }
                          });  


                      }

                  </script>
                 </td>
      </tr>
      @endforeach
 
           
          </table>
    <div class="action">
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
    </div>
    </form>
    </div>
    <div class="clear"></div>
    <!-- <div class="pager">总计 15 个记录，共 1 页，当前第 1 页 | <a href="product.php?page=1">第一页</a> 上一页 下一页 <a href="product.php?page=1">最末页</a></div>               </div> -->
   <center> 
    @if(isset($_GET['name']))
   {!! $res->appends('name',$_GET['name'])->render()  !!}
    @else
   {!! $res->render()  !!}
   @endif

   </center>

 </div>
  

@endsection