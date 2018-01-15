<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
 
 



// 后台登录
	Route::group(['middleware'=>'delete_session'],function(){
		Route::resource('/admin/login','Admins\LoginController');
	});
		

// 后台退出

	Route::resource('/admin/logout','Admins\LogoutController');

//购买者手机号
	Route::get('/admin/order/buyer/{id}','Admins\OrderController@buyer');

// 订单详情
	Route::get('/admin/order/detail/{id}','Admins\OrderController@detail');	

//订单批量删除
	Route::get('/admin/order/del/{id}','Admins\OrderController@del');

// 公告批量删除
	Route::get('/admin/notice/del/{id}','Admins\NoticeController@del');


// 后台路由组
Route::group(['prefix'=>'/admin','middleware'=>'login'],function(){



	// 后台首页
	Route::resource('/index','Admins\IndexController');

	// 系统设置
	Route::resource('system','Admins\SystemController');

	// 商品
	Route::resource('/good','Admins\GoodController');



	// 管理员
	Route::resource('/admin','Admins\AdminController');
	// 用户
	Route::resource('/user','Admins\UserController');	

	// 用户详情
	Route::resource('/users_info','Admins\Users_infoController');

	// 公告notice
	Route::resource('/notice','Admins\NoticeController');

	// 订单
	Route::resource('/order','Admins\OrderController');

	// 广告位
	Route::resource('/ad','Admins\AdController');

	//轮播图
	Route::resource('/lunbo','Admins\LunboController');


});
