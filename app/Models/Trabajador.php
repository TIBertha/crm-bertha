<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trabajador extends Model
{
    protected $table = 'trabajadores';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $dates = ['fecha_nacimiento', 'fecha_postulacion'];

    protected $guarded = [];

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function scopeActivo($query, $flag) {
        return $query->where('activo', $flag);
    }

    public function distrito()
    {
        return $this->belongsTo(\App\Models\Distrito::class, 'distrito_id', 'id');
    }

    public function postulacionesActivas()
    {
        return $this->hasMany(RequerimientoPostulacion::class, 'trabajador_id', 'id')
            ->where('activo', 1); // o el estado que uses
    }


    public function contratosActivos()
    {
        return $this->hasMany(\App\Models\Contrato::class, 'trabajador_id', 'id')
            ->where('activo', 1);
    }

    public function bajas()
    {
        return $this->hasMany(TransaccionBaja::class, 'trabajador_id', 'id')
            ->with('baja');
    }


    public function pais()
    {
        return $this->belongsTo(\App\Models\Pais::class, 'nacionalidad_id', 'id');
    }

    public function cambiosEstatus()
    {
        return $this->hasMany(\App\Models\CambioEstatusTrabajador::class, 'trabajador_id', 'id');
    }


    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'id');
    }

    public function estatusPostulante()
    {
        return $this->belongsTo(\App\Models\EstatusPostulante::class, 'estatuspostulante_id', 'id');
    }

    public function contratos()
    {
        return $this->hasMany(\App\Models\Contrato::class, 'trabajador_id');
    }

}
