from django.db import models

class Sensor(models.Model):
    TIPOS_SENSOR_CHOICES = [
        ('Temperatura', 'Temperatura'),
        ('Umidade', 'Umidade'),
        ('Luminosidade', 'Luminosidade'),
        ('Contador', 'Contador'),
    ]
    
    tipo = models.CharField(max_length=20, choices=TIPOS_SENSOR_CHOICES)
    unidade_medida = models.CharField(max_length=20, blank=True, null=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    localizacao = models.CharField(max_length=100)
    responsavel = models.CharField(max_length=100)
    status_operacional = models.BooleanField(default=True)
    observacao = models.TextField(blank=True, null=True)
    mac_address = models.CharField(max_length=20, null=True)
    def str (self):
        return f"{self.tipo} - {self.localizacao}"
    