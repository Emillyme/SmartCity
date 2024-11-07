import django_filters
from .models import Sensor

class SensorFilter(django_filters.FilterSet):
    tipo = django_filters.ChoiceFilter(choices=Sensor.TIPOS_SENSOR_CHOICES, empty_label="Escolha o tipo")
    unidade_medida = django_filters.CharFilter(lookup_expr='icontains')
    latitude = django_filters.NumberFilter()
    longitude = django_filters.NumberFilter()
    status_operacional = django_filters.BooleanFilter()

    class Meta:
        model = Sensor
        fields = ['tipo', 'unidade_medida', 'latitude', 'longitude', 'status_operacional']
