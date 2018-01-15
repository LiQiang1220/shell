<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|----------`----------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
 
 // 路由不可以使用admin和home，要用加s
Route::get('/',function(){
	return view('welcome');
});

// 后台的路由

// 前台油路开始
Route::group(['prefix'=>'Homes'],function(){

	// 用户模块 
	Route::controller('/user','Homes\UserController');
					// ['create'=>'User.register']
	// 商品模块
	Route::resource('/goods','Homes\GoodsController');
	//验证模块

	//前台登录
	Route::controller('/login', 'Homes\LoginController');	
	Route::post('/dologin','Homes\LoginController@dologin');
	
	//前台注册
	Route::controller('/register','Homes\RegisterController');
	Route::post('/doregister','Homes\RegisterController@doregister');
	
});
//前台改密
Route::get('/changepass','Homes\LoginController@changepass');
//验证码
Route::get('kit/captcha/{tmp}', 'KitController@captcha');
Route::post('/phonecaptcha','Homes\RegisterController@phonecaptcha');
//后台路由组
Route::group(['prefix'=>'admin'],function(){

	
});
