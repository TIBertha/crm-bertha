<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestimonialesTrabajador extends Model
{
    protected $table = 'testimoniales_new';

    protected $fillable = ['trabajador_id', 'imagen', 'fecha','usuariointerno_id'];

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    public function trabajador()
    {
        return $this->belongsTo(Trabajador::class, 'trabajador_id');
    }

    public function usuarioInterno()
    {
        return $this->belongsTo(UsuarioInterno::class, 'usuariointerno_id');
    }
}
