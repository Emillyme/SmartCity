# Generated by Django 5.1.2 on 2024-11-28 11:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('smartcity', '0005_rename_sensor_id_contadordata_sensor_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contadordata',
            name='timestamp',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='luminosidadedata',
            name='timestamp',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='sensorupload',
            name='uploaded_at',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='temperaturadata',
            name='timestamp',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='umidadedata',
            name='timestamp',
            field=models.DateTimeField(),
        ),
    ]
