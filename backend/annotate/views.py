from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework import status
from .tasks import runRoboFlow
from django.http import HttpResponse
import json
from django.db.models import Q
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.parsers import MultiPartParser, FormParser

import os
from dotenv import load_dotenv
load_dotenv()

# Import the Cloudinary libraries
# ==============================
import cloudinary
from cloudinary import CloudinaryImage
import cloudinary.uploader
import cloudinary.api
import json
config = cloudinary.config(secure=True)

class postImageView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    print('inside posting image!!!!')
    def post(self,request):
        serializer = UploadSerializer(data=request.data)
        if serializer.is_valid():
            #print('initial serializer valid')
            UploadObj = serializer.save(user=request.user)
        else:
            print(serializer.errors)
        request.data._mutable = True
        request.data["title"] = request.data['title'].replace(' ','_')
        annotatedImage, annotations, style, gender = runRoboFlow(f"images/{request.data['title']}")
        postTitle = request.data['title'].replace(' ','_')
        UploadObj.title = f'{postTitle[:postTitle.rfind(".")]}_{str(int(time.time())).replace(".","")}{postTitle[postTitle.rfind("."):]}'
        UploadObj.style = style
        UploadObj.gender = gender
        oldImagePath = UploadObj.image.path
        newImagePath = os.path.join('images/',UploadObj.title)

        with default_storage.open(oldImagePath, 'rb') as file_content:
            default_storage.save(newImagePath, ContentFile(file_content.read()))
        if default_storage.exists(oldImagePath):
            default_storage.delete(oldImagePath)
        #UploadObj.annotatedImage = runRoboFlow(f"images/{request.data['title']}")
        UploadObj.annotatedImage = annotatedImage
        UploadObj.annotations = json.dumps(annotations)
        UploadObj.user = self.request.user
        UploadObj.save()
        if serializer.is_valid():
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
class deleteUserImage(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self,request):
        queryset = Upload.objects.filter(user = self.request.user)
        titles = json.loads(request.query_params.get('titles'))
        query_filters = Q()
        for title in titles:
            query_filters |= Q(title=title)
        results = queryset.filter(query_filters)
        deleted_count, _ =results.delete()
        return Response({"message": f"{deleted_count} images deleted successfully."},
            status=status.HTTP_200_OK)



class getUserImages(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        queryset = Upload.objects.filter(user = self.request.user)
        serializer = UploadSerializer(instance= queryset,many=True)

        return Response(serializer.data,status=status.HTTP_200_OK)

class getAnnotatedImageView(APIView):
    permission_classes=[AllowAny]
    def get(self,request):
        imgName = request.query_params.get("title")
        oneUpload = Upload.objects.filter(title=imgName).first()
        
        #queryset = Upload.objects.filter(pk=oneUpload.pk)
        #serializer = UploadSerializer(queryset,many = True)
        return HttpResponse(oneUpload.annotatedImage,status=status.HTTP_200_OK,content_type="image/jpeg")
    
class getImagesView(APIView):
    permission_classes=[AllowAny]
    def get(self,request):
        print('in get images view')
        queries = request.query_params

        first_key = next(iter(queries))
        filters = json.loads(queries.getlist(first_key)[0])
        query_filter = Q()
        for filter,values in filters.items():
            if filter =="date":
                if values[0]!="-1":
                    query_filter &= Q(date__gte=datetime.strptime(values[0], "%Y-%m-%d").date())
                if values[1]!="-1":
                    query_filter &= Q(date__lte=datetime.strptime(values[1], "%Y-%m-%d").date())
                continue
            for value in values:
                query_filter &= Q(**{f'{filter}__icontains':value})
        print(query_filter)
        results = Upload.objects.filter(query_filter)[:25]
        serializer = UploadSerializer(instance=results,many=True)

        return Response(serializer.data,status=status.HTTP_200_OK)
class getAnnotations(APIView):
    permission_classes=[AllowAny]
    def get(self,request):
        imgName = request.query_params.get("title")
        oneUpload = Upload.objects.filter(title=imgName).first()
        print(oneUpload)
        if oneUpload:
            serializer = UploadSerializer(oneUpload)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Upload not found"}, status=status.HTTP_404_NOT_FOUND)
class deleteUpload(APIView):
    permission_classes=[IsAuthenticated]
    def delete(self,request):
        imgName =request.query_params.get("title")
        if request.query_params.get("upload") == "True":
            uploadOutput = cloudinary.uploader.upload(f"/Users/rileycho/Documents/CS lab/backend/media/images/{imgName}",public_id=imgName)
            oneUpload = Upload.objects.get(title=imgName)
            oneUpload.imageLink = uploadOutput['url']
            oneUpload.save()
        else:
            Upload.objects.filter(title=imgName).delete()
        return Response(status=status.HTTP_200_OK)
        