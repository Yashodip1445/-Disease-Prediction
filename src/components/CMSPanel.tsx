import React, { useState, useRef } from 'react';
import { 
  Settings, Plus, Edit, Trash2, Save, X, FileText, AlertTriangle, Heart, 
  Stethoscope, Search, Filter, Download, Upload, Copy, BarChart3,
  Clock, User, Tag, Globe, CheckCircle, AlertCircle, Eye, EyeOff,
  ChevronDown, ChevronUp, SortAsc, SortDesc, RefreshCw
} from 'lucide-react';
import { useCMS } from '../hooks/useCMS';
import { CMSContent } from '../types/cms';
import { logger } from '../utils/logger';

interface CMSPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const CMSPanel: React.FC<CMSPanelProps> = ({ isVisible, onToggle }) => {
  const { 
    filteredContent, 
    stats, 
    isLoading, 
    error, 
    searchTerm,
    filterType,
    filterUrgency,
    filterStatus,
    sortBy,
    sortOrder,
    addContent, 
    updateContent, 
    deleteContent, 
    duplicateContent,
    searchContent,
    setFilters,
    setSorting,
    clearFilters,
    exportContent,
    importContent,
    validateContent
  } = useCMS();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'stats' | 'settings'>('content');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<CMSContent>>({
    type: 'condition',
    title: '',
    content: '',
    shortDescription: '',
    detailedDescription: '',
    metadata: {
      urgency: 'monitor',
      severity: 'mild',
      category: '',
      subcategory: '',
      tags: [],
      symptoms: [],
      relatedConditions: [],
      ageGroups: [],
      gender: 'both',
      prevalence: 'common',
      duration: '',
      onset: 'gradual',
      triggers: [],
      riskFactors: [],
      complications: [],
      whenToSeekHelp: [],
      homeRemedies: [],
      medications: [],
      lifestyle: [],
      prevention: [],
      followUp: '',
      sources: [],
      author: 'Admin',
      reviewedBy: '',
      medicallyReviewed: false,
      version: 1,
      status: 'draft',
      language: 'en',
      region: '',
      lastUpdated: ''
    }
  });

  const handleSave = async () => {
    try {
      const validation = validateContent(formData);
      if (!validation.isValid) {
        alert(`Validation errors:\n${validation.errors.join('\n')}`);
        return;
      }

      if (validation.warnings.length > 0) {
        const proceed = confirm(`Warnings:\n${validation.warnings.join('\n')}\n\nContinue anyway?`);
        if (!proceed) return;
      }

      if (editingId) {
        updateContent(editingId, formData);
        setEditingId(null);
      } else {
        addContent(formData as Omit<CMSContent, 'id'>);
        setShowAddForm(false);
      }

      resetForm();
      logger.info('CMS content saved successfully');
    } catch (error) {
      logger.error('Failed to save CMS content', { error });
      alert(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'condition',
      title: '',
      content: '',
      shortDescription: '',
      detailedDescription: '',
      metadata: {
        urgency: 'monitor',
        severity: 'mild',
        category: '',
        subcategory: '',
        tags: [],
        symptoms: [],
        relatedConditions: [],
        ageGroups: [],
        gender: 'both',
        prevalence: 'common',
        duration: '',
        onset: 'gradual',
        triggers: [],
        riskFactors: [],
        complications: [],
        whenToSeekHelp: [],
        homeRemedies: [],
        medications: [],
        lifestyle: [],
        prevention: [],
        followUp: '',
        sources: [],
        author: 'Admin',
        reviewedBy: '',
        medicallyReviewed: false,
        version: 1,
        status: 'draft',
        language: 'en',
        region: '',
        lastUpdated: ''
      }
    });
  };

  const handleEdit = (item: CMSContent) => {
    setFormData(item);
    setEditingId(item.id);
    setShowAddForm(false);
    setActiveTab('content');
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    resetForm();
  };

  const handleDuplicate = (id: string) => {
    try {
      duplicateContent(id);
      logger.info('Content duplicated successfully');
    } catch (error) {
      logger.error('Failed to duplicate content', { error });
      alert('Failed to duplicate content');
    }
  };

