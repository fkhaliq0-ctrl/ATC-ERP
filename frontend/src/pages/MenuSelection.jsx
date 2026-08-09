import React, { useState } from 'react';
import './MenuSelection.css';

const API_URL = 'https://atc-geca.onrender.com/api/create-menu-submission/';

const MenuSelection = () => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    gathering_type: '',
    venue: '',
    pax: '',
    event_time: '',
    pre_wedding: '',
    pre_wedding_type: '',
    pre_wedding_venue: '',
    event_date: '',
    menu_selections: {}
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMenuChange = (category, item) => {
    setFormData(prev => {
      const selections = { ...prev.menu_selections };
      if (!selections[category]) {
        selections[category] = [];
      }
      const index = selections[category].indexOf(item);
      if (index > -1) {
        selections[category].splice(index, 1);
        if (selections[category].length === 0) {
          delete selections[category];
        }
      } else {
        selections[category].push(item);
      }
      return {
        ...prev,
        menu_selections: selections
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      pax: parseInt(formData.pax) || null
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess(true);
        console.log('✅ Menu submitted successfully!');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit menu.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="menu-container">
      <div className="menu-card">
        <div className="menu-header">
          <h1>🍽️ Zebaish Caterers</h1>
          <p className="menu-subtitle">Customize Your Event Menu</p>
          <p className="menu-subtitle-small">A unit of Allied Trading Corporation</p>
        </div>

        <div className="menu-body">
          {success ? (
            <div className="success-message">
              <p>✅ Menu submitted successfully!</p>
              <p className="success-detail">Thank you! Our team will contact you shortly.</p>
              <button className="btn-new" onClick={() => window.location.reload()}>
                Submit Another Menu
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="menu-form">
              <h3>Event Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Customer Name</label>
                  <input type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} placeholder="Enter your name" />
                </div>
                <div className="form-group">
                  <label>Contact Number *</label>
                  <input type="tel" name="customer_phone" value={formData.customer_phone} onChange={handleChange} placeholder="9876543210" required />
                </div>
              </div>

              <div className="form-group">
                <label>Gathering Type</label>
                <select name="gathering_type" value={formData.gathering_type} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Mixed">Mixed Gathering</option>
                  <option value="Segregate">Segregate (Ladies & Gents)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Venue</label>
                <input type="text" name="venue" value={formData.venue} onChange={handleChange} placeholder="Enter event venue" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pax (Guest Count)</label>
                  <input type="number" name="pax" value={formData.pax} onChange={handleChange} placeholder="100" />
                </div>
                <div className="form-group">
                  <label>Event Time</label>
                  <input type="time" name="event_time" value={formData.event_time} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Event Date</label>
                <input type="date" name="event_date" value={formData.event_date} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Pre-Wedding Functions</label>
                <select name="pre_wedding" value={formData.pre_wedding} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {formData.pre_wedding === 'Yes' && (
                <>
                  <div className="form-group">
                    <label>Pre-Wedding Type</label>
                    <select name="pre_wedding_type" value={formData.pre_wedding_type} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Mehendi">Mehendi</option>
                      <option value="Sangeet">Sangeet</option>
                      <option value="Haldi">Haldi</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Pre-Wedding Venue</label>
                    <input type="text" name="pre_wedding_venue" value={formData.pre_wedding_venue} onChange={handleChange} placeholder="Enter pre-wedding venue" />
                  </div>
                </>
              )}

              <h3>Select Your Menu</h3>
              
              <div className="menu-categories">
                <div className="menu-category">
                  <h4>🥂 Welcome Drinks (Halal)</h4>
                  {['Fresh Lime', 'Mango Shake', 'Rose Sharbat', 'Jaljeera'].map(item => (
                    <label key={item} className="menu-item">
                      <input type="checkbox" onChange={() => handleMenuChange('welcome_drinks', item)} />
                      {item}
                    </label>
                  ))}
                </div>

                <div className="menu-category">
                  <h4>🍽️ Starters (Veg)</h4>
                  {['Paneer Tikka', 'Spring Rolls', 'Veg Seekh', 'Mushroom Galouti'].map(item => (
                    <label key={item} className="menu-item">
                      <input type="checkbox" onChange={() => handleMenuChange('starters_veg', item)} />
                      {item}
                    </label>
                  ))}
                </div>

                <div className="menu-category">
                  <h4>🍗 Starters (Non-Veg)</h4>
                  {['Chicken Tikka', 'Mutton Seekh', 'Chicken Wings', 'Fish Amritsari'].map(item => (
                    <label key={item} className="menu-item">
                      <input type="checkbox" onChange={() => handleMenuChange('starters_nonveg', item)} />
                      {item}
                    </label>
                  ))}
                </div>

                <div className="menu-category">
                  <h4>🍛 Main Course (Veg)</h4>
                  {['Paneer Butter Masala', 'Dal Makhani', 'Veg Biryani', 'Shahi Paneer'].map(item => (
                    <label key={item} className="menu-item">
                      <input type="checkbox" onChange={() => handleMenuChange('main_course_veg', item)} />
                      {item}
                    </label>
                  ))}
                </div>

                <div className="menu-category">
                  <h4>🍖 Main Course (Non-Veg)</h4>
                  {['Butter Chicken', 'Rogan Josh', 'Chicken Biryani', 'Mutton Curry'].map(item => (
                    <label key={item} className="menu-item">
                      <input type="checkbox" onChange={() => handleMenuChange('main_course_nonveg', item)} />
                      {item}
                    </label>
                  ))}
                </div>

                <div className="menu-category">
                  <h4>🍰 Desserts</h4>
                  {['Gulab Jamun', 'Rasmalai', 'Ice Cream', 'Kulfi'].map(item => (
                    <label key={item} className="menu-item">
                      <input type="checkbox" onChange={() => handleMenuChange('desserts', item)} />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Submitting...' : '📨 Submit My Menu'}
              </button>
            </form>
          )}
        </div>

        <div className="menu-footer">
          <p>🔒 All data is secure and stored in your ERP system.</p>
        </div>
      </div>
    </div>
  );
};

export default MenuSelection;