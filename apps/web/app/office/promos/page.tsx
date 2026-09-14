'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@repo/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

interface Promo {
  id: string;
  code: string;
  discount_amount: number;
  redemptions: number;
  max_redemptions: number;
  start_date: string | null;
  end_date: string | null;
  status: 'ACTIVE' | 'EXPIRED' | 'DISABLED';
  target_country_id: string | null;
  target_state_id: string | null;
  guide_id: string | null;
  created_at: string;
}

interface Country {
  id: string;
  name: string;
}

interface State {
  id: string;
  name: string;
  country_id: string;
}

interface Guide {
  id: string;
  title: string;
}

function generateRandomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'HERO-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function PromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  
  const [code, setCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [maxRedemptions, setMaxRedemptions] = useState(100);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetCountryId, setTargetCountryId] = useState('');
  const [targetStateId, setTargetStateId] = useState('');
  const [guideId, setGuideId] = useState('');
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Sorting and filtering
  const [sortField, setSortField] = useState<keyof Promo>('created_at');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchPromos(),
      fetchCountries(),
      fetchStates(),
      fetchGuides()
    ]);
    setLoading(false);
  };

  const fetchPromos = async () => {
    const { data, error } = await supabase
      .from('promos')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data && !error) {
      setPromos(data);
    } else {
      console.error("Error fetching promos:", error);
    }
  };

  const fetchCountries = async () => {
    const { data } = await supabase.from('countries').select('id, name').order('name');
    if (data) setCountries(data);
  };

  const fetchStates = async () => {
    const { data } = await supabase.from('states').select('id, name, country_id').order('name');
    if (data) setStates(data);
  };

  const fetchGuides = async () => {
    const { data } = await supabase.from('guide_versions').select('guide_id, title').order('title');
    const mappedData = data?.map(d => ({ id: d.guide_id, title: d.title })) || [];
    if (mappedData) setGuides(mappedData);
  };

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = (code.trim() || generateRandomCode()).toUpperCase();

    const newPromo = {
      code: finalCode,
      discount_amount: parseFloat(discountAmount) || 0,
      redemptions: 0,
      max_redemptions: Number(maxRedemptions) || 100,
      start_date: startDate ? new Date(startDate).toISOString() : null,
      end_date: endDate ? new Date(endDate).toISOString() : null,
      status: 'ACTIVE',
      target_country_id: targetCountryId || null,
      target_state_id: targetStateId || null,
      guide_id: guideId || null,
    };

    const { data, error } = await supabase
      .from('promos')
      .insert([newPromo])
      .select()
      .single();

    if (data && !error) {
      setPromos([data, ...promos]);
      setCode('');
      setDiscountAmount('');
      setMaxRedemptions(100);
      setStartDate('');
      setEndDate('');
      setTargetCountryId('');
      setTargetStateId('');
      setGuideId('');
    } else {
      console.error("Error creating code:", error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    const { data, error } = await supabase
      .from('promos')
      .update({ status: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (data && !error) {
      setPromos(promos.map((item) => (item.id === id ? data : item)));
    } else {
      console.error("Error toggling status:", error);
    }
  };

  const handleCopyCode = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredPromos = promos.filter(p => filterStatus === 'ALL' || p.status === filterStatus);
  const sortedPromos = [...filteredPromos].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal === bVal) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;
    if (aVal < bVal) return sortAsc ? -1 : 1;
    return sortAsc ? 1 : -1;
  });

  return (
    <div style={{ color: '#111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Promos</h1>
          <p style={{ color: '#666', marginTop: '5px', marginBottom: 0 }}>
            Manage discount vouchers, redemption limits, and promotional campaigns.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="EXPIRED">Expired</option>
          <option value="DISABLED">Disabled</option>
        </select>
      </div>

      {/* Promos Table */}
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead style={{ background: '#eee', color: '#333' }}>
            <tr>
              <th style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => { setSortField('status'); setSortAsc(!sortAsc); }}>Status</th>
              <th style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => { setSortField('code'); setSortAsc(!sortAsc); }}>Code</th>
              <th style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => { setSortField('discount_amount'); setSortAsc(!sortAsc); }}>Discount</th>
              <th style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => { setSortField('redemptions'); setSortAsc(!sortAsc); }}>Usage</th>
              <th style={{ padding: '12px 16px' }}>Target</th>
              <th style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => { setSortField('start_date'); setSortAsc(!sortAsc); }}>Dates</th>
              <th style={{ padding: '12px 16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '12px 16px', textAlign: 'center' }}>Loading...</td></tr>
            ) : sortedPromos.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '12px 16px', textAlign: 'center' }}>No promos found.</td></tr>
            ) : (
              sortedPromos.map((item) => {
                const isExhausted = item.redemptions >= item.max_redemptions;
                const percentUsed = Math.min(100, Math.round((item.redemptions / item.max_redemptions) * 100));

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          background:
                            item.status === 'EXPIRED' ? '#d32f2f'
                              : item.status === 'ACTIVE'
                                ? (isExhausted ? '#f57c00' : '#2e7d32')
                                : '#757575',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        {isExhausted && item.status === 'ACTIVE' ? 'DEPLETED' : item.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <code style={{ background: '#f4f4f4', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {item.code}
                      </code>
                    </td>
                    <td style={{ padding: '12px 16px' }}>${item.discount_amount}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.redemptions}/{item.max_redemptions}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      {item.target_country_id && <div>Country: {countries.find(c => c.id === item.target_country_id)?.name || item.target_country_id}</div>}
                      {item.target_state_id && <div>State: {states.find(s => s.id === item.target_state_id)?.name || item.target_state_id}</div>}
                      {item.guide_id && <div>Guide: {guides.find(g => g.id === item.guide_id)?.title || item.guide_id}</div>}
                      {!item.target_country_id && !item.target_state_id && !item.guide_id && <span style={{ color: '#888' }}>Global</span>}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      <div>Start: {item.start_date ? new Date(item.start_date).toLocaleDateString() : 'N/A'}</div>
                      <div>End: {item.end_date ? new Date(item.end_date).toLocaleDateString() : 'N/A'}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleCopyCode(item.id, item.code)}
                          style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                        >
                          {copiedId === item.id ? 'Copied!' : 'Copy'}
                        </button>
                        <span>|</span>
                        <button
                          onClick={() => handleToggleStatus(item.id, item.status)}
                          style={{ background: 'none', border: 'none', color: item.status === 'ACTIVE' ? '#d32f2f' : '#2e7d32', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                        >
                          {item.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Generate Custom Promo Code Form */}
      <div style={{ marginTop: '30px', padding: '24px', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Create Promo</h3>
        <form onSubmit={handleCreateCode}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Code</label>
                <button
                  type="button"
                  onClick={() => setCode(generateRandomCode())}
                  style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline', padding: 0 }}
                >
                  Generate random
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. FLASH50"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                Discount Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                Redemption Limit
              </label>
              <input
                type="number"
                min="1"
                value={maxRedemptions}
                onChange={(e) => setMaxRedemptions(Number(e.target.value))}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: 'white' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: 'white' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                Target Country
              </label>
              <select
                value={targetCountryId}
                onChange={(e) => setTargetCountryId(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: 'white' }}
              >
                <option value="">Any Country</option>
                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                Target State
              </label>
              <select
                value={targetStateId}
                onChange={(e) => setTargetStateId(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: 'white' }}
                disabled={!targetCountryId}
              >
                <option value="">Any State</option>
                {states.filter(s => s.country_id === targetCountryId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                Target Guide
              </label>
              <select
                value={guideId}
                onChange={(e) => setGuideId(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: 'white' }}
              >
                <option value="">Any Guide</option>
                {guides.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit"
            style={{ padding: '10px 24px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Create Promo
          </button>
        </form>
      </div>
    </div>
  );
}
