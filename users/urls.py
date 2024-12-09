from django.urls import path
from users.views import *

urlpatterns = [
    path('login/', LogView.as_view(), name="Login"),
    path('logout/', logout_view, name="Logout"),
]
