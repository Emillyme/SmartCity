from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Sensor, TemperaturaData, UmidadeData, LuminosidadeData, ContadorData, SensorUpload

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email"]
    

class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = '__all__'

class TemperaturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemperaturaData
        fields = '__all__'
    
class UmidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UmidadeData
        fields = '__all__'

class LuminosidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LuminosidadeData
        fields = '__all__'

class ContadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContadorData
        fields = '__all__'
        
class SensorUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorUpload
        fields = ['sensor_id', 'csv_file', 'sensor_type']

    def validate_sensor_type(self, value):
        # Verifique se o tipo de sensor é válido
        if value not in ['Temperatura', 'Umidade', 'Luminosidade', 'Contador']:  # Adapte isso para os tipos que você tiver
            raise serializers.ValidationError("Tipo de sensor não suportado")
        return value



        