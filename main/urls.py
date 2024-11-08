from django.urls import path
from main.views import HomePage

urlpatterns = [
    path('', HomePage, name='home'),
]