# Generated by Django 3.1.2 on 2020-10-27 00:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Bates_Energy', '0004_auto_20201026_2312'),
    ]

    operations = [
        migrations.RenameField(
            model_name='observation',
            old_name='month',
            new_name='Day',
        ),
    ]
