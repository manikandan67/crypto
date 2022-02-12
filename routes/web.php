<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CurrencyExchangeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


 
Route::controller(CurrencyExchangeController::class)->group(function () {
    Route::get('currency','index')->name('currency');
   Route::post('currency','store')->name('exchange');
   Route::get('graph','create')->name('graph');
});

Route::get('/', function () {
    return view('welcome');
});
