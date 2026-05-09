<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Empleador extends Authenticatable
{

    protected $table = 'empleadores';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $hidden = ['password'];
    protected $guarded = [];
    protected $dates = ['fecha', 'fecha_nacimiento'];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function showAvatar(){

        $foto = asset('img/user_icon.svg');
        $avatar = $this->foto;

        if($avatar != ''){
            $foto = $avatar;
        }

        return $foto;
    }

    public function showName(){
        return '¡Hola, '.formatTextFirstCharacterToUpper($this->nombres).'!';
    }

    public function showFullName(){
        return formatTextFirstCharacterToUpper($this->nombres. ' '.$this->apellidos);
    }

    public function showCorreo(){
        return $this->usuario->correo;
    }

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function scopeActivo($query, $flag) {
        return $query->where('activo', $flag);
    }

    public function isPhoneVerified(){
        return $this->verificar_telefono;
    }

    public function contratos()
    {
        return $this->hasMany(\App\Models\Contrato::class, 'empleador_id');
    }
}
