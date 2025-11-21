from flask import Flask, request, jsonify
import os
from src.image_infer import ImageAnalyzer
from src.text_infer import TextClassifier

app = Flask(__name__)

# Initialize models
image_analyzer = ImageAnalyzer()
text_classifier = TextClassifier()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'service': 'AI Service'})

@app.route('/analyze', methods=['POST'])
def analyze_content():
    try:
        data = request.json
        
        results = {}
        
        if 'image' in data:
            image_results = image_analyzer.analyze(data['image'])
            results['image_analysis'] = image_results
            
        if 'text' in data:
            text_results = text_classifier.classify(data['text'])
            results['text_analysis'] = text_results
            
        return jsonify(results)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)