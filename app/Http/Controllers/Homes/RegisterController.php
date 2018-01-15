<?php

namespace App\Http\Controllers\Homes;

use Illuminate\Http\Request;
use Flc\Dysms\Client;
use Flc\Dysms\Request\SendSms;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Session;
use Gregwar\Captcha\CaptchaBuilder;
use App\Model\user;
use Hash;

class RegisterController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getRegister(){
        
       
        
        // //验证码
        
        function re_captcha() { 
            $url = "{{ URL('kit/captcha') }}"; 
            $url = $url + "/" + Math.random(0,99999); 
            $url = document.getElementById('c2c98f0de5a04167a9e427d883690ff6').src ; 
        }
        return view('Homes.user.register');
        
    }
    public function doregister(Request $request)
    {
        
        
        
           $phone = $request-> input('phone');
       $password = $request-> input('password');
        $codew = $request -> input('code');
        $codea = $request -> session() ->get('codea');

        // echo $codew;
        
        // echo $codea;
        // if($codew == $codea){

        // }
       $res2 = user::where('phone',$phone)->first();
       $res = new user;
       $res -> phone = $phone;
       $res -> password = Hash::make($password);
       $res ->save();   
       if($res2)
        {
            echo 1; //
            return;          
        }
        if($codew!=$codea){
            echo 3;
            return;
        }else{
            echo 2;
            return;
        }
      
       
        return view('Homes.user.login') ;
    
       
    }
    public function captcha($tmp)
    {
        //生成验证码图片的Builder对象，配置相应属性
        $builder = new CaptchaBuilder;
        //可以设置图片宽高及字体
        // $builder = $builder->build();
       $builder->build($width = 100, $height = 40, $font = null);
        //获取验证码的内容
       $phrase = $builder->getPhrase() ;
        // dd($phrase);
        //把内容存入session
        Session::flash('milkcaptcha', $phrase);
        
        //生成图片
        header("Cache-Control: no-cache, must-revalidate");
        header('Content-Type: image/jpeg');
        return $builder->output();
        // dd($builder);        
    }

    public function phonecaptcha(Request $request )
    {
        $phone = $request -> input('phone');
        // dd($phone);
        $config = [
            'accessKeyId'    => 'LTAIHQ5ir36SAzt3',
            'accessKeySecret' => 'm4Y7ofvn8bzwg9RtWj1aSbHDfDRcX0',
        ];
        
        $client  = new Client($config);
        $sendSms = new SendSms;
        $sendSms->setPhoneNumbers($phone);
        $sendSms->setSignName('小李的店');
        $sendSms->setTemplateCode('SMS_120375820');
        $num = rand(100000, 999999);
        $request -> session() ->put('codea',$num);
        $sendSms->setTemplateParam(['code' => $num]);
        $sendSms->setOutId('demo');
        
        print_r($client->execute($sendSms));
        
        

    }


}
