from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
import os


def index(request):
    return render(request, 'Bates_Energy/index.html')


def processed_data(request, name):
    csv_file = open(os.path.join(settings.BASE_DIR, f'processed_data/{name}.csv'))
    return HttpResponse(csv_file, content_type="text/csv")


