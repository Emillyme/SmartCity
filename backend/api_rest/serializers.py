# Serializers
# Serve para transformar objetos em formato JSON
# Porque JSON é mais facil de ser manipulado e exportado

from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__' # Podemos colocar campos específicos aqui
        
    