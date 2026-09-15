from django.contrib import admin
from .models import Upload
# Register your models here.
admin.site.register(Upload)
class YourModelAdmin(admin.ModelAdmin):
    list_display = ('title','image','imageLink','annotatedImage', 'annotations','style','user','created_at') # Include your date field
"""@admin.register(Upload)
class UploadAdmin(admin.ModelAdmin):
    model = Upload
    fields= ['title2','image','annotatedImage2']
    list_display = ('title2','image','annotatedImage2')
    def titleAdmin(self, obj):
        return obj.title2  # Calls the @property method

    def annotatedImageAdmin(self, obj):
        return obj.annotatedImage2"""