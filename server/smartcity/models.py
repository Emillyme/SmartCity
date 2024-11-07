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
    
    
class TemperaturaData(models.Model):
    valor = models.FloatField()
    sensor_id = models.ForeignKey(Sensor, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    def str (self):
        return f"Temperatura - {self.valor} Celsius - {self.timestamp}"
    
class UmidadeData(models.Model):
    sensor_id = models.ForeignKey(Sensor, on_delete=models.CASCADE)
    valor = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
    def str (self):
        return f"Umidade - {self.valor} % - {self.timestamp}"

class LuminosidadeData(models.Model):
    valor = models.FloatField()
    sensor_id = models.ForeignKey(Sensor, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    def str (self):
        return f"Luminosidade - {self.valor} % - {self.timestamp}"
    
class ContadorData(models.Model):
    sensor_id = models.ForeignKey(Sensor, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    def str (self):
        return f"Contador - {self.valor} - {self.timestamp}"