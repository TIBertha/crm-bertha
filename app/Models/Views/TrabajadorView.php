<?php

namespace App\Models\Views;

use Illuminate\Database\Eloquent\Model;

class TrabajadorView extends Model
{
    protected $table = 'trabajadores_view';

    public function scopeActivo($query, $flag) {
        return $query->where('activo', $flag);
    }

}