'use client';

import React, { useState } from 'react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  interval: string;
  features: string;
  status: 'ACTIVE' | 'ARCHIVED';
}

const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Free',
    price: '$0.00',
    interval: 'Monthly',
    features: 'Up to 3 free guide downloads, Standard audio speed, Community support',
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'Premium',
    price: '$9.99',
    interval: 'Monthly',
    features: 'Unlimited guide downloads, Offline playback, High-definition audio, Ad-free experience',
    status: 'ACTIVE',
  },
  {
    id: '3',
    name: 'Enterprise',
    price: '$49.99',
    interval: 'Monthly',
    features: 'Multi-seat licenses, Custom museum guides, Priority support, API access',
    status: 'ACTIVE',
  },
];

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(INITIAL_PLANS);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [interval, setInterval] = useState('Monthly');
  const [features, setFeatures] = useState('');

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPlan: SubscriptionPlan = {
      id: Date.now().toString(),
      name: name.trim(),
      price: price.trim().startsWith('$') ? price.trim() : `$${price.trim() || '0.00'}`,
      interval,
      features: features.trim() || 'Standard access',
      status: 'ACTIVE',
    };

    setPlans([...plans, newPlan]);
    setName('');
    setPrice('');
    setInterval('Monthly');
    setFeatures('');
  };

  const handleToggleStatus = (id: string) => {
    setPlans(
      plans.map((plan) =>
        plan.id === id
          ? { ...plan, status: plan.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE' }
          : plan
      )
    );
  };

  return (
    <div style={{ color: '#111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Subscription Plans</h1>
          <p style={{ color: '#666', marginTop: '5px', marginBottom: 0 }}>
            Manage membership tiers, pricing, and feature entitlements.
          </p>
        </div>
      </div>

      {/* Subscription Plans Table */}
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#eee', color: '#333' }}>
            <tr>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Plan Name</th>
              <th style={{ padding: '12px 16px' }}>Price</th>
              <th style={{ padding: '12px 16px' }}>Interval</th>
              <th style={{ padding: '12px 16px' }}>Included Features</th>
              <th style={{ padding: '12px 16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      background: plan.status === 'ACTIVE' ? '#2e7d32' : '#757575',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    {plan.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{plan.name}</td>
                <td style={{ padding: '12px 16px' }}>{plan.price}</td>
                <td style={{ padding: '12px 16px' }}>{plan.interval}</td>
                <td style={{ padding: '12px 16px', color: '#555', maxWidth: '300px' }}>{plan.features}</td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() => handleToggleStatus(plan.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1976d2',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                      fontSize: '14px',
                    }}
                  >
                    {plan.status === 'ACTIVE' ? 'Archive' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Plan Form */}
      <div style={{ marginTop: '30px', padding: '24px', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Add New Subscription Plan</h3>
        <form onSubmit={handleAddPlan}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                Plan Name
              </label>
              <input
                type="text"
                placeholder="e.g. Student, Pro, Enterprise"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                Price (USD)
              </label>
              <input
                type="text"
                placeholder="e.g. 14.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                Billing Interval
              </label>
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                  background: 'white',
                }}
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Lifetime / One-time">Lifetime / One-time</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
              Features & Entitlements
            </label>
            <input
              type="text"
              placeholder="e.g. Unlimited downloads, offline access, priority support"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 24px',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            + Create Plan
          </button>
        </form>
      </div>
    </div>
  );
}

