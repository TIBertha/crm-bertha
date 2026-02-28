@if ($ficha['checkantecedentes'])

    <div class="book">
        <div class="page">
            <div class="subpage-antecedentes">
                <section class="container seccion1 tidal mt-5 mb-5">
                    <div class="row mb-2 mt-2 flex-row-reverse">
                        <div class="col-4">
                            <img class="logo-proveedor" src="{{ asset('img/logo-mak-consulting.png') }}"
                                alt="LogoBerthaExpertaEnCasa">
                        </div>
                    </div>
                </section>

                <section>
                    <div class="font1">
                        <h4>{{ $ficha['antecedente']['numero_solicitud'] }} - 1</h4>
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

                <h4 class="font-weight-bold">VERIFICACIÓN DE ANTECEDENTES POLICIALES</h4>

                @for ($j = 0; $j < $ficha['cant_ant_pol']; $j++)
                    <nav>
                        <div class="mt-4" style="padding-top: 3rem">
                            <h5 class="font-weight-bold">{{ $j + 1 }}.- INFORMACIÓN POLICIAL</h5>
                            <table class="tabla-antecedentes text-start">
                                <tbody>
                                    <tr class="table1">
                                        <td width="35%"><strong>REFERENCIAS PNP</strong></td>
                                        <td width="65%"
                                            class="font-weight-bold {{ $ficha['antecedente']['policiales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['policiales'][$j]['policiales_referenciapnp'] }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>REQUISITORIA</strong></td>
                                        <td
                                            class="font-weight-bold {{ $ficha['antecedente']['policiales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['policiales'][$j]['policiales_requisitoria'] }}
                                        </td>
                                    </tr>
                                    <tr class="table1">
                                        <td><strong>DENUNCIAS</strong></td>
                                        <td
                                            class="font-weight-bold {{ $ficha['antecedente']['policiales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['policiales'][$j]['policiales_denuncia'] }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="mt-5">
                            <h5 class="font-weight-bold">REGISTROS</h5>
                            <table class="tabla-antecedentes text-start">
                                <tbody>
                                    <tr class="table1">
                                        <td width="35%"><strong>DEPENDENCIA</strong></td>
                                        <td width="65%"
                                            class="font-weight-bold {{ $ficha['antecedente']['policiales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['policiales'][$j]['policiales_dependencia'] }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>DELITO</strong></td>
                                        <td
                                            class="font-weight-bold {{ $ficha['antecedente']['policiales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['policiales'][$j]['policiales_delito'] }}</td>
                                    </tr>
                                    <tr class="table1">
                                        <td><strong>FECHA DE REGISTRO</strong></td>
                                        <td
                                            class="font-weight-bold {{ $ficha['antecedente']['policiales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['policiales'][$j]['policiales_fecha_registro'] }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>FECHA DE HECHO</strong></td>
                                        <td
                                            class="font-weight-bold {{ $ficha['antecedente']['policiales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['policiales'][$j]['policiales_fecha_hecho'] }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        @if ($ficha['cant_ant_pol'] == $j + 1)
                            <section class="mt-5 container">
                                <h4 class="font-weight-bold">CONCLUSIÓN</h4>
                                <h2
                                    class="resultado-antecedente font-weight-bold {{ $ficha['antecedente']['policiales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                    {{ $ficha['antecedente']['policiales_conclusion'] ? 'Si Presenta Antecedentes Policiales' : 'No Presenta Antecedentes Policiales' }}
                                </h2>
                            </section>
                        @endif

                    </nav>
                @endfor

            </div>

        </div>
    </div>

@endif
