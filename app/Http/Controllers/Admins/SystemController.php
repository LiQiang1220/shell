<?php

namespace App\Http\Controllers\Admins;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Model\system;

class SystemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        // echo 'index..';
        $res = system::first();
        return view('Admins.System.index',['res'=>$res]);
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
        // echo 'store';
        $res = $request->all();
        // dd($_FILES);
        // dd($res);
        $jieguo = system::first();
        $jieguo->title = $res['title'];
        $jieguo->keywords = $res['keywords'];
        $jieguo->description = $res['description'];
        $jieguo->status = $res['status'];
       
       //检测是否有文件logo
        if($request->hasFile('logo')){
            $logo = $request->file('logo');

            // 获取文件的目录
             // $url = public_path().'/uploads/'.date('Ymd');
             $url = './uploads/logo/'.date('Ymd');

             // 获取文件名字
             $name = 'img'.date('YmdHis').rand(10000,99999);
             $houzhui = $logo->getClientOriginalExtension('logo');
             // dd($name);
             $filename = $name.'.'.$houzhui;
             // dd($filename);

             // 执行上传到指定目录，并且重新命名
            $data = $logo->move($url,$filename);

            // 将文件的完整路径赋值给要更新的变量，数据库中的logo
            $jieguo->logo = $url.'/'.$filename;

            // dd($jieguo->logo);

            if($data){
                // echo "<script>alert('上传成功');</script>";
            }else{
                echo "<script>alert('上传失败');</script>";

            }
        }



        $final = $jieguo->save();
        if($final){
            echo "<script>alert('恭喜，修改成功！');location.href='/admin/system'</script>";
        }else{
            echo "<script>alert('抱歉，修改失败！');location.href='/admin/system'</script>";

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
}
