from django.db import models

# Create your models here.


class Observation(models.Model):
    building = models.CharField(max_length=150, unique=False, null=True)
    Day = models.CharField(max_length=150, unique=False, null=True)
    Interval = models.CharField(max_length=150, unique=False, null=True)
    Quantity = models.FloatField(unique=False, null=True)

    def __str__(self):
        return str(self.building)