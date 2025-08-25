# marketmuse_sim.py
# Enhanced MarketMuse Multi-Agent System Simulation
import json
from datetime import datetime

# Enhanced influencer data with more detailed metrics
INFLUENCERS = [
  {"id": 1, "name": "EcoGlow", "handle": "@ecoglow", "platform": "instagram", 
   "followers": 54000, "er": 0.048, "topics": ["skincare","sustainable","cruelty-free"],
   "aud": {"13-17":0.18, "18-24":0.56, "25-34":0.18, "35+":0.08}, 
   "geo": {"US": 0.45, "CA": 0.15, "UK": 0.20, "AU": 0.10, "other": 0.10},
   "safety": "clean", "history": {"reel":0.12,"static":0.04,"story":0.08,"avg_views":8500},
   "fraud_indicators": {"spike_frequency": 0.02, "bot_ratio": 0.05, "repetitive_comments": 0.03}},
  
  {"id": 2, "name": "DermGenZ", "handle": "@dermgenz", "platform": "instagram",
   "followers": 88000, "er": 0.041, "topics": ["dermatology","skincare","science"],
   "aud": {"13-17":0.12, "18-24":0.52, "25-34":0.24, "35+":0.12},
   "geo": {"US": 0.50, "CA": 0.12, "UK": 0.18, "AU": 0.08, "other": 0.12},
   "safety": "clean", "history": {"reel":0.10,"static":0.03,"story":0.06,"avg_views":7200},
   "fraud_indicators": {"spike_frequency": 0.01, "bot_ratio": 0.03, "repetitive_comments": 0.02}},
   
  {"id": 3, "name": "PlanetSkin", "handle": "@planetskin", "platform": "instagram",
   "followers": 32000, "er": 0.055, "topics": ["eco","skincare","sustainable","zero-waste"],
   "aud": {"13-17":0.20, "18-24":0.58, "25-34":0.15, "35+":0.07},
   "geo": {"US": 0.40, "CA": 0.18, "UK": 0.22, "AU": 0.12, "other": 0.08},
   "safety": "clean", "history": {"reel":0.13,"static":0.05,"story":0.09,"avg_views":6800},
   "fraud_indicators": {"spike_frequency": 0.015, "bot_ratio": 0.04, "repetitive_comments": 0.025}},
   
  {"id": 4, "name": "GlowNGo", "handle": "@glowngo", "platform": "instagram",
   "followers": 120000, "er": 0.028, "topics": ["beauty","lifestyle"],
   "aud": {"13-17":0.08, "18-24":0.40, "25-34":0.36, "35+":0.16},
   "geo": {"US": 0.55, "CA": 0.10, "UK": 0.15, "AU": 0.08, "other": 0.12},
   "safety": "minor-flags", "history": {"reel":0.09,"static":0.03,"story":0.05,"avg_views":9200},
   "fraud_indicators": {"spike_frequency": 0.08, "bot_ratio": 0.12, "repetitive_comments": 0.15}},
   
  {"id": 5, "name": "CleanBeautyBae", "handle": "@cleanbeautybae", "platform": "instagram",
   "followers": 67000, "er": 0.052, "topics": ["clean-beauty","skincare","sustainable"],
   "aud": {"13-17":0.22, "18-24":0.61, "25-34":0.12, "35+":0.05},
   "geo": {"US": 0.42, "CA": 0.16, "UK": 0.19, "AU": 0.11, "other": 0.12},
   "safety": "clean", "history": {"reel":0.14,"static":0.06,"story":0.10,"avg_views":7800},
   "fraud_indicators": {"spike_frequency": 0.02, "bot_ratio": 0.04, "repetitive_comments": 0.03}},
   
  {"id": 6, "name": "SustainableSkinBae", "handle": "@sustskinbae", "platform": "instagram",
   "followers": 43000, "er": 0.061, "topics": ["sustainable","skincare","eco-friendly","dermatologist-tested"],
   "aud": {"13-17":0.25, "18-24":0.55, "25-34":0.14, "35+":0.06},
   "geo": {"US": 0.38, "CA": 0.20, "UK": 0.24, "AU": 0.10, "other": 0.08},
   "safety": "clean", "history": {"reel":0.15,"static":0.07,"story":0.11,"avg_views":6900},
   "fraud_indicators": {"spike_frequency": 0.01, "bot_ratio": 0.03, "repetitive_comments": 0.02}},

  {"id": 7, "name": "HolisticBeautyDoc", "handle": "@holisticbeautydoc", "platform": "instagram",
   "followers": 92000, "er": 0.039, "topics": ["holistic-beauty","dermatology","natural-skincare","wellness"],
   "aud": {"13-17":0.10, "18-24":0.45, "25-34":0.35, "35+":0.10},
   "geo": {"US": 0.48, "CA": 0.15, "UK": 0.22, "AU": 0.08, "other": 0.07},
   "safety": "clean", "history": {"reel":0.11,"static":0.04,"story":0.08,"avg_views":8800},
   "fraud_indicators": {"spike_frequency": 0.02, "bot_ratio": 0.04, "repetitive_comments": 0.02}},

  {"id": 8, "name": "OrganicGlowGuru", "handle": "@organicglowguru", "platform": "instagram",
   "followers": 38000, "er": 0.058, "topics": ["organic-beauty","vegan","clean-beauty","mindful-skincare"],
   "aud": {"13-17":0.20, "18-24":0.58, "25-34":0.16, "35+":0.06},
   "geo": {"US": 0.40, "CA": 0.18, "UK": 0.25, "AU": 0.12, "other": 0.05},
   "safety": "clean", "history": {"reel":0.14,"static":0.06,"story":0.10,"avg_views":5900},
   "fraud_indicators": {"spike_frequency": 0.01, "bot_ratio": 0.03, "repetitive_comments": 0.02}},

  {"id": 9, "name": "SkinScientist", "handle": "@skinscientist", "platform": "instagram",
   "followers": 150000, "er": 0.035, "topics": ["skincare-science","clinical-research","evidence-based"],
   "aud": {"13-17":0.05, "18-24":0.35, "25-34":0.45, "35+":0.15},
   "geo": {"US": 0.52, "CA": 0.12, "UK": 0.20, "AU": 0.08, "other": 0.08},
   "safety": "clean", "history": {"reel":0.09,"static":0.04,"story":0.07,"avg_views":11000},
   "fraud_indicators": {"spike_frequency": 0.02, "bot_ratio": 0.04, "repetitive_comments": 0.03}},

  {"id": 10, "name": "ZeroWasteBeauty", "handle": "@zerowaste.beauty", "platform": "instagram",
   "followers": 29000, "er": 0.067, "topics": ["zero-waste","sustainable","eco-packaging","natural-beauty"],
   "aud": {"13-17":0.22, "18-24":0.60, "25-34":0.13, "35+":0.05},
   "geo": {"US": 0.35, "CA": 0.25, "UK": 0.20, "AU": 0.15, "other": 0.05},
   "safety": "clean", "history": {"reel":0.16,"static":0.07,"story":0.12,"avg_views":4800},
   "fraud_indicators": {"spike_frequency": 0.01, "bot_ratio": 0.02, "repetitive_comments": 0.01}}
]

