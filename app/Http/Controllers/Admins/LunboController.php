<?php

namespace App\Http\Controllers\Admins;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Model\lunbo;

class LunboController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        // echo "index";
        $res = lunbo::orderBy('id','asc')->get();
        // dd($res);
        return view('Admins.Lunbo.index',['res'=>$res]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
        return view('Admins.Lunbo.add');
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
      
        $res = $request->all();
        $jieguo = new lunbo;
        $jieguo->link = $res['link'];
        $jieguo->order = $res['order'];
 
        
        // 判断所有的内容都不允许为空
        if($jieguo->link == '' ||  $jieguo->order==''){
            $request->flash();
            echo "<script>alert('不允许有空字段！');location.href='".$_SERVER['HTTP_REFERER']."'</script>";
            return ;
        }

        if($request->hasFile('pic')){
            // echo 'you';
           $pic = $request->file('pic');
           // dd($pic);
            // 获取文件存储路径
           $url = './Uploads/lunbo/'.date('Ymd');

           // 设置文件的新名字
           $name = 'lunbo'.date('YmdHis').rand(10000,99999);
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
            echo "<script>alert('请上传轮播图片！');location.href='".$_SERVER['HTTP_REFERER']."'</script>";
            return ;
        }


        $final = $jieguo->save();
        if($final){
            echo "<script>alert('添加轮播图成功！');location.href='/admin/lunbo'</script>";
        }else{
            echo "<script>alert('添加轮播图失败！');location.href='/admin/lunbo'</script>";
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
        $res = lunbo::find($id);
        // dd($res);

        return view('Admins.Lunbo.edit',['res'=>$res]);
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
        //
        // echo 'update';
        $res = $request->all();
        // dd($res);
        $jieguo = lunbo::find($id);
        $jieguo->link = $res['link'];
        $jieguo->order = $res['order'];
 

        // 执行图片上传函数
         // $this->upload(Request $request);
        if($request->hasFile('pic')){
            // echo 'you';
           $pic = $request->file('pic');
           // dd($pic);
            // 获取文件存储路径
           $url = './Uploads/lunbo/'.date('Ymd');

           // 设置文件的新名字
           $name = 'lunbo'.date('YmdHis').rand(10000,99999);
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
            echo "<script>alert('修改成功！');location.href='/admin/lunbo'</script>";
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
       $res = lunbo::where('id',$id)->delete();
        if($res){
            echo '1';
        }else{
            echo '2';
        }
    }
}
