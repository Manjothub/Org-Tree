from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Person
from .serializers import PersonSerializer

class PersonListCreateView(generics.ListCreateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

    def perform_create(self, serializer):
        try:
            serializer.save()
        except Exception as e:
            raise ValidationError({'error': str(e)})

class PersonDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

    def perform_update(self, serializer):
        try:
            serializer.save()
        except Exception as e:
            raise ValidationError({'error': str(e)})

    def perform_destroy(self, instance):
        try:
            instance.delete()
        except Exception as e:
            raise ValidationError({'error': str(e)})