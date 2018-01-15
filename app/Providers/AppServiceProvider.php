<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
<<<<<<< HEAD
=======
use App\Model\admin;
>>>>>>> 0a21419c72fa2261a5e71228c8b21376a7e1fc4d

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
<<<<<<< HEAD
        //
=======
         //视图间共享数据
        // view()->share('shouye','aaa');

        //  $shouye = admin::where('id',session('admin_id'))->first();
        // view()->composer('*',function($view){
        //     $view->with('shouye',array('name'=>session('admin_id'),'level'=>'level'));
        // });
>>>>>>> 0a21419c72fa2261a5e71228c8b21376a7e1fc4d
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
