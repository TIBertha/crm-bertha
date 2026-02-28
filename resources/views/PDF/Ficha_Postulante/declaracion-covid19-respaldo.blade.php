@if ($ficha['firma'])
    <div class="book">
        <div class="page">
            <div class="subpage">

                <section class="container seccion1 tidal mb-5">
                    <div class="row mb-2 mt-2 justify-content-between">
                        <div class="col-3 my-auto">
                            <img class="logo-experta" src="{{ asset('img/logo.png') }}" alt="LogoBerthaExpertaEnCasa">
                        </div>
                        <div class="col-3 text-end my-auto">
                            <h3>N°00000</h3>
                        </div>
                    </div>
                </section>

                <section class="container titulo mt-4 mb-5">
                    <h3>Declaración Jurada de trabajadores para prevenir el Coronavirus (COVID-19)</h3>
                </section>

                <section class="container introduccion-declaracion-covid">
                    <p>Esta declaración jurada está protegida por la ley de datos personales N° 29733.</p>
                </section>

                <section class="container seccion-covid informacion-postulante-covid">
                    <h4 class="titulo-seccion-covid">1. Información Personal</h4>
                    <div class="row container-fluid">
                        <div class="col-auto my-auto">
                            <p>Nombre :</p>
                        </div>
                        <div class="col columna-dato-covid">
                            <p>{{ $ficha['nombres'] }}</p>
                        </div>
                    </div>
                    <div class="row container-fluid">
                        <div class="col-auto my-auto">
                            <p>Tipo y N° de documento :</p>
                        </div>
                        <div class="col columna-dato-covid">
                            <p>{{ $ficha['tipodocumento'] }} - {{ $ficha['numerodocumento'] }}</p>
                        </div>
                    </div>
                </section>

                <section class="container seccion-covid preguntas-postulante-covid">
                    <h4 class="titulo-seccion-covid">2. Antecedentes de salud</h4>

                    <div class="pregunta-1 container-fluid">
                        <p>¿Ha sido diagnosticado con COVID-19?</p>
                        <div class="row container-fluid">
                            <div class="col-4">
                                <div class="row">
                                    <div class="cuadro-alternativa-covid">
                                    </div>

                                    <div class="col">
                                        <p class="respuesta-covid">Si</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-8">
                                <div class="row">
                                    <div class="cuadro-alternativa-covid text-center">
                                        <i class="fas fa-check"></i>
                                    </div>

                                    <div class="col">
                                        <p class="respuesta-covid">No</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pregunta-2 container-fluid">
                        <p>¿Tuvo contacto con alguna persona enferma con COVID-19?</p>
                        <div class="row container-fluid">
                            <div class="col-4">
                                <div class="row">
                                    <div class="cuadro-alternativa-covid">
                                    </div>

                                    <div class="col">
                                        <p class="respuesta-covid">Si</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-8">
                                <div class="row">
                                    <div class="cuadro-alternativa-covid text-center">
                                        <i class="fas fa-check"></i>
                                    </div>

                                    <div class="col">
                                        <p class="respuesta-covid">No</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pregunta-3 container-fluid">
                        <p class="enunciado-pregunta3">Actualmente, ¿Usted presenta algunos de estos síntomas?</p>
                        <div class="row container-fluid">
                            <div class="col-4 pregunta3-alternativa">
                                <div class="row">
                                    <div class="cuadro-alternativa-covid">
                                    </div>

                                    <div class="col">
                                        <p class="respuesta-covid">Tos</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-4 pregunta3-alternativa">
                                <div class="row">
                                    <div class="cuadro-alternativa-covid">
                                    </div>

                                    <div class="col">
                                        <p class="respuesta-covid">Fiebre</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-4 pregunta3-alternativa">
                                <div class="row">
                                    <div class="cuadro-alternativa-covid text-center">
                                        <i class="fas fa-check"></i>
                                    </div>

                                    <div class="col">
                                        <p class="respuesta-covid">Ninguno</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-4 pregunta3-alternativa">
                                <div class="row">
                                    <div class="cuadro-alternativa-covid">
                                    </div>

                                    <div class="col">
                                        <p class="respuesta-covid">Dolor de garganta</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-8 pregunta3-alternativa">
                                <div class="row">
                                    <div class="cuadro-alternativa-covid">
                                    </div>

                                    <div class="col">
                                        <p class="respuesta-covid">Dolor muscular</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-4 pregunta3-alternativa">
                                <div class="row">
                                    <div class="cuadro-alternativa-covid">
                                    </div>

                                    <div class="col">
                                        <p class="respuesta-covid">Secreciones nasales</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-8 pregunta3-alternativa">
                                <div class="row">
                                    <div class="cuadro-alternativa-covid">
                                    </div>

                                    <div class="col">
                                        <p class="respuesta-covid">Dificultad respiratoria</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </section>

                <section class="container final-constancia-covid">
                    <div>
                        <p>Declaro bajo juramento que esta información es verdadera y pongo mi firma para fines legales
                            correspondientes.</p>
                        <p>En caso de resultar falsa la información que proporciono, me sujeto a los alcances de lo
                            establecido en el artículo 411° del Código Penal, concordante con el artículo 32° de la Ley
                            N° 27444, Ley de Procedimiento Administrativo General.</p>
                        <p>En fe de lo cual firmo la presente.</p>
                    </div>

                    <div class="area-fecha-covid">
                        <p>En <span class="blank-space mx-1"></span> de <span class="blank-space mx-1"></span> de 2022
                        </p>
                    </div>
                </section>

                <section class="container firma">
                    <div class="row d-flex justify-content-center">
                        <div class="col-6 font1 text-center">
                            <span style="color: #FFFFFF">.</span>
                            <img class="w-70 mx-auto" src="{{ $ficha['firma'] }}">
                            <hr class="mb-0">
                            <p>FIRMA</p>
                            <p>{{ $ficha['tipodocumento'] }}: {{ $ficha['numerodocumento'] }}</p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    </div>
@endif
