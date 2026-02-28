@extends('Layouts.template-inside')


@section('breadcrumb')
    <div id="display-label" data-title="Credenciales"></div>
@endsection

@section('content')
    <div id="credenciales-app" data-url="{{ url('/') }}"></div>
@endsection
