<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class user extends Model
{
    //定义模型关系 一对一
    public function users_info(){
    	// 定义外键
    	return $this->hasOne('App\Model\users_info','uid');
    }
}
