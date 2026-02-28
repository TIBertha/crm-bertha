@if ($ficha['firma'])

    <div class="book"></div>

    <div class="page">
        <div class="subpage-none">

            <section class="seccion1 tidal mb-5">
                <div class="row mb-2 mt-2">
                    <div class="col-4">
                        <img class="logo-experta" src="{{ asset('img/logo.png') }}" alt="LogoBerthaExpertaEnCasa">
                    </div>
                </div>
            </section>

            <section class="titulo text-center mt-4 mb-5">
                <h3 class="font-weight-bold">Compromiso</h3>
            </section>

            <section class="mb-2 px-0">
                <div class="subtitulo mb-2">
                    <h4>ACEPTO:</h4>
                </div>

                <div>
                    <ol class="lista-compromiso">
                        <li>La verificación de mis antecedentes policiales, judiciales y penales.</li>
                        <li>La verificación de mis recomendaciones.</li>
                        <li>La agencia mostrará mi información a los empleadores.</li>

                        @if (request()->is('contratos/impresion/*'))
                            @if ($ficha['tiempodescanso'])
                                <li>Si trabajo cama adentro, el día de mi salida descansaré en el domicilio de mi
                                    empleador el tiempo que se establezca en mi contrato.</li>
                            @endif
                        @endif

                        <li>Si no asisto a mi primer día de labores, la agencia no me presentará más empleadores.</li>

                        @if ($ficha['id'] != 3633)
                            <li>Esperar 15 días para que consigan mi reemplazo, sino se considerará abandono de trabajo.
                            </li>
                        @else
                            <li>Esperar 15 días para que consigan mi reemplazo, sino se considerará abandono de trabajo.
                            </li>
                            <li>Cuando la agencia consiga mi reemplazo, no trabajaré con mi ex-empleador.</li>
                        @endif

                    </ol>
                </div>

            </section>

            <section class="mt-4 firma">
                <div class="row d-flex justify-content-center">
                    <div class="row d-flex justify-content-center">
                        <div class="col-9 font1 text-center pt-5">
                            <h3 class="font-weight-bold pt-5"><u>ACEPTADO Y DECLARADO ELECTRÓNICAMENTE CON ID
                                    {{ $ficha['id'] }}</u></h3>
                        </div>
                    </div>
                </div>
                <div class="datos-postulante font1">
                    <p>Nombre: {{ $ficha['nombres'] }} </p>
                    <p>DNI: {{ $ficha['numerodocumento'] }} </p>
                </div>
            </section>
        </div>
    </div>

@endif
