from django.db import models


class Observation(models.Model):
    building = models.CharField(max_length=150, unique=False, null=True)
    date_time = models.DateTimeField(null=True, blank=True)
    quantity = models.FloatField(unique=False, null=True)
    string_time = models.CharField(max_length=20, unique=False, null=True, blank=True)

    class Meta:
        ordering = ['date_time']

    def __str__(self):
        return str(self.building)

