 
@extends('Admins.Extends.common')
@section("zhuti")
<div id="urHere">DouPHP 管理中心<b>></b><strong>用户管理</strong> </div>   <div id="manager" class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
    <h3> 用户管理</h3>
<form action="/admin/user" method='get' >
    <input type="text" name='phone' value='' placeholder="请输入手机号" class='form-control'>
    <br>
    <input type="submit" value='搜索' class='form-control btn btn-success'>
</form>        

        <table width="100%" class='table table-hover table-bordered table-striped' >
      <tr>
      <th   >编号</th>
      <th  >手机号</th>
      <th  >密码</th>
      <th  >详情</th>
    
     </tr>
     @foreach($res as $v)
         
              <tr>
                  <td align="center">{{$v['id']}}</td>
                   <td align="center"> {{$v['phone']}} </td> 
                  <td align="center">{{$v['password']}}</td>
                  <td align="center"><a href="/admin/user/{{$v['id']}}">查看详情</a></td>
              </tr>
         
      @endforeach    
     </table>
                       </div>
                    <center>  
                      
 @if(isset($_GET['phone']))

 {!!$res->appends(['phone'=>$_GET['phone']])->render()!!}
@else

{!! $res->render() !!}

@endif
                      </center>
 </div>
@endsection