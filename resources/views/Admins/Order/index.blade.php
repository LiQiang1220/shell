@extends('Admins.Extends.common')
@section("zhuti")


<div id="urHere">DouPHP 管理中心<b>></b><strong>订单列表</strong> </div>   <div class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
        <h3><!-- <a href="/admin/admin/create" class="actionBtn add">添加管理员</a> -->订单列表</h3>
 

    <form action="/admin/order" method='get' class='form-group'>
        <input type="text" name='name' class='form-control' value='' placeholder='请输入订单名'>
        <br>
        <input type="submit" value='搜索' class=' btn btn-success form-control'>

    </form>
<!--     <span>
    <a class="btnGray" href="product.php?rec=re_thumb">更新商品缩略图</a>
        <a class="btnGray" href="product.php?rec=sort">开始筛选首页商品</a>
        </span> -->
    <!-- </div> -->
        <div id="list">
    
    <table width="100%" class='table table-striped table-bordered table-hover'>
      <tr>
        <th  align="center"> </th>
        <th   align="center">编号</th>
        <th   align="left">订单名</th>
        <th  align="center">单价</th>
        <th  align="center">数量</th>
        <th  align="center">总额</th>
        <th  align="center">购买人ID</th>
        <th  align="center">收货地址</th>
        <th  align="center">创建时间</th>
        <th  align="center">处理时间</th>
        <th  align="center">订单详情</th>
        
 
        <th ign="center">状态</th>
      </tr>
      @foreach($res as $v)
      <tr> 
        <td align="center"><input class='box' type="checkbox" name="checkbox[]" value="{{$v['id']}}" /></td>
        <td align="center">{{$v['id']}}</td>
        <td>{{$v['name']}}</td>
        <td align="center">{{$v['price']}}</td>
        <td align="center">{{$v['num']}}</td>
        <td align="center">{{$v['num']*$v['price']}}</td>
        <td id="tt" align="center"><a href="/admin/order/buyer/{{$v['buyer_id']}}">{{$v['buyer_id']}}</a></td>


        

        <td align="center">{{$v['addr']}}</td>
        <td align="center">{{$v['created_at']}}</td>
        <td align="center">{{$v['updated_at']}}</td>
        <td align="center"><a href="/admin/order/detail/{{$v['id']}}">订单详情</a></td>
        <td align="center" >
            <a id='chuli' href='/admin/order/{{$v["id"]}}' >
                <!-- {{$v['status']==0?'未处理':'已处理'}} -->
                <?php
                  if($v['status']==0){
                        echo "<span style='color:red;'>未处理</span>";
                  }else{
                        echo "<span style='color:green;'>已处理</span>";
                  }

               ?>
            </a> 
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
    <div class="action">
  
      &nbsp;<input id='qx' type="button" name='qx' value='全选' class='btn btn-default'>
      &nbsp;<input id='qbx' type="button" name='qbx' value='全不选' class='btn btn-info'>
      &nbsp;<input id='fx' type="button" name='fx' value='反选' class='btn btn-success'>
 
     &nbsp;&nbsp;&nbsp;&nbsp;<input onclick="del()" name="submit" class="btn btn-danger" type="submit" value="执行删除" />
    </div>
    <script>
        $('#qx').click(function(){
            $('.box').prop('checked',true);
            // alert($('input:checked').length);
        });

        $('#qbx').click(function(){
            $('.box').prop('checked',false);
        });

        $('#fx').click(function(){
            var store = $('.box:checked');
            $('.box').prop('checked',true);
            store.prop('checked',false);
        });

        function del(){
          var box = $('.box:checked');
          var length = box.length;
          var str='';
          for(var i=0;i<length;i++){
              str = str + ',' + box[i].value;
          }
          if(str != ''){
           $.get('/admin/order/del/'+str,function(data){
                if(data == 1){
                    $('.box:checked').parent().parent().remove();
                    alert('删除成功！');
                }else{
                    alert('删除失败！');
                }
           });
            
          }

        }


    </script>

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