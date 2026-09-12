'use client';

import React, { useState } from 'react';

interface PromoCode {
  id: string;
  code: string;
  discount: string;
  redemptions: number;
  maxRedemptions: number;
  expiresAt: string;
  status: 'ACTIVE' | 'EXPIRED' | 'DISABLED';
}

const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    id: '1',
    code: 'WELCOME2026',
    discount: '25% OFF First Month',
    redemptions: 42,
    maxRedemptions: 100,
    expiresAt: '2026-12-31',
    status: 'ACTIVE',
  },
  {
    id: '2',
    code: 'SUMMERFREE',
    discount: '100% OFF (1 Month)',
    redemptions: 50,
    maxRedemptions: 50,
    expiresAt: '2026-08-31',
    status: 'EXPIRED',
  },
  {
    id: '3',
    code: 'VIPPARTNER',
    discount: '50% OFF Lifetime',
    redemptions: 12,
    maxRedemptions: 25,
    expiresAt: '2026-11-30',
    status: 'ACTIVE',
  },
  {
    id: '4',
    code: 'MUSEUMPASS',
    discount: '15% OFF Annual',
    redemptions: 89,
    maxRedemptions: 500,
    expiresAt: '2027-01-01',
    status: 'ACTIVE',
  },
];

function generateRandomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'HERO-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [maxRedemptions, setMaxRedemptions] = useState(100);
  const [expiresAt, setExpiresAt] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleQuickGenerate = () => {
    const randomCode = generateRandomCode();
    const newPromo: PromoCode = {
      id: Date.now().toString(),
      code: randomCode,
      discount: '20% OFF',
      redemptions: 0,
      maxRedemptions: 100,
      expiresAt: '2026-12-31',
      status: 'ACTIVE',
    };
    setPromoCodes([newPromo, ...promoCodes]);
  };

  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = (code.trim() || generateRandomCode()).toUpperCase();

    const newPromo: PromoCode = {
      id: Date.now().toString(),
      code: finalCode,
      discount: discount.trim() || '15% OFF',
      redemptions: 0,
      maxRedemptions: Number(maxRedemptions) || 100,
      expiresAt: expiresAt || '2026-12-31',
      status: 'ACTIVE',
    };

    setPromoCodes([newPromo, ...promoCodes]);
    setCode('');
    setDiscount('');
    setMaxRedemptions(100);
    setExpiresAt('');
  };

  const handleToggleStatus = (id: string) => {
    setPromoCodes(
      promoCodes.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' }
          : item
      )
    );
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
              <th style={{ padding: '12px 16px' }}>Usage</th>
              <th style={{ padding: '12px 16px' }}>Expires At</th>
              <th style={{ padding: '12px 16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes.map((item) => {
              const isExhausted = item.redemptions >= item.maxRedemptions;
              const percentUsed = Math.min(100, Math.round((item.redemptions / item.maxRedemptions) * 100));

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
                    {item.redemptions} / {item.maxRedemptions}
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
                  <td style={{ padding: '12px 16px', color: '#555' }}>{item.expiresAt}</td>
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
                        onClick={() => handleToggleStatus(item.id)}
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
            })}
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

