from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.validators import RegexValidator
from django.db import models

CHOICES = (
    ('admin', 'admin'),
    ('user', 'user')
)


class UserManager(BaseUserManager):
    def create_user(self, username, email, password, **extra_fields):
        """
        Creates and saves a User with the given email, username and password.
        """
        if username is None:
            raise TypeError('Users should have a username')
        if email is None:
            raise TypeError('Users should have a Email')
        if username == 'me':
            raise TypeError('Users not may username me')
        if password is None:
            raise TypeError('Password should not be none')
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password, **extra_fields):
        """
        Creates and saves a superuser with the given email and password.
        """
        if password is None:
            raise TypeError('Password should not be none')
        if username is None:
            raise TypeError('Users should have a username')
        if email is None:
            raise TypeError('Users should have a Email')
        if username == 'me':
            raise TypeError('Users not may username me')
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.is_admin = True
        user.is_superuser
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    username = models.CharField(
        max_length=150,
        verbose_name='user',
        unique=True,
        null=False,
        blank=False,
        validators=[
            RegexValidator(
                regex=r'^(?!^me$)[\w.@+-]+$',
                message='Username must be Alphanumeric',
                code='invalid_username',
            )
        ],
    )
    first_name = models.CharField(max_length=150, null=True, blank=True)
    last_name = models.CharField(max_length=150, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    email = models.EmailField(
        max_length=254,
        verbose_name='email address',
        unique=True,
        null=False,
        blank=False,
    )
    role = models.CharField(
        max_length=50, choices=CHOICES, default='user', null=True, blank=True
    )
    telegram_userid = models.PositiveBigIntegerField(
        null=True,
        blank=True,
        verbose_name="Telegram user ID",
        help_text="You can get this bot @userinfobot to get your userID",
        unique=True
    )

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        verbose_name = 'User'

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        """Does the user have a specific permission?"""
        return True

    def has_module_perms(self, app_label):
        """Does the user have permissions to view the app `app_label`?"""
        return True

    @property
    def is_staff(self):
        """Is the user a member of staff?"""
        return self.is_admin