# Campaign benchmarks for different verticals and seasons
CAMPAIGN_HISTORY = [
  {"id": 1, "vertical": "skincare", "season": "winter", "post_type": "reel", "avg_cpm": 8.5, "avg_ctr": 0.014, "avg_cvr": 0.025},
  {"id": 2, "vertical": "skincare", "season": "summer", "post_type": "reel", "avg_cpm": 7.2, "avg_ctr": 0.016, "avg_cvr": 0.028},
  {"id": 3, "vertical": "beauty", "season": "winter", "post_type": "static", "avg_cpm": 6.8, "avg_ctr": 0.008, "avg_cvr": 0.018}
]

# Evaluation weights for composite scoring
WEIGHTS = {"relevance":0.35,"audience":0.30,"engagement":0.20,"safety":0.10,"consistency":0.05}

def decompose(query: str):
    """Extract key parameters from query and set up task structure"""
    # Simple keyword extraction - in production would use NLP
    is_micro = "micro" in query.lower() or "10k" in query or "100k" in query
    is_sustainable = "sustainable" in query.lower() or "eco" in query.lower()
    is_genz = "gen z" in query.lower() or "genz" in query.lower()
    
    return {
        "evaluate": {
            "vertical": "skincare" if "skincare" in query.lower() else "beauty",
            "audience": "genz" if is_genz else "general",
            "tier": "micro" if is_micro else "mixed",
            "sustainability_focus": is_sustainable
        },
        "predict": {
            "duration_weeks": 3,
            "posts_per_creator": 2,
            "stories_per_creator": 2,
            "baseline_cvr": 0.025,
            "season": "winter"  # Could be extracted from timing
        },
        "optimize": {
            "budget_inr": 500000,
            "target_unique_reach": 0.80
        }
    }

