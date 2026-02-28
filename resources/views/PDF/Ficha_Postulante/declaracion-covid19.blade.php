@if ($ficha['direccion'] and $ficha['firma'])
    <div class="book"></div>

    <div class="page">
        <div class="subpage-none">

            <section class="container seccion1 tidal mb-5">
                <div class="row mb-2 mt-2 justify-content-between">
                    <div class="col-4 my-auto">
                        <img class="logo-experta" src="{{ asset('img/logo.png') }}" alt="LogoBerthaExpertaEnCasa">
                    </div>
                    <div class="col-4 text-end my-auto">
                        <h3>N° {{ $ficha['id'] }}</h3>
                    </div>
                </div>
            </section>

            <section class="container titulo mt-4 mb-5">
                <h4 class="title-declaracion-covid">Declaración Jurada de trabajadores para prevenir el Coronavirus
                    (COVID-19)</h4>
            </section>

            <section class="container seccion-covid informacion-postulante-covid">
                <p>Yo, <span class="blank-space">{{ $ficha['nombreapellido'] }}</span>, identificado(a) con <span
                        class="blank-space">{{ $ficha['tipodocumento'] }}</span> N° <span
                        class="blank-space">{{ $ficha['numerodocumento'] }}</span> y con domicilio en <span
                        class="blank-space">{{ $ficha['domiciliodeclaracion'] }}</span> :</p>
            </section>

            <section class="container seccion-covid preguntas-postulante-covid my-4">
                <h4 class="titulo-seccion-covid">DECLARO BAJO JURAMENTO:</h4>

                <ul class="checks-covid">
                    <li>No haber sido diagnosticado(a) con COVID-19.</li>
                    <li>No haber tenido contacto con alguna persona enferma con COVID-19.</li>
                    <li>No presento ninguno de los siguientes síntomas: Tos, fiebre, dolor de
                        garganta, fatiga, dificultad respiratoria, diarrea, pérdida del olfato, pérdida
                        del gusto y/o color azul de los labios (cianosis).</li>
                    <li>No haber incumplido el aislamiento social obligatorio.</li>
                    <li>No tener enfermedades preexistentes: hipertensión arterial,
                        cardiovasculares, cáncer, diabetes mellitus, asma, enfermedades
                        respiratorias crónicas (tuberculosis), insuficiencia renal crónica y/o un IMC
                        (índice de masa corporal) mayor a 40%.</li>
                </ul>

            </section>


            <section class="container final-constancia-covid">
                <div>
                    <p>En caso de resultar falsa la información que proporciono, me sujeto a los alcances de lo
                        establecido en el artículo 411° del Código Penal, concordante con el artículo 32° de la Ley N°
                        27444, Ley de Procedimiento Administrativo General.</p>
                </div>

                <div class="area-fecha-covid">
                    <p>En <span class="blank-space">{{ $ficha['diaregistro'] }}</span> de <span
                            class="blank-space">{{ $ficha['mesregistro'] }}</span> de {{ $ficha['anioregistro'] }}</p>
                </div>

            </section>

            <section class="container mt-4 firma">
                <div class="row d-flex justify-content-center">
                    <div class="col-6 font1 text-center">
                        <span style="color: #FFFFFF">.</span>
                        <img class="w-70 mx-auto {{ $ficha['restringida'] ? 'difuminado' : '' }}"
                            src="{{ $ficha['firma'] }}" />
                        <hr class="mb-0">
                        <p>FIRMA</p>
                    </div>
                </div>
                <div class="datos-postulante font1">
                    <p>Nombre: {{ $ficha['nombres'] }} </p>
                    <p>DNI: {{ $ficha['numerodocumento'] }} </p>
                </div>
            </section>


            <section class="container aviso pt-4">
                <p><strong>AVISO IMPORTANTE</strong></p>
                <ul>
                    <li>Esta declaración jurada está protegida por la ley de datos personales N° 29733.</li>
                    <li>Esta declaración jurada está protegida por el artículo 411° del Código Penal: El que, en un
                        procedimiento administrativo, hace una falsa declaración en relación a hechos o circunstancias
                        que le corresponde probar, violando la presunción de veracidad establecida por ley, será
                        reprimido con pena privativa de libertad no menor de uno ni mayor de cuatro años.</li>
                </ul>
            </section>

        </div>
    </div>

    <div class="book"></div>
@endif
