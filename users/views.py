from django.contrib.auth import logout
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect
from users.forms import CustomAuthenticationForm


class LogView(LoginView):
    template_name = 'auth.html'
    form_class = CustomAuthenticationForm
#main обработка входа


def logout_view(request):
    if request.method == "GET":
        logout(request)
        return redirect('Login')
    return redirect('Login')
#main обработка выхода
