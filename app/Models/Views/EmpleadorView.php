<?php

namespace App\Models\Views;

use Illuminate\Database\Eloquent\Model;

class EmpleadorView extends Model
{
    protected $table = 'empleadores_view';

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function scopeActivo($query, $flag) {
        return $query->where('activo', $flag);
    }

}
