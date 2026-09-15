from django.urls import path
from .views import postImageView,getAnnotatedImageView,getAnnotations,deleteUpload,getImagesView,deleteUserImage,getUserImages
urlpatterns = [
    path('post/',postImageView.as_view(),name='upload-image'),
    path('get-annotated-image/',getAnnotatedImageView.as_view(),name='get-annotated-image'),
    path('get-annotations/',getAnnotations.as_view(),name='get-annotations'),
    path('delete-upload/',deleteUpload.as_view(),name='delete-upload'),
    path('get-images/',getImagesView.as_view(),name="get-images"),
    path('delete-user-images/',deleteUserImage.as_view(),name="delete-user-image"),
    path('api/get-user-images/',getUserImages.as_view(),name="get-user-images"),

]