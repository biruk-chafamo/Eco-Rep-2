# Generated by Django 3.1.2 on 2020-10-26 19:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Bates_Energy', '0002_auto_20201026_1914'),
    ]

    operations = [
        migrations.RenameField(
            model_name='observation',
            old_name='Quantity',
            new_name='count',
        ),
    ]
