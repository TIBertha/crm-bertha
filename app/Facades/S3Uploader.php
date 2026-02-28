<?php

namespace App\Facades;
use Illuminate\Support\Facades\Facade;


class S3Uploader extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 's3uploader';
    }
}

