# Generated by Django 3.1.2 on 2020-11-11 02:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Bates_Energy', '0007_auto_20201030_0113'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='observation',
            options={'ordering': ['Time']},
        ),
        migrations.AlterField(
            model_name='observation',
            name='Time',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
