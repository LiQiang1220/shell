<?php

namespace App\Http\Controllers\Admins;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Model\admin;

class LoginController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        // echo 'login';
        return view('Admins.Login.index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
        echo 'create';
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

        $name = $request->input('name');
        $password = $request->input('password');
        // dd($name);
        $jieguo = admin::where('name',$name)->where('password',$password)->first();
        if($jieguo){
             session(['admin_id'=>$jieguo['id'],'admin_name'=>$jieguo['name'],'admin_level'=>$jieguo['level']]);
            // if($jieguo['level'] == 1){
            //      echo "<script>alert('恭喜，登录成功！');location.href='/admin/index'</script>";

            // }else{
            //      echo "<script>alert('恭喜，登录成功！');location.href='/admin/shouye'</script>";

            // }
             echo "<script>alert('恭喜，登录成功！');location.href='/admin/index'</script>";
        }else{
            echo "<script>alert('抱歉，登录失败！');location.href='".$_SERVER['HTTP_REFERER']."'</script>";

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
