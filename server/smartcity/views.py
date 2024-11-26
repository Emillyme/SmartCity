from django.shortcuts import render
from django.contrib.auth import authenticate
from django.http import HttpResponse
from .serializers import UserRegisterSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from django.contrib.auth.models import User
from django.utils.encoding import force_str 
from base64 import urlsafe_b64decode
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .filters import SensorFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Sensor, SensorUpload,TemperaturaData, UmidadeData, LuminosidadeData, ContadorData
from.serializers import  SensorUploadSerializer, SensorSerializer, TemperaturaSerializer, UmidadeSerializer, LuminosidadeSerializer, ContadorSerializer, UserSerializer

def abre_index(request):
    mensagem = "Hello world!"
    return HttpResponse(mensagem)

class GetUser(APIView):
    permission_classes = [IsAuthenticated] 
    
    def get(self, request):
        user = request.user 
        
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserRegisterView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save() # salva o usuario
            access = AccessToken.for_user(user)
            refresh = RefreshToken.for_user(user)

            # Retorna o token de acesso e refresh
            return Response({
                    'message': "Usuário criado com sucesso",
                    'access': str(access),
                    'refresh': str(refresh)
                }, status=status.HTTP_201_CREATED)        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # authenticate é a função que faz a autenticação dos dados passados pelo usuário
        user = authenticate(username=username, password=password)

        if user is not None:
            # Usuário autenticado com sucesso
            # Gerando tokens JWT

            access = AccessToken.for_user(user)
            refresh = RefreshToken.for_user(user)

            return Response({
                'access': str(access),
                'refresh': str(refresh)
            }, status=status.HTTP_200_OK)
        else:
            # Usuário ou senha inválidos
            return Response({'error': 'Usuario ou senha inválidos'}, status=status.HTTP_401_UNAUTHORIZED)
        
