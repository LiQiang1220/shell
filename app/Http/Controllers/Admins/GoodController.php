<?php

namespace App\Http\Controllers\Admins;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Model\good;
use DB;

class GoodController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
       // $res = good::orderBy('id','asc')->get();
        if(!isset($_GET['name'])){
            $res = DB::table('goods')->orderBy('id','asc')->paginate('5');
        }else{
            $res = DB::table('goods')->where('name','like','%'.$_GET['name'].'%')->orderBy('id','asc')->paginate('5');
        }
        

       return view('Admins.Good.index',['res'=>$res]);

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
        // echo 'create';
        return view('Admins.Good.addgoods');
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
        // echo 'store';
        // dd($_FILES);
        $res = $request->all();
        $jieguo = new good;
        $jieguo->name = $res['name'];
        $jieguo->type = $res['type'];
        $jieguo->price = $res['price'];
        $jieguo->desc = $res['desc'];
        $jieguo->content = $res['content'];
        
        // 判断所有的内容都不允许为空
        if($jieguo->name == '' || $jieguo->type=='0' || $jieguo->price=='' || $jieguo->desc=='' || $jieguo->content == ''){
            $request->flash();
            echo "<script>alert('不允许有空字段！');location.href='".$_SERVER['HTTP_REFERER']."'</script>";
            return ;
        }

        if($request->hasFile('pic')){
            // echo 'you';
           $pic = $request->file('pic');
           // dd($pic);
            // 获取文件存储路径
           $url = './Uploads/pic/'.date('Ymd');

           // 设置文件的新名字
           $name = 'goods'.date('YmdHis').rand(10000,99999);
           // 获取文件的后缀
           $houzhui = $pic->getClientOriginalExtension();
           $arr = array('jpg','png','gif','bmp','jpeg');
           if(!in_array($houzhui,$arr)){
                echo "<script>alert('文件类型不合法！');</script>";
                return ;
           }

           // 文件名为
           $filename = $name.'.'.$houzhui;
           // dd($filename);

           $pic->move($url,$filename);

           $jieguo->pic = $url.'/'.$filename;
        }else{
            $request->flash();
            echo "<script>alert('请上传商品图片！');location.href='".$_SERVER['HTTP_REFERER']."'</script>";
            return ;
        }


        $final = $jieguo->save();
        if($final){
            echo "<script>alert('添加成功！');location.href='/admin/good'</script>";
        }else{
            echo "<script>alert('添加失败！');location.href='/admin/good'</script>";
        }

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
        // echo 'edit';
        $res = good::find($id);
        // dd($res);

        return view('Admins.Good.editgoods',['res'=>$res]);
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
        // echo 'update';
        $res = $request->all();
        // dd($res);
        $jieguo = good::find($id);
        $jieguo->name = $res['name'];
        $jieguo->type = $res['type'];
        $jieguo->price = $res['price'];
        $jieguo->desc = $res['desc'];
        $jieguo->content = $res['content'];

        // 执行图片上传函数
         // $this->upload(Request $request);
        if($request->hasFile('pic')){
            // echo 'you';
           $pic = $request->file('pic');
           // dd($pic);
            // 获取文件存储路径
           $url = './Uploads/pic/'.date('Ymd');

           // 设置文件的新名字
           $name = 'goods'.date('YmdHis').rand(10000,99999);
           // 获取文件的后缀
           $houzhui = $pic->getClientOriginalExtension();
           $arr = array('jpg','png','gif','bmp','jpeg');
           if(!in_array($houzhui,$arr)){
                echo "<script>alert('文件类型不合法！');</script>";
                return ;
           }

           // 文件名为
           $filename = $name.'.'.$houzhui;
           // dd($filename);

           $pic->move($url,$filename);
           $jieguo->pic = $url.'/'.$filename;

        }

        $final = $jieguo->save();
        if($final){
            echo "<script>alert('修改成功！');location.href='/admin/good'</script>";
        }else{
            echo "<script>alert('修改失败！');location.href='".$_SERVER['HTTP_REFERER']."'</script>";
        }


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
        $res = good::where('id',$id)->delete();
        if($res){
            echo '1';
        }else{
            echo '2';
        }
        
    }
}
