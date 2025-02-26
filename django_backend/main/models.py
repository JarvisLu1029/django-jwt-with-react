from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    specific_column = models.CharField(max_length=100, blank=True)