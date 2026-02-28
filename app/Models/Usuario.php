<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{

    protected $table = 'usuarios';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $hidden = ['password'];
    protected $guarded = [];

    protected $dates = ['fecha_nacimiento'];

    public function trabajador(){
        return $this->hasOne('App\Models\Trabajador');
    }

    public function empleador(){
        return $this->hasOne('App\Models\Empleador');
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

        return formatTextFirstCharacterToUpper($this->correo);
    }

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function scopeActivo($query, $flag) {
        return $query->where('activo', $flag);
    }

    public function checkPhone(){
        return $this->verificar_telefono;
    }

    public function isTrabajador(){

        $tra = Trabajador::activo(true)->where('usuario_id', $this->id)->first();

        if($tra){
            return true;
        }else{
            return false;
        }
    }

    public function isEmpleador(){

        $emp = Empleador::activo(true)->where('usuario_id', $this->id)->first();

        if($emp){
            return true;
        }else{
            return false;
        }
    }

    public function getTrabajadorID(){

        $tra = Trabajador::activo(true)->where('usuario_id', $this->id)->first();

        if($tra){
            return $tra->id;
        }else{
            return NULL;
        }
    }

    public function getEmpleadorID(){

        $emp = Empleador::activo(true)->where('usuario_id', $this->id)->first();

        if($emp){
            return $emp->id;
        }else{
            return NULL;
        }
    }

}
