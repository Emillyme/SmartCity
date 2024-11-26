import csv
import os
from django.core.management.base import BaseCommand
from smartcity.models import Sensor

class Command(BaseCommand):
    help = 'Importa sensores a partir de um arquivo CSV'

    def handle(self, *args, **kwargs):
        # Caminho para o arquivo CSV
        csv_file_path = r'C:\Users\58645769808\Desktop\SmartCity\server\smartcity\data\sensores.csv'  # Usando o caminho bruto (r'')

        # Verifica se o arquivo CSV existe
        if not os.path.exists(csv_file_path):
            self.stdout.write(self.style.ERROR(f'Arquivo CSV não encontrado em {csv_file_path}'))
            return

        # Lê o CSV e importa os dados
        with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                # Cria o sensor a partir de cada linha
                Sensor.objects.create(
                    tipo=row['tipo'],
                    unidade_medida=row['unidade_medida'],
                    latitude=row['latitude'],
                    longitude=row['longitude'],
                    localizacao=row['localizacao'],
                    responsavel=row['responsavel'],
                    status_operacional=row['status_operacional'] == 'True',
                    observacao=row['observacao'],
                    mac_address=row['mac_address']
                )
                self.stdout.write(self.style.SUCCESS(f"Sensor {row['tipo']} importado com sucesso!"))
