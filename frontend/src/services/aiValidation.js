// AI Image Validation Service
class AIValidationService {
  constructor() {
    this.civicKeywords = {
      'waste_management': ['garbage', 'trash', 'waste', 'litter', 'bottle', 'plastic', 'paper', 'food', 'bin', 'dumpster', 'landfill', 'recycling', 'dump', 'rubbish'],
      'water_management': ['water', 'pipe', 'leak', 'flood', 'drain', 'sewer', 'puddle', 'overflow', 'tap', 'faucet', 'hydrant', 'burst', 'drainage'],
      'air_pollution': ['smoke', 'smog', 'dust', 'chemical', 'factory', 'industrial', 'emission', 'contamination', 'exhaust', 'fumes'],
      'noise_pollution': ['noise', 'loud', 'sound', 'construction', 'machinery', 'traffic', 'horn', 'music', 'speaker'],
      'road_&_infrastructure': ['road', 'street', 'pothole', 'crack', 'traffic', 'vehicle', 'car', 'truck', 'bus', 'pavement', 'sidewalk', 'construction', 'bridge'],
      'public_safety': ['safety', 'danger', 'hazard', 'broken', 'damaged', 'unsafe', 'security', 'crime', 'accident'],
      'electricity_issues': ['electricity', 'power', 'wire', 'cable', 'transformer', 'outage', 'blackout', 'electrical', 'voltage'],
      'drainage_&_sewage': ['drainage', 'sewage', 'sewer', 'manhole', 'overflow', 'blockage', 'clogged', 'stagnant'],
      'traffic_problems': ['traffic', 'signal', 'light', 'jam', 'congestion', 'parking', 'vehicle', 'intersection'],
      'street_lighting': ['light', 'lamp', 'lighting', 'bulb', 'pole', 'dark', 'illumination', 'streetlight'],
      'parks_&_recreation': ['park', 'garden', 'playground', 'bench', 'tree', 'grass', 'recreation', 'sports'],
      'public_transport': ['bus', 'transport', 'station', 'stop', 'metro', 'train', 'public', 'commute'],
      'building_violations': ['building', 'construction', 'violation', 'illegal', 'permit', 'structure', 'unauthorized'],
      'environmental_issues': ['environment', 'pollution', 'contamination', 'toxic', 'hazardous', 'ecological'],
      'health_&_sanitation': ['health', 'sanitation', 'hygiene', 'medical', 'hospital', 'clinic', 'disease'],
      'general_civic': ['public', 'community', 'municipal', 'government', 'civic', 'urban', 'city', 'town', 'issue', 'problem']
    }
    
    // Non-civic keywords that indicate irrelevant images
    this.nonCivicKeywords = [
      'selfie', 'portrait', 'face', 'person', 'people', 'family', 'friend',
      'food', 'meal', 'restaurant', 'cooking', 'recipe',
      'pet', 'dog', 'cat', 'animal', 'wildlife',
      'vacation', 'travel', 'holiday', 'beach', 'mountain',
      'party', 'celebration', 'birthday', 'wedding',
      'screenshot', 'meme', 'text', 'document', 'paper',
      'indoor', 'home', 'bedroom', 'kitchen', 'living',
      'nature', 'flower', 'sunset', 'landscape', 'scenic'
    ]
  }

  // Simple client-side image validation using basic analysis
  async validateImage(imageFile, category = null) {
    try {
      // Convert to base64 for analysis
      const base64Image = await this.fileToBase64(imageFile)
      
      // Basic validation using image properties and filename
      const validation = this.performBasicValidation(imageFile, category)
      
      // In a real implementation, this would call the AI service
      // For now, we'll use basic heuristics
      return {
        isValid: validation.isValid,
        confidence: validation.confidence,
        message: validation.message,
        suggestedCategory: validation.suggestedCategory
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

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.onerror = error => reject(error)
    })
  }

  performBasicValidation(file, category) {
    const filename = file.name.toLowerCase()
    const fileSize = file.size
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      return {
        isValid: false,
        confidence: 0,
        message: 'Please upload a valid image file (JPG, PNG, etc.)'
      }
    }

