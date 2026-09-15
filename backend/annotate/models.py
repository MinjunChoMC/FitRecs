from django.db import models
import time
from django.utils.functional import cached_property
from django.contrib.auth.models import User
from datetime import datetime
# Create your models here.

class Upload(models.Model):
    def logo_dir_path(instance, filename):
        postTitle = filename.replace(' ','_')
        print('saving image at this address sir')
        #postTitle = f'{postTitle[:postTitle.rfind(".")]}_{str(int(time.time())).replace(".","")}{postTitle[postTitle.rfind("."):]}'
        return f'images/{postTitle}'
    
    title = models.TextField(null=True)
    image = models.ImageField(upload_to='images')
    imageLink= models.TextField(null =True)
    annotatedImage = models.ImageField(upload_to='ann-images', null=True)
    annotations = models.TextField(null=True)
    style = models.TextField(null=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='upload',null=True)
    date = models.DateField(auto_now_add=True)
    gender = models.TextField(null=True)
    """@property
    def title2(self):
        return self.title.replace(' ','_')
    
    """
    """
    @cached_property
    def annotatedImage2(self):
        print("in annotatedImage")
        annotatedImage = runRoboFlow(self.image.name)
        return annotatedImage
        models.ImageField(upload_to="annotated-images/", null = True)
        """
    '''def save(self, *args, **kwargs):
        print(f'args: {args}')
        print(f'kwargs: {kwargs}')
        print(f'self:{self}')
        super().save(*args, **kwargs)
        if self.image:
            print(f'in models: {self.image.name}')
            print(f'in models, image:{self.image}')
            print(f'in models, annotatedImage: {annotatedImage}')
            self.annotatedImage = f"ann-images/{annotatedImage}"
            super().save(*args, **kwargs)'''
