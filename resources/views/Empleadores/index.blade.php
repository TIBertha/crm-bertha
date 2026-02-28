@extends('Layouts.template-inside')


@section('breadcrumb')
    <div id="display-label" data-title="Empleadores"></div>
@endsection

@section('content')
    <div id="empleadores-app" data-url="{{ url('/') }}"></div>
@endsection
