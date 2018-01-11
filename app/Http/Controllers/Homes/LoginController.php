<?php

namespace App\Http\Controllers\Homes;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Model\user;

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
    $phone = $request -> input('userAccount');
    $password = $request -> input('password');
    dump($phone);
    dd($password);
    // $res = user::get();
    // dump($res);        
    // $phone = $request-> input('formBean_username');
    // $password = $request-> input('checkPassword');
    }

    
}
