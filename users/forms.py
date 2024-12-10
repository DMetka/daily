from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User


class CustomAuthenticationForm(AuthenticationForm):
    username = forms.CharField(label='', max_length=10, widget=forms.TextInput(attrs={
        'class': '',
        'placeholder': 'Введите ваш логин',
    }))
    password = forms.CharField(label='', strip=False, widget=forms.PasswordInput(attrs={
        'class': '',
        'placeholder': 'Введите ваш пароль',
    }))


class CustomRegistrationForm(forms.Form):
    username = forms.CharField(label='', max_length=10, widget=forms.TextInput(attrs={
            'class': '',
            'placeholder': 'Придумайте ваш логин'
        })
    )
    password1 = forms.CharField(label='', widget=forms.PasswordInput(attrs={
            'class': '',
            'placeholder': 'Придумайте ваш пароль'
        })
    )
    password2 = forms.CharField(label='', widget=forms.PasswordInput(attrs={
            'class': '',
            'placeholder': 'Подтвердите ваш пароль'
        })
    )

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("Этот логин уже занят.")
        return username

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")

        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Пароли не совпадают.")

        return cleaned_data