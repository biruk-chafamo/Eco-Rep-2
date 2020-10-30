from django import forms
from .models import *
import pandas as pd
import numpy as np
from fuzzywuzzy import process
from django.forms import ClearableFileInput


class DataInput(forms.Form):
    file = forms.FileField()

    class Meta:
        widgets = ClearableFileInput(attrs={'multiple': True})

    def rename_columns(self, data, column_names):
        subs = {}
        for column in data:
            best_guess = process.extractOne(column, column_names)
            if 75 < best_guess[1] < 100:
                subs[column] = best_guess[0]
        data.rename(columns=subs, inplace=True)

    def remove_out_of_tolerance(self, x, max_poss, min_poss):
        if x > max_poss or x <= min_poss:
            return np.nan
        else:
            return x

    def extrapolate(self, data, column):
        length = len(data.index)
        for i, obs in enumerate(data[column]):
            if np.isnan(obs) and not np.isnan(data[column][i - 1]):
                j = i + 1
                while j < length and np.isnan(data[column][j]):
                    j += 1
                if j < length:
                    avg = (data[column][i - 1] + data[column][j]) / 2
                    data[column][i:j] = [avg for _ in range(i, j)]

    def save(self):
        building_names = ['Adams', 'Bertram', 'Carnegie', 'Chapel', 'Chase', 'Pettigrew', 'Rzasa', 'Libbey', 'Page',
                          'Rand', 'Schaeffer', 'Lane', 'LaddLibrary', 'Hathorn', 'Parker', 'Cheney', 'Dana',
                          'Underhill', 'UnderhillIce', 'Olin', 'Pettengill']
        tolerances = {'Adams': 50, 'Bertram': 50, 'Carnegie': 800, 'Chapel': 20, 'Chase': 300, 'Pettigrew': 100,
                      'Rzasa': 100, 'Libbey': 50, 'Page': 50, 'Rand': 50, 'Schaeffer': 50, 'Lane': 300,
                      'LaddLibrary': 300, 'Hathorn': 50, 'Parker': 50, 'Cheney': 50, 'Dana': 300, 'Underhill': 1000,
                      'UnderhillIce': 1000, 'Olin': 200, 'Pettengill': 400}

        energy = pd.read_csv(self.cleaned_data["file"], index_col=0)
        energy.rename(columns=lambda x: x.split(' (')[0], inplace=True)

        self.rename_columns(energy, building_names)

        for building in energy:
            tolerance = tolerances[building]
            energy[building] = energy[building].apply(self.remove_out_of_tolerance, args=(tolerance, 0))
            self.extrapolate(energy, building)

        energy.index = pd.to_datetime(energy.index, errors='ignore', utc=True)
        for building in energy:
            observations = [
                Observation(
                    building=building,
                    Quantity=obs,
                    Time=energy.index[i].strftime('%Y-%m-%d-%H-%M')
                ) for i, obs in enumerate(energy[building])
            ]
            length = len(observations)
            start = 0
            end = start + 999

            if length % 999 == 0:
                cycles = length // 999
            else:
                cycles = (length // 999) + 1

            for cycle in range(cycles):
                Observation.objects.bulk_create(observations[start:min(end, length)])
                start, end = min(end, length), min(end+999, length)




