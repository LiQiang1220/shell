<?php

namespace App\Http\Controllers\Homes;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Model\goods;

class UserController extends Controller
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

    public function getRegister(){
        $res = goods::get();
        dd($res);
        return view('Homes.user.register');
    }
    
        
}
