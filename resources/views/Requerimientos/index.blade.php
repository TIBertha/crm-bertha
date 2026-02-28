@extends('Layouts.template-inside')


@section('breadcrumb')
    <div id="display-label" data-title="Requerimientos"></div>
@endsection

@section('content')
    <div id="requerimientos-app" data-url="{{ url('/') }}"></div>
@endsection