  const handleExport = () => {
    try {
      exportContent('json');
      logger.info('Content exported successfully');
    } catch (error) {
      logger.error('Failed to export content', { error });
      alert('Failed to export content');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    importContent(file)
      .then(() => {
        logger.info('Content imported successfully');
        alert('Content imported successfully');
      })
      .catch((error) => {
        logger.error('Failed to import content', { error });
        alert('Failed to import content');
      });
  };

  const handleArrayInput = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata!,
        [field]: items
      }
    }));
  };

  const getTypeIcon = (type: CMSContent['type']) => {
    switch (type) {
      case 'condition': return <Heart className="w-4 h-4" />;
      case 'symptom': return <Stethoscope className="w-4 h-4" />;
      case 'advice': return <FileText className="w-4 h-4" />;
      case 'disclaimer': return <AlertTriangle className="w-4 h-4" />;
      case 'treatment': return <Plus className="w-4 h-4" />;
      case 'prevention': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'immediate': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'monitor': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-20 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200 z-40"
        title="Open CMS Panel (Ctrl+Shift+C)"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Content Management System</h2>
              <p className="text-sm text-gray-600">Manage medical content, conditions, and advice</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600">
              {stats.totalContent} items • {filteredContent.length} filtered
            </div>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close CMS Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'content' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Content ({filteredContent.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'stats' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'settings' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Settings
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'content' && (
            <div className="h-full flex">
              {/* Content List */}
              <div className="w-1/2 border-r border-gray-200 flex flex-col">
                {/* Controls */}
                <div className="p-4 border-b border-gray-200 space-y-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Content</span>
                    </button>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Filter className="w-4 h-4" />
                      {showFilters ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => searchContent(e.target.value)}
                      placeholder="Search content..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Filters */}
                  {showFilters && (
                    <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={filterType}
                          onChange={(e) => setFilters({ filterType: e.target.value as any })}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="all">All Types</option>
                          <option value="condition">Conditions</option>
                          <option value="symptom">Symptoms</option>
                          <option value="advice">Advice</option>
                          <option value="disclaimer">Disclaimers</option>
                          <option value="treatment">Treatments</option>
                          <option value="prevention">Prevention</option>
                        </select>
                        <select
                          value={filterUrgency}
                          onChange={(e) => setFilters({ filterUrgency: e.target.value as any })}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="all">All Urgency</option>
                          <option value="immediate">Immediate</option>
                          <option value="moderate">Moderate</option>
                          <option value="monitor">Monitor</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilters({ filterStatus: e.target.value as any })}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="all">All Status</option>
                          <option value="draft">Draft</option>
                          <option value="review">Review</option>
                          <option value="approved">Approved</option>
                          <option value="archived">Archived</option>
                        </select>
                        <button
                          onClick={clearFilters}
                          className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sorting */}
                  <div className="flex items-center space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSorting(e.target.value as any, sortOrder)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="lastUpdated">Last Updated</option>
                      <option value="title">Title</option>
                      <option value="urgency">Urgency</option>
                      <option value="category">Category</option>
                    </select>
                    <button
                      onClick={() => setSorting(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Content Items */}
                <div className="flex-1 overflow-y-auto p-4">
                  {isLoading ? (
                    <div className="text-center text-gray-500">Loading content...</div>
                  ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                  ) : filteredContent.length === 0 ? (
                    <div className="text-center text-gray-500">No content matches your filters</div>
                  ) : (
                    <div className="space-y-2">
                      {filteredContent.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                            editingId === item.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {getTypeIcon(item.type)}
                                <span className="font-medium text-sm text-gray-900">{item.title}</span>
                                {item.metadata.urgency && (
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getUrgencyColor(item.metadata.urgency)}`}>
                                    {item.metadata.urgency}
                                  </span>
                                )}
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(item.metadata.status)}`}>
                                  {item.metadata.status}
                                </span>
                              </div>
                              
                              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                {item.shortDescription || item.content}
                              </p>
                              
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <Tag className="w-3 h-3" />
                                  <span>{item.type}</span>
                                </span>
                                {item.metadata.category && (
                                  <span className="flex items-center space-x-1">
                                    <Globe className="w-3 h-3" />
                                    <span>{item.metadata.category}</span>
                                  </span>
                                )}
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{new Date(item.metadata.lastUpdated).toLocaleDateString()}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <User className="w-3 h-3" />
                                  <span>{item.metadata.author}</span>
                                </span>
                              </div>
                              
                              {item.metadata.tags && item.metadata.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.metadata.tags.slice(0, 3).map((tag, index) => (
                                    <span key={index} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                      {tag}
                                    </span>
                                  ))}
                                  {item.metadata.tags.length > 3 && (
                                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                      +{item.metadata.tags.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col space-y-1 ml-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-1 hover:bg-blue-100 rounded"
                                title="Edit"
                              >
                                <Edit className="w-3 h-3 text-blue-600" />
                              </button>
                              <button
                                onClick={() => handleDuplicate(item.id)}
                                className="p-1 hover:bg-green-100 rounded"
                                title="Duplicate"
                              >
                                <Copy className="w-3 h-3 text-green-600" />
                              </button>
                              <button
                                onClick={() => deleteContent(item.id)}
                                className="p-1 hover:bg-red-100 rounded"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Form */}
              <div className="w-1/2 flex flex-col">
                {(showAddForm || editingId) ? (
                  <div className="flex-1 p-4 overflow-y-auto">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {editingId ? 'Edit Content' : 'Add New Content'}
                    </h3>

                    <div className="space-y-4">
                      {/* Basic Information */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                            <select
                              value={formData.type}
                              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as CMSContent['type'] }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            >
                              <option value="condition">Medical Condition</option>
                              <option value="symptom">Symptom</option>
                              <option value="advice">Medical Advice</option>
                              <option value="disclaimer">Disclaimer</option>
                              <option value="treatment">Treatment</option>
                              <option value="prevention">Prevention</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input
                              type="text"
                              value={formData.title}
                              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              placeholder="Enter title..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                            <input
                              type="text"
                              value={formData.shortDescription}
                              onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              placeholder="Brief one-line description..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                            <textarea
                              value={formData.content}
                              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-24 resize-none"
                              placeholder="Main content..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                            <textarea
                              value={formData.detailedDescription}
                              onChange={(e) => setFormData(prev => ({ ...prev, detailedDescription: e.target.value }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-20 resize-none"
                              placeholder="Comprehensive description..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Medical Information */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Medical Information</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {formData.type === 'condition' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                                <select
                                  value={formData.metadata?.urgency || 'monitor'}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    metadata: { ...prev.metadata!, urgency: e.target.value as any }
                                  }))}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                >
                                  <option value="monitor">Monitor</option>
                                  <option value="moderate">Moderate</option>
                                  <option value="immediate">Immediate</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                                <select
                                  value={formData.metadata?.severity || 'mild'}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    metadata: { ...prev.metadata!, severity: e.target.value as any }
                                  }))}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                >
                                  <option value="mild">Mild</option>
                                  <option value="moderate">Moderate</option>
                                  <option value="severe">Severe</option>
                                  <option value="critical">Critical</option>
                                </select>
                              </div>
                            </>
                          )}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                              type="text"
                              value={formData.metadata?.category || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                metadata: { ...prev.metadata!, category: e.target.value }
                              }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              placeholder="e.g., respiratory, cardiac..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                            <input
                              type="text"
                              value={formData.metadata?.subcategory || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                metadata: { ...prev.metadata!, subcategory: e.target.value }
                              }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              placeholder="More specific category..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                            <input
                              type="text"
                              value={formData.metadata?.duration || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                metadata: { ...prev.metadata!, duration: e.target.value }
                              }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              placeholder="e.g., 7-10 days, chronic..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Onset</label>
                            <select
                              value={formData.metadata?.onset || 'gradual'}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                metadata: { ...prev.metadata!, onset: e.target.value as any }
                              }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            >
                              <option value="sudden">Sudden</option>
                              <option value="gradual">Gradual</option>
                              <option value="chronic">Chronic</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Lists and Arrays */}
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Related Information</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                            <input
                              type="text"
                              value={formData.metadata?.tags?.join(', ') || ''}
                              onChange={(e) => handleArrayInput('tags', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              placeholder="viral, respiratory, common..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms (comma-separated)</label>
                            <input
                              type="text"
                              value={formData.metadata?.symptoms?.join(', ') || ''}
                              onChange={(e) => handleArrayInput('symptoms', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              placeholder="fever, cough, headache..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Factors (comma-separated)</label>
                            <input
                              type="text"
                              value={formData.metadata?.riskFactors?.join(', ') || ''}
                              onChange={(e) => handleArrayInput('riskFactors', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              placeholder="age, smoking, diabetes..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">When to Seek Help (comma-separated)</label>
                            <input
                              type="text"
                              value={formData.metadata?.whenToSeekHelp?.join(', ') || ''}
                              onChange={(e) => handleArrayInput('whenToSeekHelp', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              placeholder="high fever, difficulty breathing..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Home Remedies (comma-separated)</label>
                            <input
                              type="text"
                              value={formData.metadata?.homeRemedies?.join(', ') || ''}
                              onChange={(e) => handleArrayInput('homeRemedies', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              placeholder="rest, fluids, warm compress..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prevention (comma-separated)</label>
                            <input
                              type="text"
                              value={formData.metadata?.prevention?.join(', ') || ''}
                              onChange={(e) => handleArrayInput('prevention', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              placeholder="hand washing, vaccination..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Metadata</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                            <input
                              type="text"
                              value={formData.metadata?.author || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                metadata: { ...prev.metadata!, author: e.target.value }
                              }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              placeholder="Author name..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reviewed By</label>
                            <input
                              type="text"
                              value={formData.metadata?.reviewedBy || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                metadata: { ...prev.metadata!, reviewedBy: e.target.value }
                              }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              placeholder="Reviewer name..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                              value={formData.metadata?.status || 'draft'}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                metadata: { ...prev.metadata!, status: e.target.value as any }
                              }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            >
                              <option value="draft">Draft</option>
                              <option value="review">Review</option>
                              <option value="approved">Approved</option>
                              <option value="archived">Archived</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                            <select
                              value={formData.metadata?.language || 'en'}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                metadata: { ...prev.metadata!, language: e.target.value }
                              }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                            </select>
                          </div>

                          <div className="col-span-2">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.metadata?.medicallyReviewed || false}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  metadata: { ...prev.metadata!, medicallyReviewed: e.target.checked }
                                }))}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm font-medium text-gray-700">Medically Reviewed</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-6 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Content</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Selected</h3>
                      <p className="text-gray-600 mb-4">Select content to edit or add new content</p>
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Content</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-blue-900">Total Content</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalContent}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium text-green-900">Approved</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{stats.byStatus.approved || 0}</p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-medium text-yellow-900">Needs Review</h3>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">{stats.needsReview.length}</p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="font-medium text-red-900">Immediate</h3>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{stats.byUrgency.immediate || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Content by Type</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.byType).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(type as CMSContent['type'])}
                          <span className="capitalize">{type}</span>
                        </div>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Recently Updated</h3>
                  <div className="space-y-2">
                    {stats.recentlyUpdated.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(item.type)}
                          <span className="text-sm truncate">{item.title}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(item.metadata.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6 overflow-y-auto">
              <div className="max-w-2xl space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Import/Export</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleExport}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export All Content</span>
                    </button>
                    
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Import Content</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Keyboard Shortcuts</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Toggle CMS Panel</span>
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + Shift + C</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Toggle Debug Panel</span>
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + Shift + D</kbd>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">System Information</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Version</span>
                      <span>1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage</span>
                      <span>Local Storage</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Backup</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};