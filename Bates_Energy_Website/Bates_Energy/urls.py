from django.urls import path

from . import views

app_name = "Bates_Energy"
urlpatterns = [
    path('', views.index, name='index'),
    path('import_data', views.import_data, name='import_data'),
    path('processed_data/<name>', views.processed_data, name='processed_data'),
]