from rest_framework import serializers
from .models import Person

class PersonSerializer(serializers.ModelSerializer):
    manager_id = serializers.PrimaryKeyRelatedField(
        queryset=Person.objects.all(), source='manager', allow_null=True
    )
    subordinates = serializers.PrimaryKeyRelatedField(many=True, read_only=True) #Response will be id as per the foreign key relationship

    class Meta:
        model = Person
        fields = ['id', 'name', 'position', 'manager_id', 'subordinates']