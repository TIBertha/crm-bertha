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
                <div class="row m-0 justify-content-end">
                    <h5 class="font-weight-bold mb-0">Fecha: {{ $ficha['fechaHoy'] }}</h5>
                </div>
                <p class="text-justify mt-5 mb-0"><strong>MAK CONSULTING SERVICE S.A.C.</strong> proporciona la
                    información a EMPLEOS RESIDENCIAL LA MOLINA E.I.R.L.,
                    quien solicita la verificación de identidad (RENIEC) y la verificación de antecedentes policiales,
                    judiciales y penales
                    del postulante. El presente informe ha sido elaborado en base a entrevistas e información de fuentes
                    públicas de
                    carácter CONFIDENCIAL, según lo establecido en la Ley de protección de datos personales N°29733.</p>
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

                <table class="tabla-antecedentes text-start tb-ant-text">
                    <tbody class="border-antecedentes">
                        <tr class="table1">
                            <td width="35%"><strong>DEPENDENCIA</strong></td>
                            <td width="65%" class="font-weight-bold">NO REGISTRA</td>
                        </tr>
                        <tr>
                            <td><strong>DELITO</strong></td>
                            <td class="font-weight-bold">NO REGISTRA</td>
                        </tr>
                        <tr class="table1">
                            <td><strong>FECHA DE REGISTRO</strong></td>
                            <td class="font-weight-bold">NO REGISTRA</td>
                        </tr>
                        <tr>
                            <td><strong>FECHA DE HECHO</strong></td>
                            <td class="font-weight-bold">NO REGISTRA</td>
                        </tr>
                    </tbody>
                </table>

                <table class="antecedentes-conclusion text-start tb-ant-conc">
                    <tbody>
                        <tr>
                            <td width="35%" class="font-weight-bold">Conclusión</td>
                            <td width="65%" class="font-weight-bold">No Presenta Antecedentes Policiales</td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>

        <div>
            <div class="m-0" style="padding-top: 2rem">
                <h5 class="font-weight-bold m-0">2.- ANTECEDENTES JUDICIALES</h5>

                <table class="tabla-antecedentes text-start tb-ant-text">
                    <tbody class="border-antecedentes">
                        <tr class="table1">
                            <td width="35%"><strong>FISCALÍA</strong></td>
                            <td width="65%" class="font-weight-bold">NO REGISTRA</td>
                        </tr>
                        <tr>
                            <td><strong>EXPEDIENTE</strong></td>
                            <td class="font-weight-bold">NO REGISTRA</td>
                        </tr>
                        <tr class="table1">
                            <td><strong>DELITO</strong></td>
                            <td class="font-weight-bold">NO REGISTRA</td>
                        </tr>
                        <tr>
                            <td><strong>FECHA DE HECHO</strong></td>
                            <td class="font-weight-bold">NO REGISTRA</td>
                        </tr>
                        <tr class="table1">
                            <td><strong>SITUACIÓN JURÍDICA</strong></td>
                            <td class="font-weight-bold">NO REGISTRA</td>
                        </tr>
                    </tbody>
                </table>

                <table class="antecedentes-conclusion text-start tb-ant-conc">
                    <tbody>
                        <tr>
                            <td width="35%" class="font-weight-bold">Conclusión</td>
                            <td width="65%" class="font-weight-bold">No Presenta Antecedentes Judiciales</td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>

        <div>
            <div class="m-0" style="padding-top: 2rem">
                <h5 class="font-weight-bold m-0">3.- ANTECEDENTES PENALES</h5>

                <table class="tabla-antecedentes text-start tb-ant-text">
                    <tbody class="border-antecedentes">
                        <tr class="table1">
                            <td width="35%"><strong>DELITO</strong></td>
                            <td width="65%" class="font-weight-bold">NO REGISTRA</td>
                        </tr>
                        <tr>
                            <td><strong>AUTORIDAD JUDICIAL</strong></td>
                            <td class="font-weight-bold">NO REGISTRA</td>
                        </tr>
                        <tr class="table1">
                            <td><strong>ESTABLECIMIENTO PENITENCIARIO</strong></td>
                            <td class="font-weight-bold">NO REGISTRA</td>
                        </tr>
                        <tr>
                            <td><strong>FECHA DE INGRESO</strong></td>
                            <td class="font-weight-bold">NO REGISTRA</td>
                        </tr>
                    </tbody>
                </table>

                <table class="antecedentes-conclusion text-start tb-ant-conc">
                    <tbody>
                        <tr>
                            <td width="35%" class="font-weight-bold">Conclusión</td>
                            <td width="65%" class="font-weight-bold">No Presenta Antecedentes Penales</td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>

    </div>

</div>
