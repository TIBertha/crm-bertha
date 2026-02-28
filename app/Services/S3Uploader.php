<?php

namespace App\Services;
use Illuminate\Support\Facades\Storage;


class S3Uploader
{
    public function upload($file, $path)
    {
        return Storage::disk('s3')->put($path, $file);
    }

    public function delete($path)
    {
        return Storage::disk('s3')->delete($path);
    }

    public function put($path, $file, $visibility = 'public')
    {
        return Storage::disk('s3')->put($path, $file, $visibility);
    }

    public function url($path)
    {
        return Storage::disk('s3')->url($path);
    }

}