def eval_agent(task):
    """Influencer Evaluation Agent - scores and ranks influencers"""
    results = []
    
    for inf in INFLUENCERS:
        # Topic relevance scoring
        topic_match_count = 0
        sustainability_bonus = 0
        
        if task["vertical"] == "skincare":
            if "skincare" in inf["topics"]:
                topic_match_count += 2
            if "dermatology" in inf["topics"]:
                topic_match_count += 1.5
        elif task["vertical"] == "beauty":
            if "beauty" in inf["topics"]:
                topic_match_count += 2
            if "skincare" in inf["topics"]:
                topic_match_count += 1
                
        if task.get("sustainability_focus", False):
            sustainability_topics = ["sustainable", "eco", "eco-friendly", "cruelty-free", "clean-beauty", "zero-waste"]
            sustainability_bonus = sum(0.3 for topic in sustainability_topics if topic in inf["topics"])
            
        relevance_score = min(1.0, (topic_match_count * 0.3 + sustainability_bonus))
        
        # Audience fit for Gen Z (16-26, focusing on 18-24)
        if task["audience"] == "genz":
            genz_core = inf["aud"]["18-24"]  # Core Gen Z
            genz_extended = inf["aud"]["13-17"] * 0.7  # Younger Gen Z
            penalty = inf["aud"]["35+"] * 0.5  # Penalty for older audience
            audience_fit = genz_core + genz_extended - penalty
        else:
            audience_fit = inf["aud"]["18-24"] + inf["aud"]["25-34"] * 0.8
            
        audience_fit = max(0, min(1, audience_fit))
        
        # Engagement quality (normalized ER)
        engagement_quality = min(1.0, inf["er"] / 0.06)  # Normalize against 6% as excellent
        
        # Brand safety scoring
        safety_score = 1.0 if inf["safety"] == "clean" else 0.7 if inf["safety"] == "minor-flags" else 0.3
        
        # Consistency (based on reel performance)
        consistency_score = min(1.0, inf["history"]["reel"] / 0.15)
        
        # Fraud risk assessment
        fraud_indicators = inf["fraud_indicators"]
        fraud_risk_score = (
            fraud_indicators["spike_frequency"] * 0.4 +
            fraud_indicators["bot_ratio"] * 0.4 +
            fraud_indicators["repetitive_comments"] * 0.2
        )
        
        if fraud_risk_score > 0.1:
            fraud_risk = "high"
            safety_score *= 0.5
        elif fraud_risk_score > 0.05:
            fraud_risk = "medium"
            safety_score *= 0.8
        else:
            fraud_risk = "low"
            
        # Composite score calculation
        composite = 100 * (
            WEIGHTS["relevance"] * relevance_score +
            WEIGHTS["audience"] * audience_fit +
            WEIGHTS["engagement"] * engagement_quality +
            WEIGHTS["safety"] * safety_score +
            WEIGHTS["consistency"] * consistency_score
        )
        
        # Brand value alignment for sustainability
        alignment_topics = ["sustainable", "cruelty-free", "dermatologist-tested", "eco-friendly", "clean-beauty"]
        alignment_score = sum(0.25 for topic in alignment_topics if topic in inf["topics"])
        
        results.append({
            "candidate_id": inf["id"],
            "name": inf["name"],
            "handle": inf["handle"],
            "composite_score": round(composite, 2),
            "topic_score": round(relevance_score, 2),
            "audience_fit": round(audience_fit, 2),
            "engagement_quality": inf["er"],
            "brand_safety": inf["safety"],
            "fraud_risk": fraud_risk,
            "alignment_score": round(alignment_score, 2),
            "followers": inf["followers"],
            "notes": f"Strong in {', '.join(inf['topics'][:2])}" if len(inf['topics']) > 0 else "General content"
        })
    
    # Sort by composite score and take top performers
    results.sort(key=lambda x: x["composite_score"], reverse=True)
    top_results = results[:6]  # Top 6 for analysis
    
    # Calculate audience overlap matrix for top performers
    overlap_matrix = calculate_overlap_matrix([r["candidate_id"] for r in top_results])
    
    return {
        "top": top_results,
        "overlap_matrix": overlap_matrix,
        "overlap_factor": 0.18,  # Average overlap estimate
        "total_evaluated": len(results)
    }

