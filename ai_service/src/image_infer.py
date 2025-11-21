import cv2
import numpy as np
from ultralytics import YOLO
import base64
from PIL import Image
import io

class ImageAnalyzer:
    def __init__(self):
        self.model = YOLO('yolov8n.pt')  # Load pre-trained model
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    def decode_image(self, base64_string):
        """Decode base64 image string to numpy array"""
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        return np.array(image)
    
    def blur_faces(self, image):
        """Detect and blur faces in the image"""
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
        
        for (x, y, w, h) in faces:
            face_region = image[y:y+h, x:x+w]
            blurred_face = cv2.GaussianBlur(face_region, (99, 99), 30)
            image[y:y+h, x:x+w] = blurred_face
        
        return image
    
    def analyze(self, base64_image):
        """Analyze image for civic issues"""
        try:
            # Decode image
            image = self.decode_image(base64_image)
            
            # Blur faces for privacy
            image = self.blur_faces(image)
            
            # Run YOLO inference
            results = self.model(image)
            
            detections = []
            for result in results:
                boxes = result.boxes
                if boxes is not None:
                    for box in boxes:
                        detection = {
                            'category': self.model.names[int(box.cls)],
                            'confidence': float(box.conf),
                            'bbox': box.xyxy[0].tolist()
                        }
                        detections.append(detection)
            
            return {
                'detections': detections,
                'faces_blurred': len(self.face_cascade.detectMultiScale(cv2.cvtColor(image, cv2.COLOR_RGB2GRAY), 1.1, 4)) > 0
            }
            
        except Exception as e:
            return {'error': str(e)}