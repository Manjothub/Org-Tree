from django.db import models

class Person(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    manager = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='subordinates')

    def __str__(self):
        return self.name

    def delete(self, *args, **kwargs):
        for subordinate in self.subordinates.all():
            subordinate.delete()
        super().delete(*args, **kwargs)
