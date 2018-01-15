<?php

namespace App\Http\Controllers\Admins;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Model\notice;
use DB;
class NoticeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //判断一下，不能让搜索内容为 请选择
        // if(isset($_GET['title']) && $_GET['title'] ==0){
        //     echo "<script>alert('请选择搜索项');</script>";
        // }

        if(isset($_GET['title']) && $_GET['title'] != ''){
            $res = DB::table('notices')->where('title','like','%'.$_GET['title'].'%')->orderBy('id','asc')->paginate('5');
        }else{
            $res = DB::table('notices')->orderBy('id','asc')->paginate('5');
        }

         
        
        // dd($res);
        return view("Admins.Notice.index",['res'=>$res]);
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
        return view('Admins.Notice.add');
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
        $res = new notice;
        // dd($res);
        $jieguo = $request->all();
        // dd($jieguo);
        $res->title = $jieguo['title'];
        $res->content = $jieguo['content'];
        $res->aid = session('admin_id');
        $aaa = $res->save(); 
        if($aaa){
            echo "<script>alert('恭喜，添加公告成功！');location.href='/admin/notice'</script>";
        }else{
            echo "<script>alert('抱歉，添加公告失败！');location.href='".$_SERVER['HTTP_REFERER']."'</script>";

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
        $res = notice::find($id);
        return view('Admins.notice.edit',['res'=>$res]);
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
        $jieguo = notice::find($id);
        $jieguo->title = $res['title'];
        $jieguo->content = $res['content'];
        $jieguo->aid = session('admin_id');
        $aaa = $jieguo->save();
        if($aaa){
            echo "<script>alert('恭喜，修改成功！');location.href='/admin/notice'</script>";
        }else{
            echo "<script>alert('抱歉，修改失败！');location.href='".$_SERVER['HTTP_REFERER']."'</script>";

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
        $res = notice::where('id',$id)->delete();
        if($res){
            // echo "<script>alert('恭喜，删除公告成功！');location.href='/admin/notice'</script>";
            echo 1;

        }else{
            // echo "<script>alert('抱歉，删除公告失败！');location.href='".$_SERVER['HTTP_REFERER']."'</script>";
            echo 0;

        }


    }

// 公告批量删除
    public function del($id)
    {   
          $str = ltrim($id,',');  
          $arr = explode(',',$str);
          foreach($arr as $v){
                $x = notice::find($v)->delete();
          }
          if($x){
                echo '1';
          }else{
                echo '0';
          }
    }
}
