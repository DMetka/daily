from django.contrib.auth import logout, login
from django.contrib.auth.models import User
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect
from users.forms import CustomAuthenticationForm, CustomRegistrationForm


class LogView(LoginView):
    template_name = 'users/auth.html'
    form_class = CustomAuthenticationForm
#main обработка входа


def logout_view(request):
    if request.method == "GET":
        logout(request)
        return redirect('Login')
    return redirect('Login')
#main обработка выхода

def register(request):
    if request.method == 'POST':
        form = CustomRegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')

            user = User.objects.create_user(username=username, password=password)

            login(request, user)

            return redirect('/')

    else:
        form = CustomRegistrationForm()

    return render(request, 'users/reg.html', {'form': form})