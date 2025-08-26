// MarketMuseUI.jsx - Enhanced Multi-Agent Marketing Intelligence Interface
import React, { useState } from "react";
import { marketingPrompts } from "./prompts/marketingPrompts";

export default function MarketMuseApp(){
  const [query, setQuery] = useState("Identify the optimal influencers and predict campaign outcomes for launching a new sustainable skincare brand targeting Gen Z audiences");
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [apiStatus, setApiStatus] = useState("checking"); // checking, connected, disconnected


  // Check API status on component mount
  React.useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/health');
        if (response.ok) {
          setApiStatus("connected");
        } else {
          setApiStatus("disconnected");
        }
      } catch (error) {
        setApiStatus("disconnected", error);
      }
    };
    
    checkApiStatus();
    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const runSim = async () => {
    setLoading(true);
    
    try {
      // Call the Python backend API
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      // Set the real data from Python simulation
      setResp({
        query: result.query,
        timestamp: result.timestamp,
        ...result.data
      });

    } catch (error) {
      console.error('Analysis failed:', error);
      
      alert(`Analysis failed: ${error.message}\n\nPlease make sure:\n1. The API server is running (npm run server)\n2. Python environment is properly configured\n3. Try refreshing and running again`);
      
   
    } finally {
      setLoading(false);
    }
  };

  const ScoreBar = ({ score, max = 100, color = "#3b82f6" }) => (
    <div style={{width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px'}}>
      <div 
        style={{
          height: '8px',
          borderRadius: '9999px',
          width: `${(score/max)*100}%`,
          backgroundColor: color,
          transition: 'all 0.3s ease'
        }}
      />
    </div>
  );

  const MetricCard = ({ title, value, subtitle, trend, icon }) => (
    <div style={{backgroundColor: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px'}}>
        <h4 style={{fontSize: '14px', fontWeight: '500', color: '#6b7280'}}>{title}</h4>
        {icon && <span style={{fontSize: '18px'}}>{icon}</span>}
      </div>
      <div style={{fontSize: '24px', fontWeight: 'bold', color: '#111827'}}>{value}</div>
      {subtitle && <div style={{fontSize: '14px', color: '#6b7280', marginTop: '4px'}}>{subtitle}</div>}
      {trend && (
        <div style={{fontSize: '14px', marginTop: '8px', color: trend.startsWith('+') ? '#059669' : '#dc2626'}}>
          {trend}
        </div>
      )}
    </div>
  );

  return (
    <div style={{fontFamily:'Inter, system-ui', backgroundColor:'#f8fafc', minHeight:'100vh'}}>
      {/* Header */}
      <div style={{backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px'}}>
        <div style={{maxWidth: '1280px', margin: '0 auto'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <h1 style={{fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: '0'}}>MarketMuse</h1>
              <p style={{color: '#6b7280', marginTop: '4px', margin: '4px 0 0 0'}}>Multi-agent marketing intelligence for influencer campaigns</p>
            </div>
            <div style={{textAlign: 'right'}}>
              <div style={{fontSize: '12px', color: '#6b7280', marginBottom: '4px'}}>
                {apiStatus === 'connected' ? '🟢 Live Python Backend' : 
                 apiStatus === 'disconnected' ? '🔴 Demo Mode' : '🟡 Checking...'}
              </div>
              <div style={{fontSize: '10px', color: '#9ca3af'}}>
                v1.0 • {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth: '1280px', margin: '0 auto', padding: '24px'}}>
        {/* Query Input Section */}
        <div style={{backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '24px'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div style={{flex: 1}}>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Select Campaign Template</label>
                <select
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    fontSize: '14px'
                  }}
                  onChange={(e) => {
                    const selectedPrompt = marketingPrompts.find(p => p.id === parseInt(e.target.value));
                    if (selectedPrompt) {
                      setQuery(selectedPrompt.prompt);
                    }
                  }}
                >
                  <option value="">Select a campaign template...</option>
                  {marketingPrompts.map(prompt => (
                    <option key={prompt.id} value={prompt.id}>
                      {prompt.label}
                    </option>
                  ))}
                </select>
              </div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Campaign Brief</label>
              <textarea
                style={{
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  resize: 'none',
                  fontFamily: 'inherit',
                  fontSize: '14px'
                }}
                rows="3"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Describe your campaign objectives, target audience, and requirements..."
              />
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px'}}>
            <div style={{display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280'}}>
              <span>{query.length} characters • Est. analysis time: 30-60 seconds</span>
              <div style={{
                marginLeft: '16px',
                display: 'flex',
                alignItems: 'center',
                padding: '4px 8px',
                borderRadius: '12px',
                backgroundColor: apiStatus === 'connected' ? '#dcfce7' : apiStatus === 'disconnected' ? '#fecaca' : '#fef3c7',
                color: apiStatus === 'connected' ? '#166534' : apiStatus === 'disconnected' ? '#991b1b' : '#92400e'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: apiStatus === 'connected' ? '#16a34a' : apiStatus === 'disconnected' ? '#dc2626' : '#d97706',
                  marginRight: '6px'
                }}></div>
                <span style={{fontSize: '12px', fontWeight: '500'}}>
                  {apiStatus === 'connected' ? 'API Connected' : 
                   apiStatus === 'disconnected' ? 'API Offline' : 'Checking...'}
                </span>
              </div>
            </div>
            <button
              onClick={runSim}
              disabled={loading || !query.trim()}
              style={{
                padding: '8px 24px',
                borderRadius: '8px',
                fontWeight: '500',
                border: 'none',
                cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
                backgroundColor: loading || !query.trim() ? '#d1d5db' : 
                  apiStatus === 'connected' ? '#2563eb' : '#f59e0b',
                color: loading || !query.trim() ? '#6b7280' : 'white'
              }}
              title={apiStatus === 'disconnected' ? 'API server is offline. Will use fallback data.' : ''}
            >
              {loading ? (
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <div style={{
                    animation: 'spin 1s linear infinite',
                    borderRadius: '50%',
                    height: '16px',
                    width: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    marginRight: '8px'
                  }}></div>
                  Analyzing...
                </div>
              ) : (
                apiStatus === 'connected' ? 'Run Analysis' : 'Run Analysis (Fallback)'
              )}
            </button>
          </div>
        </div>

        {apiStatus === 'disconnected' && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{display: 'flex', alignItems: 'flex-start'}}>
              <span style={{fontSize: '20px', marginRight: '12px'}}>⚠️</span>
              <div style={{flex: 1}}>
                <h4 style={{margin: '0', color: '#92400e', fontSize: '16px'}}>API Server Offline</h4>
                <p style={{margin: '8px 0', color: '#92400e', fontSize: '14px'}}>
                  To get real Python simulation data, follow these steps:
                </p>
                <ol style={{margin: '8px 0', paddingLeft: '20px', color: '#92400e', fontSize: '14px'}}>
                  <li>Install dependencies: <code style={{backgroundColor: '#fbbf24', padding: '2px 4px', borderRadius: '4px'}}>npm install</code></li>
                  <li>Start API server: <code style={{backgroundColor: '#fbbf24', padding: '2px 4px', borderRadius: '4px'}}>npm run server</code></li>
                  <li>Or run both: <code style={{backgroundColor: '#fbbf24', padding: '2px 4px', borderRadius: '4px'}}>npm run dev:full</code></li>
                </ol>
                <p style={{margin: '8px 0 0 0', color: '#92400e', fontSize: '14px'}}>
                  <strong>For now, the analysis will use demonstration data with the same structure as the real Python backend.</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {resp && (
          <>
            {/* Summary Cards */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px'}}>
              <MetricCard 
                title="Estimated Reach" 
                value={resp.summary.estimated_reach.toLocaleString()} 
                subtitle="P50 forecast"
                icon="📊"
              />
              <MetricCard 
                title="Expected Conversions" 
                value={resp.summary.estimated_conversions} 
                subtitle="Based on 2.5% CVR"
                icon="🎯"
              />
              <MetricCard 
                title="Top Creators" 
                value={resp.summary.selected_creators.length} 
                subtitle="High-scoring influencers"
                icon="⭐"
              />
              <MetricCard 
                title="Confidence Level" 
                value={resp.summary.confidence_level} 
                subtitle="Analysis reliability"
                icon="📈"
              />
            </div>

            {/* Navigation Tabs */}
            <div style={{backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px'}}>
              <div style={{borderBottom: '1px solid #e5e7eb'}}>
                <nav style={{display: 'flex', gap: '32px', padding: '0 24px'}}>
                  {[
                    { id: 'overview', name: 'Overview', icon: '📋' },
                    { id: 'evaluation', name: 'Influencer Evaluation', icon: '🔍' },
                    { id: 'prediction', name: 'Campaign Prediction', icon: '📊' },
                    { id: 'optimization', name: 'Strategy & Optimization', icon: '💡' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        padding: '16px 4px',
                        borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
                        fontWeight: '500',
                        fontSize: '14px',
                        color: activeTab === tab.id ? '#2563eb' : '#6b7280',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{marginRight: '8px'}}>{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div style={{padding: '24px'}}>
                {activeTab === 'overview' && (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                    <div>
                      <h3 style={{fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px'}}>Campaign Summary</h3>
                      <div style={{backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px'}}>
                        <div style={{display: 'flex', alignItems: 'flex-start'}}>
                          <div style={{flexShrink: 0}}>
                            <span style={{fontSize: '24px'}}>🎯</span>
                          </div>
                          <div style={{marginLeft: '12px'}}>
                            <h4 style={{fontSize: '14px', fontWeight: '500', color: '#1e40af'}}>Recommended Strategy</h4>
                            <p style={{fontSize: '14px', color: '#1d4ed8', marginTop: '4px'}}>{resp.summary.top_recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
                      <div>
                        <h4 style={{fontWeight: '500', color: '#111827', marginBottom: '12px'}}>Selected Creators</h4>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                          {resp.evaluation.top.slice(0, 3).map((creator, i) => (
                            <div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px'}}>
                              <div>
                                <div style={{fontWeight: '500', color:'black'}}>{creator.name}</div>
                                <div style={{fontSize: '14px', color: '#6b7280'}}>{creator.handle} • {creator.followers.toLocaleString()} followers</div>
                              </div>
                              <div style={{textAlign: 'right'}}>
                                <div style={{fontSize: '14px', fontWeight: '500', color: '#059669'}}>{creator.composite_score}</div>
                                <div style={{fontSize: '12px', color: '#6b7280'}}>Score</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 style={{fontWeight: '500', color: '#111827', marginBottom: '12px'}}>Key Risks</h4>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                          {resp.summary.key_risks.map((risk, i) => (
                            <div key={i} style={{display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#fefce8', borderRadius: '8px'}}>
                              <span style={{color: '#d97706', marginRight: '8px'}}>⚠️</span>
                              <span style={{fontSize: '14px', color: '#92400e'}}>{risk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'evaluation' && (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <h3 style={{fontSize: '18px', fontWeight: '600', color: '#111827'}}>Influencer Evaluation Results</h3>
                      <span style={{fontSize: '14px', color: '#6b7280'}}>{resp.evaluation.total_evaluated} creators evaluated</span>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                      {resp.evaluation.top.map((creator, i) => (
                        <div key={i} style={{backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
                            <div>
                              <h4 style={{fontSize: '18px', fontWeight: '600', color: '#111827'}}>{creator.name}</h4>
                              <p style={{color: '#6b7280'}}>{creator.handle} • {creator.followers.toLocaleString()} followers</p>
                              <p style={{fontSize: '14px', color: '#6b7280', marginTop: '4px'}}>{creator.notes}</p>
                            </div>
                            <div style={{textAlign: 'right'}}>
                              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#2563eb'}}>{creator.composite_score}</div>
                              <div style={{fontSize: '14px', color: '#6b7280'}}>Composite Score</div>
                            </div>
                          </div>

                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px'}}>
                            <div>
                              <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>Topic Relevance</div>
                              <div style={{fontWeight: '500', marginBottom: '8px'}}>{(creator.topic_score * 100).toFixed(0)}%</div>
                              <ScoreBar score={creator.topic_score * 100} color="#10b981" />
                            </div>
                            <div>
                              <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>Audience Fit</div>
                              <div style={{fontWeight: '500', marginBottom: '8px'}}>{(creator.audience_fit * 100).toFixed(0)}%</div>
                              <ScoreBar score={creator.audience_fit * 100} color="#3b82f6" />
                            </div>
                            <div>
                              <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>Engagement</div>
                              <div style={{fontWeight: '500', marginBottom: '8px'}}>{(creator.engagement_quality * 100).toFixed(1)}%</div>
                              <ScoreBar score={creator.engagement_quality * 100} color="#f59e0b" />
                            </div>
                            <div>
                              <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>Brand Safety</div>
                              <div style={{fontWeight: '500', marginBottom: '8px'}}>
                                <span style={{
                                  padding: '4px 8px',
                                  borderRadius: '9999px',
                                  fontSize: '12px',
                                  backgroundColor: creator.brand_safety === 'clean' ? '#dcfce7' : '#fef3c7',
                                  color: creator.brand_safety === 'clean' ? '#166534' : '#92400e'
                                }}>
                                  {creator.brand_safety}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>Fraud Risk</div>
                              <div style={{fontWeight: '500', marginBottom: '8px'}}>
                                <span style={{
                                  padding: '4px 8px',
                                  borderRadius: '9999px',
                                  fontSize: '12px',
                                  backgroundColor: creator.fraud_risk === 'low' ? '#dcfce7' : 
                                    creator.fraud_risk === 'medium' ? '#fef3c7' : '#fecaca',
                                  color: creator.fraud_risk === 'low' ? '#166534' : 
                                    creator.fraud_risk === 'medium' ? '#92400e' : '#991b1b'
                                }}>
                                  {creator.fraud_risk}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'prediction' && (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                    <h3 style={{fontSize: '18px', fontWeight: '600', color: '#111827'}}>Campaign Forecasts</h3>

                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px'}}>
                      <div style={{backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px'}}>
                        <h4 style={{fontWeight: '500', color: '#1e40af', marginBottom: '12px'}}>Reach Forecast</h4>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontSize: '14px', color: '#1d4ed8'}}>P10 (Conservative)</span>
                            <span style={{fontWeight: '500', color: '#1e40af'}}>{resp.prediction.forecast.reach.p10.toLocaleString()}</span>
                          </div>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontSize: '14px', color: '#1d4ed8'}}>P50 (Expected)</span>
                            <span style={{fontWeight: '500', color: '#1e40af'}}>{resp.prediction.forecast.reach.p50.toLocaleString()}</span>
                          </div>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontSize: '14px', color: '#1d4ed8'}}>P90 (Optimistic)</span>
                            <span style={{fontWeight: '500', color: '#1e40af'}}>{resp.prediction.forecast.reach.p90.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px'}}>
                        <h4 style={{fontWeight: '500', color: '#166534', marginBottom: '12px'}}>Engagement Metrics</h4>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontSize: '14px', color: '#15803d'}}>Expected CTR</span>
                            <span style={{fontWeight: '500', color: '#166534'}}>{(resp.prediction.forecast.ctr.p50 * 100).toFixed(2)}%</span>
                          </div>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontSize: '14px', color: '#15803d'}}>Expected CVR</span>
                            <span style={{fontWeight: '500', color: '#166534'}}>{(resp.prediction.forecast.cvr.p50 * 100).toFixed(2)}%</span>
                          </div>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontSize: '14px', color: '#15803d'}}>Est. CPM</span>
                            <span style={{fontWeight: '500', color: '#166534'}}>₹{resp.prediction.forecast.cpm.p50}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{backgroundColor: '#faf5ff', border: '1px solid #d8b4fe', borderRadius: '8px', padding: '16px'}}>
                        <h4 style={{fontWeight: '500', color: '#7c2d12', marginBottom: '12px'}}>Conversion Forecast</h4>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontSize: '14px', color: '#8b5cf6'}}>Expected Conversions</span>
                            <span style={{fontWeight: '500', color: '#7c2d12'}}>{resp.prediction.forecast.conversions.p50}</span>
                          </div>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontSize: '14px', color: '#8b5cf6'}}>Est. CPC</span>
                            <span style={{fontWeight: '500', color: '#7c2d12'}}>₹{resp.prediction.forecast.cpc.p50}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px'}}>
                      <h4 style={{fontWeight: '500', color: '#111827', marginBottom: '16px'}}>Sensitivity Analysis</h4>
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
                        <div>
                          <h5 style={{fontWeight: '500', color: '#374151', marginBottom: '8px'}}>📈 Creative Quality Uplift</h5>
                          <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px'}}>{resp.prediction.sensitivity_analysis.creative_uplift.description}</p>
                          <div style={{backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '6px'}}>
                            <div style={{fontSize: '14px'}}>
                              <span style={{fontWeight: '500'}}>CTR Impact:</span> {resp.prediction.sensitivity_analysis.creative_uplift.ctr_delta}
                            </div>
                            <div style={{fontSize: '14px'}}>
                              <span style={{fontWeight: '500'}}>Conversion Impact:</span> {resp.prediction.sensitivity_analysis.creative_uplift.conversions_delta}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 style={{fontWeight: '500', color: '#374151', marginBottom: '8px'}}>📉 Budget Reduction Scenario</h5>
                          <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px'}}>{resp.prediction.sensitivity_analysis.budget_reduction.description}</p>
                          <div style={{backgroundColor: '#fefce8', padding: '12px', borderRadius: '6px'}}>
                            <div style={{fontSize: '14px'}}>
                              <span style={{fontWeight: '500'}}>Reach Impact:</span> {resp.prediction.sensitivity_analysis.budget_reduction.reach_delta}
                            </div>
                            <div style={{fontSize: '14px'}}>
                              <span style={{fontWeight: '500'}}>CPA Impact:</span> {resp.prediction.sensitivity_analysis.budget_reduction.cpa_delta}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'optimization' && (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                    <h3 style={{fontSize: '18px', fontWeight: '600', color: '#111827'}}>Strategy & Optimization</h3>

                    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                      <h4 style={{fontWeight: '500', color: '#111827'}}>Priority Recommendations</h4>
                      {resp.optimization.prioritized.map((rec, i) => (
                        <div key={i} style={{backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
                            <div style={{flex: 1}}>
                              <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                                <span style={{fontWeight: '600', color: '#111827', marginRight: '8px'}}>{rec.lever}</span>
                                <span style={{
                                  padding: '4px 8px',
                                  borderRadius: '9999px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  backgroundColor: rec.effort === 'S' ? '#dcfce7' : rec.effort === 'M' ? '#fef3c7' : '#fecaca',
                                  color: rec.effort === 'S' ? '#166534' : rec.effort === 'M' ? '#92400e' : '#991b1b'
                                }}>
                                  {rec.effort === 'S' ? 'Small' : rec.effort === 'M' ? 'Medium' : 'Large'} Effort
                                </span>
                                <span style={{
                                  padding: '4px 8px',
                                  borderRadius: '9999px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  marginLeft: '8px',
                                  backgroundColor: rec.confidence === 'High' ? '#dbeafe' : '#f3f4f6',
                                  color: rec.confidence === 'High' ? '#1e40af' : '#374151'
                                }}>
                                  {rec.confidence} Confidence
                                </span>
                              </div>
                              <p style={{color: '#374151', marginBottom: '8px'}}>{rec.action}</p>
                              <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px'}}>{rec.rationale}</p>
                              <div style={{display: 'flex', alignItems: 'center', fontSize: '14px'}}>
                                <span style={{fontWeight: '500', color: '#059669', marginRight: '16px'}}>{rec.impact} {rec.kpi_impact}</span>
                                <span style={{color: '#6b7280'}}>Owner: {rec.owner}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px'}}>
                      <h4 style={{fontWeight: '500', color: '#111827', marginBottom: '16px'}}>📋 Creative Test Plan</h4>
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
                        <div>
                          <h5 style={{fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Test Structure</h5>
                          <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '12px'}}>{resp.optimization.test_plan.structure}</p>
                          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                            <div>
                              <span style={{fontWeight: '500', fontSize: '14px'}}>Creatives:</span>
                              <div style={{fontSize: '14px', color: '#6b7280'}}>{resp.optimization.test_plan.creatives.join(', ')}</div>
                            </div>
                            <div>
                              <span style={{fontWeight: '500', fontSize: '14px'}}>Hooks:</span>
                              <div style={{fontSize: '14px', color: '#6b7280'}}>{resp.optimization.test_plan.hooks.join(', ')}</div>
                            </div>
                            <div>
                              <span style={{fontWeight: '500', fontSize: '14px'}}>CTAs:</span>
                              <div style={{fontSize: '14px', color: '#6b7280'}}>{resp.optimization.test_plan.ctas.join(', ')}</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 style={{fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Success Metrics</h5>
                          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                              <span style={{fontSize: '14px', color: '#6b7280'}}>Primary (CTR):</span>
                              <span style={{fontSize: '14px', fontWeight: '500'}}>{resp.optimization.test_plan.success_metrics.primary}</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                              <span style={{fontSize: '14px', color: '#6b7280'}}>Secondary (CVR):</span>
                              <span style={{fontSize: '14px', fontWeight: '500'}}>{resp.optimization.test_plan.success_metrics.secondary}</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                              <span style={{fontSize: '14px', color: '#6b7280'}}>Engagement:</span>
                              <span style={{fontSize: '14px', fontWeight: '500'}}>{resp.optimization.test_plan.success_metrics.engagement}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '24px'}}>
                      <h4 style={{fontWeight: '500', color: '#991b1b', marginBottom: '16px'}}>⚡ Performance Monitoring</h4>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                        <div>
                          <span style={{fontWeight: '500', fontSize: '14px', color: '#b91c1c'}}>Week 1 Benchmarks:</span>
                          <div style={{fontSize: '14px', color: '#dc2626', marginTop: '4px'}}>
                            CPM ≤ ₹{resp.optimization.performance_management.thresholds.week_1_benchmarks.cpm_threshold} • 
                            CTR ≥ {(resp.optimization.performance_management.thresholds.week_1_benchmarks.ctr_minimum * 100).toFixed(1)}% • 
                            CVR ≥ {(resp.optimization.performance_management.thresholds.week_1_benchmarks.cvr_minimum * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <span style={{fontWeight: '500', fontSize: '14px', color: '#b91c1c'}}>Monitoring Frequency:</span>
                          <div style={{fontSize: '14px', color: '#dc2626'}}>{resp.optimization.performance_management.monitoring_frequency}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