class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()

        if user:
            # Enviar email de reset de senha
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"http://localhost:3000/PasswordReset/?uidb64={uid}&token={token}"  # Use a URL do seu frontend

            send_mail(
                'Redefinição de senha',
                f'Por favor, clique no link para redefinir sua senha: {reset_link}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False
            )
            return Response({'message': 'Um link de redefinição de senha foi enviado para o seu email.'}, status=status.HTTP_200_OK)
        return Response({'error': 'Email não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    
class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        new_password = request.data.get('new_password')

        # Adiciona padding ao uidb64, se necessário
        try:
            while len(uidb64) % 4 != 0:
                uidb64 += "="
            user_id = force_str(urlsafe_b64decode(uidb64))
        except (TypeError, ValueError, binascii.Error):
            return Response({'error': 'UID inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Usuário não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Senha redefinida com sucesso!'}, status=status.HTTP_200_OK)

        return Response({'error': 'Token inválido ou expirado.'}, status=status.HTTP_400_BAD_REQUEST)
    
# Para listar e criar sensores (GET e POST)
# Classe para lidar com TODOS os sensores
class SensorListView(generics.ListAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
    filterset_class = SensorFilter  
    filter_backends = [DjangoFilterBackend]
        
    permission_classes = [IsAuthenticated]  # Exige que o usuário esteja autenticado
    def get(self, request):
        sensores = Sensor.objects.all()
        serializer = SensorSerializer(sensores, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = SensorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# idar com operações de atualização (PUT) e exclusão (DELETE) de um sensor específico, identificado pelo seu ID.
# Classe para lidar com sensor especificado por seu ID.
class SensorDetailView(APIView):
    permission_classes = [IsAuthenticated]  # Exige que o usuário esteja autenticado

    def get_object(self, pk):
        # Usa o get_object_or_404 para retornar 404 automaticamente se não encontrar
        return get_object_or_404(Sensor, pk=pk)

    def get(self, request, pk):
        sensor = self.get_object(pk)
        serializer = SensorSerializer(sensor)
        return Response(serializer.data)

    def put(self, request, pk):
        sensor = self.get_object(pk)
        if sensor is None:
            return Response({'error': 'Sensor não encontrado'}, status=status.HTTP_404_NOT_FOUND)
            
        serializer = SensorSerializer(sensor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    
    def delete(self, request, pk):
        sensor = self.get_object(pk)
        if sensor is None:
            return Response({'error': 'Sensor não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        sensor.delete()
        return Response({'message': 'Sensor excluído com sucesso!'}, status=status.HTTP_204_NO_CONTENT)


class TemperaturaView(APIView):
    permission_classes = [IsAuthenticated]  # Exige que o usuário esteja autenticado
    def get(self, request):
        sensoresTemp = TemperaturaData.objects.all()
        serializer = TemperaturaSerializer(sensoresTemp, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = TemperaturaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TemperaturaDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(TemperaturaData, pk=pk)
    
    def get(self, request, pk):
        sensor = self.get_object(pk)
        serializer = TemperaturaSerializer(sensor)
        return Response(serializer.data)
    
    def put(self, request, pk):
        sensor = self.get_object(pk)
        serializer = TemperaturaSerializer(sensor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        sensor = self.get_object(pk)
        sensor.delete()
        return Response({'message': 'Sensor excluído com sucesso!'}, status=status.HTTP_204_NO_CONTENT)
    
class UmidadeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        sensorUmidade = UmidadeData.objects.all()
        serializer = UmidadeSerializer(sensorUmidade, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UmidadeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UmidadeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(UmidadeData, pk=pk)

    def get(self, request, pk):
        sensor = self.get_object(pk)
        serializer = UmidadeSerializer(sensor)
        return Response(serializer.data)

    def put(self, request, pk):
        sensor = self.get_object(pk)
        serializer = UmidadeSerializer(sensor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        sensor = self.get_object(pk)
        sensor.delete()
        return Response({'message': 'Sensor excluído com sucesso!'}, status=status.HTTP_204_NO_CONTENT)
    
class LuminosidadeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        sensorLuminosidade = LuminosidadeData.objects.all()
        serializer = LuminosidadeSerializer(sensorLuminosidade, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = LuminosidadeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LuminosidadeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(LuminosidadeData, pk=pk)

    def get(self, request, pk):
        sensor = self.get_object(pk)
        serializer = LuminosidadeSerializer(sensor)
        return Response(serializer.data)

    def put(self, request, pk):
        sensor = self.get_object(pk)
        serializer = LuminosidadeSerializer(sensor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        sensor = self.get_object(pk)
        sensor.delete() 
        return Response({'message': 'Sensor excluído com sucesso!'}, status=status.HTTP_204_NO_CONTENT)

class ContadorView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        sensorContador = ContadorData.objects.all()
        serializer = ContadorSerializer(sensorContador, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ContadorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContadorDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(ContadorData, pk=pk)

    def get(self, request, pk):
        sensor = self.get_object(pk)
        serializer = ContadorSerializer(sensor)
        return Response(serializer.data)

    def put(self, request, pk):
        sensor = self.get_object(pk)
        serializer = ContadorSerializer(sensor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        sensor = self.get_object(pk)
        sensor.delete()
        return Response({'message': 'Sensor excluído com sucesso!'}, status=status.HTTP_204_NO_CONTENT)

class SensorUploadView(APIView):
    # permission_classes = [IsAuthenticated]  # Descomente se necessário
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        serializer = SensorUploadSerializer(data=request.data)
        
        if serializer.is_valid():
            # Salva o upload do arquivo
            sensor_upload = serializer.save()

            # Processar o arquivo CSV
            sensor_type = sensor_upload.sensor_type
            csv_file = sensor_upload.csv_file
            data = csv_file.read().decode('utf-8')
            csv_reader = csv.reader(StringIO(data))

            # Baseado no tipo de sensor, preenche o modelo correspondente
            if sensor_type == 'Temperatura':
                self._process_csv_for_temperatura(csv_reader, sensor_upload)
            elif sensor_type == 'Umidade':
                self._process_csv_for_umidade(csv_reader, sensor_upload)
            elif sensor_type == 'Luminosidade':
                self._process_csv_for_luminosidade(csv_reader, sensor_upload)
            elif sensor_type == 'Contador':
                self._process_csv_for_contador(csv_reader, sensor_upload)
            else:
                return Response({"error": "Tipo de sensor desconhecido!"}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"message": f"Upload realizado para o sensor {sensor_type}!"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _process_csv_for_temperatura(self, csv_reader, sensor_upload):
        for row in csv_reader:
            try:
                valor = float(row[0])  # Supondo que o valor está na primeira coluna
                sensor = Sensor.objects.filter(tipo="Temperatura").first()  # Recuperar o sensor associado
                if sensor:
                    TemperaturaData.objects.create(valor=valor, sensor_id=sensor)
            except ValueError:
                raise ValidationError("Erro ao processar valor de Temperatura no CSV.")

    def _process_csv_for_umidade(self, csv_reader, sensor_upload):
        for row in csv_reader:
            try:
                valor = float(row[0])  # Supondo que o valor está na primeira coluna
                sensor = Sensor.objects.filter(tipo="Umidade").first()  # Recuperar o sensor associado
                if sensor:
                    UmidadeData.objects.create(valor=valor, sensor_id=sensor)
            except ValueError:
                raise ValidationError("Erro ao processar valor de Umidade no CSV.")

    def _process_csv_for_luminosidade(self, csv_reader, sensor_upload):
        for row in csv_reader:
            try:
                valor = float(row[0])  # Supondo que o valor está na primeira coluna
                sensor = Sensor.objects.filter(tipo="Luminosidade").first()  # Recuperar o sensor associado
                if sensor:
                    LuminosidadeData.objects.create(valor=valor, sensor_id=sensor)
            except ValueError:
                raise ValidationError("Erro ao processar valor de Luminosidade no CSV.")

    def _process_csv_for_contador(self, csv_reader, sensor_upload):
        for row in csv_reader:
            try:
                valor = int(row[0])  # Supondo que o valor está na primeira coluna
                sensor = Sensor.objects.filter(tipo="Contador").first()  # Recuperar o sensor associado
                if sensor:
                    ContadorData.objects.create(valor=valor, sensor_id=sensor)
            except ValueError:
                raise ValidationError("Erro ao processar valor de Contador no CSV.")