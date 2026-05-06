<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contrato extends Model
{

    protected $table = 'contratos';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded =[];

    protected $dates = ['fecha', 'fechainiciolabores'];

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function scopeActivo($query, $flag) {
        return $query->where('activo', $flag);
    }

    public function scopeCulminado($query, $flag) {
        return $query->where('culminado', $flag);
    }

    public function empleador()
    {
        return $this->belongsTo(Empleador::class, 'empleador_id');
    }

    public function requerimiento()
    {
        return $this->belongsTo(Requerimiento::class, 'requerimiento_id');
    }

    public function actividad()
    {
        return $this->belongsTo(Actividad::class, 'actividad_id');
    }

    public function modalidad()
    {
        return $this->belongsTo(Modalidad::class, 'modalidad_id');
    }

    public function trabajador()
    {
        return $this->belongsTo(Trabajador::class, 'trabajador_id');
    }

    public function trabajadorB()
    {
        return $this->belongsTo(Trabajador::class, 'trabajador_b_id');
    }

    public function trabajadorC()
    {
        return $this->belongsTo(Trabajador::class, 'trabajador_c_id');
    }

    public function tipoContrato()
    {
        return $this->belongsTo(TipoContrato::class, 'tipocontrato_id');
    }

}
