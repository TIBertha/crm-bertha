<?php

namespace App\Models\Views;

use Illuminate\Database\Eloquent\Model;

class ContratoView extends Model
{
    protected $table = 'contratos_view';

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}