def calculate_overlap_matrix(creator_ids):
    """Calculate audience overlap between creators"""
    matrix = {}
    for i, id1 in enumerate(creator_ids):
        matrix[id1] = {}
        for id2 in creator_ids:
            if id1 == id2:
                matrix[id1][id2] = 1.0
            else:
                # Simulate overlap based on topic similarity
                inf1 = next(inf for inf in INFLUENCERS if inf["id"] == id1)
                inf2 = next(inf for inf in INFLUENCERS if inf["id"] == id2)
                
                common_topics = set(inf1["topics"]) & set(inf2["topics"])
                topic_overlap = len(common_topics) / max(len(inf1["topics"]), len(inf2["topics"]))
                
                # Add geographic and demographic overlap factors
                geo_overlap = sum(min(inf1["geo"][region], inf2["geo"][region]) for region in inf1["geo"])
                demo_overlap = sum(min(inf1["aud"][age], inf2["aud"][age]) for age in inf1["aud"])
                
                total_overlap = (topic_overlap * 0.4 + geo_overlap * 0.3 + demo_overlap * 0.3)
                matrix[id1][id2] = round(total_overlap, 3)
    
    return matrix

def predict_agent(task, eval_out):
    """Campaign Prediction Agent - forecasts KPIs with uncertainty bounds"""
    creators = eval_out["top"][:6]  # Work with top 6 creators
    
    # Base reach calculation per creator
    total_reach_p50 = 0
    reach_breakdown = []
    
    for creator in creators:
        inf = next(i for i in INFLUENCERS if i["id"] == creator["candidate_id"])
        
        # Base reach per post (followers * organic reach rate)
        base_reach_rate = 0.45 + (inf["er"] - 0.03) * 2  # ER influences reach
        base_reach_rate = max(0.2, min(0.8, base_reach_rate))  # Clamp between 20-80%
        
        # Adjust for content type
        reel_multiplier = 1.4  # Reels get better reach
        story_multiplier = 0.6  # Stories have lower reach but good engagement
        
        posts_reach = inf["followers"] * base_reach_rate * reel_multiplier * task["posts_per_creator"]
        stories_reach = inf["followers"] * base_reach_rate * story_multiplier * task["stories_per_creator"]
        
        creator_total_reach = posts_reach + stories_reach
        total_reach_p50 += creator_total_reach
        
        reach_breakdown.append({
            "creator": creator["name"],
            "reach": int(creator_total_reach),
            "posts_reach": int(posts_reach),
            "stories_reach": int(stories_reach)
        })
    
    # Apply audience overlap deduplication
    overlap_factor = eval_out["overlap_factor"]
    unique_reach_p50 = total_reach_p50 * (1 - 0.5 * overlap_factor)
    
    # Get seasonal and vertical benchmarks
    benchmark = next((b for b in CAMPAIGN_HISTORY if b["vertical"] == task.get("vertical", "skincare") 
                     and b["season"] == task.get("season", "winter")), CAMPAIGN_HISTORY[0])
    
    # CTR calculation with creative quality assumptions
    base_ctr = benchmark["avg_ctr"]
    
    # Sustainability hook uplift for Gen Z
    sustainability_uplift = 0.003 if task.get("sustainability_focus", False) else 0
    creative_quality_uplift = 0.002  # Assume good creative execution
    
    ctr_p50 = base_ctr + sustainability_uplift + creative_quality_uplift
    
    # CVR from baseline with landing page optimizations
    cvr_p50 = task["baseline_cvr"]
    
    # Calculate downstream metrics
    clicks_p50 = unique_reach_p50 * ctr_p50
    conversions_p50 = clicks_p50 * cvr_p50
    
    # CPM and CPC calculations
    total_budget = task.get("budget_inr", 500000)
    cpm_p50 = benchmark["avg_cpm"]
    cpc_p50 = cpm_p50 / (ctr_p50 * 1000)
    
    # Uncertainty bounds (P10/P90)
    uncertainty_factor = 0.25  # ±25% uncertainty
    
    # Sensitivity analysis scenarios
    scenarios = {
        "base": {
            "reach": {"p10": int(unique_reach_p50 * (1 - uncertainty_factor)), 
                     "p50": int(unique_reach_p50), 
                     "p90": int(unique_reach_p50 * (1 + uncertainty_factor))},
            "ctr": {"p50": round(ctr_p50, 4)},
            "cvr": {"p50": round(cvr_p50, 4)},
            "conversions": {"p50": int(conversions_p50)},
            "cpm": {"p50": round(cpm_p50, 2)},
            "cpc": {"p50": round(cpc_p50, 2)}
        },
        "creative_uplift": {
            "description": "+20% creative quality improvement",
            "ctr_delta": "+15%",
            "conversions_delta": f"+{int(conversions_p50 * 0.15)}"
        },
        "budget_reduction": {
            "description": "-15% budget scenario",
            "reach_delta": "-12%",
            "cpa_delta": "+8%"
        }
    }
    
    # Mix comparison: 6 micros vs 2 mid-tier + 4 micros
    mix_comparison = {
        "scenario_a": {
            "description": "6 micro-creators (current)",
            "reach": int(unique_reach_p50),
            "cost_efficiency": "High",
            "authenticity": "High",
            "risk": "Low - diverse portfolio"
        },
        "scenario_b": {
            "description": "2 mid-tier + 4 micro creators",
            "reach": int(unique_reach_p50 * 1.3),  # Higher reach but more overlap
            "cost_efficiency": "Medium",
            "authenticity": "Medium",
            "risk": "Medium - concentration risk"
        }
    }
    
    return {
        "forecast": scenarios["base"],
        "reach_breakdown": reach_breakdown,
        "sensitivity_analysis": {
            "creative_uplift": scenarios["creative_uplift"],
            "budget_reduction": scenarios["budget_reduction"]
        },
        "mix_comparison": mix_comparison,
        "assumptions": {
            "duplication_factor": overlap_factor,
            "hook_uplift_ctr": sustainability_uplift,
            "creative_uplift_ctr": creative_quality_uplift,
            "baseline_reach_rate": "45-80% depending on ER",
            "seasonality": f"Winter skincare campaign ({task.get('season', 'winter')})",
            "uncertainty_bounds": f"±{uncertainty_factor*100}%"
        }
    }

