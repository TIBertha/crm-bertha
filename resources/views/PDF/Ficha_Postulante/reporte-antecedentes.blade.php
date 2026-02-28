@if ($ficha['checkantecedentes'])

    <div class="book"></div>

    <div class="page">
        <div class="subpage-antecedentes">

            <section class="container seccion1 tidal mb-5">
                <div class="row mb-2 mt-2 justify-content-end">
                    <div class="col-4 text-end">
                        <img class="logo-proveedor" src="{{ asset('img/logo-mak-consulting.png') }}"
                            alt="LogoBerthaExpertaEnCasa">
                    </div>
                </div>
            </section>

            <section class="container titulo text-center mt-4 mb-5">
                <h3 class="font-weight-bold">Reporte de Antecedentes</h3>
            </section>

            <section>
                <div class="font1">
                    <div class="row m-0 justify-content-between">
                        <h5 class="font-weight-bold mb-0">N° {{ $ficha['antecedente']['numero_solicitud'] }}</h5>

                        @if ($ficha['fechaContrato'])
                            <h5 class="font-weight-bold mb-0">Fecha: {{ $ficha['fechaContrato'] }}</h5>
                        @else
                            <h5 class="font-weight-bold mb-0">Fecha: {{ $ficha['antecedente']['fecha'] }}</h5>
                        @endif

                    </div>
                    <p class="text-justify mt-5 mb-0"><strong>MAK CONSULTING SERVICE S.A.C.</strong> proporciona la
                        información a EMPLEOS RESIDENCIAL LA MOLINA E.I.R.L.,
                        quien solicita la verificación de identidad (RENIEC) y la verificación de antecedentes
                        policiales, judiciales y penales
                        del postulante. El presente informe ha sido elaborado en base a entrevistas e información de
                        fuentes públicas de
                        carácter CONFIDENCIAL, según lo establecido en la Ley de protección de datos personales N°29733.
                    </p>
                </div>
                <div class="my-5">
                    <div class="row m-0 justify-content-between">
                        <div class="col-6 px-0">
                            <h5 class="mb-0 text-start">Nombres y Apellidos: <span
                                    class="font-weight-bold">{{ $ficha['nombres'] }}</span></h5>
                        </div>
                        <div class="col-6 px-0">
                            <h5 class="mb-0 text-end">{{ $ficha['tipodocumento'] }}: <span
                                    class="font-weight-bold">{{ $ficha['numerodocumento'] }}</span></h5>
                        </div>
                    </div>
                </div>
            </section>

            <div>
                <div>
                    <h5 class="font-weight-bold m-0">1.- ANTECEDENTES POLICIALES</h5>

                    @for ($j = 0; $j < $ficha['cant_ant_pol']; $j++)
                        <table class="tabla-antecedentes text-start tb-ant-text">
                            <tbody class="border-antecedentes">
                                <tr class="table1">
                                    <td width="35%"><strong>DEPENDENCIA</strong></td>
                                    <td width="65%"
                                        class="font-weight-bold {{ $ficha['antecedente']['policiales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                        {{ $ficha['antecedente']['policiales'][$j]['policiales_dependencia'] }}</td>
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
                                        {{ $ficha['antecedente']['policiales'][$j]['policiales_fecha_registro'] }}</td>
                                </tr>
                                <tr>
                                    <td><strong>FECHA DE HECHO</strong></td>
                                    <td
                                        class="font-weight-bold {{ $ficha['antecedente']['policiales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                        {{ $ficha['antecedente']['policiales'][$j]['policiales_fecha_hecho'] }}</td>
                                </tr>
                            </tbody>
                        </table>

                        @if ($ficha['cant_ant_pol'] == $j + 1)
                            <table class="antecedentes-conclusion text-start tb-ant-conc">
                                <tbody>
                                    <tr>
                                        <td width="35%" class="font-weight-bold">Conclusión</td>
                                        <td width="65%"
                                            class="font-weight-bold {{ $ficha['antecedente']['policiales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['policiales_conclusion'] ? 'Si Presenta Antecedentes Policiales' : 'No Presenta Antecedentes Policiales' }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        @endif
                    @endfor

                </div>
            </div>

            <div>
                <div class="m-0" style="padding-top: 2rem">
                    <h5 class="font-weight-bold m-0">2.- ANTECEDENTES JUDICIALES</h5>

                    @for ($t = 0; $t < $ficha['cant_ant_jud']; $t++)
                        <table class="tabla-antecedentes text-start tb-ant-text">
                            <tbody class="border-antecedentes">
                                <tr class="table1">
                                    <td width="35%"><strong>FISCALÍA</strong></td>
                                    <td width="65%"
                                        class="font-weight-bold {{ $ficha['antecedente']['judiciales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                        {{ $ficha['antecedente']['judiciales'][$t]['judiciales_fiscalia'] }}</td>
                                </tr>
                                <tr>
                                    <td><strong>EXPEDIENTE</strong></td>
                                    <td
                                        class="font-weight-bold {{ $ficha['antecedente']['judiciales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                        {{ $ficha['antecedente']['judiciales'][$t]['judiciales_expediente'] }}</td>
                                </tr>
                                <tr class="table1">
                                    <td><strong>DELITO</strong></td>
                                    <td
                                        class="font-weight-bold {{ $ficha['antecedente']['judiciales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                        {{ $ficha['antecedente']['judiciales'][$t]['judiciales_delito_poder'] }}</td>
                                </tr>
                                <tr>
                                    <td><strong>FECHA DE HECHO</strong></td>
                                    <td
                                        class="font-weight-bold {{ $ficha['antecedente']['judiciales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                        {{ $ficha['antecedente']['judiciales'][$t]['judiciales_fecha_hecho'] }}</td>
                                </tr>
                                <tr class="table1">
                                    <td><strong>SITUACIÓN JURÍDICA</strong></td>
                                    <td
                                        class="font-weight-bold {{ $ficha['antecedente']['judiciales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                        {{ $ficha['antecedente']['judiciales'][$t]['judiciales_situacion_juridica'] }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        @if ($ficha['cant_ant_jud'] == $t + 1)
                            <table class="antecedentes-conclusion text-start tb-ant-conc">
                                <tbody>
                                    <tr>
                                        <td width="35%" class="font-weight-bold">Conclusión</td>
                                        <td width="65%"
                                            class="font-weight-bold {{ $ficha['antecedente']['judiciales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['judiciales_conclusion'] ? 'Si Presenta Antecedentes Judiciales' : 'No Presenta Antecedentes Judiciales' }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        @endif
                    @endfor

                </div>
            </div>

            <div>
                <div class="m-0" style="padding-top: 2rem">
                    <h5 class="font-weight-bold m-0">3.- ANTECEDENTES PENALES</h5>

                    @for ($f = 0; $f < $ficha['cant_ant_pen']; $f++)
                        <table class="tabla-antecedentes text-start tb-ant-text">
                            <tbody class="border-antecedentes">
                                <tr class="table1">
                                    <td width="35%"><strong>DELITO</strong></td>
                                    <td width="65%"
                                        class="font-weight-bold {{ $ficha['antecedente']['penales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                        {{ $ficha['antecedente']['penales'][$f]['penales_delito_inpe'] }}</td>
                                </tr>
                                <tr>
                                    <td><strong>AUTORIDAD JUDICIAL</strong></td>
                                    <td
                                        class="font-weight-bold {{ $ficha['antecedente']['penales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                        {{ $ficha['antecedente']['penales'][$f]['penales_autoridad_judicial'] }}</td>
                                </tr>
                                <tr class="table1">
                                    <td><strong>ESTABLECIMIENTO PENITENCIARIO</strong></td>
                                    <td
                                        class="font-weight-bold {{ $ficha['antecedente']['penales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                        {{ $ficha['antecedente']['penales'][$f]['penales_establecimiento_penitenciario'] }}
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>FECHA DE INGRESO</strong></td>
                                    <td
                                        class="font-weight-bold {{ $ficha['antecedente']['penales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                        {{ $ficha['antecedente']['penales'][$f]['penales_fecha_ingreso'] }}</td>
                                </tr>
                            </tbody>
                        </table>

                        @if ($ficha['cant_ant_pen'] == $f + 1)
                            <table class="antecedentes-conclusion text-start tb-ant-conc">
                                <tbody>
                                    <tr>
                                        <td width="35%" class="font-weight-bold">Conclusión</td>
                                        <td width="65%"
                                            class="font-weight-bold {{ $ficha['antecedente']['penales_conclusion'] == 1 ? 'text-danger' : '' }}">
                                            {{ $ficha['antecedente']['penales_conclusion'] ? 'Si Presenta Antecedentes Penales' : 'No Presenta Antecedentes Penales' }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        @endif
                    @endfor

                </div>
            </div>

        </div>

    </div>

@endif
