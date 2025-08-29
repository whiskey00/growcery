<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Maintenance mode
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Autoload
require __DIR__.'/../growcery/vendor/autoload.php';

// ⬇️ Fix Laravel's public path BEFORE app is loaded
$app = require_once __DIR__.'/../growcery/bootstrap/app.php';

$app->bind('path.public', function () {
    return __DIR__;
});

// Run the request
$app->handleRequest(Request::capture());
