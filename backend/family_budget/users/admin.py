from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group

from users.models import User


class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""

    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'role',
            'first_name',
            'last_name',
            'password',
            'telegram_userid',
        )

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    disabled password hash display field.
    """

    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'role',
            'first_name',
            'last_name',
            'password',
            'is_active',
            'is_admin',
            'telegram_userid'
        )


class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = (
        'username',
        'email',
        'is_active',
        'is_admin',
        'role',
        'first_name',
        'last_name',
        'password',
        'telegram_userid'
    )
    list_filter = ('is_admin',)
    fieldsets = (
        (None, {'fields': ('username', 'email')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        (
            'Permissions',
            {
                'fields': (
                    'role',
                    'is_admin',
                    'is_active',
                )
            },
        ),
        ('Social network', {'fields': ('telegram_userid',)}),
        ('Password management', {'fields': ('password',)}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': (
                    'username',
                    'email',
                    'is_active',
                    'is_admin',
                    'role',
                    'first_name',
                    'last_name',
                    'password',
                    'telegram_userid',
                ),
            },
        ),
    )
    search_fields = ('username',)
    ordering = ('username',)
    filter_horizontal = ()

    def save_model(self, request, obj, form, change):
        if 'password' in form.changed_data:
            obj.set_password(form.cleaned_data['password'])
        super().save_model(request, obj, form, change)


admin.site.register(User, UserAdmin)
admin.site.unregister(Group)
