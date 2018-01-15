@extends('Admins.Extends.common')
@section("zhuti")
<div id="urHere">DouPHP 管理中心<b>></b><strong>网站公告</strong> </div>   <div id="manager" class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
    <h3><a href="/admin/notice/create" class="actionBtn">添加公告</a>网站公告</h3>
        <table width="100%"   class="table  table-striped table-bordered table-hover">
    <form action="/admin/notice" method="get" class='form-group' >
 
     <input type="text" name='title' value='' placeholder='请输入搜索内容' class='form-control'>
     <br>
     <input   class="btn btn-success form-control" type="submit" value="搜索" />
    </form>



    <br>
    <br>


     <tr>
      <th></th>
      <th width="30" align="center">编号</th>
      <th align="left">标题</th>
      <th align="center">内容</th>
      <th align="center">添加时间</th>
      <th align="center">更新时间</th>
      <th align="center">发布人id</th>
      <th align="center">操作</th>
     </tr>

     @foreach($res as $v)
     <tr>
      <td><input class='box' type="checkbox" name='checkbox[]' value='{{$v["id"]}}'></td>
      <td align="center">{{$v['id']}}</td>
      <td>{{$v['title']}}</td>
      <td align="center">{{$v['content']}}</td>
      <td align="center">{{$v['created_at']}}</td>
      <td align="center">{{$v['updated_at']}}</td>
      <td align="center">{{$v['aid']}}</td>
      <td align="center"><a href="/admin/notice/{{{$v['id']}}}/edit"><button class='btn btn-info'>编辑</button></a>  

      <!-- <a href="/admin/notice/{{$v['id']}}">删除</a></td> -->
      <input type="button" value='删除' onclick="del({{$v['id']}},$(this))" class='btn btn-danger'>


     </tr>
     @endforeach

      <script>
          function del(id,obj){
              $.post('/admin/notice/'+id,{'_method':'delete','_token':'{{csrf_token()}}'},function(data){
                    if(data == 1){
                        obj.parent().parent().remove();
                        alert('删除成功！');
                    }else{
                        alert('删除失败！');
                    }
              });
          }

      </script> 


         </table>
         
    <div class="action">
      <input  id='qx' type="button" class='btn btn-default' name='qx' value='全选'>
      <input  id='qbx' type="button" class='btn btn-default' name='qbx' value='全不选'>
      <input  id='fx' type="button" class='btn btn-default' name='fx' value='反选'>
 
     <input onclick="del()"  class="btn btn-danger" type="submit" value="执行删除" />
     </div>
     <script>

          // 全选
          $('#qx').click(function(){
              $('.box').prop('checked',true);
          });

          // 全不选
          $('#qbx').click(function(){
              $('.box').prop('checked',false);
          });

          // 反选
          $('#fx').click(function(){
              var a = $('.box:checked');
              $('.box').prop('checked',true);
              a.prop('checked',false);
          });


          function del(){

            var box = $('.box:checked');
            var length = box.length;
            var str='';
            for(var i=0;i<length;i++){
                str = str + ',' + box[i].value;
            }
            $.get('/admin/notice/del/'+str,function(data){
                if(data == 1){
                    $('.box:checked').parent().parent().remove();
                    alert('删除成功！');
                }else{
                    alert('删除失败！');
                }
            });
              
          }


      </script> 
   <center>
    @if(isset($_GET['title']))
         {!!$res->appends(['title'=>$_GET['title']])->render()!!} 
    @else
          {!! $res->render() !!}
    @endif      
   </center>
    
                       </div>
 </div>
@endsection