# MarketMuse: Multi-Agent Marketing Intelligence System

A comprehensive multi-agent system that evaluates influencers, predicts campaign outcomes, and recommends optimization strategies for influencer marketing campaigns.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python 3.9+ with venv support
- macOS/Linux environment

### Installation & Setup

1. **Install Node.js dependencies:**

   ```bash
   npm install
   ```

2. **Python environment is already configured** with a virtual environment in `.venv/`

3. **Run the complete system:**

   **Option A: Full system with real Python backend (Recommended)**

   ```bash
   # Terminal 1: Start the API server
   npm run server

   # Terminal 2: Start the React frontend
   npm run dev
   ```

   **Option B: Quick start with concurrent servers**

   ```bash
   npm run dev:full
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - API Server: http://localhost:3001

## 🏗️ System Architecture

### Components

1. **Frontend (React)** - Interactive UI for query input and results visualization
2. **API Server (Express.js)** - Bridge between React and Python simulation
3. **Multi-Agent Backend (Python)** - Core intelligence engine with three agents:
   - **Influencer Evaluation Agent** - Scores and ranks influencers
   - **Campaign Prediction Agent** - Forecasts KPIs with uncertainty bounds
   - **Optimization Strategy Agent** - Provides actionable recommendations

### Multi-Agent Flow

```
User Query → API Gateway → Orchestrator → Agents (Parallel/Sequential) → Aggregated Response
```

## 📊 Features

### Influencer Evaluation

- **Scoring Criteria**: Topic relevance (35%), audience fit (30%), engagement quality (20%), brand safety (10%), consistency (5%)
- **Fraud Detection**: Analyzes suspicious engagement patterns
- **Brand Alignment**: Assesses value alignment with sustainability topics
- **Audience Overlap**: Calculates reach overlap between creators

### Campaign Prediction

- **Forecasting**: Reach, CTR, CVR, conversions with P10/P50/P90 bounds
- **Sensitivity Analysis**: Creative quality uplift and budget reduction scenarios
- **Mix Comparison**: Different creator portfolio strategies
- **Seasonal Adjustments**: Winter/summer campaign variations

### Optimization Strategy

- **Prioritized Recommendations**: Effort-based action items with KPI impact
- **Creative Test Plans**: Structured A/B testing matrices
- **Performance Monitoring**: Real-time thresholds and go/no-go criteria
- **Brand Safety**: Compliance and authenticity guidelines

## 🧪 Example Usage

### Sample Query

```
"Identify the optimal influencers and predict campaign outcomes for launching a new sustainable skincare brand targeting Gen Z audiences"
```

### Expected Output Structure

```json
{
  "evaluation": {
    "top": [
      /* ranked influencers with scores */
    ],
    "overlap_matrix": {
      /* audience overlap analysis */
    }
  },
  "prediction": {
    "forecast": {
      /* KPI predictions with uncertainty */
    },
    "sensitivity_analysis": {
      /* scenario modeling */
    }
  },
  "optimization": {
    "prioritized": [
      /* actionable recommendations */
    ],
    "test_plan": {
      /* creative testing strategy */
    },
    "performance_management": {
      /* monitoring framework */
    }
  }
}
```

## 🔧 Configuration

### Python Backend

- **Influencer Database**: `INFLUENCERS` array in `src/marketmuse_sim.py`
- **Scoring Weights**: `WEIGHTS` dictionary for composite scoring
- **Campaign Benchmarks**: `CAMPAIGN_HISTORY` for seasonal baselines

### API Server

- **Port**: 3001 (configurable in `server.js`)
- **CORS**: Enabled for local development
- **Python Path**: Auto-detected virtual environment

## 📁 Project Structure

```
MarketMuse/
├── src/
│   ├── marketmuse_sim.py          # Core multi-agent system
│   ├── MarketMuseUI_Enhanced.jsx  # React frontend
│   ├── App.jsx                    # Main app component
│   └── App.css                    # Styling
├── server.js                      # Express API server
├── package.json                   # Dependencies & scripts
├── vite.config.js                 # Frontend build config
└── README.md                      # This file
```

## 🎯 Key Algorithms

### Composite Scoring Formula

```python
composite_score = (
    0.35 * topic_relevance +
    0.30 * audience_fit +
    0.20 * engagement_quality +
    0.10 * brand_safety +
    0.05 * consistency
) * 100
```

### Reach Calculation

```python
unique_reach = sum(creator_reach) * (1 - 0.5 * overlap_factor)
```

### Fraud Risk Assessment

```python
fraud_score = (
    spike_frequency * 0.4 +
    bot_ratio * 0.4 +
    repetitive_comments * 0.2
)
```

## 🚦 API Status

The UI displays real-time API connection status:

- 🟢 **Connected**: Real Python simulation data
- 🟡 **Checking**: Verifying connection
- 🔴 **Offline**: Using fallback demonstration data

## 🛠️ Development

### Running Individual Components

```bash
# Python simulation only
cd src && python marketmuse_sim.py

# API server only
npm run server

# Frontend only
npm run dev
```

### Testing Different Scenarios

The system includes preset queries for testing:

- Sustainable Skincare (Gen Z)
- Beauty Launch (Micro-Influencers)
- Eco-Friendly Brand Campaign

## 📈 Performance

- **Analysis Time**: 2-5 seconds for complete multi-agent workflow
- **Scalability**: Designed for 10-100 influencer evaluation
- **Accuracy**: Based on industry benchmarks and heuristic models

## 🎨 UI Features

- **Tabbed Interface**: Overview, Evaluation, Prediction, Optimization
- **Real-time Metrics**: Live scoring and forecasting displays
- **Interactive Elements**: Progress bars, status indicators, metric cards
- **Responsive Design**: Works on desktop and mobile devices

## 💡 Future Enhancements

- Real influencer data integration
- Advanced ML models for prediction
- A/B testing framework integration
- Multi-platform support (TikTok, YouTube)
- Real-time campaign monitoring dashboard

---

Built with ❤️ for modern influencer marketing intelligence.
