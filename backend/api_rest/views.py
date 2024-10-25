# Nesse aquivo serao as funcoes para as rotas

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import User
from .serializers import UserSerializer

import json


@api_view(['GET'])
def get_users(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True) # many=True para retornar uma lista
        # Serializer tambem serve para transformar objetos em formato JSON
        return Response(serializer.data)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
def get_by_nickname(request, nickname):
    try:
        user = User.objects.get(pk=nickname)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    if request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)
                
# CRUD
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def user_manage(request):
    if request.method == 'GET':
        try:
            if request.GET['user']:
                user_nickname = request.GET['user']
                try:
                    user = User.objects.get(pk=user_nickname)
                except:
                    return Response(status=status.HTTP_404_NOT_FOUND)
                serializer = UserSerializer(user)
                return Response(serializer.data)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    # CRIANDO DADOS
    if request.method == 'POST':
        new_user = request.data
        serializer = UserSerializer(data=new_user) 
        
        if serializer.is_valid(): # verifica se os dados estao corretos e se ja existe um dado com o mesmo nickname
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    # ALTERANDO DADOS
    if request.method == 'PUT':
        nickname = request.data.get('user_nickname')
        
        if not nickname:
            return Response({"error": "Necessita de um nickname."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            updated_user = User.objects.get(pk=nickname)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)   
        
        print(request.data)

        serializer = UserSerializer(updated_user, data=request.data)   
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED) 
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETANDO DADOS
    if request.method == 'DELETE':
        try:
            nickname = request.data.get('user_nickname')
            user = User.objects.get(pk=nickname)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
                    
                    
                    
                    
def databaseEmDjango():
    # pega os dados do banco de dados, é uma classe.
    data = User.objects.get(pk='admin')    
    
    # QuerySet ou seja uma lista de dados, 
    # só consegue usar o filter quando tem mais de um dado
    # Para acessar o dado, basta colocar o nome da tabela e o nome da coluna
    # Exemplo:
    data = User.objects.filter(user_nickname='admin')   
    
    # Para excluir um dado, basta colocar o nome da tabela e o nome da coluna  
    # Exemplo:
    data = User.objects.exclude(user_email='admin')   
    
    # Para atualizar um dado, basta colocar o nome da tabela e o nome da coluna  
    # Exemplo:
    data.save()

    # Para deletar um dado, basta colocar o nome da tabela e o nome da coluna  
    # Exemplo:
    data.delete()