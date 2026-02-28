@extends('Layouts.template-inside')


@section('breadcrumb')
    <div id="display-label" data-title="Contratos"></div>
@endsection

@section('content')
    <div id="contratos-app" data-url="{{ url('/') }}"></div>
@endsection
