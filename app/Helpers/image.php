<?php

use Intervention\Image\Image;


function base64ImageHasDimensions(string $base64, int $width, int $height): bool
{
    try {
        // Remove "data:image/png;base64," prefix if present
        if (str_contains($base64, ',')) {
            $base64 = explode(',', $base64)[1];
        }

        $imageData = base64_decode($base64);

        if (!$imageData) {
            return false;
        }

        $img = Image::make($imageData);

        return $img->width() === $width && $img->height() === $height;

    } catch (\Exception $e) {
        return false;
    }
}
