<?php

namespace App\Models\Views;

use App\Models\CambioEstatusTrabajador;
use App\Models\Pais;
use Illuminate\Database\Eloquent\Model;

class TrabajadorView extends Model
{
    protected $table = 'trabajadores_view';

    public function scopeActivo($query, $flag) {
        return $query->where('activo', $flag);
    }

    public function distrito()
    {
        return $this->belongsTo(DistritoView::class, 'distrito_id');
    }

    public function cambiosEstatus()
    {
        return $this->hasMany(CambioEstatusTrabajador::class, 'trabajador_id')
            ->borrado(false)
            ->orderBy('creado', 'DESC');
    }


    public function postulacionesActivas()
    {
        return $this->hasMany(RequerimientoPostulacionView::class, 'trabajador_id')
            ->where('fechaentrevistaformat', '>=', now());
    }

    public function contratosActivos()
    {
        return $this->hasMany(ContratoView::class, 'trabajadorid')
            ->where('culminado', false);
    }

    public function bajas()
    {
        return $this->hasMany(TransaccionBajaView::class, 'trabajador_id');
    }

    public function pais()
    {
        return $this->belongsTo(Pais::class, 'distrito_pais_id');
    }

}
