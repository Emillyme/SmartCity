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
        fields = '__all__'