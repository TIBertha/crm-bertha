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
                        <h4>{{ $ficha['antecedente']['numero_solicitud'] }} - 2</h4>
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

                <h4 class="font-weight-bold">VERIFICACIÓN DE ANTECEDENTES JUDICIALES</h4>

                @for ($t = 0; $t < $ficha['cant_ant_jud']; $t++)
                    <nav>
                        <div class="mt-4" style="padding-top: 3rem">
                            <h5 class="font-weight-bold">{{ $t + 1 }}.- MINISTERIO PÚBLICO</h5>
                            <table class="tabla-antecedentes text-start">
                                <tbody>
                                    <tr class="table1">
                                        <td width="35%"><strong>FISCALÍA</strong></td>
                                        <td width="65%"
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['judiciales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['judiciales'][$t]['judiciales_fiscalia'] }}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>DELITO</strong></td>
                                        <td
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['judiciales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['judiciales'][$t]['judiciales_delito_ministerio'] }}
                                        </td>
                                    </tr>
                                    <tr class="table1">
                                        <td><strong>N° DE CASO</strong></td>
                                        <td
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['judiciales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['judiciales'][$t]['judiciales_numero_caso'] }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>FECHA</strong></td>
                                        <td
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['judiciales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['judiciales'][$t]['judiciales_fecha'] }}</td>
                                    </tr>
                                    <tr class="table1">
                                        <td><strong>ESTADO</strong></td>
                                        <td
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['judiciales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['judiciales'][$t]['judiciales_estado'] }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="mt-5">
                            <h5 class="font-weight-bold">PODER JUDICIAL</h5>
                            <table class="tabla-antecedentes text-start">
                                <tbody>
                                    <tr class="table1">
                                        <td width="35%"><strong>EXPEDIENTE</strong></td>
                                        <td width="65%"
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['judiciales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['judiciales'][$t]['judiciales_expediente'] }}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>SITUACIÓN JURÍDICA</strong></td>
                                        <td
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['judiciales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['judiciales'][$t]['judiciales_situacion_juridica'] }}
                                        </td>
                                    </tr>
                                    <tr class="table1">
                                        <td><strong>FECHA DE HECHO</strong></td>
                                        <td
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['judiciales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['judiciales'][$t]['judiciales_fecha_hecho'] }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>DELITO</strong></td>
                                        <td
                                            class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['judiciales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['judiciales'][$t]['judiciales_delito_poder'] }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        @if ($ficha['cant_ant_jud'] == $t + 1)
                            <section class="mt-5">
                                <h4 class="font-weight-bold">CONCLUSIÓN</h4>
                                <h2
                                    class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['judiciales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                    {{ $ficha['antecedente']['judiciales_conclusion'] ? 'Si Presenta Antecedentes Judiciales' : 'No Presenta Antecedentes Judiciales' }}
                                </h2>
                            </section>
                        @endif

                    </nav>
                @endfor

            </div>
        </div>
    </div>

@endif
