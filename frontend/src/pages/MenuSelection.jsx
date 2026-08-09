import React, { useState } from 'react';
import './MenuSelection.css';

const MenuSelection = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    eventType: 'Mixed',
    venue: '',
    pax: '',
    eventTime: '',
    eventDate: '',
    preWedding: 'No',
    preWeddingType: '',
    preWeddingVenue: '',
    menuDecided: '',
    selectedItems: {
      welcomeDrinks: [],
      vegStarters: [],
      nonVegStarters: [],
      soups: [],
      vegMain: [],
      nonVegMain: [],
      biryani: [],
      desserts: [],
    }
  });

  const [showPreview, setShowPreview] = useState(false);

  const menuCategories = {
    welcomeDrinks: {
      label: '🥂 Welcome Drinks (Halal)',
      items: ['Fresh Lime', 'Mango Shake', 'Rose Sharbat', 'Jaljeera', 'Coconut Water', 'Sweet Lassi', 'Salt Lassi', 'Mint Lemonade', 'Aam Panna', 'Fruit Punch', 'Buttermilk']
    },
    vegStarters: {
      label: '🍽️ Veg Starters',
      items: ['Paneer Tikka', 'Spring Rolls', 'Veg Seekh', 'Hara Bhara Kabab', 'Veg Nuggets', 'Bombay Cutlet', 'French Fries', 'Aloo Tikki', 'Cheese Balls', 'Chilly Honey Potato']
    },
    nonVegStarters: {
      label: '🍗 Non-Veg Starters',
      items: ['Chicken Tikka', 'Mutton Seekh', 'Fish Amritsari', 'Chicken Lollipop', 'Chicken Shami Kabab', 'Chicken Wings', 'Chicken 65', 'Fish Fingers', 'Tandoori Prawns', 'Mutton Chaap']
    },
    soups: {
      label: '🥣 Soups',
      items: ['Chicken Soup', 'Tomato Soup', 'Sweet Corn Soup', 'Cream of Mushroom', 'Lemon Coriander', 'Vegetable Soup', 'Badam Soup', 'Hot & Sour Soup', 'Manchow Soup']
    },
    vegMain: {
      label: '🍛 Main Course (Veg)',
      items: ['Paneer Butter Masala', 'Dal Makhani', 'Shahi Paneer', 'Kadhai Paneer', 'Malai Kofta', 'Rajma', 'Mix Veg', 'Palak Paneer', 'Pindi Chole', 'Jaipuri Dal']
    },
    nonVegMain: {
      label: '🍖 Main Course (Non-Veg)',
      items: ['Butter Chicken', 'Rogan Josh', 'Chicken Qorma', 'Mutton Qorma', 'Chicken Kadhai', 'Fish Curry', 'Chicken Lahori', 'Nihari', 'Haleem', 'Badam Pasanda']
    },
    biryani: {
      label: '🍚 Biryani / Pulao',
      items: ['Chicken Biryani', 'Mutton Biryani', 'Buff Biryani', 'Fish Biryani', 'Prawn Biryani', 'Chicken Achari Biryani', 'Mutton Hyderabadi Biryani', 'Chicken Muradabadi Pulao']
    },
    desserts: {
      label: '🍰 Desserts',
      items: ['Gulab Jamun', 'Rasmalai', 'Kheer', 'Kulfi', 'Ice Cream', 'Moong Dal Halwa', 'Shahi Tukda', 'Fruit Custard', 'Rabri Jalebi', 'Gajar Halwa']
    }
  };

  const handleCheckboxChange = (category, item) => {
    setFormData(prev => {
      const current = prev.selectedItems[category];
      const updated = current.includes(item) 
        ? current.filter(i => i !== item) 
        : [...current, item];
      return {
        ...prev,
        selectedItems: {
          ...prev.selectedItems,
          [category]: updated
        }
      };
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Menu submitted successfully! We will contact you shortly.');
    console.log('Form Data:', formData);
    // Here we will send data to backend later
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  const renderCategory = (categoryKey, categoryData) => {
    return (
      <div key={categoryKey} className="menu-category">
        <h4>{categoryData.label}</h4>
        <div className="menu-items-grid">
          {categoryData.items.map(item => (
            <label key={item} className="menu-item">
              <input
                type="checkbox"
                checked={formData.selectedItems[categoryKey].includes(item)}
                onChange={() => handleCheckboxChange(categoryKey, item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="menu-page-container">
      <div className="menu-header">
        <h1>🍽️ Zebaish Caterers</h1>
        <p className="subtitle">A unit of Allied Trading Corporation</p>
        <p className="welcome-text">Welcome! Please customize your menu for your upcoming event.</p>
      </div>

      <form onSubmit={handleSubmit} className="menu-form">
        {/* Event Details */}
        <div className="event-details">
          <h3>📋 Event Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Customer Name *</label>
              <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Event Type</label>
              <select name="eventType" value={formData.eventType} onChange={handleInputChange}>
                <option value="Mixed">Mixed Gathering</option>
                <option value="Segregate">Segregate (Ladies & Gents)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Venue *</label>
              <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} placeholder="e.g., India Islamic Cultural Centre" required />
            </div>
            <div className="form-group">
              <label>Pax (Guest Count) *</label>
              <input type="number" name="pax" value={formData.pax} onChange={handleInputChange} placeholder="e.g., 200" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Event Date *</label>
              <input type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Event Time *</label>
              <input type="time" name="eventTime" value={formData.eventTime} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Any Pre-Wedding Functions?</label>
              <select name="preWedding" value={formData.preWedding} onChange={handleInputChange}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            {formData.preWedding === 'Yes' && (
              <>
                <div className="form-group">
                  <label>Pre-Wedding Function Type</label>
                  <select name="preWeddingType" value={formData.preWeddingType} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="Mehendi">Mehendi</option>
                    <option value="Sangeet">Sangeet</option>
                    <option value="Haldi">Haldi</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Pre-Wedding Venue</label>
                  <input type="text" name="preWeddingVenue" value={formData.preWeddingVenue} onChange={handleInputChange} placeholder="e.g., IICC Hall B" />
                </div>
              </>
            )}
          </div>

          <div className="form-group">
            <label>Menu Decided (If any)</label>
            <textarea name="menuDecided" value={formData.menuDecided} onChange={handleInputChange} placeholder="Share any specific menu items you already have in mind..." rows="2"></textarea>
          </div>
        </div>

        {/* Menu Selection */}
        <div className="menu-selection">
          <h3>📋 Select Your Menu</h3>
          <p className="hint">Check all items you'd like to include in your event menu.</p>

          {Object.entries(menuCategories).map(([key, data]) => renderCategory(key, data))}
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="button" className="btn-preview" onClick={handlePreview}>
            👁️ {showPreview ? 'Hide Preview' : 'Preview Menu'}
          </button>
          <button type="submit" className="btn-submit">
            📩 Submit My Menu
          </button>
          <button type="button" className="btn-print" onClick={() => window.print()}>
            🖨️ Print Menu
          </button>
        </div>
      </form>

      {/* Preview Section */}
      {showPreview && (
        <div className="preview-section">
          <h3>📄 Menu Preview</h3>
          <div className="preview-content">
            <p><strong>Customer:</strong> {formData.customerName || 'Not provided'}</p>
            <p><strong>Event:</strong> {formData.eventType}</p>
            <p><strong>Venue:</strong> {formData.venue || 'Not provided'}</p>
            <p><strong>Pax:</strong> {formData.pax || 'Not provided'}</p>
            <p><strong>Date:</strong> {formData.eventDate || 'Not provided'}</p>
            <p><strong>Time:</strong> {formData.eventTime || 'Not provided'}</p>
            {formData.preWedding === 'Yes' && (
              <p><strong>Pre-Wedding:</strong> {formData.preWeddingType} at {formData.preWeddingVenue}</p>
            )}
            <hr />
            <h4>Selected Items:</h4>
            {Object.entries(menuCategories).map(([key, data]) => {
              const selected = formData.selectedItems[key];
              if (selected.length === 0) return null;
              return (
                <div key={key}>
                  <p><strong>{data.label}:</strong> {selected.join(', ')}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuSelection;
