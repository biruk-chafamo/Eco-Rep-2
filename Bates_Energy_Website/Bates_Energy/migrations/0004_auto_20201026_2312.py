# Generated by Django 3.1.2 on 2020-10-26 23:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Bates_Energy', '0003_auto_20201026_1915'),
    ]

    operations = [
        migrations.RenameField(
            model_name='observation',
            old_name='count',
            new_name='Quantity',
        ),
    ]
