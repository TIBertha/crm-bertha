@extends('Layouts.template-inside')


@section('breadcrumb')
    <div id="display-label" data-title="Postulantes"></div>
@endsection

@section('content')
    <div id="postulantes-app" data-url="{{ url('/') }}"></div>
@endsection
