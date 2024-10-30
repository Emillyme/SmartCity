# SmartCity

**SmartCity** é um projeto que visa facilitar o gerenciamento e a visualização de sensores no Senai. Com este aplicativo, você pode facilmente adicionar, editar e remover sensores, permitindo um melhor monitoramento e gerenciamento de dados em tempo real.

## Funcionalidades

- **Visualizar Sensores**: Veja uma lista de todos os sensores cadastrados.
- **Adicionar Sensores**: Insira novos sensores ao sistema com informações detalhadas.
- **Editar Sensores**: Atualize as informações dos sensores existentes.
- **Deletar Sensores**: Remova sensores que não são mais necessários.

## Tecnologias Utilizadas

- **Backend**: Django e Django REST Framework
- **Frontend**: Next.js e React
- **Banco de Dados**: SQLite (ou outro de sua escolha)
- **Autenticação**: JWT (JSON Web Tokens)

## Instalação

### Backend (Django)

1. Navegue até a pasta do backend:
   ```bash
   cd server

2. Crie um ambiente virtual e ative-o:
    python -m venv venv
    source venv/bin/activate  # Para Linux/Mac
    venv\Scripts\activate     # Para Windows

3. Instale as dependências:
    pip install -r requirements.txt

4. Execute as migrações:
    python manage.py migrate

5. Inicie o servidor Django:
    python manage.py runserver

### Frontend (Next.js)

1. Navegue até a pasta do frontend:
    cd client

2. Instale as dependências
    npm install

3. Inicie o servidor Next.js
    npm run dev
