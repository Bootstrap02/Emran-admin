// src/Components/NewsEventTemplateSelector.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { FiChevronDown, FiX } from 'react-icons/fi';

const NewsEventTemplateSelector = ({ onTemplateSelect, selectedTemplate, adminId }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedType, setSelectedType] = useState('birthday');
  const [loading, setLoading] = useState(false);
  const [templateData, setTemplateData] = useState({});

  const templateTypes = ['birthday', 'funeral', 'wedding', 'anniversary', 'other'];

  useEffect(() => {
    fetchTemplatesByType(selectedType);
  }, [selectedType]);

  const fetchTemplatesByType = async (type) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/news-templates/type/${type}`);
      setTemplates(res.data.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setTemplateData({});
    onTemplateSelect(template);
  };

  const handleTemplateDataChange = (fieldName, value) => {
    const updated = { ...templateData, [fieldName]: value };
    setTemplateData(updated);
    onTemplateSelect({
      ...selectedTemplate,
      templateData: updated,
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-[#001F5B] mb-6">Select Event Template</h2>

      {/* Template Type Selector */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-[#001F5B] mb-3">Event Type</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {templateTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-3 rounded-xl font-semibold capitalize transition ${
                selectedType === type
                  ? 'bg-[#E30613] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading templates...</p>
      ) : templates.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No templates available for this type</p>
      ) : (
        <div className="mb-8">
          <label className="block text-lg font-semibold text-[#001F5B] mb-3">Choose Template</label>
          <div className="space-y-3">
            {templates.map(template => (
              <div
                key={template._id}
                onClick={() => handleTemplateSelect(template)}
                className={`p-5 border-2 rounded-2xl cursor-pointer transition ${
                  selectedTemplate?._id === template._id
                    ? 'border-[#E30613] bg-red-50'
                    : 'border-gray-200 hover:border-[#E30613]'
                }`}
              >
                <h4 className="font-bold text-[#001F5B] text-lg">{template.templateName}</h4>
                <p className="text-gray-600 text-sm mt-1">{template.templateDescription}</p>
                <span className="text-xs text-gray-500 mt-2 block">
                  📸 Max {template.maxImages} images
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Data Form */}
      {selectedTemplate && selectedTemplate.requiredFields && selectedTemplate.requiredFields.length > 0 && (
        <div className="border-t-2 pt-8 mt-8">
          <h3 className="text-xl font-bold text-[#001F5B] mb-6">Fill in Event Details</h3>
          <div className="space-y-5">
            {selectedTemplate.requiredFields.map((field, idx) => (
              <div key={idx}>
                <label className="block text-lg font-semibold text-[#001F5B] mb-2 capitalize">
                  {field.fieldName.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {field.fieldType === 'date' ? (
                  <input
                    type="date"
                    value={templateData[field.fieldName] || ''}
                    onChange={(e) => handleTemplateDataChange(field.fieldName, e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-[#E30613] focus:outline-none"
                  />
                ) : field.fieldType === 'number' ? (
                  <input
                    type="number"
                    placeholder={field.placeholder || `Enter ${field.fieldName}`}
                    value={templateData[field.fieldName] || ''}
                    onChange={(e) => handleTemplateDataChange(field.fieldName, e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-[#E30613] focus:outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={field.placeholder || `Enter ${field.fieldName}`}
                    value={templateData[field.fieldName] || ''}
                    onChange={(e) => handleTemplateDataChange(field.fieldName, e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-[#E30613] focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsEventTemplateSelector;
