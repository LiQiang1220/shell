<?php

namespace App\Http\Controllers\Admins;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Model\admin;



class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $res = admin::orderBy('id','asc')->get();
        // dump($res);
        return view('Admins.Admin.admin',['res'=>$res]);

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
        return view('Admins.Admin.addmanager');
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
       $res = $request->except(['_token']);
       $jieguo = new admin;
       $jieguo->name = $res['name'];
       $jieguo->password = $res['password'];
       $jieguo->level = $res['level'];
       if($res['level'] == 0){
            echo "<script>alert('请填写管理员级别');location.href='".$_SERVER['HTTP_REFERER']."'</script>";
            return ;

       }
      $aaa =  $jieguo->save();
      if($aaa){
            echo "<script>alert('恭喜，添加成功！');location.href='/admin/admin'</script>";
      }else{
            echo "<script>alert('抱歉，添加失败！');location.href='".$_SERVER['HTTP_REFERER']."'</script>";

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
        $res = admin::find($id);
        return view('Admins.Admin.editmanager',['res'=>$res]);


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
        // echo "update页面";
        $res = $request->except(['_token','_method']);
        // var_dump($res);
        $jieguo = admin::find($id);
                // var_dump($jieguo);

        $jieguo->name = $res['name'];
        $jieguo->password = $res['password'];
        $jieguo->level = $res['level'];
       $aaa =  $jieguo->save();
        if($aaa){
            echo "<script>alert('恭喜，修改成功！');location.href='/admin/admin'</script>";
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
        
        $res = admin::find($id);
       $jieguo = $res->delete();
 

       if($jieguo){
            $data = 1;
       }else{
            $data = 0;
       }

       echo $data;
        

   }
}
