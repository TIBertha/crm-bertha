<div class="page new-page">
    <div class="cut-page-ficha-none">
        <div class="subpage-ficha-post">

            <section class=" seccion1 tidal mb-4 s1-ficha">
                <div class="row my-2 mx-0">
                    <div class="col-4 special-ret">
                        <img class="logo-experta" src="{{ asset('img/logo.png') }}" alt="LogoBerthaExpertaEnCasa">
                    </div>
                    <div class="col-8 text-end font-weight-bold">
                        <p>www.holabertha.com</p>
                    </div>
                </div>
            </section>

            <section class=" titulo my-4">
                <h3>Ficha del Postulante</h3>
            </section>

            <section class=" seccion2 mt-5 tidal">
                <div class="row">
                    <div class="padding-data-ficha col-8 font1">
                        <p><strong>Nombres y Apellidos: </strong> {{ $ficha['nombres'] }}</p>
                        {{-- <p><strong>Género: </strong> {{$ficha['genero']}}</p> --}}
                        <p><strong>Estado Civil: </strong> {{ $ficha['estadocivil'] }}</p>
                        <p><strong>Tipo de Documento: </strong> {{ $ficha['tipodocumento'] }}</p>
                        <p><strong>Número de Documento: </strong> {{ $ficha['numerodocumento'] }}</p>
                        {{-- <p><strong>Telefono: </strong> {{$ficha['telefono']}} | <strong>WhatsApp: </strong> {{$ficha['telefono_whatsapp']}}</p> --}}
                        <p><strong>Domicilio: </strong> {{ $ficha['domiciliodeclaracion'] }}</p>
                        <p><strong>Fecha de Nacimiento: </strong> {{ $ficha['fechanacimiento'] }}
                            {{ $ficha['edadpostulante'] ? ' (' . $ficha['edadpostulante'] . ' AÑOS)' : '' }}</p>
                        <p><strong>Pais y Lugar de Nacimiento: </strong> {{ $ficha['pais'] }} -
                            {{ $ficha['departamentonacimiento'] }}</p>
                        <p><strong>Idiomas: </strong> {{ $ficha['idiomas'] }}</p>
                        @if ($ficha['video_introduccion_youtube'])
                            <p><strong>Video Presentación: </strong> <a class="link-purple"
                                    href="{{ $ficha['video_introduccion_youtube'] }}"
                                    target="_blank">{{ $ficha['video_introduccion_youtube'] }}</a></p>
                        @endif
                    </div>

                    <div class="col-4">
                        <div class="ficha-foto-perfil"><img src="{{ $ficha['foto'] }}"></div>
                    </div>

                </div>
            </section>

            <section class=" seccion3 mt-3 mb-3 tidal font1">
                <div class="titulo-seccion">
                    <h6>CARACTERÍSTICAS DE DISPONIBILIDAD</h6>
                </div>
                <div class="row mx-0">
                    <div class="col-6">
                        <p><strong>Actividad(es): </strong> {{ $ficha['actividades'] }} </p>
                    </div>
                    <div class="col-6">
                        <p><strong>Modalidad(es): </strong> {{ $ficha['tiposervicio'] }}</p>
                    </div>
                </div>
            </section>

            <section class=" seccion3 mt-3 mb-3 tidal font1">
                <div class="titulo-seccion">
                    <h6>CONTACTO DE EMERGENCIA</h6>
                </div>
                <div class="row mx-0">
                    <div class="col-12">
                        @if ($ficha['contactos'])
                            @foreach ($ficha['contactos'] as $c)
                                <div class="">
                                    <span>{{ $c['nombre'] }}</span>
                                    (<span>{{ $c['parentesco'] }}</span>)
                                    -
                                    <span>{{ $c['telefono'] }}</span>
                                </div>
                            @endforeach
                        @else
                            -
                        @endif
                    </div>
                </div>
            </section>

            <section class=" seccion4 mt-3 mb-3 tidal font1">
                <div class="titulo-seccion">
                    <h6>DOCUMENTOS VERIFICADOS</h6>
                </div>
                <div class="row mx-0">

                    @if ($ficha['checkdocumentoidentidad'])
                        <div class="col-6">
                            <div class="row">
                                <div class="col-10">
                                    <p><strong>Documento de Identidad</strong></p>
                                </div>
                                <div class="col-2">
                                    <p>
                                        @if ($ficha['checkdocumentoidentidad'])
                                            <i class="fas fa-check icon-green"></i>
                                        @else
                                            <i class="fas fa-times"></i>
                                        @endif
                                    </p><!--Check Documento de Identidad-->
                                </div>
                            </div>
                        </div>
                    @endif

                    @if ($ficha['checkdeclaracionjurada'])
                        <div class="col-6">
                            <div class="row">
                                <div class="col-10">
                                    <p><strong>Declaración Jurada de Domicilio</strong></p>
                                </div>
                                <div class="col-2">
                                    <p>
                                        @if ($ficha['checkdeclaracionjurada'])
                                            <i class="fas fa-check icon-green"></i>
                                        @else
                                            <i class="fas fa-times"></i>
                                        @endif
                                    </p><!--Check Declaración Jurada-->
                                </div>
                            </div>
                        </div>
                    @endif

                    @if ($ficha['checkcertiadulto'])
                        <div class="col-6">
                            <div class="row">
                                <div class="col-10">
                                    <p><strong>Reporte de Antecedentes Policiales</strong></p>
                                </div>
                                <div class="col-2">
                                    <p>
                                        <i class="fas fa-check icon-green"></i>
                                    </p><!--Check Antecedentes-->
                                </div>
                            </div>
                        </div>

                        <div class="col-6">
                            <div class="row">
                                <div class="col-10">
                                    <p><strong>Reporte de Antecedentes Judiciales</strong></p>
                                </div>
                                <div class="col-2">
                                    <p>
                                        <i class="fas fa-check icon-green"></i>
                                    </p><!--Check Antecedentes-->
                                </div>
                            </div>
                        </div>

                        <div class="col-6">
                            <div class="row">
                                <div class="col-10">
                                    <p><strong>Reporte de Antecedentes Penales</strong></p>
                                </div>
                                <div class="col-2">
                                    <p>
                                        <i class="fas fa-check icon-green"></i>
                                    </p><!--Check Antecedentes-->
                                </div>
                            </div>
                        </div>
                    @endif

                    @if ($ficha['checkrecibo'])
                        <div class="col-6">
                            <div class="row">
                                <div class="col-10">
                                    <p><strong>Recibo de Servicio</strong></p>
                                </div>
                                <div class="col-2">
                                    <p>
                                        @if ($ficha['checkrecibo'])
                                            <i class="fas fa-check icon-green"></i>
                                        @else
                                            <i class="fas fa-times"></i>
                                        @endif
                                    </p><!--Check Recibo de Servicio-->
                                </div>
                            </div>
                        </div>
                    @endif

                    <div class="col-6">
                        <div class="row">
                            <div class="col-10">
                                <p><strong>Declaración Jurada de Gozar Buena Salud Física y Mental y Vacuna
                                        Covid</strong></p>
                            </div>
                            <div class="col-2">
                                <p>
                                    <i class="fas fa-check icon-green"></i>
                                </p>
                            </div>
                        </div>
                    </div>

                    @if ($ficha['checkrecomendaciones'])
                        <div class="col-6">
                            <div class="row">
                                <div class="col-10">
                                    <p><strong>Recomendaciones</strong></p>
                                </div>
                                <div class="col-2">
                                    <p>
                                        @if ($ficha['checkrecomendaciones'])
                                            <i class="fas fa-check icon-green"></i>
                                        @else
                                            <i class="fas fa-times"></i>
                                        @endif
                                    </p><!--Check Recomendaciones-->
                                </div>
                            </div>
                        </div>
                    @endif

                    @if ($ficha['checkcompromiso'])
                        <div class="col-6">
                            <div class="row">
                                <div class="col-10">
                                    <p><strong>Compromiso</strong></p>
                                </div>
                                <div class="col-2">
                                    <p>
                                        @if ($ficha['checkcompromiso'])
                                            <i class="fas fa-check icon-green"></i>
                                        @else
                                            <i class="fas fa-times"></i>
                                        @endif
                                    </p><!--Check Compromiso-->
                                </div>
                            </div>
                        </div>
                    @endif

                    @if ($ficha['checkeducacion'])
                        <div class="col-6">
                            <div class="row">
                                <div class="col-10">
                                    <p><strong>Certificados, Diplomas y Otros</strong></p>
                                </div>
                                <div class="col-2">
                                    <p>
                                        @if ($ficha['checkeducacion'])
                                            <i class="fas fa-check icon-green"></i>
                                        @else
                                            <i class="fas fa-times"></i>
                                        @endif
                                    </p><!--Check Certificados, Diplomas y Otros-->
                                </div>
                            </div>
                        </div>
                    @endif

                </div>

            </section>

            @if ($ficha['checkrecomendaciones'] and $ficha['checkverificacioneslaborales'] and $ficha['verificaciones'])

                <section class=" seccion5 mt-3 mb-3 tidal font1">
                    <div class="titulo-seccion">
                        <h6>RECOMENDACIONES</h6>
                    </div>

                    <div class="contenedor-tabla-recomendacion">
                        <table class="tabla-recomendacion">
                            <thead>
                                <tr>
                                    <th style="width: 18%; text-align: left"><strong>EMPLEADOR</strong></th>
                                    <th style="width: 18%; text-align: left"><strong>DISTRITO | DEPARTAMENTO</strong>
                                    </th>
                                    <th style="width: 16%; text-align: left"><strong>PERIODO</strong></th>
                                    <th style="width: 15%; text-align: left"><strong>DURACIÓN</strong></th>
                                    <th style="width: 15%; text-align: left"><strong>ACTIVIDAD</strong></th>
                                    <th style="width: 10%; text-align: left"><strong>TELEFONO</strong></th>
                                    <th style="width: 5%; text-align: left"><strong>VERIFICACIÓN</strong></th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($ficha['verificaciones'] as $f)
                                    <tr class="text-start">
                                        <td>{{ $f['nombre'] }}</td>
                                        <td>{{ $f['departamento'] }}</td>
                                        <td>{{ ($f['inicioLabores'] and $f['finLabores']) ? $f['inicioLabores'] . ' | ' . $f['finLabores'] : ' - ' }}
                                        </td>
                                        <td>{{ $f['tiempo'] }}</td>
                                        <td>{{ $f['actividad'] }}</td>
                                        <td>{{ $f['telefono'] }}</td>
                                        <td style="text-align: center">

                                            @if ($f['adjuntosverificacion'])
                                                @foreach ($f['adjuntosverificacion'] as $key => $a)
                                                    <a style="cursor: pointer" href="{{ $a['url'] }}"
                                                        target="_blank">
                                                        <i class="fas fa-link me-2"></i>
                                                    </a>
                                                @endforeach
                                            @else
                                                -
                                            @endif

                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>

                </section>

            @endif

            @if ($ficha['checkeducacion'] and $ficha['educacion'] and !$ficha['isnewpageestudio'])
                @include('PDF.Ficha_Postulante.Sections.section-estudios')
            @endif

        </div>

        <div class="pie-pagina-ficha">
            Términos y condiciones de selección de personal: <a class="link-pink" target="_blank"
                href="{{ config('webexperta.url-web') . '/condiciones' }}">www.holabertha.com/condiciones</a>
        </div>
    </div>

</div>

<div class="book"></div>
