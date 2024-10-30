from django.shortcuts import render
from django.contrib.auth import authenticate
from django.http import HttpResponse
from .serializers import UserRegisterSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken


def abre_index(request):
    mensagem = "Hello world!"
    return HttpResponse(mensagem)

class UserRegisterView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
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