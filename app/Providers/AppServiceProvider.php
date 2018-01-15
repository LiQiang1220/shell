<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Model\admin;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
         //视图间共享数据
        // view()->share('shouye','aaa');

        //  $shouye = admin::where('id',session('admin_id'))->first();
        // view()->composer('*',function($view){
        //     $view->with('shouye',array('name'=>session('admin_id'),'level'=>'level'));
        // });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