def optimize_agent(task, eval_out, pred_out):
    """Optimization Strategy Agent - provides actionable recommendations"""
    
    # Analyze current creator mix for optimization opportunities
    top_creators = eval_out["top"][:6]
    high_performers = [c for c in top_creators if c["composite_score"] > 75]
    medium_performers = [c for c in top_creators if 60 <= c["composite_score"] <= 75]
    
    # Calculate unique reach efficiency
    total_reach = pred_out["forecast"]["reach"]["p50"]
    overlap_matrix = eval_out["overlap_matrix"]
    
    recommendations = []
    
    # 1. Creator Selection Optimization
    if len(high_performers) >= 3:
        recommendations.append({
            "lever": "Creator Mix",
            "action": f"Prioritize top 3 performers: {', '.join([c['name'] for c in high_performers[:3]])}. Target 80%+ unique reach.",
            "rationale": f"Top performers show {high_performers[0]['composite_score']:.1f}+ composite scores with strong Gen Z alignment",
            "impact": "↑unique reach",
            "kpi_impact": f"+{int(total_reach * 0.12):,} incremental reach",
            "effort": "S",
            "confidence": "High",
            "owner": "Campaign Manager"
        })
    
    # 2. Creative Strategy Optimization
    creative_strategy = {
        "hooks": ["Refillable packaging demo", "Before/after skin transformation"],
        "ctas": ["Try eco-mini starter kit", "Get your skin assessment"],
        "content_types": ["Reel", "Carousel", "Story"]
    }
    
    recommendations.append({
        "lever": "Creative",
        "action": "Lead with refillable packaging demo in first 2s; A/B test 'Try eco-mini' vs 'Get assessment' CTAs",
        "rationale": "Gen Z responds 40% better to sustainability messaging and interactive CTAs",
        "impact": "↑CTR",
        "kpi_impact": f"+{int(pred_out['forecast']['conversions']['p50'] * 0.15)} conversions",
        "effort": "S",
        "confidence": "Medium",
        "owner": "Creative Team"
    })
    
    # 3. Landing Page Optimization
    recommendations.append({
        "lever": "Landing",
        "action": "Add UPI express checkout + customer reviews section + ingredient transparency",
        "rationale": "Gen Z values transparency and seamless mobile experience",
        "impact": "↑CVR",
        "kpi_impact": f"+{pred_out['forecast']['cvr']['p50'] * 0.2:.1%} CVR improvement",
        "effort": "M",
        "confidence": "High",
        "owner": "Product Team"
    })
    
    # 4. Timing and Posting Strategy
    recommendations.append({
        "lever": "Timing",
        "action": "Post Reels 6-8PM IST, Stories 10-11AM. Front-load week 1 with 60% of content",
        "rationale": "Peak Gen Z engagement windows and early momentum building",
        "impact": "↑engagement",
        "kpi_impact": "+12% engagement rate",
        "effort": "S",
        "confidence": "Medium",
        "owner": "Social Media Manager"
    })
    
    # 5. Budget Allocation Optimization
    budget = task.get("budget_inr", 500000)
    recommendations.append({
        "lever": "Budget",
        "action": f"Allocate 70% to top 3 creators, 30% to testing. Reserve ₹{int(budget * 0.15):,} for performance scaling",
        "rationale": "Focus spend on proven performers while maintaining test budget",
        "impact": "↓CPA",
        "kpi_impact": f"-15% CPA vs equal distribution",
        "effort": "S",
        "confidence": "High",
        "owner": "Performance Marketing"
    })
    
    # Test Plan for Creative Optimization
    test_plan = {
        "description": "Gen Z Sustainable Skincare Creative Test Matrix",
        "structure": "3 creatives × 2 hooks × 2 CTAs = 12 variants",
        "creatives": ["Refillable demo", "Ingredient spotlight", "Before/after transformation"],
        "hooks": ["First 2s product reveal", "Problem/solution narrative"],
        "ctas": ["Try eco-mini kit", "Get personalized routine"],
        "success_metrics": {
            "primary": "CTR > 1.8%",
            "secondary": "CVR > 2.8%", 
            "engagement": "ER > 5.5%"
        },
        "learning_goals": [
            "Which sustainability angle resonates most",
            "Effectiveness of product demos vs transformations",
            "CTA preference for Gen Z audience"
        ]
    }
    
    # Brand Safety and Compliance
    brand_safety_guidelines = {
        "disclosure_requirements": [
            "Use #ad or #sponsored in first line",
            "Clear product mention within first 15 seconds",
            "Honest opinion disclaimer for reviews"
        ],
        "content_moderation": [
            "Pre-approve all captions and key talking points",
            "Monitor comments for negative sentiment (respond within 2 hours)",
            "Escalation protocol for brand safety issues"
        ],
        "authenticity_maintenance": [
            "Allow creator's natural voice and style",
            "Encourage genuine product trial before posting",
            "Avoid overly scripted content"
        ]
    }
    
    # Rapid iteration rules
    performance_thresholds = {
        "week_1_benchmarks": {
            "cpm_threshold": 12.0,  # INR
            "ctr_minimum": 0.012,
            "cvr_minimum": 0.022
        },
        "go_no_go_criteria": {
            "continue_if": "CTR > 1.2% AND CVR > 2.2% AND no brand safety issues",
            "pause_if": "CPM > ₹15 OR CTR < 1.0% OR negative sentiment > 20%",
            "scale_if": "CTR > 1.8% AND CVR > 2.8% AND positive sentiment > 70%"
        },
        "optimization_triggers": {
            "creative_refresh": "If CTR drops 25% week-over-week",
            "audience_adjustment": "If CPM increases 30% above benchmark",
            "budget_reallocation": "If top performer shows 2x better CPA"
        }
    }
    
    # Prioritize recommendations by impact and effort
    recommendations.sort(key=lambda x: {"S": 1, "M": 2, "L": 3}[x["effort"]])
    
    return {
        "prioritized": recommendations,
        "test_plan": test_plan,
        "brand_safety": brand_safety_guidelines,
        "performance_management": {
            "thresholds": performance_thresholds,
            "monitoring_frequency": "Daily for first week, then weekly",
            "optimization_cycle": "72-hour response window for underperformance"
        },
        "contingency_plans": [
            {
                "scenario": "Low performance week 1",
                "action": "Shift budget to top 2 performers, refresh creative with stronger hook",
                "timeline": "24-48 hours"
            },
            {
                "scenario": "High CPM inflation",
                "action": "Pause underperformers, negotiate better rates with top creators",
                "timeline": "Immediate"
            }
        ]
    }

