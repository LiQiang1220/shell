<?php

namespace App\Http\Controllers\Homes;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class GoodsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getList()
    {
        //
        return view('Homes.goods.list');
    }

     
}
