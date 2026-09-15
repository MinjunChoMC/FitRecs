from roboflow import Roboflow
from PIL import Image,ImageDraw
import io
import os
import mimetypes
from django.core.files.uploadedfile import InMemoryUploadedFile
import json
def runRoboFlow(image):
    print(f'in tasks: {image}')

    rf = Roboflow(api_key=os.getenv("ROBOFLOW_API_KEY"))
    project = rf.workspace("cs-lab-57fli").project("outfit-styles")
    version = project.version(1)
    model = version.model
    style = model.predict(f"/Users/rileycho/Documents/CS lab/backend/media/{image}",confidence=30).json()
    if style['predictions']:
        style = style['predictions'][0]['class']
    else:
        style = "unsure"
    project = rf.workspace("cutm-jipbe").project("gender-detection-irbyv")
    #project = rf.workspace("trainmodel").project("gender-detection-irbyv")

    version = project.version(1)
    model = version.model
    gender = model.predict(f"/Users/rileycho/Documents/CS lab/backend/media/{image}",confidence=30).json()

    print(gender)
    if gender['predictions']:
        gender = gender['predictions'][0]['class']
        if gender == '0':
            gender = "Female"
        if gender == '1':
            gender = "Male"
    else:
        gender = 'Female or Male'
    print(gender)
    rf = Roboflow(api_key=os.getenv("ROBOFLOW_API_KEY"))
    project = rf.workspace("cs-lab-57fli").project("cs-lab-project")
    version = project.version(2)
    dataset = version.download("yolov8")
    model = version.model
    roboData = model.predict(f"/Users/rileycho/Documents/CS lab/backend/media/{image}", confidence=30).json()

    
    #print(type(roboData))
    #print(roboData)
    #print(f'image type: {type(image)}')
    return outline(roboData,image,style,gender)

def getClassColor(clothing):
    with open('/Users/rileycho/Documents/CS lab/backend/annotate/class_colors.json','r') as f:
        class_colors = json.loads(f.read())
        print(class_colors[clothing])
        return class_colors[clothing]
def outline(roboData,image,style,gender):
    imageFile = Image.open(f'media/{image}')
    output_image = imageFile.copy()
    draw = ImageDraw.Draw(output_image)
    for prediction in roboData['predictions']:
        color = getClassColor(prediction['class'])
        #print(prediction['class'])
        for i, point in enumerate(prediction['points']):
            if i == len(prediction['points'])-1:
                break
            #print(f"AHH: {(point['x'],point['y']),(prediction['points'][i+1]['x'],prediction['points'][i+1]['y'])}")
            draw.line([(point['x'],point['y']),(prediction['points'][i+1]['x'],prediction['points'][i+1]['y'])],fill=color,width=5)
    #output_image.show()
    image = image[7:]
    #print(f'ann_{image}')

    #print([item['class'] for item in roboData['predictions']])
    annotations = [f"({item['class']})" for item in roboData['predictions']]
    output_image.save(f'/Users/rileycho/Documents/CS lab/backend/media/ann-images/ann_{image}',quality=95)
    with open(f'/Users/rileycho/Documents/CS lab/backend/media/ann-images/ann_{image}', 'rb') as f:
        file_name = os.path.basename(f'/Users/rileycho/Documents/CS lab/backend/media/ann-images/ann_{image}')
        file_stream = io.BytesIO(f.read())
        print(mimetypes.guess_type(file_name)[0])

        file = InMemoryUploadedFile(file=file_stream,
                                    name=file_name,
                                    field_name=None,
                                    content_type=mimetypes.guess_type(file_name)[0],
                                    size=file_stream.getbuffer().nbytes,
                                    charset=None)
        print(file)
        class_to_color = dict()
        for annotation in annotations:
            class_to_color[annotation] = getClassColor(annotation[1:-1])
            print(class_to_color)
        print(f"in task: {style}")
        print(f"in task: {gender}")
        style = f"({style})"
        gender = f'({gender})'
        return (file,class_to_color,style,gender)