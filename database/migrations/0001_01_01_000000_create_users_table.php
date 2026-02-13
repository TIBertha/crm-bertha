<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('UsuariosInternos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nombres')->nullable(false);
            $table->string('apellidos')->nullable(false);
            $table->string('correo')->unique()->nullable(false);
            $table->string('telefono')->nullable(false);
            $table->string('password')->nullable(false);
            //$table->unsignedBigInteger('rol_id')->nullable(false);
            //$table->foreign('rol_id')->references('id')->on('Roles');
            $table->string('foto');
            $table->rememberToken();
            $table->boolean('activo')->default(true);
            $table->boolean('borrado')->default(false);
            $table->timestamps();


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
