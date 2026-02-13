<?php

namespace App\Models\Views;

use Illuminate\Database\Eloquent\Model;

class RequerimientoView extends Model
{
    protected $table = 'requerimientos_view';

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}