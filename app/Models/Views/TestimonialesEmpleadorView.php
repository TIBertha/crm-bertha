<?php

namespace App\Models\Views;

use Illuminate\Database\Eloquent\Model;

class TestimonialesEmpleadorView extends Model
{
    protected $table = 'testimoniales_view';

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }
}
