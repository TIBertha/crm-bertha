<section class="container seccion5 mt-3 mb-3 tidal font1">
    <div class="titulo-seccion">
        <h6>ESTUDIOS</h6>
    </div>

    <div class="contenedor-tabla-recomendacion">
        <table class="tabla-recomendacion">
            <thead>
                <tr>
                    <th style="width: 20%; text-align: left"><strong>TIPO CERTIFICADO</strong></th>
                    <th style="width: 40%; text-align: left"><strong>CENTRO DE ESTUDIOS</strong></th>
                    <th style="width: 40%; text-align: left"><strong>TÍTULO</strong></th>
                </tr>
            </thead>
            <tbody>
                @foreach ($ficha['educacion'] as $e)
                    <tr class="text-start">
                        <td>{{ $e['tipocertificado'] }}</td>
                        <td>{{ $e['centro'] }}</td>
                        <td>{{ $e['titulo'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

</section>
