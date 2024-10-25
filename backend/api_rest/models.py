from django.db import models

class User(models.Model):
    user_nickname = models.CharField(max_length=255, primary_key=True, default="")
    user_name = models.CharField(max_length=255, default="")
    user_email = models.EmailField(max_length=255)

def __str__(self):
    return f'Nickname: {self.user_nickname}, Name: {self.user_name}, Email: {self.user_email}'

