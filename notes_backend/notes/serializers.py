from rest_framework import serializers
from .models import Note
from django.contrib.auth.models import User  # ✅ Add this line!


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at']  # ✅ Exclude 'user' from required fields
        read_only_fields = ['id', 'created_at']  # ✅ Ensure 'id' and 'created_at' are read-only

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']