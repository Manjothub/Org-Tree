from rest_framework import serializers
from .models import Person

class PersonSerializer(serializers.ModelSerializer):
    manager_id = serializers.PrimaryKeyRelatedField(
        queryset=Person.objects.all(), source='manager', allow_null=True
    )
    subordinates = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Person
        fields = ['id', 'name', 'position', 'manager_id', 'subordinates']