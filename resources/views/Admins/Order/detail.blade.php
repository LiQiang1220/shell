@extends('Admins.Extends.common')
@section("zhuti")
<div id="urHere">DouPHP 管理中心<b>></b><strong>订单详情</strong> </div>   <div class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
 
<a href="/admin/order"><button class='btn btn-success' style='float:right;'>返回列表</button> </a>
<h3> 订单详情</h3>
 

 
        <div id="list">
    
    <table width="100%" class='table table-striped table-bordered table-hover'>
      <tr>
        <th  align="center"><input name='chkall' type='checkbox' id='chkall' onclick='selectcheckbox(this.form)' value='check'></th>
        <th   align="center">编号</th>
        <th   align="left">订单名</th>
        <th  align="center">单价</th>
        <th  align="center">数量</th>
        <th  align="center">总额</th>
        <th  align="center">购买人</th>
        <th  align="center">商品名</th>
        <th  align="center">收货地址</th>
        <th  align="center">创建时间</th>
        <th  align="center">处理时间</th>
        
 
        <th ign="center">状态</th>
      </tr>
     
      <tr>
        <td align="center"><input type="checkbox" name="checkbox[]" value="15" /></td>
        <td align="center">{{$order['id']}}</td>
        <td>{{$order['name']}}</td>
        <td align="center">{{$order['price']}}</td>
        <td align="center">{{$order['num']}}</td>
        <td align="center">{{$order['num']*$order['price']}}</td>
        <td align="center"> {{$phone}} </td>
        <td align="center"> {{$good_name}} </td>


        

        <td align="center">{{$order['addr']}}</td>
        <td align="center">{{$order['created_at']}}</td>
        <td align="center">{{$order['updated_at']}}</td>
        <td align="center" >
            
                <?php
                  if($order['status']==0){
                        echo "<span style='color:red;'>未处理</span>";
                  }else{
                        echo "<span style='color:green;'>已处理</span>";
                  }

               ?>
            <!-- </a>  -->
        </td>
      </tr>
 

 
 
 
           
          </table>
 

    </div>
    <div class="clear"></div>
 

 </div>
  

@endsection