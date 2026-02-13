<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Requerimiento extends Model
{

    protected $table = 'requerimientos';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $fillable = ['monto_adelanto', 'fecha_pago_adelanto','horarios','tipocontrato_id' ,'valor_dia_frecuencia', 'empleador_id', 'estatusrequerimiento_id', 'hora_salida','dia_salida', 'dia_ingreso', 'domicilio_id', 'hora_ingreso', 'seguimientos', 'fecha', 'fecha_entrevista', 'hora_entrevista', 'observaciones', 'observaciones_web', 'frecuenciaservicio_id', 'sueldo',  'sueldo_por_dias', 'tipocomision', 'monto_comision', 'paispedido_id', 'confirmacion_adelanto', 'fecha_inicio_labores', 'nacionalidad_busqueda', 'fecha', 'tiempo_cuarentena', 'actividad_id', 'modalidad_id', 'edad_nino', 'edad_adulto', 'numero_adultos', 'numero_ninos', 'nacionalidad_busqueda', 'rangoedad_id', 'tipovivienda_id', 'departamento_id', 'provincia_id', 'distrito_id', 'numero_pisos', 'numero_mascotas', 'diagnostico', 'tipobeneficio_id'];

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}
