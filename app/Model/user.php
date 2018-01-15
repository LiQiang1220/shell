<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class user extends Model
{
<<<<<<< HEAD
    //
=======
    //定义模型关系 一对一
    public function users_info(){
    	// 定义外键
    	return $this->hasOne('App\Model\users_info','uid');
    }
>>>>>>> 0a21419c72fa2261a5e71228c8b21376a7e1fc4d
}
