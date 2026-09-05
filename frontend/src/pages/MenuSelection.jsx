import React, { useState, useCallback } from 'react';
import { MdEvent, MdRestaurantMenu, MdVisibility, MdAdd, MdRemove, MdClose, MdSearch, MdCheckCircle, MdBarChart } from 'react-icons/md';
import jsPDF from 'jspdf';
import './MenuSelection.css';

const generateMenuNumber = () => {
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const r = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return 'MENU-' + y + m + day + '-' + r;
};

const CATEGORIES = [
  { name: 'Welcome Drinks', icon: '\uD83C\uDF79', items: ['Virgin Mojito','Blue Lagoon','Tropical Fruit Punch','Shirley Temple','Mint Margarita','Fresh Lime Soda/Water','Shardai (Thandai)','Badam Milk','Chilled Chaas (Buttermilk)','Traditional Jaljeera','Fresh Tender Coconut Water','Fresh Filter Coffee','Royal Masala Chai','Organic Green Tea','Kashmiri Kahwa'] },
  { name: 'Soups', icon: '\uD83C\uDF72', items: ['Classic Chicken Clear Soup','Sweet Corn Chicken Soup','Cream of Chicken Veloute','Lemon Coriander Chicken Soup','Hot & Sour Chicken Soup','Chicken Manchow Soup','Creamy Tomato Basil Soup','Velvet Mushroom Soup','Sweet Corn Vegetable Soup','Lemon Coriander Vegetable Soup','Hot & Sour Veg Soup','Veg Manchow Soup','Almond (Badam) Velvet Soup'] },
  { name: 'Veg Starters', icon: '\uD83E\uDD57', items: ['Gourmet Veg Nuggets','Spiced Veg Kababs','Bombay Cutlet','Crispy Spring Rolls','Golden French Fries','Classic Aloo Tikki','Mini Veg Burger Shots','Crispy Cheese Balls','Honey Chilli Potatoes','Crispy Potato Fingers','Potato Cutlets','Stuffed Potato Rolls','Paneer Tilhani','Chilli Paneer Bites','Mini Veg Pizzas','Soya Chaap','Soya Lemon Chaap','Dahi ke Sholay','Honey Chilli Potato','Crispy Honey Lotus Stem','Tossed Crispy Corn','Veg Manchurian Dry','Crispy Salt & Pepper Vegetables','Vegetable Cigar Rolls','Chicken Momos (Steamed/Fried)','Veg Momos (Steamed/Fried)','Chicken & Cheese Momos (Steamed/Fried)','Corn & Cheese Momos (Steamed/Fried)','Pan-Fried Momos'] },
  { name: 'Non-Veg Starters', icon: '\uD83C\uDF57', items: ['Chicken Satay with Peanut Glaze','Crispy Chicken Nuggets','Golden Chicken Popcorn','Chicken Spring Rolls','Mini Chicken Burger Shots','Chicken Samosas','Chicken 65','Chicken Wontons','Chicken Cheese Balls','Fiery Chilli Chicken Dry','Chicken Manchurian Dry','Honey Glazed Chicken','Kung Pao Chicken Dry','Drums of Heaven','Chicken Shami Kabab','Chicken Lollipops','Chicken Wings','Crispy Chicken Thread','Chicken Cigar Rolls','Traditional Chicken Sajji','Crispy Fish Fingers','Lemon Butter Fish','Spicy Fish Chilli Dry','Fish in Mustard Veloute','Fish 65','Tandoori Prawns','Golden Fried Prawns','Spicy Prawns Chilli Dry','Fish Salt & Pepper','Dynamite Prawns','Fish Finger with Tartar Emulsion','Pan-Fried Mutton Chaap','Roasted Mutton Chaap','Mutton Shami Kabab','Mutton Tikka Boti','Mutton Boti Kabab','Traditional Mutton Kabab'] },
  { name: 'Tandoori & Grill', icon: '\uD83D\uDD25', items: ['Chicken Angara Tangri','Classic Tandoori Chicken','Chicken Achari Tangri','Chicken Afghani Tangri','Chicken Achari Tikka','Chicken Malai Tikka','Chicken Garlic Tikka','Chicken Ajwaini Tikka','Chicken Kali Mirch Tikka','Chicken Angara Tikka','Chicken Burra','Chicken Kashmiri Tikka','Chicken Haryali Tikka','Chicken Lemon Tikka','Roasted Quail (Batair)','Chicken Seekh Kabab','Chicken Galafi Kabab','Chicken Gulauti Kabab','Chicken Dora Kabab','Chicken Kakori Kabab','Chicken Reshmi Kabab','Chicken Chapli Kabab','Chicken Sambhali Kabab','Mutton Tikka','Mutton Barrah','Mutton Tikka Boti','Mutton Seekh Kabab','Mutton Chaap','Mutton Dora Kabab','Mutton Reshmi Kabab','Buff Dora Kabab','Buff Reshmi Kabab','Buff Sambhali Kabab','Buff Tikka','Buff Kakori Kabab','Bihari Boti Kabab','Fish Malai Tikka','Fish Achari Tikka','Fish Garlic Tikka','Atlantic Salmon','Whole Pomfret','Jumbo Prawns','Chicken Shami Kabab','Chicken Lollipop','Classic Chicken Fry','Crispy Fish Fry','Fried Quail (Batair)'] },
  { name: 'Mughlai & North Indian', icon: '\uD83C\uDF5B', items: ['Chicken Tasla','Chicken Changezi','Traditional Chicken Stew','Rich Chicken Qorma','Chicken Laziz Handi','Chicken Kadhai','Chicken Achari','Chicken Jalfarezi','Chicken Do Piyaza','Chicken Adraki','Chicken Kali Mirch','Chicken Lababdar','Chicken Patiala (Bone/Boneless)','Chicken Lahori','Chicken Kaju Qeema','Chilli Chicken Gravy','Butter Chicken (Bone/Boneless)','Palak Chicken','Brain Masala (Bheja)','Tawa Bheja','Royal Mutton Qorma','Mutton Stew','Kashmiri Mutton Stew','Chaap Masala','Mutton Butter Masala','Mutton Do Piyaza','White Mutton Qorma','Aloo Gosht','Peshawri Gosht','Traditional Roghan Josh','Shabdegh','Royal Haleem','Traditional Nihari (Live/Buffet)','Badam Pasanda','Hari Mirch Qeema','Kaju Qeema','Gurdey Qeema','Fish Tasla','Rich Fish Curry','Fish Chilli Gravy','Fish Achari'] },
  { name: 'Veg Main Course', icon: '\uD83E\uDD58', items: ['Slow-Cooked Dal Makhni','Jaipuri Dal','Homestyle Rajma','Paneer Adraki','Paneer Butter Masala','Paneer Lababdar','Paneer Do Piyaza','Shahi Paneer','Kadhai Paneer','Mutter Paneer','Melange of Mixed Vegetables','Pineapple Paneer','Puri Pindi Chole','Rich Malai Kofta','Seasonal Sarso Ka Saag','Bhindi Masala','Pindi Choley','Paneer Badam Qorma','Mutter Qorma','Paneer Pasanda','Khoya Paneer','Paneer Kofta','Palak Kofta','Palak Paneer','Chilli Paneer Gravy','Veg Manchurian Gravy','Exotic Vegetables in Hot Garlic Sauce','Vegetables in Black Bean Sauce','Vegetables in White Garlic Sauce','Vegetables in Sweet & Sour Sauce','Chilli Garlic Gravy','Manchurian Gravy','Hot Garlic Gravy','Black Bean Gravy','Oyster Sauce Entree'] },
  { name: 'Breads & Rotis', icon: '\uD83E\uDED3', items: ['Stuffed Kulcha','Lal Roti','Makka Roti / Missi Roti / Bajra Roti','Ghee Chini Doodh Roti','Layered Lachcha Parantha','Besani Parantha','Rawa Maida Parantha','Rumali Roti','Chapati Roti','Live Tandoori Roti','Besani Roti','Lucknow Sheermal','Bakarkhani Sheermal','Seasonal Bathwa Parantha','Folding Naan','Plain Naan','Butter Naan','Stuffed Naans (Aloo/Gobhi/Paneer)','Kandhari Roti','Kandhari Biscuit Roti','Taftaan'] },
  { name: 'Biryani & Rice', icon: '\uD83C\uDF5A', items: ['Chicken Dum Biryani','Chicken Achari Biryani','Chicken Royal Dry Fruit Biryani','Chicken Aalu Bukhara Biryani','Live Chicken Mandi','Chicken Hyderabadi Biryani','Chicken Muradabadi Pulao','Chicken Kolkata Biryani','Mutton Dum Biryani','Mutton Masala Biryani','Mutton Muradabadi Pulao','Mutton Hyderabadi Biryani','Buff Dum Biryani','Buff Masala Biryani','Buff Muradabadi Pulao','Buff Kolkata Biryani','Live Fish Biryani','Prawn Biryani','Vegetable Fried Rice','Chilli Garlic Fried Rice','Egg Fried Rice','Szechuan Fried Rice','Hakka Noodles','Chilli Garlic Noodles','Butter & Black Pepper Noodles','Singapore Noodles'] },
  { name: 'Chaat & Street Food', icon: '\uD83E\uDDC6', items: ['Crispy Gol Gappe (Ata/Suji)','Papri + Gujiya + Kalmi Vada Platter','Classic Aloo Tikki','Dry Fruit Stuffed Paneer Tikki','Aloo Mutter Chaat','Mumbai Pav Bhaji','Paneer Chilla','Cream Stuffed Chilla','Mutter Patila + Kulcha','Mutter Patila + Kachori','Meerut Wale Aloo','Maunth + Kachori','Sprouted Maunth Chaat','Street-Style Chowmein'] },
  { name: 'Rolls & Wraps', icon: '\uD83C\uDF2F', items: ['Chicken Spring Roll Wraps','Chicken Tikka Roll','Chicken Kabab Roll','Chicken Shawarma Rolls','Mutton Tikka Roll','Mutton Kabab Roll'] },
  { name: 'Salads & Raitas', icon: '\uD83E\uDD57', items: ['Premium Fancy Salad','Crisp Green Salad','Mixed Achar & Murabba','Sweet Murabba','Mint Hari Chutney','Tangy Lal Chutney','Sweet Meethi Chutney','Boondi Raita','Pineapple Raita','Mixed Fruit Raita','Seasonal Bathwa Raita','Pudina Raita','Dahi Pakori','Dahi Gujiya'] },
  { name: 'Cakes & Pastries', icon: '\uD83C\uDF70', items: ['Strawberry Cheesecake','Wild Blueberry Cheesecake','Mango Passion Fruit Cheesecake','Kiwi Cheesecake','Lemon Cheesecake','Baked New York Cheesecake','Assorted Fruit Tarts','Lemon Curd Tarts','Chocolate Ganache Tarts','Walnut Honey Tarts','Chocolate Walnut Tarts','Classic Apple Pie','Date Pie','Banoffee Pie','Italian Tiramisu','Classic Fruit Cream','Trifle Pudding','Warm Apple Crumble','Bread & Butter Pudding','Assorted Mousses','Whipped Souffles','Fruit Flane','Walnut Pie','Hot Chocolate Gateaux','Cream Caramel','Chocolate Truffle Cake','Almond Nougat Cake','Black Forest Gateaux','Fruit Gateaux','Pineapple Gateaux','Dark Cherry Chocolate Cake','Arabian Honey Cake','Chocolate Marble Cake','Lemon Pound Cake','Banana Walnut Cake','Chocolate Fudge Brownies','Chocolate Mud Cake','Classic Plum Cake','Grand Wedding Cake','Chocolate & Sugar Glazed Doughnuts','Artisan Muffins','Eclairs','Profitrolls'] },
  { name: 'Indian Sweets & Halwas', icon: '\uD83C\uDF6E', items: ['Plain Rabri Kheer','Zafrani Kheer','Pineapple Kheer','Royal Raj Halwa','Fresh Fruit Custard','Paneer Jalebi','Traditional Rasmalai','Chhena Pie','Chilled Mini Rasgulle','Artisanal Kulfa (Rabri, Mango, Jamun, Shareefa, Anar)','Tilla Kulfi','Traditional Matka Kulfi','Kulfi Faluda','Premium Assorted Ice Creams (Amul, Mother Dairy, Vadilal)','Slow-Cooked Moong Dal Halwa','Seasonal Lal Gajar Halwa','Seasonal Sunehri Gajar Halwa','Pineapple Halwa','Ghiye Ka Halwa','Shahi Tukda','Stuffed Gulab Jamun','Malpuda with Rabri','Rabri Jalebi','Rich Badam Halwa'] },
  { name: 'Continental Food', icon: '\uD83E\uDD5A', items: ['Classic Vegetable Quiche','Rich Vegetable Quiche','Caramelized Onion & Feta Quiche','Chicken Quiche','Elegant Asparagus Puffs','Vol-au-Vent Shells with Filling','Mini Gourmet Pizzas','Crisp Tart Shells','Cheese Straws','Savory Veg Patties','Savory Chicken Patties','Grilled Chicken Salad','Classic Russian Salad','Mexican Garden Salad','Pasta Pesto Salad','Fresh Seasonal Fruit Salad'] }
];


