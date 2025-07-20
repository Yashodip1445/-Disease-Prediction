export interface CMSContent {
  id: string;
  type: 'condition' | 'symptom' | 'advice' | 'disclaimer' | 'treatment' | 'prevention';
  title: string;
  content: string;
  shortDescription?: string;
  detailedDescription?: string;
  metadata: {
    urgency?: 'immediate' | 'moderate' | 'monitor';
    severity?: 'mild' | 'moderate' | 'severe' | 'critical';
    category?: string;
    subcategory?: string;
    tags?: string[];
    symptoms?: string[];
    relatedConditions?: string[];
    ageGroups?: ('infant' | 'child' | 'teen' | 'adult' | 'elderly')[];
    gender?: 'male' | 'female' | 'both';
    prevalence?: 'common' | 'uncommon' | 'rare';
    duration?: string;
    onset?: 'sudden' | 'gradual' | 'chronic';
    triggers?: string[];
    riskFactors?: string[];
    complications?: string[];
    whenToSeekHelp?: string[];
    homeRemedies?: string[];
    medications?: string[];
    lifestyle?: string[];
    prevention?: string[];
    followUp?: string;
    sources?: string[];
    lastUpdated: string;
    author: string;
    reviewedBy?: string;
    medicallyReviewed?: boolean;
    version: number;
    status: 'draft' | 'review' | 'approved' | 'archived';
    language: string;
    region?: string;
  };
}

export interface CMSState {
  content: CMSContent[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  filterType: CMSContent['type'] | 'all';
  filterUrgency: 'immediate' | 'moderate' | 'monitor' | 'all';
  filterStatus: 'draft' | 'review' | 'approved' | 'archived' | 'all';
  sortBy: 'title' | 'lastUpdated' | 'urgency' | 'category';
  sortOrder: 'asc' | 'desc';
}

export interface CMSStats {
  totalContent: number;
  byType: Record<CMSContent['type'], number>;
  byUrgency: Record<string, number>;
  byStatus: Record<string, number>;
  recentlyUpdated: CMSContent[];
  needsReview: CMSContent[];
}

export interface CMSValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CMSExportData {
  content: CMSContent[];
  exportDate: string;
  version: string;
  metadata: {
    totalItems: number;
    exportedBy: string;
    format: 'json' | 'csv' | 'xml';
  };
}