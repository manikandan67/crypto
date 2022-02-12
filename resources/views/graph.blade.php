<!DOCTYPE html>
<html>
<head>
<title>Laravel Currency Exchange Rate Calculator - Tutsmake.com</title> 
<meta name="csrf-token" content="{{ csrf_token() }}">
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
<script src="https://code.jquery.com/jquery-3.4.1.js"></script> 
</head>
<body>

<div class="card-header">
Laravel LIVE GRAPH
</div>

<script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
<div class="tradingview-widget-container">
  <div id="tradingview_17f8f"></div>
  <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/USDINR/" rel="noopener" target="_blank"><span class="blue-text">AAPL Chart</span></a> by TradingView</div>
  </div>

</body>
<script type="text/javascript">
     new TradingView.widget(
  {
  "width": 980,
  "height": 610,
  "symbol": "USDINR",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "Light",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "allow_symbol_change": true,
  "container_id": "tradingview_17f8f"
}
  );
<!-- TradingView Widget END -->
</script>
</html>
#laravel #php #web-development #developer #programming

