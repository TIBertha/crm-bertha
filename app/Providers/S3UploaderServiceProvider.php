<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\S3Uploader;

class S3UploaderServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton('s3uploader', function () {
            return new S3Uploader();
        });
    }

    public function boot()
    {
        // MUST BE EMPTY
    }

}
