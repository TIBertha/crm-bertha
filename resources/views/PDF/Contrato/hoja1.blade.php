<div class="page">
    <div class="subpage contrato1">

        <section class="seccion1 tidal mb-5">
            <div class="row mb-2 mt-2">
                <div class="col-4">
                    <img class="logo-experta" src="{{ asset('img/logo.png') }}" alt="LogoBerthaExpertaEnCasa">
                </div>
                <div class="col-8 text-end font-weight-bold">
                    <h4>{{ $contrato['fecha'] }}</h4>
                </div>
            </div>
        </section>

        <section class="container text-center mt-4 mb-5">
            <h2 class="font-weight-bold">Contrato de Selección de Personal</h2>
        </section>

        <section>
            <h4>Datos del Empleador</h4>
            <div class="cuadro">
                <div class="mx-4 my-4">
                    <p>{{ $contrato['nombreempleador'] }}</p>
                    <hr>
                    <h5 class="mt-2">Nombres y Apellidos</h5>
                </div>
            </div>
        </section>

        <section class="mt-5">
            <h4>Datos del Trabajador</h4>
            <div class="cuadro">
                <div class="mx-4 my-4">
                    <p>{{ $contrato['nombretrabajador'] }}</p>
                    <hr>
                    <h5 class="mt-2">Nombres y Apellidos</h5>
                </div>
                <div class="mx-4 my-4">

                    @if ($contrato['telefonotrabajador'] != $contrato['telefonowhatsapptrabajador'])
                        <div class="row">
                            <div class="col-6 minicuadro">
                                <a class=""
                                    href="{{ 'tel:' . $contrato['telefonotrabajador'] }}">{{ $contrato['telefonotrabajador'] }}</a>
                                <hr>
                                <h5 class="mt-2">Número de Teléfono</h5>
                            </div>
                            <div class="col-6 minicuadro">
                                <a class=""
                                    href="{{ 'https://wa.me/' . $contrato['telefonowhatsapptrabajador'] }}">{{ $contrato['telefonowhatsapptrabajador'] }}</a>
                                <hr>
                                <h5 class="mt-2">Número WhatsApp</h5>
                            </div>

                        </div>
                    @else
                        <div class="row">
                            <div class="col-12 minicuadro">
                                <a class=""
                                    href="{{ 'tel:' . $contrato['telefonotrabajador'] }}">{{ $contrato['telefonotrabajador'] }}</a>
                                <hr>
                                <h5 class="mt-2">Número de Teléfono y WhatsApp</h5>
                            </div>
                        </div>
                    @endif

                </div>

                @if (count($contrato['contactos']) > 0)
                    <div class="mx-4 my-4">
                        <p>
                            @foreach ($contrato['contactos'] as $contacto)
                                {{ $contacto['nombre'] }} ({{ $contacto['parentesco'] }}): <a
                                    href="{{ 'tel:' . $contacto['telefono'] }}">{{ $contacto['telefono'] }}</a>
                                @if ($loop->last)
                                @else,
                                @endif
                            @endforeach
                        </p>
                        <hr>
                        <h5 class="mt-2">Contacto de Emergencia</h5>
                    </div>
                @endif

            </div>
        </section>

        <section class="mt-5">

            <div class="cuadro">

                <div class="m-4">

                    <div class="row">
                        <div class="col-4 minicuadro">
                            <p>{{ $contrato['tipocontrato'] }}</p>
                            <hr>
                            <h5 class="mt-2">Tipo de Contrato</h5>
                        </div>
                        <div class="col-4 minicuadro">
                            <p>{{ $contrato['actividad-modalidad'] }}</p>
                            <hr>
                            <h5 class="mt-2">Tipo de Servicio/Actividad</h5>
                        </div>

                        @if ($contrato['modalidad_id'] == 3)
                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['diasfrecuencia'] ? $contrato['diasfrecuencia'] : ' - ' }}</p>
                                <hr>
                                <h5 class="mt-2">Días de Asistencia</h5>
                            </div>
                        @elseif(in_array($contrato['modalidad_id'], [2, 4, 5]))
                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['diadescanso'] ? $contrato['diadescanso'] : ' - ' }}</p>
                                <hr>
                                <h5 class="mt-2">Día de Descanso</h5>
                            </div>
                        @elseif($contrato['modalidad_id'] == 1)
                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['tipodescanso'] ? $contrato['tipodescanso'] : 'SIN CUARENTENA' }}</p>
                                <hr>
                                <h5 class="mt-2">Tipo Descanso</h5>
                            </div>
                        @endif

                    </div>
                </div>

                @if ($contrato['modalidad_id'] == 3)

                    <div class="m-3">
                        <div class="row">

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['divisa'] }} {{ $contrato['comision'] }}</p>
                                <hr>
                                <h5 class="mt-2">Comisión</h5>
                            </div>

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['divisa'] }}
                                    {{ $contrato['valordiafrecuencia'] ? $contrato['valordiafrecuencia'] : '0,00' }}
                                </p>
                                <hr>
                                <h5 class="mt-2">Pago por Día</h5>
                            </div>

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['divisa'] }}
                                    {{ $contrato['sueldopordias'] ? $contrato['sueldopordias'] : '0,00' }}</p>
                                <hr>
                                <h5 class="mt-2">Sueldo Mensual</h5>
                            </div>

                        </div>
                    </div>

                    <div class="m-3">
                        <div class="row">

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['iniciolabores'] }}</p>
                                <hr>
                                <h5 class="mt-2">Inicio de Labores</h5>
                            </div>

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['fechainiciogarantia'] }}</p>
                                <hr>
                                <h5 class="mt-2">Fecha Inicio Garantía</h5>
                            </div>

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['fechafingarantia'] }}</p>
                                <hr>
                                <h5 class="mt-2">Fecha Fin Garantía</h5>
                            </div>

                        </div>
                    </div>

                    @if ($contrato['paispedido'] == 54)
                        <div class="m-3">
                            <div class="row">

                                <div class="col-4 minicuadro">
                                    <p>{{ $contrato['garantia'] }}</p>
                                    <hr>
                                    <h5 class="mt-2">
                                        {{ $contrato['idTipoContrato'] == 1 ? 'Garantía' : 'Garantía Restante' }}</h5>
                                </div>

                            </div>
                        </div>
                    @endif
                @elseif(in_array($contrato['modalidad_id'], [2, 4, 5]))
                    <div class="m-3">
                        <div class="row">

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['divisa'] }} {{ $contrato['sueldomensual'] }}</p>
                                <hr>
                                <h5 class="mt-2">Sueldo Mensual</h5>
                            </div>

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['iniciolabores'] }}</p>
                                <hr>
                                <h5 class="mt-2">Inicio de Labores</h5>
                            </div>

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['divisa'] }} {{ $contrato['comision'] }}</p>
                                <hr>
                                <h5 class="mt-2">Comisión</h5>
                            </div>

                        </div>
                    </div>

                    <div class="m-3">
                        <div class="row">

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['divisa'] }}
                                    {{ $contrato['totalpagado'] ? $contrato['totalpagado'] : '0,00' }}</p>
                                <hr>
                                <h5 class="mt-2">Total Pagado</h5>
                            </div>

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['fechainiciogarantia'] }}</p>
                                <hr>
                                <h5 class="mt-2">Fecha Inicio Garantía</h5>
                            </div>

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['fechafingarantia'] }}</p>
                                <hr>
                                <h5 class="mt-2">Fecha Fin Garantía</h5>
                            </div>

                        </div>
                    </div>

                    @if ($contrato['paispedido'] == 54)
                        <div class="m-3">
                            <div class="row">

                                <div class="col-4 minicuadro">
                                    <p>{{ $contrato['garantia'] }}</p>
                                    <hr>
                                    <h5 class="mt-2">
                                        {{ $contrato['idTipoContrato'] == 1 ? 'Garantía' : 'Garantía Restante' }}</h5>
                                </div>

                            </div>
                        </div>
                    @endif
                @elseif($contrato['modalidad_id'] == 1)
                    <div class="m-3">
                        <div class="row">

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['diadescanso'] ? $contrato['diadescanso'] : ' - ' }}</p>
                                <hr>
                                <h5 class="mt-2">Día de Descanso</h5>
                            </div>

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['divisa'] }} {{ $contrato['sueldomensual'] }}</p>
                                <hr>
                                <h5 class="mt-2">Sueldo Mensual</h5>
                            </div>

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['iniciolabores'] }}</p>
                                <hr>
                                <h5 class="mt-2">Inicio de Labores</h5>
                            </div>

                        </div>
                    </div>

                    <div class="m-3">
                        <div class="row">

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['divisa'] }} {{ $contrato['comision'] }}</p>
                                <hr>
                                <h5 class="mt-2">Comisión</h5>
                            </div>

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['divisa'] }}
                                    {{ $contrato['totalpagado'] ? $contrato['totalpagado'] : '0,00' }}</p>
                                <hr>
                                <h5 class="mt-2">Total Pagado</h5>
                            </div>

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['fechainiciogarantia'] }}</p>
                                <hr>
                                <h5 class="mt-2">Fecha Inicio Garantía</h5>
                            </div>

                        </div>
                    </div>

                    <div class="m-3">
                        <div class="row">

                            <div class="col-4 minicuadro">
                                <p>{{ $contrato['fechafingarantia'] }}</p>
                                <hr>
                                <h5 class="mt-2">Fecha Fin Garantía</h5>
                            </div>

                            @if ($contrato['paispedido'] == 54)
                                <div class="col-4 minicuadro">
                                    <p>{{ $contrato['garantia'] }}</p>
                                    <hr>
                                    <h5 class="mt-2">
                                        {{ $contrato['idTipoContrato'] == 1 ? 'Garantía' : 'Garantía Restante' }}</h5>
                                </div>
                            @endif

                        </div>
                    </div>

                @endif

            </div>

        </section>

        <section class="pie-pagina">
            <div class="row text-center font-weight-bold">
                <div class="col-6 minicuadro text-start">
                    <h6>
                        <a class="link-pink" target="_blank"
                            href="{{ 'https://holabertha.com/es-' . $contrato['countryCode'] . '/condiciones' }}">www.holabertha.com/es-{{ $contrato['countryCode'] }}/condiciones</a>
                    </h6>
                </div>
                <div class="col-6 minicuadro text-end">
                    <h6>
                        <a target="_blank" href="{{ 'https://api.whatsapp.com/send?phone=51999256807' }}">
                            <img class="logo-whatsapp me-2" src="{{ asset('img/WhatsApp.png') }}"
                                alt="LogoWhatsAppBertha">
                            51 999 256 807
                        </a>
                    </h6>
                </div>
            </div>
        </section>

    </div>
</div>
