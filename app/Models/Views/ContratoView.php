<?php

namespace App\Models\Views;

use App\Models\Requerimiento;
use Illuminate\Database\Eloquent\Model;

class ContratoView extends Model
{
    protected $table = 'contratos_view';

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function requerimiento()
    {
        return $this->belongsTo(Requerimiento::class, 'requerimientoid');
    }

}
