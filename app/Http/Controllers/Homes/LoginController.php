<?php

namespace App\Http\Controllers\Homes;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Model\user;
use Hash;
class LoginController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getLogin()
    {
        //
       return view('Homes.user.login');
         
    }


    public function Dologin(Request $request){
                // echo '123';

           
            // $res = new user;
            // dd($request->all());
            $phone = $request -> input('phone');
            $password = $request -> input('password');
            // dump($phone);
            // dd($password);
            $res = User::where('phone',$phone)->first();
            // dd(User::where('phone',$phone)->first());
            // dump($res);
            if($res){
                    

            }else{
                echo 1;     //未找到账号
                return;
            }
            if(Hash::check($password,$res['password']))
                {
                    session(['phone' => $res['phone']]);
                    echo 0;   //true
                    return;
                }else{
                    echo 3;  //false
                    return;
                }
            }
            // dd($res);

    
    //修改密码
    public function Changepass()
    {
        //
       return view('Homes.user.changepass');
    //  echo "123";
         
    }
}
