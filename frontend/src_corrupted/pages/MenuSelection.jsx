import React, { useState, useEffect } from 'react';
import './MenuSelection.css';

const API_URL = 'https://atc-geca.onrender.com/api/create-menu-submission/';

const MenuSelection = () => {
  const menuData = {
    "🍹 Signature Welcome Beverages & Elixirs": [
      "Virgin Mojito", "Blue Lagoon", "Tropical Fruit Punch", "Shirley Temple",
      "Mint Margarita", "Fresh Lime Soda/Water", "Shardai (Thandai)", "Badam Milk",
      "Chilled Chaas (Buttermilk)", "Traditional Jaljeera", "Fresh Tender Coconut Water",
      "Fresh Filter Coffee", "Royal Masala Chai", "Organic Green Tea", "Kashmiri Kahwa"
    ],
    "🍲 Soups & Velvety Broths": [
      "Classic Chicken Clear Soup", "Sweet Corn Chicken Soup", "Cream of Chicken Velouté",
      "Lemon Coriander Chicken Soup", "Hot & Sour Chicken Soup", "Chicken Manchow Soup",
      "Creamy Tomato Basil Soup", "Velvet Mushroom Soup", "Sweet Corn Vegetable Soup",
      "Lemon Coriander Vegetable Soup", "Hot & Sour Veg Soup", "Veg Manchow Soup",
      "Almond (Badam) Velvet Soup"
    ],
    "🍗 Hors d'Oeuvres & Starters (Poultry & Meat)": [
      "Chicken Satay with Peanut Glaze", "Crispy Chicken Nuggets", "Golden Chicken Popcorn",
      "Chicken Spring Rolls", "Mini Chicken Burger Shots", "Chicken Samosas", "Chicken 65",
      "Chicken Wontons", "Chicken Cheese Balls", "Fiery Chilli Chicken Dry",
      "Chicken Manchurian Dry", "Honey Glazed Chicken", "Kung Pao Chicken Dry",
      "Drums of Heaven", "Chicken Shami Kabab", "Chicken Lollipops", "Chicken Wings",
      "Crispy Chicken Thread", "Chicken Cigar Rolls", "Traditional Chicken Sajji",
      "Crispy Fish Fingers", "Lemon Butter Fish", "Spicy Fish Chilli Dry",
      "Fish in Mustard Velouté", "Fish 65", "Tandoori Prawns", "Golden Fried Prawns",
      "Spicy Prawns Chilli Dry", "Fish Salt & Pepper", "Dynamite Prawns",
      "Fish Finger with Tartar Emulsion", "Pan-Fried Mutton Chaap", "Roasted Mutton Chaap",
      "Mutton Shami Kabab", "Mutton Tikka Boti", "Mutton Boti Kabab", "Traditional Mutton Kabab"
    ],
    "🥗 Hors d'Oeuvres & Starters (Vegetarian)": [
      "Gourmet Veg Nuggets", "Spiced Veg Kababs", "Bombay Cutlet", "Crispy Spring Rolls",
      "Golden French Fries", "Classic Aloo Tikki", "Mini Veg Burger Shots",
      "Crispy Cheese Balls", "Honey Chilli Potatoes", "Crispy Potato Fingers",
      "Potato Cutlets", "Stuffed Potato Rolls", "Paneer Tilhani", "Chilli Paneer Bites",
      "Mini Veg Pizzas", "Soya Chaap", "Soya Lemon Chaap", "Dahi ke Sholay",
      "Honey Chilli Potato", "Crispy Honey Lotus Stem", "Tossed Crispy Corn",
      "Veg Manchurian Dry", "Crispy Salt & Pepper Vegetables", "Vegetable Cigar Rolls",
      "Chicken Momos (Steamed/Fried)", "Veg Momos (Steamed/Fried)",
      "Chicken & Cheese Momos (Steamed/Fried)", "Corn & Cheese Momos (Steamed/Fried)",
      "Pan-Fried Momos"
    ],
    "🍰 Continental & Patisserie Masterpieces": [
      "Classic Vegetable Quiche", "Rich Vegetable Quiche", "Caramelized Onion & Feta Quiche",
      "Chicken Quiche", "Elegant Asparagus Puffs", "Vol-au-Vent Shells with Filling",
      "Mini Gourmet Pizzas", "Crisp Tart Shells", "Cheese Straws", "Savory Veg Patties",
      "Savory Chicken Patties", "Grilled Chicken Salad", "Classic Russian Salad",
      "Mexican Garden Salad", "Pasta Pesto Salad", "Fresh Seasonal Fruit Salad",
      "Strawberry Cheesecake", "Wild Blueberry Cheesecake", "Mango Passion Fruit Cheesecake",
      "Kiwi Cheesecake", "Lemon Cheesecake", "Baked New York Cheesecake",
      "Assorted Fruit Tarts", "Lemon Curd Tarts", "Chocolate Ganache Tarts",
      "Walnut Honey Tarts", "Chocolate Walnut Tarts", "Classic Apple Pie",
      "Date Pie", "Banoffee Pie", "Italian Tiramisu", "Classic Fruit Cream",
      "Trifle Pudding", "Warm Apple Crumble", "Bread & Butter Pudding",
      "Assorted Moussés", "Whipped Soufflés", "Fruit Flane", "Walnut Pie",
      "Hot Chocolate Gateaux", "Cream Caramel", "Chocolate Truffle Cake",
      "Almond Nougat Cake", "Black Forest Gateaux", "Fruit Gateaux",
      "Pineapple Gateaux", "Dark Cherry Chocolate Cake", "Arabian Honey Cake",
      "Chocolate Marble Cake", "Lemon Pound Cake", "Banana Walnut Cake",
      "Chocolate Fudge Brownies", "Chocolate Mud Cake", "Classic Plum Cake",
      "Grand Wedding Cake", "Chocolate & Sugar Glazed Doughnuts", "Artisan Muffins",
      "Eclairs", "Profitrolls"
    ],
    "🔥 Tandoori & Grill Room Specialties": [
      "Chicken Angara Tangri", "Classic Tandoori Chicken", "Chicken Achari Tangri",
      "Chicken Afghani Tangri", "Chicken Achari Tikka", "Chicken Malai Tikka",
      "Chicken Garlic Tikka", "Chicken Ajwaini Tikka", "Chicken Kali Mirch Tikka",
      "Chicken Angara Tikka", "Chicken Burra", "Chicken Kashmiri Tikka",
      "Chicken Haryali Tikka", "Chicken Lemon Tikka", "Roasted Quail (Batair)",
      "Chicken Seekh Kabab", "Chicken Galafi Kabab", "Chicken Gulauti Kabab",
      "Chicken Dora Kabab", "Chicken Kakori Kabab", "Chicken Reshmi Kabab",
      "Chicken Chapli Kabab", "Chicken Sambhali Kabab", "Mutton Tikka",
      "Mutton Barrah", "Mutton Tikka Boti", "Mutton Seekh Kabab", "Mutton Chaap",
      "Mutton Dora Kabab", "Mutton Reshmi Kabab", "Buff Dora Kabab",
      "Buff Reshmi Kabab", "Buff Sambhali Kabab", "Buff Tikka", "Buff Kakori Kabab",
      "Bihari Boti Kabab", "Fish Malai Tikka", "Fish Achari Tikka",
      "Fish Garlic Tikka", "Atlantic Salmon", "Whole Pomfret", "Jumbo Prawns",
      "Chicken Shami Kabab", "Chicken Lollipop", "Classic Chicken Fry",
      "Crispy Fish Fry", "Fried Quail (Batair)"
    ],
    "🍛 Royal Mughlai & North Indian Gravies": [
      "Chicken Tasla", "Chicken Changezi", "Traditional Chicken Stew",
      "Rich Chicken Qorma", "Chicken Laziz Handi", "Chicken Kadhai",
      "Chicken Achari", "Chicken Jalfarezi", "Chicken Do Piyaza",
      "Chicken Adraki", "Chicken Kali Mirch", "Chicken Lababdar",
      "Chicken Patiala (Bone/Boneless)", "Chicken Lahori", "Chicken Kaju Qeema",
      "Chilli Chicken Gravy", "Butter Chicken (Bone/Boneless)", "Palak Chicken",
      "Brain Masala (Bheja)", "Tawa Bheja", "Royal Mutton Qorma", "Mutton Stew",
      "Kashmiri Mutton Stew", "Chaap Masala", "Mutton Butter Masala",
      "Mutton Do Piyaza", "White Mutton Qorma", "Aloo Gosht", "Peshawri Gosht",
      "Traditional Roghan Josh", "Shabdegh", "Royal Haleem",
      "Traditional Nihari (Live/Buffet)", "Badam Pasanda", "Hari Mirch Qeema",
      "Kaju Qeema", "Gurdey Qeema", "Fish Tasla", "Rich Fish Curry",
      "Fish Chilli Gravy", "Fish Achari"
    ],
    "🥘 Vegetarian Gourmet & Oriental Entrées": [
      "Slow-Cooked Dal Makhni", "Jaipuri Dal", "Homestyle Rajma",
      "Paneer Adraki", "Paneer Butter Masala", "Paneer Lababdar",
      "Paneer Do Piyaza", "Shahi Paneer", "Kadhai Paneer", "Mutter Paneer",
      "Melange of Mixed Vegetables", "Pineapple Paneer", "Puri Pindi Chole",
      "Rich Malai Kofta", "Seasonal Sarso Ka Saag", "Bhindi Masala",
      "Pindi Choley", "Paneer Badam Qorma", "Mutter Qorma", "Paneer Pasanda",
      "Khoya Paneer", "Paneer Kofta", "Palak Kofta", "Palak Paneer",
      "Chilli Paneer Gravy", "Veg Manchurian Gravy",
      "Exotic Vegetables in Hot Garlic Sauce", "Vegetables in Black Bean Sauce",
      "Vegetables in White Garlic Sauce", "Vegetables in Sweet & Sour Sauce",
      "Chilli Garlic Gravy", "Manchurian Gravy", "Hot Garlic Gravy",
      "Black Bean Gravy", "Oyster Sauce Entrée"
    ],
    "🍚 Rice, Dum Biryanis & Noodles": [
      "Chicken Dum Biryani", "Chicken Achari Biryani",
      "Chicken Royal Dry Fruit Biryani", "Chicken Aalu Bukhara Biryani",
      "Live Chicken Mandi", "Chicken Hyderabadi Biryani",
      "Chicken Muradabadi Pulao", "Chicken Kolkata Biryani",
      "Mutton Dum Biryani", "Mutton Masala Biryani", "Mutton Muradabadi Pulao",
      "Mutton Hyderabadi Biryani", "Buff Dum Biryani", "Buff Masala Biryani",
      "Buff Muradabadi Pulao", "Buff Kolkata Biryani", "Live Fish Biryani",
      "Prawn Biryani", "Vegetable Fried Rice", "Chilli Garlic Fried Rice",
      "Egg Fried Rice", "Szechuan Fried Rice", "Hakka Noodles",
      "Chilli Garlic Noodles", "Butter & Black Pepper Noodles", "Singapore Noodles"
    ],
    "🧆 Artisanal Chaat Stalls & Street Classics": [
      "Crispy Gol Gappe (Ata/Suji)", "Papri + Gujiya + Kalmi Vada Platter",
      "Classic Aloo Tikki", "Dry Fruit Stuffed Paneer Tikki", "Aloo Mutter Chaat",
      "Mumbai Pav Bhaji", "Paneer Chilla", "Cream Stuffed Chilla",
      "Mutter Patila + Kulcha", "Mutter Patila + Kachori", "Meerut Wale Aloo",
      "Maunth + Kachori", "Sprouted Maunth Chaat", "Street-Style Chowmein"
    ],
    "🫓 Handcrafted Breads & Specialty Rotis": [
      "Stuffed Kulcha", "Lal Roti", "Makka Roti / Missi Roti / Bajra Roti",
      "Ghee Chini Doodh Roti", "Layered Lachcha Parantha", "Besani Parantha",
      "Rawa Maida Parantha", "Rumali Roti", "Chapati Roti", "Live Tandoori Roti",
      "Besani Roti", "Lucknow Sheermal", "Bakarkhani Sheermal",
      "Seasonal Bathwa Parantha", "Folding Naan", "Plain Naan", "Butter Naan",
      "Stuffed Naans (Aloo/Gobhi/Paneer)", "Kandhari Roti", "Kandhari Biscuit Roti",
      "Taftaan"
    ],
    "🌯 Rolls & Wraps": [
      "Chicken Spring Roll Wraps", "Chicken Tikka Roll", "Chicken Kabab Roll",
      "Chicken Shawarma Rolls", "Mutton Tikka Roll", "Mutton Kabab Roll"
    ],
    "🥗 Garden Salads, Raitas & Condiments": [
      "Premium Fancy Salad", "Crisp Green Salad", "Mixed Achar & Murabba",
      "Sweet Murabba", "Mint Hari Chutney", "Tangy Lal Chutney",
      "Sweet Meethi Chutney", "Boondi Raita", "Pineapple Raita",
      "Mixed Fruit Raita", "Seasonal Bathwa Raita", "Pudina Raita",
      "Dahi Pakori", "Dahi Gujiya"
    ],
    "🍮 Confectionery, Halwas & Traditional Desserts": [
      "Plain Rabri Kheer", "Zafrani Kheer", "Pineapple Kheer", "Royal Raj Halwa",
      "Fresh Fruit Custard", "Paneer Jalebi", "Traditional Rasmalai",
      "Chhena Pie", "Chilled Mini Rasgulle",
      "Artisanal Kulfa (Rabri, Mango, Jamun, Shareefa, Anar)", "Tilla Kulfi",
      "Traditional Matka Kulfi", "Kulfi Faluda",
      "Premium Assorted Ice Creams (Amul, Mother Dairy, Vadilal)",
      "Slow-Cooked Moong Dal Halwa", "Seasonal Lal Gajar Halwa",
      "Seasonal Sunehri Gajar Halwa", "Pineapple Halwa", "Ghiye Ka Halwa",
      "Shahi Tukda", "Stuffed Gulab Jamun", "Malpuda with Rabri",
      "Rabri Jalebi", "Rich Badam Halwa"
    ]
  };

  const functionTypes = ['Marriage', 'Reception', 'Birthday', 'Corporate', 'Anniversary', 'Engagement', 'Other'];
  const gatheringTypes = ['Mix Gathering', 'Segregated (Ladies & Gents)'];
  const serviceTypes = ['Catering Only', 'Catering + Decoration', 'Full Event Organization'];

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    gathering_type: '',
    venue: '',
    city: '',
    location: '',
    pax: '',
    function_type: '',
    service_required: '',
    event_date: '',
    event_time: '',
    menu_selections: {}
  });

  const [preWeddingFunctions, setPreWeddingFunctions] = useState([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const categoryKeys = Object.keys(menuData);
    if (categoryKeys.length > 0) {
      setExpandedCategories({ [categoryKeys[0]]: true });
    }
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Location only appears for "Outside Delhi"
    if (name === 'city') {
      setShowLocation(value && value.toLowerCase() === 'outside delhi');
    }
  };

  // ============================================
  // KEYBOARD NAVIGATION - FULLY FIXED
  // ============================================
  const handleKeyDown = (e) => {
    const target = e.target;
    
    // For dropdown (select) - Enter moves to next field
    if (target.tagName === 'SELECT') {
      if (e.key === 'Enter') {
        e.preventDefault();
        const form = target.closest('form');
        if (form) {
          const inputs = form.querySelectorAll('input, select, textarea, button');
          const currentIndex = Array.from(inputs).indexOf(target);
          if (currentIndex > -1 && currentIndex < inputs.length - 1) {
            let nextIndex = currentIndex + 1;
            while (nextIndex < inputs.length && inputs[nextIndex].disabled) {
              nextIndex++;
            }
            if (nextIndex < inputs.length) {
              inputs[nextIndex].focus();
            }
          }
        }
        return;
      }
      return;
    }
    
    // For checkbox - move through all items in category, then next category, then submit
    if (target.type === 'checkbox') {
      if (e.key === 'Enter') {
        e.preventDefault();
        const form = target.closest('form');
        if (form) {
          const allCheckboxes = form.querySelectorAll('input[type="checkbox"]');
          const currentIndex = Array.from(allCheckboxes).indexOf(target);
          const currentCategory = target.closest('.menu-category-dark');

          // Step 1: Try next checkbox in the SAME category
          let nextCheckbox = null;
          for (let i = currentIndex + 1; i < allCheckboxes.length; i++) {
            const cat = allCheckboxes[i].closest('.menu-category-dark');
            if (cat === currentCategory) {
              nextCheckbox = allCheckboxes[i];
              break;
            }
            // Stop as soon as we hit a different category
            if (cat && cat !== currentCategory) break;
          }

          // Step 2: If no more in same category, find first in NEXT category
          if (!nextCheckbox) {
            for (let i = currentIndex + 1; i < allCheckboxes.length; i++) {
              const cat = allCheckboxes[i].closest('.menu-category-dark');
              if (cat && cat !== currentCategory) {
                nextCheckbox = allCheckboxes[i];
                break;
              }
            }
          }

          if (nextCheckbox) {
            // Expand the target category if collapsed
            const targetCategory = nextCheckbox.closest('.menu-category-dark');
            if (targetCategory) {
              const categoryHeader = targetCategory.querySelector('.category-title-dark span');
              if (categoryHeader) {
                const categoryName = categoryHeader.textContent || '';
                for (const key of Object.keys(menuData)) {
                  if (key.includes(categoryName) || categoryName.includes(key)) {
                    if (!expandedCategories[key]) {
                      toggleCategory(key);
                    }
                    break;
                  }
                }
              }
            }
            // Focus after a brief delay to let the category expand
            setTimeout(() => {
              nextCheckbox.scrollIntoView({ block: 'center', behavior: 'smooth' });
              nextCheckbox.focus();
            }, 150);
          } else {
            // No more checkboxes in any category - move to Submit
            const submitBtn = form.querySelector('.btn-submit-dark');
            if (submitBtn) {
              submitBtn.scrollIntoView({ block: 'center', behavior: 'smooth' });
              setTimeout(() => submitBtn.focus(), 300);
            }
          }
        }
      }
      return;
    }
    
    // For text inputs
    if (e.key === 'Enter') {
      // Required fields - don't move if empty
      if (target.hasAttribute('required') && target.value.trim() === '') {
        e.preventDefault();
        target.style.borderColor = '#ff6b6b';
        target.focus();
        return;
      }
      
      // Move to next field
      e.preventDefault();
      const form = target.closest('form');
      if (form) {
        const inputs = form.querySelectorAll('input, select, textarea, button');
        const currentIndex = Array.from(inputs).indexOf(target);
        if (currentIndex > -1 && currentIndex < inputs.length - 1) {
          let nextIndex = currentIndex + 1;
          while (nextIndex < inputs.length && inputs[nextIndex].disabled) {
            nextIndex++;
          }
          if (nextIndex < inputs.length) {
            inputs[nextIndex].focus();
          }
        }
      }
    }
  };

  const handleServiceChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, service_required: value });
    setShowAdditionalFields(value === 'Full Event Organization');
  };

  const handlePreWeddingChange = (index, field, value) => {
    const updated = [...preWeddingFunctions];
    updated[index][field] = value;
    setPreWeddingFunctions(updated);
  };

  const addPreWeddingFunction = () => {
    setPreWeddingFunctions([...preWeddingFunctions, { name: '', venue: '' }]);
  };

  const removePreWeddingFunction = (index) => {
    const updated = preWeddingFunctions.filter((_, i) => i !== index);
    setPreWeddingFunctions(updated);
  };

  // ============================================
  // MULTIPLE SELECTION - FIXED
  // ============================================
  const handleMenuChange = (category, item) => {
    setFormData(prev => {
      const currentSelections = prev.menu_selections[category] || [];
      const isSelected = currentSelections.includes(item);
      
      let newSelections;
      if (isSelected) {
        newSelections = currentSelections.filter(i => i !== item);
      } else {
        newSelections = [...currentSelections, item];
      }
      
      const updatedSelections = {
        ...prev.menu_selections,
        [category]: newSelections
      };
      
      if (newSelections.length === 0) {
        delete updatedSelections[category];
      }
      
      return {
        ...prev,
        menu_selections: updatedSelections
      };
    });
  };

  const getTotalItems = () => {
    let total = 0;
    for (const category in formData.menu_selections) {
      total += formData.menu_selections[category].length;
    }
    return total;
  };

  const getSelectedCount = (category) => {
    return formData.menu_selections[category]?.length || 0;
  };

  // Show confirmation popup instead of submitting directly
  const handleSubmit = (e) => {
    e.preventDefault();
    if (getTotalItems() === 0) {
      setError('Please select at least one menu item.');
      return;
    }
    setShowConfirm(true);
  };

  // Actually submit after confirmation
  const handleConfirmSubmit = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      pax: parseInt(formData.pax) || null,
      pre_wedding_functions: preWeddingFunctions,
      menu_selections: formData.menu_selections
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit menu.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  // Download PDF of selected menu
  const handleDownloadPDF = () => {
    const lines = [];
    lines.push('========================================');
    lines.push('     ZEBAISH CATERERS');
    lines.push('   A Unit of Allied Trading Corporation');
    lines.push('========================================');
    lines.push('');
    lines.push(`Customer: ${formData.customer_name || 'N/A'}`);
    lines.push(`Phone: ${formData.customer_phone || 'N/A'}`);
    lines.push(`Venue: ${formData.venue || 'N/A'}`);
    lines.push(`City: ${formData.city || 'N/A'}`);
    lines.push(`PAX: ${formData.pax || 'N/A'}`);
    lines.push(`Function: ${formData.function_type || 'N/A'}`);
    lines.push(`Date: ${formData.event_date || 'N/A'}`);
    lines.push(`Time: ${formData.event_time || 'N/A'}`);
    lines.push('');
    lines.push('----------------------------------------');
    lines.push('SELECTED MENU');
    lines.push('----------------------------------------');
    for (const category of Object.keys(formData.menu_selections)) {
      if (formData.menu_selections[category]?.length > 0) {
        lines.push('');
        lines.push(category);
        formData.menu_selections[category].forEach(item => {
          lines.push(`  • ${item}`);
        });
      }
    }
    lines.push('');
    lines.push('----------------------------------------');
    lines.push(`Total Items: ${getTotalItems()}`);
    lines.push(`Categories: ${Object.keys(formData.menu_selections).filter(k => formData.menu_selections[k]?.length > 0).length}`);
    lines.push('');
    lines.push('Generated by Zebaish Caterers - Menu Selection Tool');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Zebaish_Menu_${formData.customer_name || 'Customer'}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Send menu via WhatsApp
  const handleSendWhatsApp = () => {
    let msg = '🍽️ *ZEBAISH CATERERS*\n';
    msg += 'A Unit of Allied Trading Corporation\n\n';
    msg += `👤 *Customer:* ${formData.customer_name || 'N/A'}\n`;
    msg += `📞 *Phone:* ${formData.customer_phone || 'N/A'}\n`;
    msg += `📍 *Venue:* ${formData.venue || 'N/A'}\n`;
    msg += `🏙️ *City:* ${formData.city || 'N/A'}\n`;
    msg += `👥 *PAX:* ${formData.pax || 'N/A'}\n`;
    msg += `🎉 *Function:* ${formData.function_type || 'N/A'}\n`;
    msg += `📅 *Date:* ${formData.event_date || 'N/A'}\n`;
    msg += `⏰ *Time:* ${formData.event_time || 'N/A'}\n\n`;
    msg += '━━━━━━━━━━━━━━━━━━━━\n';
    msg += '*SELECTED MENU*\n';
    msg += '━━━━━━━━━━━━━━━━━━━━\n';
    for (const category of Object.keys(formData.menu_selections)) {
      if (formData.menu_selections[category]?.length > 0) {
        msg += `\n*${category}*\n`;
        formData.menu_selections[category].forEach(item => {
          msg += `• ${item}\n`;
        });
      }
    }
    msg += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Total Items: ${getTotalItems()}\n`;
    msg += `Categories: ${Object.keys(formData.menu_selections).filter(k => formData.menu_selections[k]?.length > 0).length}\n`;

    const rawPhone = formData.customer_phone ? formData.customer_phone.replace(/\D/g, '') : '';
    const phone = rawPhone ? (rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone) : '';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.location.href = url;
  };

  // Remove item from preview (edit mode)
  const handleRemoveItem = (category, item) => {
    setFormData(prev => {
      const currentSelections = prev.menu_selections[category] || [];
      const newSelections = currentSelections.filter(i => i !== item);
      const updatedSelections = { ...prev.menu_selections };
      if (newSelections.length === 0) {
        delete updatedSelections[category];
      } else {
        updatedSelections[category] = newSelections;
      }
      return { ...prev, menu_selections: updatedSelections };
    });
  };

  const getFilteredItems = (category, items) => {
    if (!searchTerm.trim()) return items;
    return items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Scroll to preview
  const scrollToPreview = () => {
    const previewEl = document.querySelector('.preview-section-dark');
    if (previewEl) {
      previewEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="menu-container-dark">
      <div className="menu-card-dark">
        <div className="menu-header-dark">
          <h1>🍽️ Zebaish Caterers</h1>
          <p className="menu-subtitle-dark">Customize Your Event Menu</p>
          <p className="menu-subtitle-small-dark">A unit of Allied Trading Corporation</p>
        </div>

        <div className="menu-body-dark">
          {success ? (
            <div className="success-message-dark">
              <p>✅ Menu submitted successfully!</p>
              <p className="success-detail-dark">Thank you! Our team will contact you shortly.</p>
              <div className="save-options-dark">
                <button type="button" className="save-option-btn-dark pdf-btn" onClick={handleDownloadPDF}>
                  📥 Download PDF
                </button>
                <button type="button" className="save-option-btn-dark whatsapp-btn" onClick={handleSendWhatsApp}>
                  📱 Send to WhatsApp
                </button>
              </div>
              <button type="button" className="btn-submit-dark" style={{ marginTop: '16px' }} onClick={() => {
                setSuccess(false);
                setFormData({ customer_name: '', customer_phone: '', gathering_type: '', venue: '', city: '', location: '', pax: '', function_type: '', service_required: '', event_date: '', event_time: '', menu_selections: {} });
                setPreWeddingFunctions([]);
                setShowAdditionalFields(false);
                setShowLocation(false);
                setError('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}>
                ➕ Submit Another Menu
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="menu-form-dark">
              <div className="form-section-dark">
                <h3>📋 Event Details</h3>
                <div className="form-row-dark">
                  <div className="form-group-dark">
                    <label>Full Name <span className="required">*</span></label>
                    <input 
                      type="text" 
                      name="customer_name" 
                      value={formData.customer_name} 
                      onChange={handleChange} 
                      onKeyDown={handleKeyDown}
                      onFocus={(e) => e.target.style.borderColor = ''}
                      placeholder="Enter your full name" 
                      required 
                    />
                  </div>
                  <div className="form-group-dark">
                    <label>Phone Number <span className="required">*</span></label>
                    <input 
                      type="tel" 
                      name="customer_phone" 
                      value={formData.customer_phone} 
                      onChange={handleChange} 
                      onKeyDown={handleKeyDown}
                      onFocus={(e) => e.target.style.borderColor = ''}
                      placeholder="9876543210" 
                      required 
                    />
                  </div>
                </div>

                <div className="form-row-dark">
                  <div className="form-group-dark">
                    <label>Gathering Type</label>
                    <select name="gathering_type" value={formData.gathering_type} onChange={handleChange} onKeyDown={handleKeyDown}>
                      <option value="">Select</option>
                      {gatheringTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div className="form-group-dark">
                    <label>Venue</label>
                    <input type="text" name="venue" value={formData.venue} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Venue name" />
                  </div>
                </div>

                <div className="form-row-dark">
                  <div className="form-group-dark">
                    <label>City/State</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Enter city/state name" />
                  </div>
                  <div className="form-group-dark">
                    <label>PAX (Guests)</label>
                    <input type="number" name="pax" value={formData.pax} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="100" min="1" />
                  </div>
                </div>

                {showLocation && (
                  <div className="form-row-dark">
                    <div className="form-group-dark full-width">
                      <label>📍 Google Maps Location</label>
                      <input type="text" name="location" value={formData.location} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Paste Google Maps link" />
                    </div>
                  </div>
                )}

                <div className="form-row-dark">
                  <div className="form-group-dark">
                    <label>Function Type</label>
                    <select name="function_type" value={formData.function_type} onChange={handleChange} onKeyDown={handleKeyDown}>
                      <option value="">Select</option>
                      {functionTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div className="form-group-dark">
                    <label>Service Required</label>
                    <select name="service_required" value={formData.service_required} onChange={handleServiceChange} onKeyDown={handleKeyDown}>
                      <option value="">Select</option>
                      {serviceTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row-dark">
                  <div className="form-group-dark">
                    <label>Event Date</label>
                    <input type="date" name="event_date" value={formData.event_date} onChange={handleChange} onKeyDown={handleKeyDown} />
                  </div>
                  <div className="form-group-dark">
                    <label>Event Time</label>
                    <input type="time" name="event_time" value={formData.event_time} onChange={handleChange} onKeyDown={handleKeyDown} />
                  </div>
                </div>

                {showAdditionalFields && (
                  <div className="additional-fields-dark">
                    <h4>🎉 Pre-Wedding Functions</h4>
                    {preWeddingFunctions.map((func, index) => (
                      <div key={index} className="pre-wedding-function-dark">
                        <input type="text" placeholder="Function name" value={func.name} onChange={(e) => handlePreWeddingChange(index, 'name', e.target.value)} onKeyDown={handleKeyDown} />
                        <input type="text" placeholder="Venue" value={func.venue} onChange={(e) => handlePreWeddingChange(index, 'venue', e.target.value)} onKeyDown={handleKeyDown} />
                        <button type="button" onClick={() => removePreWeddingFunction(index)} className="remove-btn-dark">✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={addPreWeddingFunction} className="add-btn-dark">+ Add Function</button>
                  </div>
                )}
              </div>

              <div className="form-section-dark">
                <div className="menu-header-section-dark">
                  <h3>🍽️ Select Your Menu</h3>
                  <div className="menu-stats-dark">
                    <span className="menu-stats-item-dark">📦 {getTotalItems()} selected</span>
                    <span className="menu-stats-item-dark">📂 {Object.keys(formData.menu_selections).filter(k => formData.menu_selections[k]?.length > 0).length} categories</span>
                    {getTotalItems() > 0 && (
                      <button 
                        type="button" 
                        className="preview-tab-btn"
                        onClick={() => setShowPreview(true)}
                      >
                        👁️ View Menu ({getTotalItems()})
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="search-container-dark">
                  <input type="text" className="search-input-dark" placeholder="🔍 Search menu items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown} />
                  {searchTerm && <button className="search-clear-dark" onClick={() => setSearchTerm('')}>✕</button>}
                </div>

                {Object.keys(menuData).map((category) => {
                  const items = menuData[category];
                  const filteredItems = getFilteredItems(category, items);
                  const selectedCount = getSelectedCount(category);
                  const isExpanded = expandedCategories[category] || false;

                  if (searchTerm && filteredItems.length === 0) return null;

                  return (
                    <div key={category} className={`menu-category-dark ${isExpanded ? 'expanded' : ''}`}>
                      <div className="menu-category-header-dark" onClick={() => toggleCategory(category)}>
                        <div className="category-title-dark">
                          <span className="category-arrow-dark">{isExpanded ? '▼' : '▶'}</span>
                          <span>{category}</span>
                          <span className="category-count-dark">({items.length})</span>
                        </div>
                        {selectedCount > 0 && <span className="selected-badge-dark">{selectedCount} selected</span>}
                      </div>
                      {isExpanded && (
                        <div className="menu-items-grid-dark">
                          {filteredItems.map((item) => {
                            const isChecked = formData.menu_selections[category]?.includes(item) || false;
                            return (
                              <label key={item} className={`menu-item-dark ${isChecked ? 'selected' : ''}`}>
                                <input 
                                  type="checkbox" 
                                  checked={isChecked}
                                  onChange={() => handleMenuChange(category, item)}
                                  onKeyDown={handleKeyDown}
                                />
                                <span className="menu-item-name-dark">{item}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {error && <div className="error-message-dark">{error}</div>}
              <button type="submit" className="btn-submit-dark" disabled={loading} onKeyDown={handleKeyDown}>
                {loading ? 'Submitting...' : '📩 Submit Menu'}
              </button>
            </form>
          )}
        </div>

        <div className="menu-footer-dark">
          <p>🔒 Your data is secure. We'll contact you within 24 hours.</p>
        </div>
      </div>

      {/* ============================================
          CONFIRMATION POPUP
          ============================================ */}
      {showConfirm && (
        <div className="modal-overlay-dark" onClick={() => setShowConfirm(false)}>
          <div className="modal-content-dark confirm-modal-dark" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-gold">
              <h2>🍽️ Confirm Menu Submission</h2>
              <p>Review your selections before submitting</p>
            </div>
            <div className="confirm-body-dark">
              <div className="confirm-info-row">
                <span className="confirm-label">Customer:</span>
                <span className="confirm-value">{formData.customer_name || 'N/A'}</span>
              </div>
              <div className="confirm-info-row">
                <span className="confirm-label">Phone:</span>
                <span className="confirm-value">{formData.customer_phone || 'N/A'}</span>
              </div>
              <div className="confirm-info-row">
                <span className="confirm-label">Venue:</span>
                <span className="confirm-value">{formData.venue || 'N/A'}</span>
              </div>
              <div className="confirm-info-row">
                <span className="confirm-label">PAX:</span>
                <span className="confirm-value">{formData.pax || 'N/A'}</span>
              </div>
              <div className="confirm-info-row">
                <span className="confirm-label">Function:</span>
                <span className="confirm-value">{formData.function_type || 'N/A'}</span>
              </div>
              <div className="confirm-info-row">
                <span className="confirm-label">Date:</span>
                <span className="confirm-value">{formData.event_date || 'N/A'}</span>
              </div>
              <div className="confirm-divider" />
              <div className="confirm-summary">
                <span className="confirm-total">{getTotalItems()} items</span>
                <span className="confirm-total">in {Object.keys(formData.menu_selections).filter(k => formData.menu_selections[k]?.length > 0).length} categories</span>
              </div>
              <div className="confirm-categories">
                {Object.keys(formData.menu_selections).map((category) => (
                  formData.menu_selections[category]?.length > 0 && (
                    <div key={category} className="confirm-cat-item">
                      <strong>{category.split(' ').slice(0, 2).join(' ')}...</strong>
                      <span>{formData.menu_selections[category].length} items</span>
                    </div>
                  )
                ))}
              </div>
            </div>
            <div className="modal-actions-dark">
              <button className="modal-btn-cancel-dark" onClick={() => setShowConfirm(false)}>✕ Cancel</button>
              <button className="modal-btn-confirm-dark" onClick={handleConfirmSubmit} disabled={loading}>
                {loading ? '⏳ Submitting...' : '✅ Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          PREVIEW MODAL - Gold Design + Edit Mode
          ============================================ */}
      {showPreview && (
        <div className="modal-overlay-dark" onClick={() => setShowPreview(false)}>
          <div className="modal-content-dark preview-modal-dark" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-gold">
              <h2>📋 Your Menu Selection</h2>
              <p>{getTotalItems()} items across {Object.keys(formData.menu_selections).filter(k => formData.menu_selections[k]?.length > 0).length} categories</p>
            </div>
            <div className="preview-modal-body">
              {Object.keys(formData.menu_selections).map((category) => (
                formData.menu_selections[category]?.length > 0 && (
                  <div key={category} className="preview-modal-category">
                    <div className="preview-modal-cat-header">
                      <span className="preview-modal-cat-name">{category}</span>
                      <span className="preview-modal-cat-count">{formData.menu_selections[category].length}</span>
                    </div>
                    <div className="preview-modal-items">
                      {formData.menu_selections[category].map((item) => (
                        <div key={item} className="preview-modal-item">
                          <span className="preview-modal-item-name">• {item}</span>
                          <button className="preview-modal-remove" onClick={() => handleRemoveItem(category, item)} title="Remove item">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
              {getTotalItems() === 0 && (
                <div className="preview-modal-empty">No items selected yet.</div>
              )}
            </div>
            <div className="modal-actions-dark">
              <button className="modal-btn-cancel-dark" onClick={() => setShowPreview(false)}>✕ Close</button>
              {getTotalItems() > 0 && (
                <button className="modal-btn-confirm-dark" onClick={() => { setShowPreview(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  ✏️ Edit Menu
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuSelection;
