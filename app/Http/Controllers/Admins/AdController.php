<?php

namespace App\Http\Controllers\Admins;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Model\ad;

class AdController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        // echo 'index';
        $res = ad::orderBy('id','asc')->get();
        return view('Admins.Ad.index',['res'=>$res]);
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
        return view('Admins.Ad.add');
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
        $res = $request->all();
        // dd($res);
        $jieguo = new ad;
        $jieguo->name=$res['name'];
        $jieguo->link=$res['link'];
        $jieguo->ad_boss=$res['ad_boss'];

        // 判断所有的内容都不允许为空
        if($jieguo->name == '' || $jieguo->link=='' || $jieguo->ad_boss==''){
            $request->flash();
            echo "<script>alert('不允许有空字段！');location.href='".$_SERVER['HTTP_REFERER']."'</script>";
            return ;
        }

        // 判断是否上传图片
        if($request->hasFile('pic')){
            // echo 'you';
           $pic = $request->file('pic');
           // dd($pic);
            // 获取文件存储路径
           $url = './Uploads/ad/'.date('Ymd');

           // 设置文件的新名字
           $name = 'ads'.date('YmdHis').rand(10000,99999);
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
            echo "<script>alert('请上传广告位图片！');location.href='".$_SERVER['HTTP_REFERER']."'</script>";
            return ;
        }

        // 执行添加操作
        $final = $jieguo->save();
        if($final){
            echo "<script>alert('添加广告位成功！');location.href='/admin/ad'</script>";
        }else{
            echo "<script>alert('添加广告位失败！');location.href='".$_SERVER['HTTP_REFERER']."'</script>";
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
        $res = ad::find($id);
        return view('Admins.Ad.edit',['res'=>$res]);
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
        //
        // echo 'update';
        $res = $request->all();
        // dd($res);
        $jieguo = ad::find($id);
        $jieguo->name = $res['name'];
        $jieguo->ad_boss = $res['ad_boss'];
        $jieguo->link = $res['link'];
        

        // 执行图片上传函数
         // $this->upload(Request $request);
        if($request->hasFile('pic')){
            // echo 'you';
           $pic = $request->file('pic');
           // dd($pic);
            // 获取文件存储路径
           $url = './Uploads/ad/'.date('Ymd');

           // 设置文件的新名字
           $name = 'ads'.date('YmdHis').rand(10000,99999);
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
            echo "<script>alert('修改成功！');location.href='/admin/ad'</script>";
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
        // echo 'destroy';
        $res = ad::where('id',$id)->delete();
        if($res){
            echo '1';
        }else{
            echo '0';
        }

    }
}
