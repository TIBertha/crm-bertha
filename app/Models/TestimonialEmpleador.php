<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestimonialEmpleador extends Model
{
    protected $table = 'videos_testimoniales';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $fillable = ['fecha', 'orden', 'usuariointerno_id', 'empleador_id', 'video_youtube', 'poster','imagen_testimonial','nombre_cliente','testimonial', 'borrado', 'activo', 'creado', 'actualizado'];

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function scopeOrdenar($query){
        return $query->orderBy('orden', 'asc');
    }
}
