@if($ficha['checkeducacion'] AND $ficha['educacion'])

    <div class="page">
        <div class="subpage-none">

            @include('PDF.Ficha_Postulante.Sections.section-estudios')

        </div>
    </div>

    <div class="book"></div>

@endif
