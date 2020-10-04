from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('processed_data/<name>', views.processed_data, name='processed_data'),
]