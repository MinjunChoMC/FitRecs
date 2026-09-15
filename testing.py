from PIL import ImageDraw, Image
import json
with open('rq.json') as f:
    roboData = f.read()
    roboData = json.loads(roboData)

def getClassColor(clothing):
    if clothing == 'sneaker':
        return "navy"
    elif clothing == 'T shirt':
        return 'purple'
    elif clothing == 'jeans':
        return 'red'
    else:
        return 'white'
def outline(roboData,image):
    image = Image.open(f'testing-images/{image}')
    output_image = image.copy()
    draw = ImageDraw.Draw(output_image)
    for prediction in roboData['predictions']:
        color = getClassColor(prediction['class'])
        print(prediction['class'])
        for i, point in enumerate(prediction['points']):
            if i == len(prediction['points'])-1:
                break
            #print(f"AHH: {(point['x'],point['y']),(prediction['points'][i+1]['x'],prediction['points'][i+1]['y'])}")
            draw.line([(point['x'],point['y']),(prediction['points'][i+1]['x'],prediction['points'][i+1]['y'])],fill=color,width=3)
        output_image.show()
    output_image.save('outlined1.jpg',quality=95)

outline(roboData, 'testing image 6.jpg')