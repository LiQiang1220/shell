<?php

namespace App\Http\Controllers\Admins;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Model\order;
use DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        // $res = order::orderBy('id','asc')->get();
        if(isset($_GET['name'])){
            $res = DB::table('orders')->where('name','like','%'.$_GET['name'].'%')->orderBy('id','asc')->paginate('10');  
        }else{
            $res = DB::table('orders')->orderBy('id','asc')->paginate('10');
        }
        
        return view('Admins.Order.index',['res'=>$res]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        // echo 'show';
        $res = order::find($id);
        if($res['status']==0){
            $res['status']=1;
            $res->save();
            echo "<script>alert('处理成功！');location.href='/admin/order'</script>";
        }else{
            echo "<script>alert('别点了，已经处理了~');location.href='/admin/order'</script>";
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    // 订单购买人
    public function buyer($id){
        $order = order::where('buyer_id',$id)->first();
        
        
            $phone = $order->user->phone;
            // dd($phone);
            if(isset($order)){
                 echo "<script>alert('购买人手机号是：'+$phone);location.href='".$_SERVER['HTTP_REFERER']."'</script>";

            }else{
                 echo "<script>alert('暂无信息');location.href='".$_SERVER['HTTP_REFERER']."'</script>";

            }
       
        
        
        // dd($phone);
       

    }

    // 订单详情
    public function detail($id){
        // echo "detail..";
        $order = order::find($id);
        $phone = $order->user->phone;
        $good_name = $order->good->name;
        return view('Admins.Order.detail',['order'=>$order,'good_name'=>$good_name,'phone'=>$phone]);
    }

    // 批量删除
    public function del($id){
        $str = ltrim($id,',');
        $arr = explode(',',$str);
        $x = '';
        foreach($arr as $v){
            $jieguo = order::find($v)->delete();
            $x += $jieguo;

        }
        if($x){
            echo '1';
        }else{
            echo '0';
        }

    }

}
