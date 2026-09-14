'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@repo/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string; // Or number, assume string as it could be '$9.99' or decimal
  interval: string;
  features: string;
  status: 'ACTIVE' | 'ARCHIVED';
}

interface Guide {
  id: string;
  title: string;
}

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  // New plan form
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [interval, setInterval] = useState('Monthly');
  const [features, setFeatures] = useState('');

  // Bulk associate form
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedGuideIds, setSelectedGuideIds] = useState<string[]>([]);
  const [discountAmount, setDiscountAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchPlans(),
      fetchGuides()
    ]);
    setLoading(false);
  };

  const fetchPlans = async () => {
    const { data } = await supabase.from('subscriptions').select('*').order('name');
    if (data) setPlans(data);
  };

  const fetchGuides = async () => {
    const { data } = await supabase.from('guide_versions').select('guide_id, title').order('title');
    const mappedData = data?.map(d => ({ id: d.guide_id, title: d.title })) || [];
    if (mappedData) setGuides(mappedData);
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPlan = {
      name: name.trim(),
      price: price.trim(), // Consider using numeric price in actual db, fallback to string if needed
      interval,
      features: features.trim(),
      status: 'ACTIVE',
    };

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([newPlan])
      .select()
      .single();

    if (data && !error) {
      setPlans([...plans, data]);
      setName('');
      setPrice('');
      setInterval('Monthly');
      setFeatures('');
    } else {
      console.error("Error creating plan:", error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ status: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (data && !error) {
      setPlans(plans.map((plan) => (plan.id === id ? data : plan)));
    }
  };

  const handleGuideSelection = (guideId: string) => {
    if (selectedGuideIds.includes(guideId)) {
      setSelectedGuideIds(selectedGuideIds.filter(id => id !== guideId));
    } else {
      setSelectedGuideIds([...selectedGuideIds, guideId]);
    }
  };

  const handleBulkAssociate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId || selectedGuideIds.length === 0) return;

    const inclusions = selectedGuideIds.map(guideId => ({
      subscription_id: selectedPlanId,
      guide_id: guideId,
      discount_amount: discountAmount ? parseFloat(discountAmount) : null,
      start_date: startDate ? new Date(startDate).toISOString() : null,
      end_date: endDate ? new Date(endDate).toISOString() : null,
    }));

    const { error } = await supabase
      .from('subscription_inclusions')
      .insert(inclusions);

    if (!error) {
      alert("Successfully associated guides to the subscription plan!");
      setSelectedPlanId('');
      setSelectedGuideIds([]);
      setDiscountAmount('');
      setStartDate('');
      setEndDate('');
    } else {
      console.error("Error associating guides:", error);
      alert("Error associating guides.");
    }
  };

  return (
    <div style={{ color: '#111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Subscription Plans</h1>
          <p style={{ color: '#666', marginTop: '5px', marginBottom: 0 }}>
            Manage membership tiers, pricing, and bulk-associate guides.
          </p>
        </div>
      </div>

      {/* Subscription Plans Table */}
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
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
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '12px 16px', textAlign: 'center' }}>Loading...</td></tr>
            ) : plans.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '12px 16px', textAlign: 'center' }}>No plans found.</td></tr>
            ) : plans.map((plan) => (
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
                    onClick={() => handleToggleStatus(plan.id, plan.status)}
                    style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontSize: '14px' }}
                  >
                    {plan.status === 'ACTIVE' ? 'Archive' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Add New Plan Form */}
        <div style={{ padding: '24px', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Add New Subscription Tier</h3>
          <form onSubmit={handleAddPlan}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Plan Name</label>
              <input type="text" placeholder="e.g. Pro" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Price</label>
              <input type="text" placeholder="e.g. 14.99" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Billing Interval</label>
              <select value={interval} onChange={(e) => setInterval(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: 'white' }}>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Lifetime">Lifetime / One-time</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Features & Entitlements</label>
              <input type="text" placeholder="e.g. Unlimited downloads" value={features} onChange={(e) => setFeatures(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" style={{ padding: '10px 24px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              + Create Plan
            </button>
          </form>
        </div>

        {/* Bulk Associate Guides */}
        <div style={{ padding: '24px', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Bulk-Associate Guides to Tier</h3>
          <form onSubmit={handleBulkAssociate}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Target Tier</label>
              <select value={selectedPlanId} onChange={(e) => setSelectedPlanId(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: 'white' }}>
                <option value="">Select a tier...</option>
                {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Discount Override ($)</label>
                <input type="number" step="0.01" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>
              <div></div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: 'white' }} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Select Guides ({selectedGuideIds.length} selected)</label>
              <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                {guides.length === 0 ? <span style={{ color: '#666', fontSize: '14px' }}>No guides available</span> : null}
                {guides.map(g => (
                  <div key={g.id} style={{ marginBottom: '5px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedGuideIds.includes(g.id)}
                        onChange={() => handleGuideSelection(g.id)}
                        style={{ marginRight: '8px' }}
                      />
                      {g.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={!selectedPlanId || selectedGuideIds.length === 0} style={{ padding: '10px 24px', background: (!selectedPlanId || selectedGuideIds.length === 0) ? '#aaa' : '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: (!selectedPlanId || selectedGuideIds.length === 0) ? 'not-allowed' : 'pointer' }}>
              Associate {selectedGuideIds.length} Guides
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
