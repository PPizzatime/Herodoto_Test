'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@repo/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

interface PromoCode {
  id: string;
  code: string;
  discount: string;
  redemptions: number;
  max_redemptions: number;
  expires_at: string | null;
  status: 'ACTIVE' | 'EXPIRED' | 'DISABLED';
  target_country: string | null;
  target_month: number | null;
}

function generateRandomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'HERO-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [maxRedemptions, setMaxRedemptions] = useState(100);
  const [expiresAt, setExpiresAt] = useState('');
  const [targetCountry, setTargetCountry] = useState('');
  const [targetMonth, setTargetMonth] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data && !error) {
      setPromoCodes(data);
    } else {
      console.error("Error fetching codes:", error);
    }
    setLoading(false);
  };

  const handleQuickGenerate = async () => {
    const randomCode = generateRandomCode();
    const newPromo = {
      code: randomCode,
      discount: '20% OFF',
      redemptions: 0,
      max_redemptions: 100,
      expires_at: '2026-12-31',
      status: 'ACTIVE',
    };
    const { data, error } = await supabase
      .from('promo_codes')
      .insert([newPromo])
      .select()
      .single();

    if (data && !error) {
      setPromoCodes([data, ...promoCodes]);
    } else {
      console.error("Error creating code:", error);
    }
  };

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = (code.trim() || generateRandomCode()).toUpperCase();

    const newPromo = {
      code: finalCode,
      discount: discount.trim() || '15% OFF',
      redemptions: 0,
      max_redemptions: Number(maxRedemptions) || 100,
      expires_at: expiresAt || null,
      status: 'ACTIVE',
      target_country: targetCountry.trim() || null,
      target_month: targetMonth ? Number(targetMonth) : null,
    };

    const { data, error } = await supabase
      .from('promo_codes')
      .insert([newPromo])
      .select()
      .single();

    if (data && !error) {
      setPromoCodes([data, ...promoCodes]);
      setCode('');
      setDiscount('');
      setMaxRedemptions(100);
      setExpiresAt('');
      setTargetCountry('');
      setTargetMonth('');
    } else {
      console.error("Error creating code:", error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    const { data, error } = await supabase
      .from('promo_codes')
      .update({ status: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (data && !error) {
      setPromoCodes(
        promoCodes.map((item) => (item.id === id ? data : item))
      );
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

  return (
    <div style={{ color: '#111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Promo Codes</h1>
          <p style={{ color: '#666', marginTop: '5px', marginBottom: 0 }}>
            Manage discount vouchers, redemption limits, and promotional campaigns.
          </p>
        </div>
        <button
          onClick={handleQuickGenerate}
          style={{
            padding: '10px 20px',
            background: 'blue',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          + Quick Generate Code
        </button>
      </div>

      {/* Promo Codes Table */}
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#eee', color: '#333' }}>
            <tr>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Promo Code</th>
              <th style={{ padding: '12px 16px' }}>Discount</th>
              <th style={{ padding: '12px 16px' }}>Redemption Limit</th>
              <th style={{ padding: '12px 16px' }}>Target</th>
              <th style={{ padding: '12px 16px' }}>Usage</th>
              <th style={{ padding: '12px 16px' }}>Expires At</th>
              <th style={{ padding: '12px 16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: '12px 16px', textAlign: 'center' }}>Loading...</td></tr>
            ) : promoCodes.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '12px 16px', textAlign: 'center' }}>No promo codes found.</td></tr>
            ) : (
              promoCodes.map((item) => {
                const isExhausted = item.redemptions >= item.max_redemptions;
                const percentUsed = Math.min(100, Math.round((item.redemptions / item.max_redemptions) * 100));

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          background:
                            item.status === 'EXPIRED' || isExhausted
                              ? '#d32f2f'
                              : item.status === 'ACTIVE'
                                ? '#2e7d32'
                                : '#757575',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        {isExhausted && item.status === 'ACTIVE' ? 'EXHAUSTED' : item.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <code
                        style={{
                          background: '#f4f4f4',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          letterSpacing: '1px',
                        }}
                      >
                        {item.code}
                      </code>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{item.discount}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>
                      {item.redemptions} / {item.max_redemptions}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {item.target_country ? `Country: ${item.target_country}` : ''}
                      {item.target_country && item.target_month ? <br /> : ''}
                      {item.target_month ? `Month: ${item.target_month}` : ''}
                      {!item.target_country && !item.target_month ? 'Global' : ''}
                    </td>
                    <td style={{ padding: '12px 16px', width: '140px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            flex: 1,
                            height: '8px',
                            background: '#eee',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${percentUsed}%`,
                              height: '100%',
                              background: percentUsed >= 100 ? '#d32f2f' : percentUsed > 75 ? '#f57c00' : '#1976d2',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '12px', color: '#666' }}>{percentUsed}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>
                      {item.expires_at ? new Date(item.expires_at).toISOString().split('T')[0] : 'Never'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleCopyCode(item.id, item.code)}
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
                          {copiedId === item.id ? 'Copied!' : 'Copy'}
                        </button>
                        <span>|</span>
                        <button
                          onClick={() => handleToggleStatus(item.id, item.status)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: item.status === 'ACTIVE' ? '#d32f2f' : '#2e7d32',
                            cursor: 'pointer',
                            padding: 0,
                            textDecoration: 'underline',
                            fontSize: '14px',
                          }}
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
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Generate Custom Promo Code</h3>
        <form onSubmit={handleCreateCode}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Code</label>
                <button
                  type="button"
                  onClick={() => setCode(generateRandomCode())}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1976d2',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textDecoration: 'underline',
                    padding: 0,
                  }}
                >
                  Generate random
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. FLASH50 (or leave blank)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                  textTransform: 'uppercase',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                Discount Description
              </label>
              <input
                type="text"
                placeholder="e.g. 50% OFF, 1 Month Free"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
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
                Redemption Limit
              </label>
              <input
                type="number"
                min="1"
                placeholder="100"
                value={maxRedemptions}
                onChange={(e) => setMaxRedemptions(Number(e.target.value))}
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
                Expiration Date
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                  background: 'white',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                Target Country
              </label>
              <input
                type="text"
                placeholder="e.g. US, MX (or leave blank)"
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                  textTransform: 'uppercase',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                Target Month
              </label>
              <input
                type="number"
                min="1"
                max="12"
                placeholder="e.g. 9 for Sept (or leave blank)"
                value={targetMonth}
                onChange={(e) => setTargetMonth(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              />
            </div>
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
            Create Promo Code
          </button>
        </form>
      </div>
    </div>
  );
}
