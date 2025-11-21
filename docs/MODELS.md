# AI Models Documentation

## Image Analysis Model (YOLO)
- **Purpose**: Detect civic issues in uploaded images
- **Categories**: Potholes, graffiti, litter, damaged infrastructure
- **Framework**: YOLOv8
- **Training Data**: Custom dataset with 10k+ annotated images
- **Accuracy**: 85% mAP on test set

## Text Classification Model
- **Purpose**: Categorize report descriptions
- **Framework**: BERT-based transformer
- **Categories**: Infrastructure, safety, environment, community
- **Training**: Fine-tuned on civic report dataset

## Face Detection & Blurring
- **Purpose**: Privacy protection in uploaded images
- **Model**: OpenCV Haar Cascades
- **Process**: Automatic detection and Gaussian blur

## Model Training Pipeline
1. Data collection and annotation
2. Preprocessing and augmentation
3. Model training with validation
4. Performance evaluation
5. Deployment and monitoring

## Performance Metrics
- Inference time: <500ms per image
- Memory usage: <2GB
- Accuracy targets: >80% for all categories