def run(query: str):
    """Main orchestrator function - coordinates all agents"""
    print(f"🚀 MarketMuse Analysis Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📝 Query: {query}\n")
    
    # Decompose query into structured tasks
    plan = decompose(query)
    print("📋 Task Decomposition:")
    print(f"   • Vertical: {plan['evaluate']['vertical']}")
    print(f"   • Audience: {plan['evaluate']['audience']}")
    print(f"   • Tier: {plan['evaluate']['tier']}")
    print(f"   • Sustainability Focus: {plan['evaluate']['sustainability_focus']}")
    print(f"   • Campaign Duration: {plan['predict']['duration_weeks']} weeks")
    print(f"   • Budget: ₹{plan['optimize']['budget_inr']:,}\n")
    
    # Execute agents in sequence
    print("🔍 Running Influencer Evaluation Agent...")
    eval_output = eval_agent(plan["evaluate"])
    print(f"   ✓ Evaluated {eval_output['total_evaluated']} influencers")
    print(f"   ✓ Top performer: {eval_output['top'][0]['name']} (Score: {eval_output['top'][0]['composite_score']})")
    
    print("\n📊 Running Campaign Prediction Agent...")
    pred_output = predict_agent(plan["predict"], eval_output)
    print(f"   ✓ Forecast reach: {pred_output['forecast']['reach']['p50']:,}")
    print(f"   ✓ Expected conversions: {pred_output['forecast']['conversions']['p50']}")
    
    print("\n💡 Running Optimization Strategy Agent...")
    opt_output = optimize_agent(plan["optimize"], eval_output, pred_output)
    print(f"   ✓ Generated {len(opt_output['prioritized'])} recommendations")
    print(f"   ✓ Top priority: {opt_output['prioritized'][0]['lever']}")
    
    # Compile final results
    final_output = {
        "query": query,
        "timestamp": datetime.now().isoformat(),
        "evaluation": eval_output,
        "prediction": pred_output,
        "optimization": opt_output,
        "summary": {
            "selected_creators": [c["name"] for c in eval_output["top"][:3]],
            "estimated_reach": pred_output["forecast"]["reach"]["p50"],
            "estimated_conversions": pred_output["forecast"]["conversions"]["p50"],
            "top_recommendation": opt_output["prioritized"][0]["action"],
            "confidence_level": "Medium-High",
            "key_risks": ["Audience overlap", "Creative fatigue", "Seasonal competition"]
        }
    }
    
    print(f"\n✅ Analysis Complete! Top 3 creators: {', '.join(final_output['summary']['selected_creators'])}")
    return final_output

if __name__ == "__main__":
    # Test with the brief scenario
    test_query = "Identify the optimal influencers and predict campaign outcomes for launching a new sustainable skincare brand targeting Gen Z audiences"
    
    result = run(test_query)
    
    print("\n" + "="*80)
    print("📋 MARKETMUSE ANALYSIS RESULTS")
    print("="*80)
    
    # Print compact JSON for UI integration
    compact_result = {
        "evaluation": result["evaluation"],
        "prediction": result["prediction"], 
        "optimization": result["optimization"]
    }
    
    print(json.dumps(compact_result, indent=2))
