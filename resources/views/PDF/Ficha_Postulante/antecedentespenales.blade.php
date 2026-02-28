@if ($ficha['checkantecedentes'])

    <div class="book">
        <div class="page">
            <div class="subpage-antecedentes">

                <section class="container seccion1 tidal mb-5">
                    <div class="row mb-2 mt-2 flex-row-reverse">
                        <div class="col-4">
                            <img class="logo-proveedor" src="{{ asset('img/logo-mak-consulting.png') }}"
                                alt="LogoBerthaExpertaEnCasa">
                        </div>
                    </div>
                </section>

                <section>
                    <div class="font1">
                        <h4>{{ $ficha['antecedente']['numero_solicitud'] }} - 3</h4>
                        <p class="text-justify mt-3"><strong>MAK CONSULTING SERVICE S.A.C.</strong> proporciona la
                            información a EMPLEOS RESIDENCIAL LA MOLINA E.I.R.L.,
                            quien solicita la verificación de identidad (RENIEC) y la verificación de antecedentes
                            policiales,
                            judiciales y penales. El presente informe ha sido elaborado en base a entrevistas e
                            información de
                            fuentes públicas de carácter CONFIDENCIAL, según lo establecido en la Ley de protección de
                            datos
                            personales N°29733. </p>
                    </div>
                    <div class="mt-4">
                        <h4 class="font-weight-bold">{{ $ficha['nombres'] }}</h4>
                        <div class="mt-3 mb-3 font1">
                            <p>DNI : {{ $ficha['numerodocumento'] }}</p>
                            @if ($ficha['fechaContrato'])
                                <p>Fecha : {{ $ficha['fechaContrato'] }}</p>
                            @else
                                <p>Fecha : {{ $ficha['antecedente']['fecha'] }}</p>
                            @endif
                        </div>
                    </div>
                </section>

                <h4 class="font-weight-bold">VERIFICACIÓN DE ANTECEDENTES PENALES</h4>

                @for ($f = 0; $f < $ficha['cant_ant_pen']; $f++)
                    <nav>
                        <div class="mt-4" style="padding-top: 3rem">
                            <h5 class="font-weight-bold">{{ $f + 1 }}.- DETENCIÓN</h5>
                            <table class="tabla-antecedentes text-start">
                                <tbody>
                                    <tr class="table1">
                                        <td width="35%"><strong>DEPARTAMENTO, PROVINCIA, DISTRITO</strong></td>
                                        <td width="65%"
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['penales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['penales'][$f]['penales_departamento_distrito_provincia'] }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>DELITO</strong></td>
                                        <td
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['penales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['penales'][$f]['penales_delito_detencion'] }}</td>
                                    </tr>
                                    <tr class="table1">
                                        <td><strong>FECHA DE DETENCIÓN</strong></td>
                                        <td
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['penales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['penales'][$f]['penales_fecha_detencion'] }}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>EDAD DE DETENIDO</strong></td>
                                        <td
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['penales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['penales'][$f]['penales_edad_detenido'] }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="mt-5">
                            <h5 class="font-weight-bold">INSTITUTO NACIONAL PENITENCIARIO DEL PERÚ (INPE)</h5>
                            <table class="tabla-antecedentes text-start">
                                <tbody>
                                    <tr class="table1">
                                        <td width="35%"><strong>DELITO</strong></td>
                                        <td width="65%"
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['penales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['penales'][$f]['penales_delito_inpe'] }}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>AUTORIDAD JUDICIAL</strong></td>
                                        <td
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['penales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['penales'][$f]['penales_autoridad_judicial'] }}
                                        </td>
                                    </tr>
                                    <tr class="table1">
                                        <td><strong>ESTABLECIMIENTO PENITENCIARIO</strong></td>
                                        <td
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['penales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['penales'][$f]['penales_establecimiento_penitenciario'] }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>FECHA DE INGRESO</strong></td>
                                        <td
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['penales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['penales'][$f]['penales_fecha_ingreso'] }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        @if ($ficha['cant_ant_pen'] == $f + 1)
                            <section class="mt-5">
                                <h4 class="font-weight-bold">CONCLUSIÓN</h4>
                                <h2
                                    class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['penales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                    {{ $ficha['antecedente']['penales_conclusion'] ? 'Si Presenta Antecedentes Penales' : 'No Presenta Antecedentes Penales' }}
                                </h2>
                            </section>
                        @endif

                    </nav>
                @endfor

            </div>
        </div>
    </div>

@endif
