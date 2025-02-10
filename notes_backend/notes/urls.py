from django.urls import path
from .views import NoteListCreateView, NoteDetailView, RegisterUserView, UserDetailView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('user/', UserDetailView.as_view(), name='user'),
    path('notes/', NoteListCreateView.as_view(), name='notes-list'),
    path('notes/<int:pk>/', NoteDetailView.as_view(), name='note-detail'),
]
