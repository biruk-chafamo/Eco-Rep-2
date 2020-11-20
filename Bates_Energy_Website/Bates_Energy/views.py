from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.urls import reverse
from .forms import *
from django.contrib.admin.views.decorators import staff_member_required
from django.core import serializers


def index(request):
    return render(request, 'Bates_Energy/index.html')


def processed_data(request, name):

    data = serializers.serialize(
        'python',
        Observation.objects.filter(building=name),
        fields=('Quantity', 'Time')
    )
    actual_data = [d['fields'] for d in data]

    return JsonResponse(actual_data, safe=False)


@staff_member_required
def import_data(request):
    if request.method == "POST":
        form = DataInput(request.POST, request.FILES)
        # TODO: redefine is_valid() to validate CSV
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse('Bates_Energy:index'))
    else:
        form = DataInput()
        context = {"csv_upload_form": form}
        return render(request, "Bates_Energy/imported.html", context)


