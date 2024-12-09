from django import forms
from django.contrib.auth.forms import AuthenticationForm


class CustomAuthenticationForm(AuthenticationForm):
    username = forms.CharField(label='', max_length=10, widget=forms.TextInput(attrs={
        'class': '',
        'placeholder': 'Введите ваш логин',
    }))
    password = forms.CharField(label='', strip=False, widget=forms.PasswordInput(attrs={
        'class': '',
        'placeholder': 'Введите ваш пароль',
    }))