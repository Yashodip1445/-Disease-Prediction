import { useState, useEffect, useMemo } from 'react';
import { CMSContent, CMSState, CMSStats, CMSValidation, CMSExportData } from '../types/cms';
import { logger } from '../utils/logger';
import { performanceMonitor } from '../utils/performance';

const STORAGE_KEY = 'disease-prevention-cms';
const BACKUP_KEY = 'disease-prevention-cms-backup';
const VERSION = '1.0.0';

export const useCMS = () => {
  const [state, setState] = useState<CMSState>({
    content: [],
    isLoading: true,
    error: null,
    searchTerm: '',
    filterType: 'all',
    filterUrgency: 'all',
    filterStatus: 'all',
    sortBy: 'lastUpdated',
    sortOrder: 'desc'
  });

  // Load content from localStorage
  useEffect(() => {
    performanceMonitor.measureAsync('cms-load', async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          setState(prev => ({ ...prev, content: data.content || data, isLoading: false }));
          logger.info('CMS content loaded from storage', { itemCount: (data.content || data).length });
        } else {
          await initializeDefaultContent();
        }
      } catch (error) {
        logger.error('Failed to load CMS content', { error }, error instanceof Error ? error : undefined);
        setState(prev => ({ ...prev, error: 'Failed to load content', isLoading: false }));
      }
    });
  }, []);

  const initializeDefaultContent = async () => {
    const defaultContent: CMSContent[] = [
      {
        id: '1',
        type: 'disclaimer',
        title: 'Medical Disclaimer',
        content: 'This tool provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your doctor for medical concerns.',
        shortDescription: 'Legal disclaimer for medical information',
        detailedDescription: 'Comprehensive legal disclaimer explaining the limitations of the medical information provided by this application.',
        metadata: {
          category: 'legal',
          tags: ['disclaimer', 'legal', 'medical'],
          lastUpdated: new Date().toISOString(),
          author: 'Legal Team',
          reviewedBy: 'Chief Medical Officer',
          medicallyReviewed: true,
          version: 1,
          status: 'approved',
          language: 'en',
          region: 'global'
        }
      },
      {
        id: '2',
        type: 'condition',
        title: 'Common Cold',
        content: 'A viral infection of the upper respiratory tract causing mild to moderate symptoms.',
        shortDescription: 'Viral upper respiratory infection',
        detailedDescription: 'The common cold is a viral infection that affects the nose, throat, and upper respiratory system. It is one of the most frequent illnesses, especially during colder months.',
        metadata: {
          urgency: 'monitor',
          severity: 'mild',
          category: 'respiratory',
          subcategory: 'viral infections',
          tags: ['viral', 'respiratory', 'common', 'contagious'],
          symptoms: ['runny nose', 'sneezing', 'cough', 'sore throat', 'mild headache'],
          relatedConditions: ['flu', 'sinusitis', 'bronchitis'],
          ageGroups: ['child', 'teen', 'adult', 'elderly'],
          gender: 'both',
          prevalence: 'common',
          duration: '7-10 days',
          onset: 'gradual',
          triggers: ['cold weather', 'stress', 'lack of sleep', 'close contact with infected person'],
          riskFactors: ['weakened immune system', 'age under 6', 'crowded environments'],
          complications: ['sinusitis', 'ear infection', 'bronchitis'],
          whenToSeekHelp: ['fever over 101.3°F', 'symptoms lasting more than 10 days', 'severe headache', 'difficulty breathing'],
          homeRemedies: ['rest', 'fluids', 'warm salt water gargle', 'humidifier'],
          medications: ['acetaminophen', 'ibuprofen', 'decongestants'],
          lifestyle: ['hand washing', 'avoid touching face', 'get adequate sleep'],
          prevention: ['frequent hand washing', 'avoid close contact with sick people', 'maintain healthy lifestyle'],
          followUp: 'Monitor symptoms and seek medical care if they worsen or persist beyond 10 days',
          sources: ['CDC', 'Mayo Clinic', 'WHO'],
          lastUpdated: new Date().toISOString(),
          author: 'Dr. Sarah Johnson',
          reviewedBy: 'Medical Review Board',
          medicallyReviewed: true,
          version: 2,
          status: 'approved',
          language: 'en',
          region: 'global'
        }
      },
      {
        id: '3',
        type: 'symptom',
        title: 'Persistent Headache',
        content: 'Ongoing head pain that lasts for several hours or days, potentially indicating various underlying conditions.',
        shortDescription: 'Continuous head pain requiring evaluation',
        detailedDescription: 'A persistent headache is characterized by continuous or recurring head pain that may vary in intensity and location. It can be a symptom of various conditions ranging from tension to more serious medical issues.',
        metadata: {
          urgency: 'moderate',
          severity: 'moderate',
          category: 'neurological',
          subcategory: 'pain',
          tags: ['headache', 'pain', 'neurological', 'chronic'],
          relatedConditions: ['migraine', 'tension headache', 'cluster headache', 'sinusitis'],
          ageGroups: ['teen', 'adult', 'elderly'],
          gender: 'both',
          prevalence: 'common',
          duration: 'variable',
          onset: 'gradual',
          triggers: ['stress', 'dehydration', 'lack of sleep', 'eye strain', 'certain foods'],
          riskFactors: ['stress', 'poor posture', 'irregular sleep', 'dehydration'],
          complications: ['medication overuse headache', 'chronic daily headache'],
          whenToSeekHelp: ['sudden severe headache', 'headache with fever', 'vision changes', 'confusion'],
          homeRemedies: ['rest in dark room', 'cold/warm compress', 'hydration', 'gentle massage'],
          medications: ['acetaminophen', 'ibuprofen', 'aspirin'],
          lifestyle: ['regular sleep schedule', 'stress management', 'proper hydration'],
          prevention: ['stress management', 'regular exercise', 'adequate sleep', 'proper nutrition'],
          followUp: 'Keep headache diary and consult doctor if frequency increases',
          sources: ['American Headache Society', 'Mayo Clinic'],
          lastUpdated: new Date().toISOString(),
          author: 'Dr. Michael Chen',
          reviewedBy: 'Neurology Department',
          medicallyReviewed: true,
          version: 1,
          status: 'approved',
          language: 'en'
        }
      },
      {
        id: '4',
        type: 'treatment',
        title: 'Hydration Therapy',
        content: 'Systematic approach to maintaining proper fluid balance in the body to support recovery and prevent complications.',
        shortDescription: 'Fluid replacement and maintenance therapy',
        detailedDescription: 'Hydration therapy involves the careful management of fluid intake to maintain proper electrolyte balance and support the body\'s natural healing processes.',
        metadata: {
          category: 'supportive care',
          subcategory: 'fluid management',
          tags: ['hydration', 'fluids', 'electrolytes', 'supportive care'],
          ageGroups: ['infant', 'child', 'teen', 'adult', 'elderly'],
          gender: 'both',
          prevalence: 'common',
          duration: 'as needed',
          whenToSeekHelp: ['signs of severe dehydration', 'inability to keep fluids down', 'decreased urination'],
          homeRemedies: ['water', 'electrolyte solutions', 'clear broths', 'herbal teas'],
          lifestyle: ['regular fluid intake', 'monitor urine color', 'increase intake during illness'],
          prevention: ['regular water intake', 'limit caffeine and alcohol', 'increase fluids in hot weather'],
          followUp: 'Monitor hydration status and adjust intake as needed',
          sources: ['WHO', 'CDC', 'American Academy of Pediatrics'],
          lastUpdated: new Date().toISOString(),
          author: 'Dr. Lisa Rodriguez',
          reviewedBy: 'Emergency Medicine Department',
          medicallyReviewed: true,
          version: 1,
          status: 'approved',
          language: 'en'
        }
      },
      {
        id: '5',
        type: 'prevention',
        title: 'Hand Hygiene Protocol',
        content: 'Comprehensive hand washing and sanitization practices to prevent the spread of infectious diseases.',
        shortDescription: 'Proper hand cleaning techniques for infection prevention',
        detailedDescription: 'Hand hygiene is one of the most effective ways to prevent the spread of infections. This protocol outlines proper techniques for hand washing and sanitization.',
        metadata: {
          category: 'infection control',
          subcategory: 'hygiene',
          tags: ['hand washing', 'hygiene', 'infection prevention', 'sanitization'],
          ageGroups: ['child', 'teen', 'adult', 'elderly'],
          gender: 'both',
          prevalence: 'common',
          duration: '20 seconds minimum',
          triggers: ['before eating', 'after bathroom use', 'after coughing/sneezing', 'after touching surfaces'],
          prevention: ['regular hand washing', 'alcohol-based sanitizer', 'avoid touching face'],
          lifestyle: ['carry hand sanitizer', 'teach children proper technique', 'make it a habit'],
          sources: ['CDC', 'WHO', 'FDA'],
          lastUpdated: new Date().toISOString(),
          author: 'Infection Control Team',
          reviewedBy: 'Public Health Department',
          medicallyReviewed: true,
          version: 3,
          status: 'approved',
          language: 'en',
          region: 'global'
        }
      }
    ];

    setState(prev => ({ ...prev, content: defaultContent, isLoading: false }));
    saveToStorage(defaultContent);
    logger.info('CMS initialized with comprehensive default content', { itemCount: defaultContent.length });
  };

  const saveToStorage = (content: CMSContent[]) => {
    try {
      const data = {
        content,
        version: VERSION,
        lastBackup: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      
      // Create backup
      const backup = localStorage.getItem(STORAGE_KEY);
      if (backup) {
        localStorage.setItem(BACKUP_KEY, backup);
      }
      
      logger.debug('CMS content saved to storage with backup');
    } catch (error) {
      logger.error('Failed to save CMS content', { error }, error instanceof Error ? error : undefined);
    }
  };

  const validateContent = (content: Partial<CMSContent>): CMSValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!content.title?.trim()) errors.push('Title is required');
    if (!content.content?.trim()) errors.push('Content is required');
    if (!content.type) errors.push('Content type is required');
    if (!content.metadata?.author?.trim()) errors.push('Author is required');

    if (content.title && content.title.length < 3) warnings.push('Title should be at least 3 characters');
    if (content.content && content.content.length < 10) warnings.push('Content should be more descriptive');
    if (content.metadata?.tags && content.metadata.tags.length === 0) warnings.push('Consider adding tags for better organization');

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const addContent = (newContent: Omit<CMSContent, 'id'>) => {
    const validation = validateContent(newContent);
    if (!validation.isValid) {
      logger.warn('Content validation failed', { errors: validation.errors });
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const content: CMSContent = {
      ...newContent,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        ...newContent.metadata,
        lastUpdated: new Date().toISOString(),
        version: 1,
        status: newContent.metadata.status || 'draft'
      }
    };

    setState(prev => {
      const updated = [...prev.content, content];
      saveToStorage(updated);
      return { ...prev, content: updated };
    });

    logger.info('CMS content added', { 
      id: content.id, 
      type: content.type, 
      title: content.title,
      warnings: validation.warnings 
    });
    return content;
  };

  const updateContent = (id: string, updates: Partial<CMSContent>) => {
    const validation = validateContent(updates);
    if (!validation.isValid) {
      logger.warn('Content update validation failed', { errors: validation.errors });
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    setState(prev => {
      const updated = prev.content.map(item =>
        item.id === id
          ? { 
              ...item, 
              ...updates, 
              metadata: { 
                ...item.metadata, 
                ...updates.metadata,
                lastUpdated: new Date().toISOString(),
                version: (item.metadata.version || 1) + 1
              } 
            }
          : item
      );
      saveToStorage(updated);
      return { ...prev, content: updated };
    });

    logger.info('CMS content updated', { 
      id, 
      updates: Object.keys(updates),
      warnings: validation.warnings 
    });
  };

  const deleteContent = (id: string) => {
    setState(prev => {
      const updated = prev.content.filter(item => item.id !== id);
      saveToStorage(updated);
      return { ...prev, content: updated };
    });

    logger.info('CMS content deleted', { id });
  };

  const duplicateContent = (id: string) => {
    const original = state.content.find(item => item.id === id);
    if (!original) return;

    const duplicate = {
      ...original,
      title: `${original.title} (Copy)`,
      metadata: {
        ...original.metadata,
        status: 'draft' as const,
        version: 1
      }
    };

    delete (duplicate as any).id;
    return addContent(duplicate);
  };

  // Filtering and sorting
  const filteredAndSortedContent = useMemo(() => {
    let filtered = state.content;

    // Apply search filter
    if (state.searchTerm) {
      const searchLower = state.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.content.toLowerCase().includes(searchLower) ||
        item.metadata.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        item.metadata.category?.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (state.filterType !== 'all') {
      filtered = filtered.filter(item => item.type === state.filterType);
    }

    // Apply urgency filter
    if (state.filterUrgency !== 'all') {
      filtered = filtered.filter(item => item.metadata.urgency === state.filterUrgency);
    }

    // Apply status filter
    if (state.filterStatus !== 'all') {
      filtered = filtered.filter(item => item.metadata.status === state.filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (state.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'lastUpdated':
          aValue = new Date(a.metadata.lastUpdated);
          bValue = new Date(b.metadata.lastUpdated);
          break;
        case 'urgency':
          const urgencyOrder = { immediate: 3, moderate: 2, monitor: 1 };
          aValue = urgencyOrder[a.metadata.urgency as keyof typeof urgencyOrder] || 0;
          bValue = urgencyOrder[b.metadata.urgency as keyof typeof urgencyOrder] || 0;
          break;
        case 'category':
          aValue = a.metadata.category?.toLowerCase() || '';
          bValue = b.metadata.category?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return state.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return state.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [state.content, state.searchTerm, state.filterType, state.filterUrgency, state.filterStatus, state.sortBy, state.sortOrder]);

  // Statistics
  const stats: CMSStats = useMemo(() => {
    const byType = state.content.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<CMSContent['type'], number>);

    const byUrgency = state.content.reduce((acc, item) => {
      const urgency = item.metadata.urgency || 'none';
      acc[urgency] = (acc[urgency] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = state.content.reduce((acc, item) => {
      const status = item.metadata.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentlyUpdated = [...state.content]
      .sort((a, b) => new Date(b.metadata.lastUpdated).getTime() - new Date(a.metadata.lastUpdated).getTime())
      .slice(0, 5);

    const needsReview = state.content.filter(item => item.metadata.status === 'review');

    return {
      totalContent: state.content.length,
      byType,
      byUrgency,
      byStatus,
      recentlyUpdated,
      needsReview
    };
  }, [state.content]);

  // Export functionality
  const exportContent = (format: 'json' | 'csv' = 'json'): CMSExportData => {
    const exportData: CMSExportData = {
      content: state.content,
      exportDate: new Date().toISOString(),
      version: VERSION,
      metadata: {
        totalItems: state.content.length,
        exportedBy: 'CMS User',
        format
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `disease-prevention-cms-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    logger.info('CMS content exported', { format, itemCount: state.content.length });
    return exportData;
  };

  // Import functionality
  const importContent = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          const importedContent = data.content || data;
          
          setState(prev => {
            const updated = [...prev.content, ...importedContent];
            saveToStorage(updated);
            return { ...prev, content: updated };
          });

          logger.info('CMS content imported', { itemCount: importedContent.length });
          resolve();
        } catch (error) {
          logger.error('Failed to import CMS content', { error }, error instanceof Error ? error : undefined);
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  const getContentByType = (type: CMSContent['type']) => {
    return state.content.filter(item => item.type === type);
  };

  const getContentById = (id: string) => {
    return state.content.find(item => item.id === id);
  };

  const searchContent = (term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }));
  };

  const setFilters = (filters: Partial<Pick<CMSState, 'filterType' | 'filterUrgency' | 'filterStatus'>>) => {
    setState(prev => ({ ...prev, ...filters }));
  };

  const setSorting = (sortBy: CMSState['sortBy'], sortOrder: CMSState['sortOrder']) => {
    setState(prev => ({ ...prev, sortBy, sortOrder }));
  };

  const clearFilters = () => {
    setState(prev => ({
      ...prev,
      searchTerm: '',
      filterType: 'all',
      filterUrgency: 'all',
      filterStatus: 'all'
    }));
  };

  return {
    ...state,
    filteredContent: filteredAndSortedContent,
    stats,
    addContent,
    updateContent,
    deleteContent,
    duplicateContent,
    getContentByType,
    getContentById,
    searchContent,
    setFilters,
    setSorting,
    clearFilters,
    exportContent,
    importContent,
    validateContent
  };
};