    // Check file size (max 5MB)
    if (fileSize > 5 * 1024 * 1024) {
      return {
        isValid: false,
        confidence: 0,
        message: 'Image size too large. Please upload an image smaller than 5MB.'
      }
    }

    // Check for non-civic keywords (negative indicators)
    let nonCivicScore = 0
    for (const keyword of this.nonCivicKeywords) {
      if (filename.includes(keyword)) {
        nonCivicScore += 0.3
      }
    }

    // Basic keyword matching from filename
    let relevanceScore = 0
    let matchedCategory = null
    let bestCategoryMatch = null
    let bestCategoryScore = 0
    
    if (category) {
      const categoryKey = category.toLowerCase().replace(/\s+/g, '_').replace(/&/g, '_')
      const keywords = this.civicKeywords[categoryKey] || this.civicKeywords.general_civic
      
      for (const keyword of keywords) {
        if (filename.includes(keyword)) {
          relevanceScore += 0.25
          matchedCategory = category
        }
      }
    }

    // Check all categories to find best match
    for (const [catKey, keywords] of Object.entries(this.civicKeywords)) {
      let categoryScore = 0
      for (const keyword of keywords) {
        if (filename.includes(keyword)) {
          categoryScore += 0.2
        }
      }
      if (categoryScore > bestCategoryScore) {
        bestCategoryScore = categoryScore
        bestCategoryMatch = catKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      }
    }

    // Adjust relevance score
    relevanceScore = Math.max(relevanceScore, bestCategoryScore)
    
    // Apply penalty for non-civic indicators
    relevanceScore = Math.max(0, relevanceScore - nonCivicScore)

    // Determine validity with 80% threshold
    const hasStrongNonCivicIndicators = nonCivicScore > 0.5
    const confidence = Math.min(Math.max(relevanceScore, 0.1), 1.0)
    const meetsThreshold = confidence >= 0.8
    
    const isValid = !hasStrongNonCivicIndicators && meetsThreshold

    return {
      isValid,
      confidence,
      message: this.getValidationMessage(isValid, confidence, matchedCategory || bestCategoryMatch, hasStrongNonCivicIndicators, meetsThreshold),
      suggestedCategory: matchedCategory || bestCategoryMatch
    }
  }

  isLikelyValidImage(filename) {
    // Accept images with common civic-related patterns
    const commonPatterns = ['img', 'photo', 'pic', 'image', 'report', 'issue', 'problem', 'civic', 'street', 'road']
    return commonPatterns.some(pattern => filename.includes(pattern))
  }

  getValidationMessage(isValid, confidence, category, hasNonCivicIndicators, meetsThreshold) {
    if (hasNonCivicIndicators) {
      return 'Upload a clear photo of the civic issue, not personal photos.'
    }
    
    if (!meetsThreshold) {
      return 'Please upload a clear, relevant photo showing the civic issue you are reporting.'
    }
    
    if (isValid) {
      return 'Good! Ensure the image clearly shows the issue for faster resolution.'
    }
    
    return 'Upload failed. Please try again with a relevant civic issue photo.'
  }

  // Validate completion photos (stricter validation)
  async validateCompletionPhoto(imageFile, originalCategory) {
    const validation = await this.validateImage(imageFile, originalCategory)
    
    // Completion photos should show resolution/improvement
    const completionKeywords = ['fixed', 'repaired', 'clean', 'completed', 'resolved', 'after', 'done']
    const filename = imageFile.name.toLowerCase()
    
    const hasCompletionIndicators = completionKeywords.some(keyword => filename.includes(keyword))
    
    return {
      ...validation,
      isValid: validation.isValid && (validation.confidence > 0.3 || hasCompletionIndicators),
      message: hasCompletionIndicators 
        ? 'Perfect! This appears to be a completion/resolution photo.'
        : validation.isValid 
          ? 'Image uploaded. Please ensure it shows the completed work or resolved issue.'
          : 'Please upload a photo showing the completed work or resolved civic issue.'
    }
  }
}

export const aiValidationService = new AIValidationService()