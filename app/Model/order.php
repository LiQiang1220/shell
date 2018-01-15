<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class order extends Model
{
    //一对一的属于关系
    public function user(){

    	// 属于关系
    	return $this->belongsTo('App\Model\user','buyer_id');
    }


    //一对一的属于关系
    public function good(){

    	// 属于关系
    	return $this->belongsTo('App\Model\good','gid');
    }
}
