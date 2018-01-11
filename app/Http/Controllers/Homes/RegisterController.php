<?php

namespace App\Http\Controllers\Homes;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Model\user;


class RegisterController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getRegister(){
        
        // $config = [
        //     'accessKeyId'    => 'LTAIfutjoO1bxWJl',
        //     'accessKeySecret' => 'Iyd2DTiaX3LeGh1b3crysnfp4jDX4Z',
        // ];
        
        // $client  = new Client($config);
        // $sendSms = new SendSms;
        // $sendSms->setPhoneNumbers('15301166673');
        // $sendSms->setSignName('小李的店');
        // $sendSms->setTemplateCode('SMS_120375820');
        // $sendSms->setTemplateParam(['code' => rand(100000, 999999)]);
        // $sendSms->setOutId('demo');
        
        // // print_r($client->execute($sendSms));
        
        // //验证码
        
        // function re_captcha() { 
        //     $url = "{{ URL('kit/captcha') }}"; 
        //     $url = $url + "/" + Math.random(); 
        //     $url = document.getElementById('c2c98f0de5a04167a9e427d883690ff6').src ; 
        // }
        return view('Homes.user.register');
        
    }
    public function doregister(Request $request)
    {
        // dd('123');
        // $input = $request -> all();
        $res = new user;
       $phone = $request-> input('formBean_username');
       $password = $request-> input('checkPassword');
        // var_dump($phone);
        // var_dump($password);
    // dd($input);
    //   dd($input->username);

    // $res = user::get();
    
    $res -> phone = $phone;
    $res -> password = md5($password);
    $res ->save();
    return view('Homes.user.login');
    
       
    }
}
