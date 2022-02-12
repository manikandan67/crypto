<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;

class CurrencyExchangeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return view('currency');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    return view('graph');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        try {
            
        
      $amount = ($request->amount)?($request->amount):(1);
      $apikey = 'aed6e4e8db75f474a7d9';
      $from_Currency = urlencode($request->from_currency);
      $to_Currency = urlencode($request->to_currency);
      $query = "{$from_Currency}_{$to_Currency}";
      $json=file_get_contents("https://free.currconv.com/api/v7/convert?q={$query}&compact=ultra&apiKey={$apikey}");
//dd($json);
      $obj = json_decode($json, true);
      $val = $obj["$query"];
      $total = $val * $amount;

      $formatValue = number_format($total, 2, '.', '');

      $data = "$amount $from_Currency = $to_Currency $formatValue";

      echo $data; die;
      } catch (Exception $e) {

        dd($e->getMessage());
            
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
