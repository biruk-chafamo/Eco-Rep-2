from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.urls import reverse
from .forms import *
import datetime
from django.contrib.admin.views.decorators import staff_member_required
import pandas as pd




def index(request):
    return render(request, 'Bates_Energy/index2.html')


# def processed_data(request, names):
#
#     buildings_data_dict = {}
#     buildings_data = pd.DataFrame()
#     names = names.split(',')
#
#     if names[0] == 'date':
#         for i, date in enumerate(names[2::]):
#             if i == 0:
#                 buildings_data_dict['Time'] = pd.DataFrame({'Time':[obs.Time.strftime('%Y-%m-%d-%H-%M') for obs in Observation.objects.filter(
#                     building=names[1],
#                     Time__gt=datetime.datetime(int(date), 1, 1, 0, 0),
#                     Time__lt=datetime.datetime(int(date) + 1, 1, 1, 0, 0)
#                 )]})
#             buildings_data_dict[date] = pd.DataFrame({date: [obs.Quantity for obs in Observation.objects.filter(
#                 building=names[1],
#                 Time__gt=datetime.datetime(int(date), 1, 1, 0, 0),
#                 Time__lt=datetime.datetime(int(date)+1, 1, 1, 0, 0)
#             )]})
#         buildings_data = pd.concat([buildings_data_dict[col] for col in buildings_data_dict], axis=1)
#
#     else:
#         for i, name in enumerate(names):
#             if i == 0:
#                 buildings_data_dict['Time'] = pd.DataFrame({'Time':[obs.Time.strftime('%Y-%m-%d-%H-%M') for obs in Observation.objects.filter(building=name)]})
#             buildings_data_dict[name] = pd.DataFrame({name: [obs.Quantity for obs in Observation.objects.filter(building=name)]})
#         buildings_data = pd.concat([buildings_data_dict[col] for col in buildings_data_dict], axis=1)
#
#     buildings_data = buildings_data.to_csv(index=False)
#     return HttpResponse(buildings_data, content_type="text/csv")
#

def processed_data(request, names):

    buildings_data_dict = {}
    buildings_data = pd.DataFrame()
    names = names.split(',')

    if names[0] == 'date':
        for i, date in enumerate(names[2::]):
            if i == 0:
                buildings_data['Time'] = Observation.objects.filter(
                    building=names[1],
                    date_time__gt=datetime.datetime(int(date), 1, 1, 0, 0),
                    date_time__lt=datetime.datetime(int(date) + 1, 1, 1, 0, 0)
                ).values_list('string_time', flat=True)
            buildings_data[date] = Observation.objects.filter(
                building=names[1],
                date_time__gt=datetime.datetime(int(date), 1, 1, 0, 0),
                date_time__lt=datetime.datetime(int(date)+1, 1, 1, 0, 0)
            ).values_list('quantity', flat=True)

    else:
        for i, name in enumerate(names):
            if i == 0:
                buildings_data['Time'] = Observation.objects.filter(building=name).values_list('string_time', flat=True)
            buildings_data[name] = Observation.objects.filter(building=name).values_list('quantity', flat=True)
    buildings_data_df = pd.concat([buildings_data[col] for col in buildings_data], axis=1)
    buildings_data_csv = buildings_data_df.to_csv(index=False)
    return HttpResponse(buildings_data_csv, content_type="text/csv")


staff_member_required


def import_data(request):
    if request.method == "POST":
        # form = DataInput(request.POST, request.FILES)
        # # TODO: redefine is_valid() to validate CSV
        # if form.is_valid():
        #     form.save()
        files = request.FILES.getlist('files')
        for f in files:
            energy = pd.read_csv(f, index_col=0)
            DataInput().save(energy)
        return HttpResponseRedirect(reverse('Bates_Energy:index'))
    else:
        if Observation.objects.first():
            oldest_date = Observation.objects.first().date_time
            latest_date = Observation.objects.last().date_time
        else:
            oldest_date, latest_date = 'No available data', 'No available data'
        form = DataInput()
        context = {"latest_date": latest_date, "oldest_date": oldest_date, "csv_upload_form": form}
        return render(request, "Bates_Energy/imported.html", context)


