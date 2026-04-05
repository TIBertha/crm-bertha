<?php

namespace App\Models\Views;

use App\Models\Views\DistritoView;
use App\Models\TipoDescanso;
use App\Models\DiaSemana;
use Illuminate\Database\Eloquent\Model;

class RequerimientoView extends Model
{
    protected $table = 'requerimientos_view';

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function distritoView()
    {
        return $this->belongsTo(DistritoView::class, 'distrito_domicilioid', 'id');
    }

    public function tipoDescanso()
    {
        return $this->belongsTo(TipoDescanso::class, 'tiempo_cuarentena', 'id');
    }

    public function diaSalida()
    {
        return $this->belongsTo(DiaSemana::class, 'dia_salida', 'id');
    }

    public function diaRetorno()
    {
        return $this->belongsTo(DiaSemana::class, 'dia_ingreso', 'id');
    }

    public function requerimiento()
    {
        return $this->belongsTo(RequerimientoView::class, 'requerimiento_id');
    }


}
