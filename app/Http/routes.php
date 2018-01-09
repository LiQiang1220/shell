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
	return '<center ><h1>欢迎访问首页</h1></center>';
});

// 后台的路由

// 前台油路开始
Route::group(['prefix'=>'homes'],function(){

	// 用户模块 
	Route::controller('/user','homes\UserController');

	// 商品模块
	Route::controller('/goods','homes\GoodsController');

});

//后台路由组
Route::group(['prefix'=>'admins'],function(){

	
});
