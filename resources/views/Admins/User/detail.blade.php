
@extends('Admins.Extends.common')
@section("zhuti")
<br><br>
<a href="/admin/user"><button class='btn btn-success' style='float:right;'>返回列表</button> </a>
 
 <center><h3>{{$res['uid']}} (UID)的个人信息</h3></center>
 
<table class='table table-striped table-bordered table-hover'>
	<tr>
		<th>ID</th>
		<th>积分</th>
		<th>昵称</th>
		<th>邮件</th>
		<th>身份证号</th>
		<th>IP</th>
		<th>地址</th>
		<th>用户ID</th>
	</tr>
	<tr>
		<td>{{$res['id']}}</td>
		<td>{{$res['score']}}</td>
		<td>{{$res['nickname']}}</td>
		<td>{{$res['email']}}</td>
		<td>{{$res['pid']}}</td>
		<td>{{$res['ip']}}</td>
		<td>{{$res['addr']}}</td>
		<td>{{$res['uid']}}</td>
	</tr>

</table>





@endsection