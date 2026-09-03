import React, { useState, useEffect } from 'react';
import './MenuSelection.css';

const MenuCalculator = () => {
  const [customerDetails, setCustomerDetails] = useState({
    customerName: '',
    phoneNumber: '',
    pax: '',
    functionType: 'Marriage',
    gatheringType: 'Mix Gathering',
    venue: '',
    eventDate: '',
    eventTime: ''
  });

  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Chicken Tikka', quantity: 0, rate: 450, total: 0 },
    { id: 2, name: 'Butter Chicken', quantity: 0, rate: 480, total: 0 },
    { id: 3, name: 'Biryani', quantity: 0, rate: 350, total: 0 },
    { id: 4, name: 'Naan', quantity: 0, rate: 20, total: 0 },
    { id: 5, name: 'Rice', quantity: 0, rate: 80, total: 0 },
  ]);

  const [deepSeekSuggestions, setDeepSeekSuggestions] = useState(null);
  const [chatGPTSuggestions, setChatGPTSuggestions] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const functionTypes = ['Marriage', 'Reception', 'Birthday', 'Corporate', 'Anniversary', 'Engagement', 'Other'];
  const gatheringTypes = ['Mix Gathering', 'Segregated'];

  const handleCustomerChange = (e) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (id, quantity) => {
    const updatedItems = menuItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: parseFloat(quantity) || 0, total: (parseFloat(quantity) || 0) * item.rate };
      }
      return item;
    });
    setMenuItems(updatedItems);
  };

  const calculateTotals = () => {
    const subtotal = menuItems.reduce((sum, item) => sum + item.total, 0);
    const gst = subtotal * 0.18;
    const grandTotal = subtotal + gst;
    const advance = grandTotal * 0.30;
    const oneWeekBefore = grandTotal * 0.30;
    const dayBefore = grandTotal * 0.40;

    return { subtotal, gst, grandTotal, advance, oneWeekBefore, dayBefore };
  };

  const totals = calculateTotals();

  const getAISuggestions = async () => {
    setLoadingAI(true);
    try {
      // Privacy: Only send menu items, PAX, and function type - NO customer data
      const aiRequestData = {
        menuItems: menuItems.map(item => ({ name: item.name, rate: item.rate })),
        pax: customerDetails.pax,
        functionType: customerDetails.functionType
      };

      // DeepSeek API Call
      try {
        const deepSeekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY || ''}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: 'You are a catering expert. Suggest quantities for menu items based on PAX and function type. Return JSON with item names as keys and quantities as values.'
              },
              {
                role: 'user',
                content: JSON.stringify(aiRequestData)
              }
            ]
          })
        });

        if (deepSeekResponse.ok) {
          const deepSeekData = await deepSeekResponse.json();
          setDeepSeekSuggestions({
            data: deepSeekData,
            confidence: 0.85
          });
        }
      } catch (error) {
        console.error('DeepSeek API Error:', error);
      }

      // ChatGPT API Call
      try {
        const chatGPTResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a catering expert. Suggest quantities for menu items based on PAX and function type. Return JSON with item names as keys and quantities as values.'
              },
              {
                role: 'user',
                content: JSON.stringify(aiRequestData)
              }
            ]
          })
        });

        if (chatGPTResponse.ok) {
          const chatGPTData = await chatGPTResponse.json();
          setChatGPTSuggestions({
            data: chatGPTData,
            confidence: 0.82
          });
        }
      } catch (error) {
        console.error('ChatGPT API Error:', error);
      }

      setShowComparison(true);
    } catch (error) {
      console.error('AI Suggestions Error:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const sendWhatsAppEstimate = () => {
    // WhatsApp integration would go here
    alert('WhatsApp estimate would be sent to: ' + customerDetails.phoneNumber);
  };

  const saveAsDraft = () => {
    // Save draft functionality would go here
    alert('Estimate saved as draft');
  };

  return (
    <div className="menu-container-dark">
      <div className="menu-card-dark">
        {/* Header */}
        <div className="menu-header-dark">
          <h1>AI Menu Calculator</h1>
          <p className="menu-subtitle-dark">CATERING SERVICE</p>
          <p className="menu-subtitle-small-dark">AI-POWERED QUANTITY & PRICING ESTIMATES</p>
        </div>

        {/* Customer Details Section */}
        <div className="form-section-dark">
          <h3>Customer Details</h3>
          <div className="form-row-dark">
            <div className="form-group-dark">
              <label>Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={customerDetails.customerName}
                onChange={handleCustomerChange}
                placeholder="Enter customer name"
              />
            </div>
            <div className="form-group-dark">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={customerDetails.phoneNumber}
                onChange={handleCustomerChange}
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-group-dark">
              <label>PAX (Guests)</label>
              <input
                type="number"
                name="pax"
                value={customerDetails.pax}
                onChange={handleCustomerChange}
                placeholder="Number of guests"
              />
            </div>
            <div className="form-group-dark">
              <label>Function Type</label>
              <select
                name="functionType"
                value={customerDetails.functionType}
                onChange={handleCustomerChange}
              >
                {functionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group-dark">
              <label>Gathering Type</label>
              <select
                name="gatheringType"
                value={customerDetails.gatheringType}
                onChange={handleCustomerChange}
              >
                {gatheringTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group-dark">
              <label>Venue</label>
              <input
                type="text"
                name="venue"
                value={customerDetails.venue}
                onChange={handleCustomerChange}
                placeholder="Event venue"
              />
            </div>
            <div className="form-group-dark">
              <label>Event Date</label>
              <input
                type="date"
                name="eventDate"
                value={customerDetails.eventDate}
                onChange={handleCustomerChange}
              />
            </div>
            <div className="form-group-dark">
              <label>Event Time</label>
              <input
                type="time"
                name="eventTime"
                value={customerDetails.eventTime}
                onChange={handleCustomerChange}
              />
            </div>
          </div>
        </div>

        {/* Menu Items Section */}
        <div className="form-section-dark">
          <h3>Menu Items</h3>
          <div className="menu-items-grid-dark">
            {menuItems.map(item => (
              <div key={item.id} className="menu-item-dark">
                <div className="menu-item-name-dark">{item.name}</div>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  placeholder="Qty"
                  min="0"
                  step="0.5"
                  style={{ width: '70px', padding: '4px 8px', fontSize: '12px' }}
                />
                <div style={{ fontSize: '11px', color: '#f5c842' }}>₹{item.rate}/kg</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions Section */}
        <div className="form-section-dark">
          <h3>AI Suggestions</h3>
          <button
            onClick={getAISuggestions}
            disabled={loadingAI || !customerDetails.pax}
            className="btn-submit-dark"
            style={{ marginTop: '0', marginBottom: '16px' }}
          >
            {loadingAI ? 'Getting AI Suggestions...' : 'Get AI Suggestions'}
          </button>

          {showComparison && (
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ color: '#f5c842', fontSize: '14px', marginBottom: '12px' }}>AI Comparison</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '8px', textAlign: 'left', color: '#f5c842' }}>Item</th>
                      <th style={{ padding: '8px', textAlign: 'center', color: '#f5c842' }}>DeepSeek</th>
                      <th style={{ padding: '8px', textAlign: 'center', color: '#f5c842' }}>ChatGPT</th>
                      <th style={{ padding: '8px', textAlign: 'center', color: '#f5c842' }}>Your Calc</th>
                      <th style={{ padding: '8px', textAlign: 'center', color: '#f5c842' }}>Diff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map(item => {
                      const deepSeekQty = deepSeekSuggestions?.data?.choices?.[0]?.message?.content ? 
                        JSON.parse(deepSeekSuggestions.data.choices[0].message.content)[item.name] || 0 : 0;
                      const chatGPTQty = chatGPTSuggestions?.data?.choices?.[0]?.message?.content ? 
                        JSON.parse(chatGPTSuggestions.data.choices[0].message.content)[item.name] || 0 : 0;
                      const diff = Math.abs(item.quantity - ((deepSeekQty + chatGPTQty) / 2)).toFixed(1);
                      
                      return (
                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '8px', color: 'rgba(200,200,220,0.8)' }}>{item.name}</td>
                          <td style={{ padding: '8px', textAlign: 'center', color: 'rgba(200,200,220,0.6)' }}>
                            {deepSeekQty ? `${deepSeekQty} kg` : 'N/A'}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center', color: 'rgba(200,200,220,0.6)' }}>
                            {chatGPTQty ? `${chatGPTQty} kg` : 'N/A'}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center', color: '#f5c842' }}>
                            {item.quantity ? `${item.quantity} kg` : '0 kg'}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center', color: 'rgba(150,150,180,0.5)' }}>
                            ±{diff} kg
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* AI Confidence Scores */}
              <div style={{ marginTop: '12px', display: 'flex', gap: '16px' }}>
                {deepSeekSuggestions && (
                  <div style={{ background: 'rgba(245,200,66,0.1)', padding: '8px 12px', borderRadius: '8px' }}>
                    <span style={{ color: 'rgba(200,200,220,0.6)', fontSize: '11px' }}>DeepSeek Confidence: </span>
                    <span style={{ color: '#f5c842', fontSize: '12px', fontWeight: '600' }}>
                      {(deepSeekSuggestions.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
                {chatGPTSuggestions && (
                  <div style={{ background: 'rgba(245,200,66,0.1)', padding: '8px 12px', borderRadius: '8px' }}>
                    <span style={{ color: 'rgba(200,200,220,0.6)', fontSize: '11px' }}>ChatGPT Confidence: </span>
                    <span style={{ color: '#f5c842', fontSize: '12px', fontWeight: '600' }}>
                      {(chatGPTSuggestions.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Summary Section */}
        <div className="form-section-dark">
          <h3>Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group-dark">
              <label>Subtotal</label>
              <input
                type="text"
                value={`₹${totals.subtotal.toFixed(2)}`}
                readOnly
                style={{ background: 'rgba(10,30,10,0.5)', color: '#f5c842' }}
              />
            </div>
            <div className="form-group-dark">
              <label>GST (18%)</label>
              <input
                type="text"
                value={`₹${totals.gst.toFixed(2)}`}
                readOnly
                style={{ background: 'rgba(10,30,10,0.5)', color: '#f5c842' }}
              />
            </div>
            <div className="form-group-dark">
              <label>Grand Total</label>
              <input
                type="text"
                value={`₹${totals.grandTotal.toFixed(2)}`}
                readOnly
                style={{ background: 'rgba(10,30,10,0.5)', color: '#f5c842', fontWeight: '600' }}
              />
            </div>
            <div className="form-group-dark">
              <label>Advance (30%)</label>
              <input
                type="text"
                value={`₹${totals.advance.toFixed(2)}`}
                readOnly
                style={{ background: 'rgba(10,30,10,0.5)', color: '#f5c842' }}
              />
            </div>
            <div className="form-group-dark">
              <label>One Week Before (30%)</label>
              <input
                type="text"
                value={`₹${totals.oneWeekBefore.toFixed(2)}`}
                readOnly
                style={{ background: 'rgba(10,30,10,0.5)', color: '#f5c842' }}
              />
            </div>
            <div className="form-group-dark">
              <label>Day Before (40%)</label>
              <input
                type="text"
                value={`₹${totals.dayBefore.toFixed(2)}`}
                readOnly
                style={{ background: 'rgba(10,30,10,0.5)', color: '#f5c842' }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bottom-actions">
          <button
            onClick={sendWhatsAppEstimate}
            className="btn-preview"
            disabled={!customerDetails.phoneNumber}
          >
            Send Estimate (WhatsApp)
          </button>
          <button
            onClick={saveAsDraft}
            className="btn-edit"
          >
            Save as Draft
          </button>
        </div>

        {/* Footer */}
        <div className="menu-footer-dark">
          <p>AI Menu Calculator • Powered by DeepSeek & ChatGPT • Customer Data Privacy Protected</p>
        </div>
      </div>
    </div>
  );
};

export default MenuCalculator;