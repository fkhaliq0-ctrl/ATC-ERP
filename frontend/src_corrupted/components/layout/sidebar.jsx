import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const navigationGroups = [
    {
      category: "Overview",
      items: [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Agent / Partner", path: "/agent" },
      ],
    },
    {
      category: "Catering Service",
      items: [
        { name: "Menu Selection", path: "/menu-selection" },
        { name: "AI Menu Calculator", path: "/menu-calculator" },
      ],
    },
    {
      category: "Sales & Distribution",
      items: [
        { name: "Sales Invoices", path: "/sales/invoice" },
        { name: "Customer Payments", path: "/sales/payments" },
        { name: "Delivery Challan", path: "/sales/delivery" },
      ],
    },
    {
      category: "Purchase & Inventory",
      items: [
        { name: "Purchase Invoices", path: "/purchase/invoice" },
        { name: "Goods Receipt", path: "/purchase/goods-receipt" },
        { name: "Stock Inventory", path: "/inventory/stock" },
      ],
    },
    {
      category: "Finance & Accounts",
      items: [
        { name: "Accounts Payments", path: "/accounts/payments" },
      ],
    },
    {
      category: "Masters",
      items: [
        { name: "Customer Master", path: "/masters/customer" },
        { name: "Supplier Master", path: "/masters/supplier" },
        { name: "Item Master", path: "/masters/item" },
        { name: "Bank Master", path: "/masters/bank" },
        { name: "Tax Master", path: "/masters/tax" },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">ATC-ERP</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {navigationGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {group.category}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item, itemIdx) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={itemIdx}>
                    <Link
                      to={item.path}
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
