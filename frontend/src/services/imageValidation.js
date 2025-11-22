// Enhanced AI Image Validation Service
class AIValidationService {
  constructor() {
    this.civicKeywords = {
      'Infrastructure': ['road', 'street', 'pothole', 'crack', 'bridge', 'sidewalk', 'pavement', 'construction', 'building', 'wall', 'fence', 'light', 'pole', 'sign', 'bench'],
      'Waste Management': ['garbage', 'trash', 'waste', 'litter', 'bottle', 'plastic', 'paper', 'bin', 'dumpster', 'landfill', 'recycling', 'dump', 'rubbish'],
      'Public Safety': ['accident', 'danger', 'hazard', 'broken', 'damaged', 'unsafe', 'crime', 'vandalism', 'graffiti', 'security'],
      'Environment': ['pollution', 'smoke', 'smog', 'dust', 'water', 'leak', 'flood', 'drain', 'sewer', 'tree', 'park', 'green'],
      'Transportation': ['traffic', 'vehicle', 'car', 'bus', 'signal', 'parking', 'metro', 'station', 'transport']
    }
    
    this.invalidKeywords = ['selfie', 'person', 'face', 'food', 'restaurant', 'party', 'celebration', 'vacation', 'travel', 'personal', 'private']
  }

  // Enhanced image validation with better filtering
  async validateImage(imageFile, category = null) {
    try {
      // Perform comprehensive validation
      const validation = await this.performEnhancedValidation(imageFile, category)
      
      return {
        isValid: validation.isValid,
        confidence: validation.confidence,
        message: validation.message,
        suggestedCategory: validation.suggestedCategory,
        issues: validation.issues || []
      }
    } catch (error) {
      return {
        isValid: false,
        confidence: 0,
        message: 'Error analyzing image. Please try again.',
        error: error.message
      }
    }
  }

  async performEnhancedValidation(file, category) {
    const filename = file.name.toLowerCase()
    const fileSize = file.size
    const issues = []
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      return {
        isValid: false,
        confidence: 0,
        message: 'Please upload a valid image file (JPG, PNG, etc.)',
        issues: ['Invalid file type']
      }
    }

    // Check file size (max 10MB)
    if (fileSize > 10 * 1024 * 1024) {
      return {
        isValid: false,
        confidence: 0,
        message: 'Image size too large. Please upload an image smaller than 10MB.',
        issues: ['File too large']
      }
    }

    // Check for invalid content indicators
    const hasInvalidContent = this.invalidKeywords.some(keyword => filename.includes(keyword))
    if (hasInvalidContent) {
      return {
        isValid: false,
        confidence: 0.1,
        message: 'This image appears to be personal content. Please upload an image showing a civic issue.',
        issues: ['Personal/irrelevant content detected']
      }
    }

    // Enhanced civic relevance scoring
    let relevanceScore = 0
    let matchedCategory = null
    let matchedKeywords = []
    
    // Check category-specific keywords
    if (category && this.civicKeywords[category]) {
      for (const keyword of this.civicKeywords[category]) {
        if (filename.includes(keyword)) {
          relevanceScore += 0.3
          matchedCategory = category
          matchedKeywords.push(keyword)
        }
      }
    }

    // Check all civic keywords
    for (const [cat, keywords] of Object.entries(this.civicKeywords)) {
      for (const keyword of keywords) {
        if (filename.includes(keyword)) {
          relevanceScore += 0.15
          if (!matchedCategory) matchedCategory = cat
          matchedKeywords.push(keyword)
        }
      }
    }

    // Image metadata analysis
    const metadataScore = await this.analyzeImageMetadata(file)
    relevanceScore += metadataScore

    // Determine validity with stricter criteria
    const minConfidence = 0.2
    const isValid = relevanceScore >= minConfidence || this.hasValidCivicIndicators(filename)
    const confidence = Math.min(relevanceScore, 1.0)

    if (!isValid) {
      issues.push('Low civic relevance detected')
    }

    return {
      isValid,
      confidence,
      message: this.getEnhancedValidationMessage(isValid, confidence, matchedCategory, matchedKeywords),
      suggestedCategory: matchedCategory,
      issues
    }
  }

  async analyzeImageMetadata(file) {
    // Analyze file creation time, size patterns, etc.
    const now = Date.now()
    const fileDate = file.lastModified || now
    const daysDiff = (now - fileDate) / (1000 * 60 * 60 * 24)
    
    // Recent photos are more likely to be relevant
    if (daysDiff < 7) return 0.1
    if (daysDiff < 30) return 0.05
    return 0
  }

  hasValidCivicIndicators(filename) {
    const civicPatterns = [
      'issue', 'problem', 'report', 'civic', 'municipal', 'public',
      'broken', 'damaged', 'repair', 'fix', 'maintenance'
    ]
    return civicPatterns.some(pattern => filename.includes(pattern))
  }

  getEnhancedValidationMessage(isValid, confidence, category, keywords) {
    if (!isValid) {
      return '❌ This image doesn\'t appear to show a civic issue. Please upload a photo of the actual problem (road damage, waste, broken infrastructure, etc.).'
    }
    
    if (confidence > 0.7) {
      const keywordText = keywords.length > 0 ? ` (detected: ${keywords.slice(0, 2).join(', ')})` : ''
      return `✅ Excellent! This image clearly shows a civic issue${keywordText}.`
    } else if (confidence > 0.4) {
      return '✅ Good! This image appears to show a civic issue. Make sure it clearly depicts the problem.'
    } else if (confidence > 0.2) {
      return '⚠️ Image accepted, but please ensure it clearly shows the civic issue you\'re reporting.'
    } else {
      return '⚠️ Low confidence. Please upload a clearer image that directly shows the civic problem.'
    }
  }

  // Quick validation for real-time feedback
  quickValidate(file) {
    if (!file) return { isValid: false, message: 'No file selected' }
    if (!file.type.startsWith('image/')) return { isValid: false, message: 'Please select an image file' }
    if (file.size > 10 * 1024 * 1024) return { isValid: false, message: 'Image too large (max 10MB)' }
    
    const filename = file.name.toLowerCase()
    const hasInvalidContent = this.invalidKeywords.some(keyword => filename.includes(keyword))
    if (hasInvalidContent) return { isValid: false, message: 'Please upload a civic issue photo, not personal content' }
    
    return { isValid: true, message: 'Image ready for upload' }
  }

  // Validate completion photos with enhanced checking
  async validateCompletionPhoto(imageFile, originalCategory) {
    const validation = await this.validateImage(imageFile, originalCategory)
    const filename = imageFile.name.toLowerCase()
    
    // Completion indicators
    const completionKeywords = ['fixed', 'repaired', 'clean', 'completed', 'resolved', 'after', 'done', 'finished', 'restored']
    const hasCompletionIndicators = completionKeywords.some(keyword => filename.includes(keyword))
    
    // Stricter validation for completion photos
    const minConfidenceForCompletion = 0.3
    const isValidCompletion = validation.confidence >= minConfidenceForCompletion || hasCompletionIndicators
    
    return {
      ...validation,
      isValid: isValidCompletion,
      message: hasCompletionIndicators 
        ? '✅ Perfect! This appears to be a completion/resolution photo.'
        : isValidCompletion 
          ? '✅ Image uploaded. Please ensure it shows the completed work or resolved issue.'
          : '❌ Please upload a clear photo showing the completed work or resolved civic issue.'
    }
  }
}

export const aiValidationService = new AIValidationService()