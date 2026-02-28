<div class="page">
    <div class="subpage recibo-pago">

        <section class="seccion1 tidal mb-4">
            <div class="row my-2 mx-0">
                <div class="col-6 text-center">
                    <img class="logoexperta" src="{{ asset('img/logo.png') }}" alt="LogoBerthaExpertaEnCasa">
                    <div class="mt-3 emp-details">
                        <p class="ti1">EMPLEOS RESIDENCIAL LA MOLINA E.I.R.L.</p>
                        <p class="ti2">AV. LA MOLINA NRO. 1167 INT. 124 URB. SAN CESAR 2DA ETAPA</p>
                        <p class="ti2">LA MOLINA - LIMA - LIMA-PERU</p>
                        <p class="ti2">WhatsApp: 51 999 256 807</p>
                    </div>
                </div>
                <div class="col-6 text-end font-weight-bold px-3 pb-3 pt-0">
                    <div class="border-title">
                        <p class="ti1">RECIBO DE PAGO</p>
                        <p class="ti2">R.U.C.: 20507645675</p>
                        <p class="ti2">Nro. {{ $recibo['numero_recibo'] }}</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="mb-4">
            <div class="border-title text-to-10">
                <div class="row mx-0">

                    @foreach ($recibo['fields'] as $r)
                        <div class="col-6 px-0 py-1">
                            <div class="row mx-0">
                                <div class="col-4 px-2">
                                    <div class="tq1">{{ $r['label'] }}:</div>
                                </div>
                                <div class="col-8 px-2">
                                    <div class="tq2">{{ $r['value'] }}</div>
                                </div>
                            </div>
                        </div>
                    @endforeach

                </div>
            </div>
        </section>

        <section class="mb-4">
            <table class="w-100 bordert2">
                <tr>
                    <th>CÓDIGO</th>
                    <th>CANTIDAD</th>
                    <th>DESCRIPCIÓN</th>
                    <th>VALOR UNITARIO</th>
                    <th>VALOR VENTA</th>
                </tr>
                <tr>
                    <td>C001</td>
                    <td>1.00 UNI</td>
                    <td>SELECCION DE PERSONAL</td>
                    <td>{{ $recibo['codigo_iso_divisa'] }} {{ $recibo['total'] }}</td>
                    <td>{{ $recibo['codigo_iso_divisa'] }} {{ $recibo['total'] }}</td>
                </tr>
            </table>
        </section>

        <section class="mb-5">
            <div class="row mx-0 justify-content-end">
                <div class="col-6 px-0 text-to-10">

                    <div class="row mx-0 text-center">
                        <div class="col-6 px-2">
                            <div class="tq1">Precio Venta:</div>
                        </div>
                        <div class="col-6 px-2 bottom-border">
                            <div class="tq2">{{ $recibo['codigo_iso_divisa'] }} {{ $recibo['total'] }}</div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
</div>