const numberToWords = (num) => {
  if (!num || num === 0) return 'Zero';
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  const convert = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? ' ' + ones[n%10] : '');
    if (n < 1000) return ones[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' and ' + convert(n%100) : '');
    if (n < 100000) return convert(Math.floor(n/1000)) + ' Thousand' + (n%1000 ? ' ' + convert(n%1000) : '');
    if (n < 10000000) return convert(Math.floor(n/100000)) + ' Lakh' + (n%100000 ? ' ' + convert(n%100000) : '');
    return convert(Math.floor(n/10000000)) + ' Crore' + (n%10000000 ? ' ' + convert(n%10000000) : '');
  };
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  let result = 'Rupees ' + convert(rupees);
  result += ' Only';
  if (paise > 0) result += ' and ' + convert(paise) + ' Paise';
  return result;
};

const MenuSelection = () => {
  const [activeTab, setActiveTab] = useState('event');
  const [eventData, setEventData] = useState({ fullName:'',gender:'',phone:'',gatheringType:'',venue:'',city:'',location:'',pax:'',functionType:'',serviceRequired:'',eventDate:'',eventTime:'' });
  const [selectedItems, setSelectedItems] = useState({});
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
    const [preWeddingFunctions, setPreWeddingFunctions] = useState([]);
  const [menuNumber] = useState(generateMenuNumber());
  const [newFunc, setNewFunc] = useState({ name:'', date:'', time:'', venue:'' });
  const [showEstimate, setShowEstimate] = useState(false);
  const [menuRates, setMenuRates] = useState({});
  const [menuUnits, setMenuUnits] = useState({});
  const [estimateType, setEstimateType] = useState('perPax');
  const [perPaxRate, setPerPaxRate] = useState('');
  const setMenuRate = (cat, item, val) => {
    const k = cat + '|' + item;
    setMenuRates(prev => ({...prev, [k]: val === '' ? '' : Number(val)}));
  };
  const getMenuRate = (cat, item) => {
    const k = cat + '|' + item;
    return menuRates[k] || 0;
  };
  const setMenuUnit = (cat, item, val) => {
    const k = cat + '|' + item;
    setMenuUnits(prev => ({...prev, [k]: val}));
  };
  const getMenuUnit = (cat, item) => {
    const k = cat + '|' + item;
    return menuUnits[k] || 'Pcs';
  };
  const [extraCharges, setExtraCharges] = useState([
    { id: 1, name: 'Cartaige', qty: 1, rate: 5000 },
    { id: 2, name: 'Desi Ghee/Zafran', qty: 1, rate: 8000 },
    { id: 3, name: 'Potato', qty: 50, rate: 40 },
    { id: 4, name: 'Nalli/Bheja', qty: 1, rate: 2000 },
    { id: 5, name: 'Water & Ice', qty: 1, rate: 7800 },
    { id: 6, name: 'Disposable', qty: 1, rate: 8960 },
    { id: 7, name: 'Labour', qty: 8, rate: 1500 },
    { id: 8, name: 'Waiters', qty: 14, rate: 1000 },
    { id: 9, name: 'Miscellaneous', qty: 1, rate: 7850 },
    { id: 10, name: 'Tips', qty: 1, rate: 5000 },
  ]);

  const addPreWeddingFunction = () => {
    if (!newFunc.name.trim()) return;
    setPreWeddingFunctions(prev => [...prev, { ...newFunc, id: Date.now() }]);
    setNewFunc({ name:'', date:'', time:'', venue:'' });
  };
  const removePreWeddingFunction = (id) => {
    setPreWeddingFunctions(prev => prev.filter(f => f.id !== id));
  };

  const handleEventKeyDown = (e, nextFieldId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextFieldId) {
        const nextField = document.getElementById(nextFieldId);
        if (nextField) nextField.focus();
      }
    }
  };

  const toggleItem = useCallback((cat, item) => {
    setSelectedItems(prev => {
      const c = prev[cat] || [];
      if (c.includes(item)) {
        const n = c.filter(i => i !== item);
        if (n.length === 0) { const p = {...prev}; delete p[cat]; return p; }
        return {...prev, [cat]: n};
      }
      return {...prev, [cat]: [...c, item]};
    });
  }, []);

  const updateQty = useCallback((cat, item, d) => {
    const k = cat + '|' + item;
    setQuantities(p => ({...p, [k]: Math.max(1, (p[k]||1) + d)}));
  }, []);

  const removeItem = useCallback((cat, item) => {
    toggleItem(cat, item);
    const k = cat + '|' + item;
    setQuantities(p => { const n = {...p}; delete n[k]; return n; });
  }, [toggleItem]);

  const filteredCategories = searchTerm ? CATEGORIES.filter(c => {
    const ls = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(ls) || c.items.some(i => i.toLowerCase().includes(ls));
  }) : CATEGORIES;

  const handleCheckboxKeyDown = useCallback((e, category, item, itemIndex, items) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      const categoryItems = items || [];
      if (itemIndex < categoryItems.length - 1) {
        const nextItem = categoryItems[itemIndex + 1];
        const nextLabel = document.querySelector('label[data-item="' + category + '|' + nextItem + '"]');
        if (nextLabel) { setTimeout(() => nextLabel.focus(), 50); return; }
      }
      const ci = CATEGORIES.findIndex(c => c.name === category);
      if (ci < CATEGORIES.length - 1) {
        const nc = CATEGORIES[ci + 1];
        setExpandedCategories(p => ({...p, [nc.name]: true}));
        setTimeout(() => {
          const firstLabel = document.querySelector('[data-category="' + nc.name + '"]');
          if (firstLabel) firstLabel.focus();
        }, 100);
      } else {
        setActiveTab('preview');
      }
    } else if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      e.stopPropagation();
      toggleItem(category, item);
    }
  }, [toggleItem]);

  const toggleCat = useCallback(cn => setExpandedCategories(p => ({...p, [cn]: !p[cn]})), []);
  const handleField = useCallback((f, v) => setEventData(p => ({...p, [f]: v})), []);
  const addExtraCharge = () => {
    const newId = extraCharges.length > 0 ? Math.max(...extraCharges.map(c => c.id)) + 1 : 1;
    setExtraCharges([...extraCharges, { id: newId, name: '', qty: 1, rate: 0 }]);
  };
  const removeExtraCharge = (id) => {
    setExtraCharges(extraCharges.filter(item => item.id !== id));
  };
  const updateExtraCharge = (id, field, value) => {
    setExtraCharges(extraCharges.map(item =>
      item.id === id ? { ...item, [field]: field === 'name' ? value : (value === '' ? 0 : Number(value)) } : item
    ));
  };
  const changeQty = (cat, item, delta) => {
    const k = cat + '|' + item;
    setQuantities(p => ({...p, [k]: Math.max(1, (p[k]||1) + delta)}));
  };
  const setItemQty = (cat, item, val) => {
    const k = cat + '|' + item;
    const n = parseInt(val, 10);
    setQuantities(p => ({...p, [k]: isNaN(n) || n < 0 ? 0 : n}));
  };
  const extraChargesSubtotal = extraCharges.reduce((s, c) => s + (Number(c.qty) || 0) * (Number(c.rate) || 0), 0);
  const menuTotal = Object.entries(selectedItems).reduce((sum, [cat, items]) => {
    return sum + items.reduce((s, it) => s + ((quantities[cat + '|' + it] || 1) * (menuRates[cat + '|' + it] || 0)), 0);
  }, 0);
  const grandTotal = menuTotal + extraChargesSubtotal;

  const [functionAssignments, setFunctionAssignments] = useState({});
  const hasFunctions = eventData.serviceRequired === 'Full Event Organization' && preWeddingFunctions.length > 0;
  const mainFuncName = 'Main Event (' + (eventData.functionType || 'Event') + ')';

  const assignFunction = (cat, item, funcName) => {
    const k = cat + '|' + item;
    setFunctionAssignments(prev => ({...prev, [k]: funcName}));
  };

  const getAssignedFunction = (cat, item) => {
    const k = cat + '|' + item;
    return functionAssignments[k] || mainFuncName;
  };

  // Build function-wise grouped items
  const buildFunctionGroups = () => {
    const groups = {};
    const allFunctions = [mainFuncName, ...preWeddingFunctions.map(f => f.name + ' (' + (f.date || 'TBD') + ')')];
    allFunctions.forEach(fn => { groups[fn] = { items: [], subtotal: 0 }; });
    Object.entries(selectedItems).forEach(([cat, items]) => {
      items.forEach(it => {
        const k = cat + '|' + it;
        const fn = functionAssignments[k] || mainFuncName;
        if (!groups[fn]) groups[fn] = { items: [], subtotal: 0 };
        const qty = quantities[k] || 1;
        groups[fn].items.push({ cat, item: it, key: k, qty });
      });
    });
    return groups;
  };

  const totalSelected = Object.values(selectedItems).reduce((s, c) => s + c.length, 0);

  const genPDF = useCallback(async () => {
    let html2canvas, jsPDF;
    try {
      const h2c = await import('html2canvas');
      html2canvas = h2c.default;
      const jsp = await import('jspdf');
      jsPDF = jsp.default;
    } catch(e) {
      alert('PDF libraries failed to load. Please refresh the page and try again.');
      return;
    }

    const fmtDate = (d) => {
      if (!d) return '-';
      try {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const parts = d.split('-');
        if (parts.length === 3) {
          const dt = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          return String(dt.getDate()).padStart(2,'0') + ' ' + months[dt.getMonth()] + ' ' + dt.getFullYear();
        }
        return d;
      } catch(e) { return d; }
    };
    const capitalize = (s) => s ? s.replace(/\b\w/g, c => c.toUpperCase()) : '-';
    const pName = capitalize(eventData.fullName || 'Customer');
    const gender = eventData.gender || 'Mr./Ms.';
    const pTitle = gender + ' ' + pName;
    const pVenue = capitalize(eventData.venue || '-');
    const pCity = capitalize(eventData.city || '-');
    const now = new Date();
    const preparedTime = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');

    // ═══ PAGE 1: COVER ═══════════════════════════════════════════
    const coverContainer = document.createElement('div');
    coverContainer.style.cssText = 'position:absolute;left:-9999px;top:0;width:700px;font-family:Georgia,serif;color:#000000;background:#ffffff;padding:20px 0;margin:0;';
    document.body.appendChild(coverContainer);

    coverContainer.innerHTML = ''
      + '<div style="min-height:900px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 40px;text-align:center;">'
      + '<div style="width:120px;height:4px;background:#1a237e;margin-bottom:40px;border-radius:2px;"></div>'
      + '<img src="Zehaish_Golden_Logo.svg" alt="Zebaish Caterers" style="height:100px;display:block;margin:0 auto 24px;" onerror="this.style.display=\'none\'" />'
      + '<p style="color:#555555;font-size:13px;margin:0 0 12px;letter-spacing:1px;">A Unit of Allied Trading Corporation</p>'
      + '<h1 style="color:#1a237e;font-size:26px;margin:0 0 8px;font-weight:700;letter-spacing:1px;">Customized Menu for ' + pTitle + '</h1>'
      + '<div style="width:200px;height:2px;background:#1a237e;margin:20px 0;"></div>'
      + '<table style="border-collapse:collapse;margin:0 auto;">'
      + '<tr><td style="padding:8px 20px;font-size:13px;color:#555555;text-align:right;border-bottom:1px solid #e0e0e0;">Unique ID</td><td style="padding:8px 20px;font-size:15px;color:#000000;text-align:left;font-weight:700;border-bottom:1px solid #e0e0e0;">' + menuNumber + '</td></tr>'
      + '<tr><td style="padding:8px 20px;font-size:13px;color:#555555;text-align:right;border-bottom:1px solid #e0e0e0;">Prepared Date</td><td style="padding:8px 20px;font-size:15px;color:#000000;text-align:left;font-weight:700;border-bottom:1px solid #e0e0e0;">' + fmtDate(eventData.eventDate || now.toISOString().split('T')[0]) + '</td></tr>'
      + '<tr><td style="padding:8px 20px;font-size:13px;color:#555555;text-align:right;border-bottom:1px solid #e0e0e0;">Prepared Time</td><td style="padding:8px 20px;font-size:15px;color:#000000;text-align:left;font-weight:700;border-bottom:1px solid #e0e0e0;">' + preparedTime + '</td></tr>'
      + '<tr><td style="padding:8px 20px;font-size:13px;color:#555555;text-align:right;">Phone</td><td style="padding:8px 20px;font-size:15px;color:#000000;text-align:left;font-weight:700;">' + (eventData.phone || '-') + '</td></tr>'
      + '</table>'
      + '<div style="width:120px;height:4px;background:#1a237e;margin-top:40px;border-radius:2px;"></div>'
      + '</div>';

    // ═══ PAGE 2: EVENT SUMMARY + MENU ════════════════════════════
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = 'position:absolute;left:-9999px;top:0;width:700px;font-family:Georgia,serif;color:#000000;background:#ffffff;padding:20px 0;margin:0;';
    document.body.appendChild(contentContainer);

    let menuHtml = '', idx = 0;
    Object.entries(selectedItems).forEach(([cn, items]) => {
      menuHtml += '<div style="margin-bottom:14px;page-break-inside:avoid;">';
      menuHtml += '<h3 style="color:#1a237e;font-size:12px;margin:0 0 6px;padding:5px 10px;background:#f0f0f5;border-left:3px solid #1a237e;border-radius:0 3px 3px 0;font-weight:700;">' + cn + '</h3>';
      items.forEach(it => {
        idx++;
        menuHtml += '<div style="margin:2px 0;font-size:11px;color:#000000;padding:3px 10px;background:' + (idx%2===0?LG:WB) + ';border-bottom:1px solid #e0e0e0;"><span style="color:#1a237e;font-weight:600;margin-right:6px;">' + idx + '.</span>' + it + '</div>';
      });
      menuHtml += '</div>';
    });
    const totalItems = Object.values(selectedItems).reduce((s, c) => s + c.length, 0);

    let preWedHtml = '';
    if (preWeddingFunctions.length > 0) {
      preWedHtml = '<h3 style="color:#1a237e;font-size:12px;margin:10px 0 6px;font-weight:700;">Pre-Wedding Functions</h3>';
      preWedHtml += '<table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:10px;">';
      preWedHtml += '<tr style="background:#f0f0f5;"><th style="padding:4px 8px;text-align:left;border:1px solid #e0e0e0;color:#1a237e;font-weight:700;">Function</th><th style="padding:4px 8px;text-align:left;border:1px solid #e0e0e0;color:#1a237e;font-weight:700;">Date</th><th style="padding:4px 8px;text-align:left;border:1px solid #e0e0e0;color:#1a237e;font-weight:700;">Time</th><th style="padding:4px 8px;text-align:left;border:1px solid #e0e0e0;color:#1a237e;font-weight:700;">Venue</th></tr>';
      preWeddingFunctions.forEach(f => {
        preWedHtml += '<tr><td style="padding:4px 8px;border:1px solid #e0e0e0;">' + f.name + '</td><td style="padding:4px 8px;border:1px solid #e0e0e0;">' + f.date + '</td><td style="padding:4px 8px;border:1px solid #e0e0e0;">' + f.time + '</td><td style="padding:4px 8px;border:1px solid #e0e0e0;">' + f.venue + '</td></tr>';
      });
      preWedHtml += '</table>';
    }

    contentContainer.innerHTML = ''
      // Event Summary
      + '<div style="padding:20px 30px 12px;">'
      + '<h3 style="color:#1a237e;font-size:14px;margin:0 0 8px;padding-bottom:4px;border-bottom:2px solid #1a237e;font-weight:700;">Event Summary</h3>'
      + '<table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #e0e0e0;">'
      + '<tr>'
      + '<td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;width:25%;"><b style="color:#1a237e;">Name</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;width:25%;color:#000000;">' + pTitle + '</td>'
      + '<td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;width:25%;"><b style="color:#1a237e;">Venue</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;width:25%;color:#000000;">' + pVenue + (eventData.location ? ', ' + capitalize(eventData.location) : '') + '</td>'
      + '</tr>'
      + '<tr>'
      + '<td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">PAX</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + (eventData.pax || '-') + '</td>'
      + '<td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Function</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + (eventData.functionType || '-') + '</td>'
      + '</tr>'
      + '<tr>'
      + '<td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Service</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + (eventData.serviceRequired || '-') + '</td>'
      + '<td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Gathering</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + (eventData.gatheringType || '-') + '</td>'
      + '</tr>'
      + '<tr>'
      + '<td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">City</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + pCity + '</td>'
      + '<td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Time</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + (eventData.eventTime || '-') + '</td>'
      + '</tr>'
      + '</table>'
      + preWedHtml
      + '</div>'

      // Selected Menu
      + '<div style="padding:0 30px 20px;">'
      + '<h3 style="color:#1a237e;font-size:14px;margin:0 0 8px;padding-bottom:4px;border-bottom:2px solid #1a237e;font-weight:700;">Selected Menu (' + totalItems + ' items)</h3>'
      + menuHtml
      + '</div>';

    try {
      const coverCanvas = await html2canvas(coverContainer, { scale: 2, useCORS: true, logging: false });
      const contentCanvas = await html2canvas(contentContainer, { scale: 2, useCORS: true, logging: false });

      const doc = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;

      // Page 1: Cover
      const coverImg = coverCanvas.toDataURL('image/jpeg', 0.95);
      const coverImgHeight = (coverCanvas.height * imgWidth) / coverCanvas.width;
      doc.addImage(coverImg, 'JPEG', 0, 0, imgWidth, coverImgHeight);

      // Page 2: Content (Event + Menu)
      doc.addPage();
      const contentImg = contentCanvas.toDataURL('image/jpeg', 0.95);
      const contentImgHeight = (contentCanvas.height * imgWidth) / contentCanvas.width;
      let heightLeft = contentImgHeight;
      let position = 0;
      doc.addImage(contentImg, 'JPEG', 0, position, imgWidth, contentImgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = -(contentImgHeight - heightLeft);
        doc.addPage();
        doc.addImage(contentImg, 'JPEG', 0, position, imgWidth, contentImgHeight);
        heightLeft -= pageHeight;
      }

      const cn = pName.replace(/[^a-zA-Z0-9]/g, '_');
      const cv = (eventData.venue || 'Venue').replace(/[^a-zA-Z0-9]/g, '_');
      const cd = eventData.eventDate || new Date().toISOString().split('T')[0];
      doc.save(cn + '_' + cv + '_' + cd + '.pdf');
    } catch(e) {
      alert('Error generating PDF: ' + e.message);
    }

    document.body.removeChild(coverContainer);
    document.body.removeChild(contentContainer);
  }, [selectedItems, quantities, eventData, preWeddingFunctions, menuNumber]);

  const handleSubmit = async () => {
    if (totalSelected === 0) { alert('Please select at least one menu item.'); return; }
    setSubmitting(true);
    try {
      await fetch('https://atc-geca.onrender.com/api/create-menu-submission/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menu_number: menuNumber, customer_name: eventData.fullName, phone: eventData.phone, gathering_type: eventData.gatheringType, venue: eventData.venue, city: eventData.city, location: eventData.location, pax: eventData.pax, function_type: eventData.functionType, service_required: eventData.serviceRequired, event_date: eventData.eventDate, event_time: eventData.eventTime, pre_wedding_functions: preWeddingFunctions, menu_items: Object.entries(selectedItems).map(([c, its]) => ({ category: c, items: its.map(i => ({ name: i, quantity: quantities[c + '|' + i] || 1 })) })) })
      });
    } catch(e) { /* API unavailable */ }
    try {
      await genPDF();
    } catch(e) {
      alert('PDF generation failed: ' + e.message);
    }
    setSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const nextField = (currentId, locationVisible) => {
    const order = ['ms-gender','ms-fullName','ms-phone','ms-city'];
    if (locationVisible) order.push('ms-location');
    order.push('ms-serviceRequired','ms-gatheringType','ms-pax','ms-eventDate','ms-venue','ms-functionType','ms-eventTime');
    const idx = order.indexOf(currentId);
    return idx < order.length - 1 ? order[idx + 1] : null;
  };

  const isLocationVisible = eventData.city && !eventData.city.toLowerCase().includes('delhi');

  const generateCustomerCopy = async () => {
    let html2canvas, jsPDF;
    try {
      const h2c = await import('html2canvas');
      html2canvas = h2c.default;
      const jsp = await import('jspdf');
      jsPDF = jsp.default;
    } catch(e) { alert('PDF libraries failed to load.'); return; }

    const fmtDate = (d) => {
      if (!d) return '-';
      try {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const parts = d.split('-');
        if (parts.length === 3) {
          const dt = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          return String(dt.getDate()).padStart(2,'0') + ' ' + months[dt.getMonth()] + ' ' + dt.getFullYear();
        }
        return d;
      } catch(e) { return d; }
    };
    const capitalize = (s) => s ? s.replace(/\b\w/g, c => c.toUpperCase()) : '-';
    const pName = capitalize(eventData.fullName || 'Customer');
    const gender = eventData.gender || 'Mr./Ms.';
    const pTitle = gender + ' ' + pName;
    const pVenue = capitalize(eventData.venue || '-');
    const pCity = capitalize(eventData.city || '-');
    const pax = eventData.pax || 0;
    const now = new Date();
    const preparedTime = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');

    let note = '';
    if (estimateType === 'perPax') {
      const rate = Number(perPaxRate) || 0;
      const extraRate = rate + 200;
      note = 'This estimate is based on ' + pax + ' guests at a per-plate rate of \u20B9' + rate.toLocaleString('en-IN') + '. Any increase in the final guest count will be charged at \u20B9' + extraRate.toLocaleString('en-IN') + ' per additional guest. Please confirm the final number of guests at least 48 hours prior to the event.';
    } else {
      note = 'This estimate is a fixed lumpsum amount of \u20B9' + grandTotal.toLocaleString('en-IN') + ' for ' + pax + ' guests. Kindly notify us of any change in the guest count at least 48 hours prior to the event, so we can adjust the quantities and pricing accordingly.';
    }

    // ═══ PAGE 1: COVER ═══════════════════════════════════════════
    const coverContainer = document.createElement('div');
    coverContainer.style.cssText = 'position:absolute;left:-9999px;top:0;width:700px;font-family:Georgia,serif;color:#000000;background:#ffffff;padding:20px 0;margin:0;';
    document.body.appendChild(coverContainer);

    coverContainer.innerHTML = ''
      + '<div style="min-height:900px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 40px;text-align:center;">'
      + '<div style="width:120px;height:4px;background:#1a237e;margin-bottom:40px;border-radius:2px;"></div>'
      + '<img src="Zehaish_Golden_Logo.svg" alt="Zebaish Caterers" style="height:100px;display:block;margin:0 auto 24px;" />'
      + '<p style="color:#555555;font-size:13px;margin:0 0 12px;letter-spacing:1px;">A Unit of Allied Trading Corporation</p>'
      + '<h1 style="color:#1a237e;font-size:26px;margin:0 0 8px;font-weight:700;letter-spacing:1px;">Customized Menu for ' + pTitle + '</h1>'
      + '<div style="width:200px;height:2px;background:#1a237e;margin:20px 0;"></div>'
      + '<table style="border-collapse:collapse;margin:0 auto;">'
      + '<tr><td style="padding:8px 20px;font-size:13px;color:#555555;text-align:right;border-bottom:1px solid #e0e0e0;">Unique ID</td><td style="padding:8px 20px;font-size:15px;color:#000000;text-align:left;font-weight:700;border-bottom:1px solid #e0e0e0;">' + menuNumber + '</td></tr>'
      + '<tr><td style="padding:8px 20px;font-size:13px;color:#555555;text-align:right;border-bottom:1px solid #e0e0e0;">Prepared Date</td><td style="padding:8px 20px;font-size:15px;color:#000000;text-align:left;font-weight:700;border-bottom:1px solid #e0e0e0;">' + fmtDate(eventData.eventDate || now.toISOString().split('T')[0]) + '</td></tr>'
      + '<tr><td style="padding:8px 20px;font-size:13px;color:#555555;text-align:right;border-bottom:1px solid #e0e0e0;">Prepared Time</td><td style="padding:8px 20px;font-size:15px;color:#000000;text-align:left;font-weight:700;border-bottom:1px solid #e0e0e0;">' + preparedTime + '</td></tr>'
      + '<tr><td style="padding:8px 20px;font-size:13px;color:#555555;text-align:right;">Phone</td><td style="padding:8px 20px;font-size:15px;color:#000000;text-align:left;font-weight:700;">' + (eventData.phone || '-') + '</td></tr>'
      + '</table>'
      + '<div style="width:120px;height:4px;background:#1a237e;margin-top:40px;border-radius:2px;"></div>'
      + '</div>';

    // ═══ PAGE 2: EVENT SUMMARY + MENU ════════════════════════════
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = 'position:absolute;left:-9999px;top:0;width:700px;font-family:Georgia,serif;color:#000000;background:#ffffff;padding:20px 0;margin:0;';
    document.body.appendChild(contentContainer);

    let menuHtml = '', idx = 0;
    Object.entries(selectedItems).forEach(([cn, items]) => {
      menuHtml += '<div style="margin-bottom:14px;page-break-inside:avoid;">';
      menuHtml += '<h3 style="color:#1a237e;font-size:12px;margin:0 0 6px;padding:5px 10px;background:#f0f0f5;border-left:3px solid #1a237e;border-radius:0 3px 3px 0;font-weight:700;">' + cn + '</h3>';
      items.forEach(it => {
        idx++;
        menuHtml += '<div style="margin:2px 0;font-size:11px;color:#000000;padding:3px 10px;background:' + (idx%2===0?LG:WB) + ';border-bottom:1px solid #e0e0e0;"><span style="color:#1a237e;font-weight:600;margin-right:6px;">' + idx + '.</span>' + it + '</div>';
      });
      menuHtml += '</div>';
    });
    const totalItems = Object.values(selectedItems).reduce((s, c) => s + c.length, 0);

    let preWedHtml = '';
    if (preWeddingFunctions.length > 0) {
      preWedHtml = '<h3 style="color:#1a237e;font-size:12px;margin:10px 0 6px;font-weight:700;">Pre-Wedding Functions</h3>';
      preWedHtml += '<table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:10px;">';
      preWedHtml += '<tr style="background:#f0f0f5;"><th style="padding:4px 8px;text-align:left;border:1px solid #e0e0e0;color:#1a237e;font-weight:700;">Function</th><th style="padding:4px 8px;text-align:left;border:1px solid #e0e0e0;color:#1a237e;font-weight:700;">Date</th><th style="padding:4px 8px;text-align:left;border:1px solid #e0e0e0;color:#1a237e;font-weight:700;">Time</th><th style="padding:4px 8px;text-align:left;border:1px solid #e0e0e0;color:#1a237e;font-weight:700;">Venue</th></tr>';
      preWeddingFunctions.forEach(f => {
        preWedHtml += '<tr><td style="padding:4px 8px;border:1px solid #e0e0e0;color:#000000;">' + f.name + '</td><td style="padding:4px 8px;border:1px solid #e0e0e0;color:#000000;">' + f.date + '</td><td style="padding:4px 8px;border:1px solid #e0e0e0;color:#000000;">' + f.time + '</td><td style="padding:4px 8px;border:1px solid #e0e0e0;color:#000000;">' + f.venue + '</td></tr>';
      });
      preWedHtml += '</table>';
    }

    const amountInWords = numberToWords(grandTotal);

    contentContainer.innerHTML = ''
      // Event Summary
      + '<div style="padding:20px 30px 12px;">'
      + '<h3 style="color:#1a237e;font-size:14px;margin:0 0 8px;padding-bottom:4px;border-bottom:2px solid #1a237e;font-weight:700;">Event Summary</h3>'
      + '<table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #e0e0e0;">'
      + '<tr>'
      + '<td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;width:25%;"><b style="color:#1a237e;">Name</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;width:25%;color:#000000;">' + pTitle + '</td>'
      + '<td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;width:25%;"><b style="color:#1a237e;">Venue</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;width:25%;color:#000000;">' + pVenue + (eventData.location ? ', ' + capitalize(eventData.location) : '') + '</td>'
      + '</tr>'
      + '<tr>'
      + '<td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">PAX</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + (eventData.pax || '-') + '</td>'
      + '<td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Function</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + (eventData.functionType || '-') + '</td>'
      + '</tr>'
      + '<tr>'
      + '<td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Service</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + (eventData.serviceRequired || '-') + '</td>'
      + '<td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Gathering</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + (eventData.gatheringType || '-') + '</td>'
      + '</tr>'
      + '<tr>'
      + '<td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">City</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + pCity + '</td>'
      + '<td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Time</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + (eventData.eventTime || '-') + '</td>'
      + '</tr>'
      + '</table>'
      + preWedHtml
      + '</div>'

      // Selected Menu
      + '<div style="padding:0 30px 16px;">'
      + '<h3 style="color:#1a237e;font-size:14px;margin:0 0 8px;padding-bottom:4px;border-bottom:2px solid #1a237e;font-weight:700;">Selected Menu (' + totalItems + ' items)</h3>'
      + menuHtml
      + '</div>'

      // Total Amount
      + '<div style="padding:12px 30px;text-align:center;border-top:2px solid #1a237e;margin-top:10px;">'
      + '<p style="font-size:11px;color:#555555;margin:0 0 4px;font-weight:600;letter-spacing:1px;">TOTAL AMOUNT</p>'
      + '<p style="font-size:22px;color:#1a237e;margin:0;font-weight:700;">\u20B9' + grandTotal.toLocaleString('en-IN') + '</p>'
      + '</div>'

      // Amount in Words
      + '<div style="padding:6px 30px 12px;text-align:center;">'
      + '<p style="font-size:11px;color:#555555;margin:0;font-style:italic;">(' + amountInWords + ')</p>'
      + '</div>'

      // Estimate Note
      + '<div style="padding:0 30px 14px;">'
      + '<div style="background:#f0f0f5;border:1px solid #e0e0e0;border-radius:6px;padding:12px 16px;">'
      + '<p style="font-size:10px;color:#555555;margin:0;line-height:1.6;">' + note + '</p>'
      + '</div></div>'

      // Payment Terms
      + '<div style="padding:0 30px 12px;margin-top:8px;">'
      + '<div style="background:#f0f0f5;padding:12px 16px;border:1px solid #e0e0e0;text-align:center;">'
      + '<b style="color:#1a237e;font-size:12px;">PAYMENT TERMS</b><br/>'
      + '<span style="color:#000000;font-size:11px;">30% at Booking \u00b7 30% one week before \u00b7 40% day before the function \u00b7 GST 18% Extra</span>'
      + '</div></div>'

      // Quote
      + '<div style="text-align:center;margin-top:20px;padding:12px 30px;">'
      + '<p style="font-size:12px;font-weight:600;color:#000000;margin:0;font-style:italic;white-space:nowrap;">\"We would love to make your cherishable memories, memorable for you and your loved Ones\"</p>'
      + '</div>'

      // Footer
      + '<div style="text-align:center;padding:8px 30px;border-top:1px solid #e0e0e0;margin-top:12px;">'
      + '<p style="font-size:9px;color:#555555;margin:0;">Zebaish Caterers | A Unit of Allied Trading Corporation</p>'
      + '</div>';

    try {
      const coverCanvas = await html2canvas(coverContainer, { scale: 2, useCORS: true, logging: false });
      const contentCanvas = await html2canvas(contentContainer, { scale: 2, useCORS: true, logging: false });

      const doc = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;

      const coverImg = coverCanvas.toDataURL('image/jpeg', 0.95);
      const coverImgHeight = (coverCanvas.height * imgWidth) / coverCanvas.width;
      doc.addImage(coverImg, 'JPEG', 0, 0, imgWidth, coverImgHeight);

      doc.addPage();
      const contentImg = contentCanvas.toDataURL('image/jpeg', 0.95);
      const contentImgHeight = (contentCanvas.height * imgWidth) / contentCanvas.width;
      let heightLeft = contentImgHeight;
      let position = 0;
      doc.addImage(contentImg, 'JPEG', 0, position, imgWidth, contentImgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = -(contentImgHeight - heightLeft);
        doc.addPage();
        doc.addImage(contentImg, 'JPEG', 0, position, imgWidth, contentImgHeight);
        heightLeft -= pageHeight;
      }

      const cn = pName.replace(/[^a-zA-Z0-9]/g, '_');
      const cv = (eventData.venue || 'Venue').replace(/[^a-zA-Z0-9]/g, '_');
      const cd = eventData.eventDate || new Date().toISOString().split('T')[0];
      doc.save('CustomerCopy_' + cn + '_' + cv + '_' + cd + '.pdf');
    } catch(e) {
      alert('Error generating PDF: ' + e.message);
    }
    document.body.removeChild(coverContainer);
    document.body.removeChild(contentContainer);
  };

  const generateFinalPDF = async () => {
    let html2canvas, jsPDF;
    try {
      const h2c = await import('html2canvas');
      html2canvas = h2c.default;
      const jsp = await import('jspdf');
      jsPDF = jsp.default;
    } catch(e) { alert('PDF libraries failed to load.'); return; }

    const fmtDate = (d) => {
      if (!d) return '-';
      try {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const parts = d.split('-');
        if (parts.length === 3) {
          const dt = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          return String(dt.getDate()).padStart(2,'0') + ' ' + months[dt.getMonth()] + ' ' + dt.getFullYear();
        }
        return d;
      } catch(e) { return d; }
    };
    const capitalize = (s) => s ? s.replace(/\b\w/g, c => c.toUpperCase()) : '-';
    const pName = capitalize(eventData.fullName || 'Customer');
    const gender = eventData.gender || 'Mr./Ms.';
    const pTitle = gender + ' ' + pName;
    const pVenue = capitalize(eventData.venue || '-');
    const pCity = capitalize(eventData.city || '-');
    const pax = eventData.pax || 0;
    const now = new Date();
    const preparedTime = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');

    let note = '';
    if (estimateType === 'perPax') {
      const rate = Number(perPaxRate) || 0;
      const extraRate = rate + 200;
      note = 'This estimate is based on ' + pax + ' guests at a per-plate rate of \u20B9' + rate.toLocaleString('en-IN') + '. Any increase in the final guest count will be charged at \u20B9' + extraRate.toLocaleString('en-IN') + ' per additional guest. Please confirm the final number of guests at least 48 hours prior to the event.';
    } else {
      note = 'This estimate is a fixed lumpsum amount of \u20B9' + grandTotal.toLocaleString('en-IN') + ' for ' + pax + ' guests. Kindly notify us of any change in the guest count at least 48 hours prior to the event, so we can adjust the quantities and pricing accordingly.';
    }
    const amountInWords = numberToWords(grandTotal);

    // ═══ PAGE 1: COVER ═══════════════════════════════════════════
    const coverContainer = document.createElement('div');
    coverContainer.style.cssText = 'position:absolute;left:-9999px;top:0;width:700px;font-family:Georgia,serif;color:#000000;background:#ffffff;padding:20px 0;margin:0;';
    document.body.appendChild(coverContainer);
    coverContainer.innerHTML = ''
      + '<div style="min-height:900px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 40px;text-align:center;">'
      + '<div style="width:120px;height:4px;background:#1a237e;margin-bottom:40px;border-radius:2px;"></div>'
      + '<img src="Zehaish_Golden_Logo.svg" alt="Zebaish Caterers" style="height:100px;display:block;margin:0 auto 24px;" />'
      + '<p style="color:#555555;font-size:13px;margin:0 0 12px;letter-spacing:1px;">A Unit of Allied Trading Corporation</p>'
      + '<h1 style="color:#1a237e;font-size:26px;margin:0 0 8px;font-weight:700;letter-spacing:1px;">Customized Menu for ' + pTitle + '</h1>'
      + '<div style="width:200px;height:2px;background:#1a237e;margin:20px 0;"></div>'
      + '<table style="border-collapse:collapse;margin:0 auto;">'
      + '<tr><td style="padding:8px 20px;font-size:13px;color:#555555;text-align:right;border-bottom:1px solid #e0e0e0;">Unique ID</td><td style="padding:8px 20px;font-size:15px;color:#000000;text-align:left;font-weight:700;border-bottom:1px solid #e0e0e0;">' + menuNumber + '</td></tr>'
      + '<tr><td style="padding:8px 20px;font-size:13px;color:#555555;text-align:right;border-bottom:1px solid #e0e0e0;">Prepared Date</td><td style="padding:8px 20px;font-size:15px;color:#000000;text-align:left;font-weight:700;border-bottom:1px solid #e0e0e0;">' + fmtDate(eventData.eventDate || now.toISOString().split('T')[0]) + '</td></tr>'
      + '<tr><td style="padding:8px 20px;font-size:13px;color:#555555;text-align:right;border-bottom:1px solid #e0e0e0;">Prepared Time</td><td style="padding:8px 20px;font-size:15px;color:#000000;text-align:left;font-weight:700;border-bottom:1px solid #e0e0e0;">' + preparedTime + '</td></tr>'
      + '<tr><td style="padding:8px 20px;font-size:13px;color:#555555;text-align:right;">Phone</td><td style="padding:8px 20px;font-size:15px;color:#000000;text-align:left;font-weight:700;">' + (eventData.phone || '-') + '</td></tr>'
      + '</table>'
      + '<div style="width:120px;height:4px;background:#1a237e;margin-top:40px;border-radius:2px;"></div>'
      + '</div>';

    // ═══ PAGE 2: EVENT SUMMARY + MENU ════════════════════════════
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = 'position:absolute;left:-9999px;top:0;width:700px;font-family:Georgia,serif;color:#000000;background:#ffffff;padding:20px 0;margin:0;';
    document.body.appendChild(contentContainer);

    let menuHtml = '', idx = 0;
    Object.entries(selectedItems).forEach(([cn, items]) => {
      menuHtml += '<div style="margin-bottom:14px;page-break-inside:avoid;">';
      menuHtml += '<h3 style="color:#1a237e;font-size:12px;margin:0 0 6px;padding:5px 10px;background:#f0f0f5;border-left:3px solid #1a237e;border-radius:0 3px 3px 0;font-weight:700;">' + cn + '</h3>';
      items.forEach(it => {
        idx++;
        menuHtml += '<div style="margin:2px 0;font-size:11px;color:#000000;padding:3px 10px;background:' + (idx%2===0?LG:WB) + ';border-bottom:1px solid #e0e0e0;"><span style="color:#1a237e;font-weight:600;margin-right:6px;">' + idx + '.</span>' + it + '</div>';
      });
      menuHtml += '</div>';
    });
    const totalItems = Object.values(selectedItems).reduce((s, c) => s + c.length, 0);

    let preWedHtml = '';
    if (preWeddingFunctions.length > 0) {
      preWedHtml = '<h3 style="color:#1a237e;font-size:12px;margin:10px 0 6px;font-weight:700;">Pre-Wedding Functions</h3>';
      preWedHtml += '<table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:10px;">';
      preWedHtml += '<tr style="background:#f0f0f5;"><th style="padding:4px 8px;text-align:left;border:1px solid #e0e0e0;color:#1a237e;font-weight:700;">Function</th><th style="padding:4px 8px;text-align:left;border:1px solid #e0e0e0;color:#1a237e;font-weight:700;">Date</th><th style="padding:4px 8px;text-align:left;border:1px solid #e0e0e0;color:#1a237e;font-weight:700;">Time</th><th style="padding:4px 8px;text-align:left;border:1px solid #e0e0e0;color:#1a237e;font-weight:700;">Venue</th></tr>';
      preWeddingFunctions.forEach(f => {
        preWedHtml += '<tr><td style="padding:4px 8px;border:1px solid #e0e0e0;color:#000000;">' + f.name + '</td><td style="padding:4px 8px;border:1px solid #e0e0e0;color:#000000;">' + f.date + '</td><td style="padding:4px 8px;border:1px solid #e0e0e0;color:#000000;">' + f.time + '</td><td style="padding:4px 8px;border:1px solid #e0e0e0;color:#000000;">' + f.venue + '</td></tr>';
      });
      preWedHtml += '</table>';
    }

    contentContainer.innerHTML = ''
      + '<div style="padding:20px 30px 12px;">'
      + '<h3 style="color:#1a237e;font-size:14px;margin:0 0 8px;padding-bottom:4px;border-bottom:2px solid #1a237e;font-weight:700;">Event Summary</h3>'
      + '<table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #e0e0e0;">'
      + '<tr><td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;width:25%;"><b style="color:#1a237e;">Name</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;width:25%;color:#000000;">' + pTitle + '</td><td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;width:25%;"><b style="color:#1a237e;">Venue</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;width:25%;color:#000000;">' + pVenue + (eventData.location ? ', ' + capitalize(eventData.location) : '') + '</td></tr>'
      + '<tr><td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">PAX</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + (eventData.pax || '-') + '</td><td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Function</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + (eventData.functionType || '-') + '</td></tr>'
      + '<tr><td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Service</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + (eventData.serviceRequired || '-') + '</td><td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Gathering</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + (eventData.gatheringType || '-') + '</td></tr>'
      + '<tr><td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">City</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + pCity + '</td><td style="padding:5px 8px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Time</b></td><td style="padding:5px 8px;border:1px solid #e0e0e0;color:#000000;">' + (eventData.eventTime || '-') + '</td></tr>'
      + '</table>'
      + preWedHtml
      + '</div>'
      + '<div style="padding:0 30px 20px;">'
      + '<h3 style="color:#1a237e;font-size:14px;margin:0 0 8px;padding-bottom:4px;border-bottom:2px solid #1a237e;font-weight:700;">Selected Menu (' + totalItems + ' items)</h3>'
      + menuHtml
      + '</div>';

    // ═══ PAGE 3: PAYMENT + TOTAL + QUOTE ═════════════════════════
    const paymentContainer = document.createElement('div');
    paymentContainer.style.cssText = 'position:absolute;left:-9999px;top:0;width:700px;font-family:Georgia,serif;color:#000000;background:#ffffff;padding:20px 0;margin:0;';
    document.body.appendChild(paymentContainer);
    paymentContainer.innerHTML = ''
      + '<div style="padding:30px 40px 20px;">'
      + '<div style="text-align:center;padding:16px 0;border-top:2px solid #1a237e;border-bottom:2px solid #1a237e;margin-bottom:20px;">'
      + '<p style="font-size:11px;color:#555555;margin:0 0 4px;font-weight:600;letter-spacing:1px;">TOTAL AMOUNT</p>'
      + '<p style="font-size:28px;color:#1a237e;margin:0;font-weight:700;">\u20B9' + grandTotal.toLocaleString('en-IN') + '</p>'
      + '<p style="font-size:11px;color:#555555;margin:6px 0 0;font-style:italic;">(' + amountInWords + ')</p>'
      + '</div>'
      + '<div style="background:#f0f0f5;border:1px solid #e0e0e0;border-radius:6px;padding:14px 18px;margin-bottom:20px;">'
      + '<p style="font-size:10px;color:#555555;margin:0;line-height:1.6;">' + note + '</p>'
      + '</div>'
      + '<div style="background:#f0f0f5;padding:14px 18px;border:1px solid #e0e0e0;text-align:center;margin-bottom:24px;">'
      + '<b style="color:#1a237e;font-size:13px;">PAYMENT TERMS</b><br/>'
      + '<span style="color:#000000;font-size:11px;">30% at Booking \u00b7 30% one week before \u00b7 40% day before the function \u00b7 GST 18% Extra</span>'
      + '</div>'
      + '<div style="text-align:center;margin-bottom:20px;">'
      + '<p style="font-size:12px;font-weight:600;color:#000000;margin:0;font-style:italic;white-space:nowrap;">\"We would love to make your cherishable memories, memorable for you and your loved Ones\"</p>'
      + '</div>'
      + '<div style="text-align:center;padding:8px 0;border-top:1px solid #e0e0e0;">'
      + '<p style="font-size:9px;color:#555555;margin:0;">Zebaish Caterers | A Unit of Allied Trading Corporation</p>'
      + '</div>'
      + '</div>';

    // ═══ PAGE 4: SIGNATURE (Final Approved only) ═════════════════
    const sigContainer = document.createElement('div');
    sigContainer.style.cssText = 'position:absolute;left:-9999px;top:0;width:700px;font-family:Georgia,serif;color:#000000;background:#ffffff;padding:20px 0;margin:0;';
    document.body.appendChild(sigContainer);
    sigContainer.innerHTML = ''
      + '<div style="padding:60px 50px 40px;">'
      + '<h2 style="color:#1a237e;font-size:18px;margin:0 0 8px;text-align:center;font-weight:700;letter-spacing:1px;">APPROVAL & SIGNATURE</h2>'
      + '<div style="width:200px;height:2px;background:#1a237e;margin:0 auto 40px;"></div>'
      + '<div style="display:flex;justify-content:space-between;gap:40px;margin-top:40px;">'
      + '<div style="flex:1;text-align:center;">'
      + '<p style="color:#1a237e;font-size:12px;font-weight:700;margin:0 0 60px;letter-spacing:1px;">CUSTOMER SIGNATURE</p>'
      + '<div style="border-top:1px solid #000000;margin:0 20px;padding-top:8px;">'
      + '<p style="color:#555555;font-size:10px;margin:0;">Signature</p>'
      + '</div>'
      + '<div style="margin-top:24px;">'
      + '<p style="color:#555555;font-size:10px;margin:0;">Date: ________________________</p>'
      + '</div>'
      + '</div>'
      + '<div style="flex:1;text-align:center;">'
      + '<p style="color:#1a237e;font-size:12px;font-weight:700;margin:0 0 60px;letter-spacing:1px;">FOR ZEBAISH CATERERS</p>'
      + '<div style="border-top:1px solid #000000;margin:0 20px;padding-top:8px;">'
      + '<p style="color:#555555;font-size:10px;margin:0;">Authorized Signatory</p>'
      + '</div>'
      + '<div style="margin-top:24px;">'
      + '<p style="color:#555555;font-size:10px;margin:0;">Date: ________________________</p>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '<div style="text-align:center;margin-top:60px;padding:12px 0;border-top:1px solid #e0e0e0;">'
      + '<p style="font-size:9px;color:#555555;margin:0;">Zebaish Caterers | A Unit of Allied Trading Corporation</p>'
      + '</div>'
      + '</div>';

    // ═══ RENDER ALL TO PDF ═══════════════════════════════════════
    try {
      const [coverCanvas, contentCanvas, paymentCanvas, sigCanvas] = await Promise.all([
        html2canvas(coverContainer, { scale: 2, useCORS: true, logging: false }),
        html2canvas(contentContainer, { scale: 2, useCORS: true, logging: false }),
        html2canvas(paymentContainer, { scale: 2, useCORS: true, logging: false }),
        html2canvas(sigContainer, { scale: 2, useCORS: true, logging: false }),
      ]);

      const doc = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;

      // Helper: add a canvas as pages
      const addCanvasPages = (canvas) => {
        const img = canvas.toDataURL('image/jpeg', 0.95);
        const imgH = (canvas.height * imgWidth) / canvas.width;
        let left = imgH;
        let pos = 0;
        doc.addImage(img, 'JPEG', 0, pos, imgWidth, imgH);
        left -= pageHeight;
        while (left > 0) {
          pos = -(imgH - left);
          doc.addPage();
          doc.addImage(img, 'JPEG', 0, pos, imgWidth, imgH);
          left -= pageHeight;
        }
      };

      // Page 1: Cover
      const coverImg = coverCanvas.toDataURL('image/jpeg', 0.95);
      const coverH = (coverCanvas.height * imgWidth) / coverCanvas.width;
      doc.addImage(coverImg, 'JPEG', 0, 0, imgWidth, coverH);

      // Page 2: Event + Menu
      doc.addPage();
      addCanvasPages(contentCanvas);

      // Page 3: Payment + Total
      doc.addPage();
      addCanvasPages(paymentCanvas);

      // Page 4: Signature
      doc.addPage();
      addCanvasPages(sigCanvas);

      const cn = pName.replace(/[^a-zA-Z0-9]/g, '_');
      const cv = (eventData.venue || 'Venue').replace(/[^a-zA-Z0-9]/g, '_');
      const cd = eventData.eventDate || new Date().toISOString().split('T')[0];
      doc.save('FinalApproved_' + cn + '_' + cv + '_' + cd + '.pdf');
    } catch(e) {
      alert('Error generating PDF: ' + e.message);
    }

    document.body.removeChild(coverContainer);
    document.body.removeChild(contentContainer);
    document.body.removeChild(paymentContainer);
    document.body.removeChild(sigContainer);
  };

    const generateOfficeCopy = () => {
    const fullName = eventData.gender ? eventData.gender + ' ' + (eventData.fullName || 'Customer') : (eventData.fullName || 'Customer');
    const cleanName = fullName.replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = 'Estimate_' + cleanName + '_' + dateStr + '.pdf';
    const pax = eventData.pax || 0;

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageW = 210;
    let y = 20;

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 35, 126);
    doc.text('Zebaish Caterers - Internal Estimate', pageW / 2, y, { align: 'center' });
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text('A Unit of Allied Trading Corporation', pageW / 2, y, { align: 'center' });
    y += 8;

    // Line
    doc.setDrawColor(26, 35, 126);
    doc.setLineWidth(0.5);
    doc.line(20, y, pageW - 20, y);
    y += 8;

    // Event Summary
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 35, 126);
    doc.text('Event Summary', 20, y);
    y += 7;

    const summaryData = [
      ['Menu No', menuNumber],
      ['Customer', fullName],
      ['Venue', (eventData.venue || '-') + (eventData.location ? ', ' + eventData.location : '')],
      ['PAX', String(pax)],
      ['City', eventData.city || '-'],
      ['Function', eventData.functionType || '-'],
      ['Service', eventData.serviceRequired || '-'],
      ['Gathering', eventData.gatheringType || '-'],
      ['Date', eventData.eventDate || '-'],
      ['Time', eventData.eventTime || '-'],
    ];

    doc.setFontSize(9);
    summaryData.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100);
      doc.text(label + ':', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51);
      doc.text(String(value), 65, y);
      y += 5;
    });

    y += 5;
    doc.setDrawColor(200);
    doc.line(20, y, pageW - 20, y);
    y += 8;

    // Menu Items Table
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 35, 126);
    doc.text('Menu Items', 20, y);
    y += 7;

    const colX = [20, 55, 100, 125, 140, 158, 180];
    const headers = ['#', 'Category', 'Item', 'Qty', 'Unit', 'Rate', 'Total'];
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 240, 245);
    doc.rect(18, y - 4, pageW - 36, 7, 'F');
    headers.forEach((h, i) => { doc.text(h, colX[i], y); });
    y += 5;

    doc.setFont('helvetica', 'normal');
    let idx = 0;
    let menuTotal = 0;
    Object.entries(selectedItems).forEach(([cat, items]) => {
      items.forEach(it => {
        idx++;
        const k = cat + '|' + it;
        const qty = quantities[k] || 1;
        const unit = menuUnits[k] || 'Pcs';
        const rate = menuRates[k] || 0;
        const total = qty * rate;
        menuTotal += total;

        if (y > 270) { doc.addPage(); y = 20; }

        doc.setTextColor(51);
        doc.text(String(idx), colX[0], y);
        doc.text(cat.length > 18 ? cat.substring(0, 16) + '..' : cat, colX[1], y);
        doc.text(it.length > 22 ? it.substring(0, 20) + '..' : it, colX[2], y);
        doc.text(String(qty), colX[3], y);
        doc.text(unit, colX[4], y);
        doc.text(rate.toLocaleString('en-IN'), colX[5], y);
        doc.text(total.toLocaleString('en-IN'), colX[6], y);
        y += 5;
      });
    });

    y += 3;
    doc.setDrawColor(200);
    doc.line(20, y, pageW - 20, y);
    y += 7;

    // Menu Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(26, 35, 126);
    doc.text('Menu Total:', 130, y);
    doc.text('\u20B9' + menuTotal.toLocaleString('en-IN'), 165, y);
    y += 10;

    // Extra Charges
    doc.setFontSize(12);
    doc.setTextColor(26, 35, 126);
    doc.text('Extra Charges', 20, y);
    y += 7;

    const ecHeaders = ['#', 'Item', 'Qty', 'Rate', 'Total'];
    const ecColX = [20, 40, 110, 130, 160];
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 240, 245);
    doc.rect(18, y - 4, pageW - 36, 7, 'F');
    ecHeaders.forEach((h, i) => { doc.text(h, ecColX[i], y); });
    y += 5;

    doc.setFont('helvetica', 'normal');
    extraCharges.forEach((ec, i) => {
      const total = (Number(ec.qty) || 0) * (Number(ec.rate) || 0);
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setTextColor(51);
      doc.text(String(i + 1), ecColX[0], y);
      doc.text((ec.name || '').substring(0, 20), ecColX[1], y);
      doc.text(String(ec.qty), ecColX[2], y);
      doc.text((Number(ec.rate) || 0).toLocaleString('en-IN'), ecColX[3], y);
      doc.text(total.toLocaleString('en-IN'), ecColX[4], y);
      y += 5;
    });

    y += 3;
    doc.setDrawColor(200);
    doc.line(20, y, pageW - 20, y);
    y += 7;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(26, 35, 126);
    doc.text('Extra Charges Total:', 110, y);
    doc.text('\u20B9' + extraChargesSubtotal.toLocaleString('en-IN'), 165, y);
    y += 10;

    // Grand Total
    doc.setDrawColor(26, 35, 126);
    doc.setLineWidth(1);
    doc.line(20, y, pageW - 20, y);
    y += 8;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 35, 126);
    doc.text('GRAND TOTAL', 20, y);
    doc.text('\u20B9' + grandTotal.toLocaleString('en-IN'), pageW - 20, y, { align: 'right' });
    y += 10;

    // Estimate Type
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    if (estimateType === 'perPax') {
      const rate = Number(perPaxRate) || 0;
      doc.text('Type: Per PAX @ \u20B9' + rate.toLocaleString('en-IN') + ' per plate for ' + pax + ' guests', 20, y);
    } else {
      doc.text('Type: Lumpsum (Fixed amount for ' + pax + ' guests)', 20, y);
    }
    y += 10;

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150);
    doc.text('Generated on ' + new Date().toLocaleString('en-IN'), pageW / 2, y, { align: 'center' });
    y += 5;
    doc.text('Zebaish Caterers | Internal Use Only', pageW / 2, y, { align: 'center' });

    doc.save(fileName);
  };

  return (
    <div className="ms-container">
      <div className="ms-logo-header">
        <img src="Zehaish_Golden_Logo.svg" alt="Zebaish Caterers" style={{height:"40px"}} />
        <div className="ms-logo-text"><span className="ms-logo-brand">Zebaish Caterers</span><span className="ms-logo-sub">A Unit of Allied Trading Corporation</span></div>
      </div>
      {showSuccess && <div className="ms-toast"><MdCheckCircle size={20} /> Menu submitted! PDF downloaded.</div>}

      {activeTab==='event' && (
        <div className="ms-panel">
          <div className="ms-panel-header"><MdEvent size={22}/><h2>Event Details</h2></div>
          <div className="ms-form-grid">
            {/* Row 1: Unique ID (25%) + Gender (25%) + Full Name (50%) */}
            <div className="ms-field ms-field-quarter"><label>Unique ID</label><div className="ms-menu-number-display"><span>{menuNumber}</span></div></div>
            <div className="ms-field ms-field-quarter"><label>Gender</label><select id="ms-gender" value={eventData.gender} onChange={e=>handleField('gender',e.target.value)} onKeyDown={e=>handleEventKeyDown(e,'ms-fullName')}><option value="">Select</option><option value="Mr.">Mr.</option><option value="Ms.">Ms.</option></select></div>
            <div className="ms-field ms-field-half"><label>Full Name *</label><input id="ms-fullName" type="text" placeholder="Enter customer name" required value={eventData.fullName} onChange={e=>handleField('fullName',e.target.value)} onKeyDown={e=>handleEventKeyDown(e,'ms-phone')}/></div>
            {/* Row 2: Phone (33%) + City (33%) + Location (33%) */}
            <div className="ms-field ms-field-third"><label>Phone Number *</label><input id="ms-phone" type="tel" placeholder="e.g. 9876543210" required value={eventData.phone} onChange={e=>handleField('phone',e.target.value)} onKeyDown={e=>handleEventKeyDown(e,'ms-city')}/></div>
            <div className="ms-field ms-field-third"><label>City *</label><input id="ms-city" type="text" placeholder="Enter city name" required value={eventData.city} onChange={e=>handleField('city',e.target.value)} onKeyDown={e=>handleEventKeyDown(e, isLocationVisible ? 'ms-location' : 'ms-serviceRequired')}/></div>
            {isLocationVisible ? <div className="ms-field ms-field-third"><label>Location / Address</label><input id="ms-location" type="text" placeholder="Enter full location address" value={eventData.location} onChange={e=>handleField('location',e.target.value)} onKeyDown={e=>handleEventKeyDown(e,'ms-serviceRequired')}/></div> : <div className="ms-field ms-field-third" style={{display:'none'}}></div>}
            {/* Row 3: Service (33%) + Gathering (33%) + PAX (33%) */}
            <div className="ms-field ms-field-third"><label>Service Required *</label><select id="ms-serviceRequired" required value={eventData.serviceRequired} onChange={e=>handleField('serviceRequired',e.target.value)} onKeyDown={e=>handleEventKeyDown(e,'ms-gatheringType')}><option value="">Select</option><option value="Catering Only">Catering Only</option><option value="Catering + Decoration">Catering + Decoration</option><option value="Full Event Organization">Full Event Organization</option></select></div>
            <div className="ms-field ms-field-third"><label>Gathering Type *</label><select id="ms-gatheringType" required value={eventData.gatheringType} onChange={e=>handleField('gatheringType',e.target.value)} onKeyDown={e=>handleEventKeyDown(e,'ms-pax')}><option value="">Select</option><option value="Mix Gathering">Mix Gathering</option><option value="Segregated (Ladies & Gents)">Segregated (Ladies & Gents)</option></select></div>
            <div className="ms-field ms-field-third"><label>PAX / Guests *</label><input id="ms-pax" type="number" placeholder="Number of guests" required value={eventData.pax} onChange={e=>handleField('pax',e.target.value)} onKeyDown={e=>handleEventKeyDown(e,'ms-eventDate')}/></div>
            {/* Row 4: Event Date (33%) + Venue (33%) + Function Type (33%) */}
            <div className="ms-field ms-field-third"><label>Event Date *</label><div className="ms-date-input-wrap"><input id="ms-eventDate" type="date" required value={eventData.eventDate} onChange={e=>handleField('eventDate',e.target.value)} onKeyDown={e=>handleEventKeyDown(e,'ms-venue')}/><span className="ms-date-icon">{'\uD83D\uDCC5'}</span></div></div>
            <div className="ms-field ms-field-third"><label>Venue *</label><input id="ms-venue" type="text" placeholder="Enter venue name" required value={eventData.venue} onChange={e=>handleField('venue',e.target.value)} onKeyDown={e=>handleEventKeyDown(e,'ms-functionType')}/></div>
            <div className="ms-field ms-field-third"><label>Function Type *</label><select id="ms-functionType" required value={eventData.functionType} onChange={e=>handleField('functionType',e.target.value)} onKeyDown={e=>handleEventKeyDown(e,'ms-eventTime')}><option value="">Select</option><option value="Marriage">Marriage</option><option value="Reception">Reception</option><option value="Birthday">Birthday</option><option value="Corporate">Corporate</option><option value="Anniversary">Anniversary</option><option value="Engagement">Engagement</option><option value="Other">Other</option></select></div>
            {/* Row 5: Event Time (100%) */}
            <div className="ms-field ms-field-full"><label>Event Time *</label><input id="ms-eventTime" type="time" required value={eventData.eventTime} onChange={e=>handleField('eventTime',e.target.value)} onKeyDown={e=>handleEventKeyDown(e, 'ms-goMenu')}/></div>
          </div>
          {eventData.serviceRequired === 'Full Event Organization' && (
            <div className="ms-prewedding">
              <h3>Pre-Wedding Functions</h3>
              <div className="ms-prewedding-form">
                <div className="ms-field"><label>Function Name</label><input type="text" placeholder="e.g. Mehendi, Sangeet" value={newFunc.name} onChange={e=>setNewFunc(p=>({...p,name:e.target.value}))}/></div>
                <div className="ms-field"><label>Date</label><input type="date" value={newFunc.date} onChange={e=>setNewFunc(p=>({...p,date:e.target.value}))}/></div>
                <div className="ms-field"><label>Time</label><input type="time" value={newFunc.time} onChange={e=>setNewFunc(p=>({...p,time:e.target.value}))}/></div>
                <div className="ms-field"><label>Venue</label><input type="text" placeholder="Enter venue" value={newFunc.venue} onChange={e=>setNewFunc(p=>({...p,venue:e.target.value}))}/></div>
                <button className="ms-add-func-btn" onClick={addPreWeddingFunction}><MdAdd size={16}/> Add</button>
              </div>
              {preWeddingFunctions.length > 0 && (
                <div className="ms-prewedding-list">
                  {preWeddingFunctions.map(f => (
                    <div key={f.id} className="ms-prewedding-item">
                      <span className="ms-pw-name">{f.name}</span>
                      <span className="ms-pw-detail">{f.date || '\u2014'}</span>
                      <span className="ms-pw-detail">{f.time || '\u2014'}</span>
                      <span className="ms-pw-detail">{f.venue || '\u2014'}</span>
                      <button className="ms-pw-remove" onClick={()=>removePreWeddingFunction(f.id)}><MdClose size={14}/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div style={{textAlign:"center",marginTop:20,paddingBottom:8}}>
            <button id="ms-goMenu" className="ms-next-btn" onClick={()=>setActiveTab("menu")} style={{width:"100%"}}>Go to Menu {'\u2192'}</button>
          </div>
        </div>
      )}

      {activeTab==='menu' && (
        <div className="ms-panel">
          <div className="ms-panel-header"><MdRestaurantMenu size={22}/><h2>Select Your Menu</h2></div>
          <div className="ms-search"><MdSearch size={18}/><input type="text" placeholder="Search menu items..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/></div>
          <div className="ms-cat-grid">
            {CATEGORIES.map((c,i)=>(
              <button key={i} className={'ms-cat-btn '+(expandedCategories[c.name]?'ms-cat-btn-active':'')} onClick={()=>toggleCat(c.name)}>
                <span className="ms-cat-icon">{c.icon}</span><span className="ms-cat-name">{c.name}</span>
                {selectedItems[c.name] && <span className="ms-cat-count">{selectedItems[c.name].length}</span>}
              </button>
            ))}
          </div>
          {filteredCategories.map(cat=>{
            if (!expandedCategories[cat.name] && !searchTerm) return null;
            return (
              <div key={cat.name} className="ms-items-section">
                <div className="ms-items-header"><span>{cat.icon} {cat.name}</span><span className="ms-items-count">{cat.items.length} items</span></div>
                <div className="ms-items-grid">
                  {cat.items.map((item,ii)=>{
                    const ck = selectedItems[cat.name]?.includes(item);
                    return (
                      <label key={item} className={'ms-item '+(ck?'ms-item-checked':'')} data-item={cat.name+'|'+item} data-category={cat.name} tabIndex="0" onKeyDown={e=>handleCheckboxKeyDown(e,cat.name,item,ii,cat.items)}>
                        <input type="checkbox" checked={ck||false} onChange={()=>toggleItem(cat.name,item)} tabIndex="-1"/>
                        <span className="ms-item-check"></span><span className="ms-item-name">{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className="ms-menu-footer">
            <span className="ms-selected-total">{totalSelected} items selected</span>
            <button className="ms-next-btn" onClick={()=>setActiveTab('preview')}>Preview Selection {'\u2192'}</button>
          </div>
        </div>
      )}

      {activeTab==='preview' && (
        <div className="ms-panel">
          <div className="ms-panel-header"><MdVisibility size={22}/><h2>Preview Selection</h2></div>
          {totalSelected===0 ? (
            <div className="ms-empty"><MdRestaurantMenu size={48}/><p>No items selected yet.</p><button className="ms-next-btn" onClick={()=>setActiveTab('menu')}>{'\u2190'} Go to Menu</button></div>
          ) : (
            <>
              <div className="ms-preview-summary">
                <div className="ms-preview-info">
                  <span><b>Menu #:</b> {menuNumber}</span>
                  <span><b>Name:</b> {eventData.fullName||'\u2014'}</span>
                  <span><b>Phone:</b> {eventData.phone||'\u2014'}</span>
                  <span><b>Venue:</b> {eventData.venue||'\u2014'}</span>
                  <span><b>City:</b> {eventData.city||'\u2014'}</span>
                  <span><b>PAX:</b> {eventData.pax||'\u2014'}</span>
                  <span><b>Function:</b> {eventData.functionType||'\u2014'}</span>
                  <span><b>Service:</b> {eventData.serviceRequired||'\u2014'}</span>
                  <span><b>Date:</b> {eventData.eventDate||'\u2014'}</span>
                </div>
              </div>
              {preWeddingFunctions.length > 0 && (
                <div className="ms-preview-prewedding">
                  <h3>Pre-Wedding Functions</h3>
                  {preWeddingFunctions.map(f => (
                    <div key={f.id} className="ms-preview-pw-item">
                      <span className="ms-pw-name">{f.name}</span>
                      <span className="ms-pw-detail">{f.date} {f.time}</span>
                      <span className="ms-pw-detail">{f.venue}</span>
                    </div>
                  ))}
                </div>
              )}
              {Object.entries(selectedItems).map(([cn,its])=>(
                <div key={cn} className="ms-preview-cat"><h3>{cn}</h3>
                  {its.map(it=>(
                    <div key={it} className="ms-preview-item"><span className="ms-preview-item-name">{it}</span>
                      {editMode && <button className="ms-preview-remove" onClick={()=>removeItem(cn,it)}>Remove</button>}
                    </div>
                  ))}
                </div>
              ))}
              <div className="ms-preview-footer">
                <div className="ms-preview-total">Total Items: <strong>{totalSelected}</strong></div>
                <div className="preview-actions">
                  <button className="btn-dark" onClick={()=>setEditMode(!editMode)}>
                    {editMode ? "Done Editing" : "Edit"}
                  </button>
                  <button className="btn-gold" onClick={handleSubmit} disabled={submitting}>
                    {'\uD83D\uDCBE'} Save & Submit
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="ms-tabs">
        <button className={'ms-tab '+(activeTab==='event'?'ms-tab-active':'')} onClick={()=>setActiveTab('event')}><MdEvent size={20}/><span>Event Details</span></button>
        <button className={'ms-tab '+(activeTab==='menu'?'ms-tab-active':'')} onClick={()=>setActiveTab('menu')}><MdRestaurantMenu size={20}/><span>Menu ({totalSelected})</span></button>
        <button className={'ms-tab '+(activeTab==='preview'?'ms-tab-active':'')} data-tab="tab-preview" onClick={()=>setActiveTab('preview')}><MdVisibility size={20}/><span>Preview</span></button>
        <button className="ms-tab ms-tab-estimate" onClick={()=>setShowEstimate(true)}><MdBarChart size={20}/><span>Estimate</span></button>
      </div>

      {showEstimate && (
        <div className="est-overlay" onClick={()=>setShowEstimate(false)}>
          <div className="est-modal" onClick={e=>e.stopPropagation()}>
            <div className="est-header">
              <h2><MdBarChart size={24}/> Internal Estimate</h2>
              <button className="est-close" onClick={()=>setShowEstimate(false)}><MdClose size={22}/></button>
            </div>
            <div className="est-body">
              {/* Event Summary */}
              <div className="est-section">
                <h3>Event Summary</h3>
                <div className="est-summary-grid">
                  <div className="est-summary-row"><span className="est-label">Menu No</span><span className="est-value">{menuNumber}</span></div>
                  <div className="est-summary-row"><span className="est-label">Customer</span><span className="est-value">{(eventData.gender || '') + ' ' + (eventData.fullName || '-')}</span></div>
                  <div className="est-summary-row"><span className="est-label">Venue</span><span className="est-value">{eventData.venue || '-'}</span></div>
                  <div className="est-summary-row"><span className="est-label">PAX</span><span className="est-value">{eventData.pax || '-'}</span></div>
                  <div className="est-summary-row"><span className="est-label">City</span><span className="est-value">{eventData.city || '-'}</span></div>
                </div>
              </div>

              {/* Menu Items — Function-wise grouped or flat */}
              <div className="est-section">
                <h3>Menu Items ({totalSelected} items)</h3>
                {totalSelected === 0 && <p className="est-empty">No items selected. Go to Menu tab to select items.</p>}
                {hasFunctions ? (
                  Object.entries(buildFunctionGroups()).filter(([,g]) => g.items.length > 0).map(([fn, group]) => (
                    <div key={fn} className="est-func-section">
                      <div className="est-func-header">
                        <span className="est-func-name">{fn}</span>
                        <span className="est-func-count">{group.items.length} items</span>
                      </div>
                      <div className="est-table-wrap">
                        <table className="est-table">
                          <thead><tr><th>#</th><th>Category</th><th>Item</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Total</th><th>Assign To</th></tr></thead>
                          <tbody>
                            {group.items.map((m, idx) => {
                              const rate = getMenuRate(m.cat, m.item);
                              const lineTotal = m.qty * rate;
                              return (
                              <tr key={m.key}>
                                <td className="est-idx">{idx + 1}</td>
                                <td className="est-cat">{m.cat}</td>
                                <td>{m.item}</td>
                                <td className="est-qty"><input className="est-input est-qty-input" type="number" value={m.qty} onChange={e => setItemQty(m.cat, m.item, e.target.value)} min={0} step={1}/></td>
                                <td><select className="est-input est-unit-select" value={getMenuUnit(m.cat, m.item)} onChange={e => setMenuUnit(m.cat, m.item, e.target.value)}><option value="Pcs">Pcs</option><option value="Kgs">Kgs</option><option value="Ltrs">Ltrs</option><option value="Dozen">Dozen</option><option value="Plate">Plate</option><option value="Portion">Portion</option><option value="Box">Box</option></select></td>
                                <td className="est-rate"><input className="est-input est-rate-input" type="number" value={menuRates[m.key] || ''} onChange={e => setMenuRate(m.cat, m.item, e.target.value)} placeholder="0" min={0}/></td>
                                <td className="est-total">{rate > 0 ? '\u20B9' + lineTotal.toLocaleString('en-IN') : '-'}</td>
                                <td>
                                  <select className="est-input est-func-select" value={functionAssignments[m.key] || mainFuncName} onChange={e => assignFunction(m.cat, m.item, e.target.value)}>
                                    <option value={mainFuncName}>{mainFuncName}</option>
                                    {preWeddingFunctions.map(f => (
                                      <option key={f.id} value={f.name + ' (' + (f.date || 'TBD') + ')'}>{f.name}</option>
                                    ))}
                                  </select>
                                </td>
                              </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="est-table-wrap">
                    <table className="est-table">
                      <thead><tr><th>#</th><th>Category</th><th>Item</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Total</th></tr></thead>
                      <tbody>
                        {Object.entries(selectedItems).map(([cat, items]) => items.map((it, idx) => {
                          const k = cat + '|' + it;
                          const qty = quantities[k] || 1;
                          const rate = getMenuRate(cat, it);
                          const lineTotal = qty * rate;
                          return (
                            <tr key={k}>
                              <td className="est-idx">{idx + 1}</td>
                              <td className="est-cat">{cat}</td>
                              <td>{it}</td>
                              <td className="est-qty"><input className="est-input est-qty-input" type="number" value={qty} onChange={e => setItemQty(cat, it, e.target.value)} min={0} step={1}/></td>
                              <td><select className="est-input est-unit-select" value={getMenuUnit(cat, it)} onChange={e => setMenuUnit(cat, it, e.target.value)}><option value="Pcs">Pcs</option><option value="Kgs">Kgs</option><option value="Ltrs">Ltrs</option><option value="Dozen">Dozen</option><option value="Plate">Plate</option><option value="Portion">Portion</option><option value="Box">Box</option></select></td>
                              <td className="est-rate"><input className="est-input est-rate-input" type="number" value={menuRates[k] || ''} onChange={e => setMenuRate(cat, it, e.target.value)} placeholder="0" min={0}/></td>
                              <td className="est-total">{rate > 0 ? '\u20B9' + lineTotal.toLocaleString('en-IN') : '-'}</td>
                            </tr>
                          );
                        }))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Extra Charges */}
              <div className="est-section">
                <div className="est-section-header">
                  <h3>Extra Charges</h3>
                  <button className="est-add-btn" onClick={addExtraCharge}><MdAdd size={16}/> Add Item</button>
                </div>
                <div className="est-table-wrap">
                  <table className="est-table">
                    <thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Total</th><th></th></tr></thead>
                    <tbody>
                      {extraCharges.map(c => (
                        <tr key={c.id}>
                          <td><input className="est-input" type="text" value={c.name} onChange={e => updateExtraCharge(c.id, 'name', e.target.value)} placeholder="Item name"/></td>
                          <td><input className="est-input" type="number" value={c.qty} onChange={e => updateExtraCharge(c.id, 'qty', e.target.value)} min={0}/></td>
                          <td><input className="est-input" type="number" value={c.rate} onChange={e => updateExtraCharge(c.id, 'rate', e.target.value)} min={0}/></td>
                          <td className="est-total">{'\u20B9'}{(Number(c.qty) * Number(c.rate)).toLocaleString('en-IN')}</td>
                          <td><button className="est-remove-btn" onClick={() => removeExtraCharge(c.id)}><MdClose size={16}/></button></td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="est-subtotal-row">
                        <td colSpan={3} className="est-subtotal-label">Subtotal</td>
                        <td className="est-total est-subtotal-val">{'\u20B9'}{extraChargesSubtotal.toLocaleString('en-IN')}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Estimate Type */}
              <div className="est-section">
                <h3>Estimate Type</h3>
                <div className="est-type-row">
                  <label className="est-type-option">
                    <input type="radio" name="estimateType" value="perPax" checked={estimateType === 'perPax'} onChange={() => setEstimateType('perPax')} />
                    <span className="est-type-dot"></span>
                    Per PAX
                  </label>
                  <label className="est-type-option">
                    <input type="radio" name="estimateType" value="lumpsum" checked={estimateType === 'lumpsum'} onChange={() => setEstimateType('lumpsum')} />
                    <span className="est-type-dot"></span>
                    Lumpsum
                  </label>
                  {estimateType === 'perPax' && (
                    <div className="est-pax-rate-input">
                      <span className="est-pax-label">Per Plate Rate</span>
                      <input className="est-input" type="number" id="perPaxRate" value={perPaxRate} onChange={e => setPerPaxRate(e.target.value)} placeholder="e.g. 1200" min={0} />
                    </div>
                  )}
                </div>
                <div className="est-actions-row">
                  <button className="btn-gold" onClick={generateCustomerCopy}>Print Customer Copy</button>
                  <button className="btn-gold" onClick={generateOfficeCopy}>Save Office Copy</button>
                  <button className="btn-gold" onClick={generateFinalPDF}>📄 Final Approved PDF</button>
                </div>
              </div>

              {/* Grand Total */}
              <div className="est-grand-total">
                <div className="est-gt-left">
                  <span>Menu Items: {totalSelected}</span>
                  <span>Extra Charges: {'\u20B9'}{extraChargesSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <span className="est-grand-val">Total Estimate: {'\u20B9'}{extraChargesSubtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuSelection;
