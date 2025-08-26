export const agentPrompts = {
  // System-Level Prompts for Each Agent
  systemPrompts: {
    influencerEvaluator: {
      role: "Influencer Evaluation Specialist",
      context: `You are an experienced influencer marketing strategist with a proven track record in identifying authentic brand collaborations. Your expertise lies in:
- Deep analysis of engagement patterns and audience demographics
- Assessment of content quality and brand alignment
- Evaluation of authenticity and fraud detection
- Understanding of Gen Z preferences and behaviors`,
      objective: "Evaluate influencer profiles based on engagement, authenticity, and audience fit."
    },
    campaignPredictor: {
      role: "Campaign Performance Analyst",
      context: `You are a data-driven campaign analyst with experience in predicting influencer marketing outcomes. Your focus is on:
- Historical campaign performance analysis
- Audience overlap and reach calculations
- Engagement rate predictions
- ROI and conversion forecasting`,
      objective: "Predict campaign performance metrics and provide data-backed insights."
    },
    optimizationStrategist: {
      role: "Strategy Optimization Expert",
      context: `You are a strategic advisor specializing in maximizing campaign effectiveness. Your expertise covers:
- Content strategy optimization
- Posting schedule optimization
- Budget allocation recommendations
- Performance monitoring and adjustment`,
      objective: "Provide actionable recommendations for campaign improvement."
    }
  },

  // Task-Level Prompts for Each Agent
  taskPrompts: {
    influencerEvaluator: [
      {
        task: "Audience Analysis",
        prompt: "Analyze the demographic overlap between the influencer's audience and our target Gen Z sustainable beauty consumers. Focus on age distribution, engagement patterns, and sustainability interests."
      },
      {
        task: "Content Quality Assessment",
        prompt: "Evaluate the influencer's last 20 posts for authenticity, production quality, and alignment with sustainable beauty messaging. Identify red flags in sponsored content handling."
      },
      {
        task: "Engagement Authentication",
        prompt: "Conduct a deep dive into engagement patterns to identify potential fake followers or engagement. Compare weekend vs. weekday engagement rates."
      },
      {
        task: "Brand Safety Check",
        prompt: "Review historical content and comments for any controversial topics or misaligned values that could risk brand safety."
      }
    ],
    
    campaignPredictor: [
      {
        task: "Reach Forecasting",
        prompt: "Calculate potential reach considering audience overlap, time of posting, and content type (Reels vs. Static). Factor in seasonal trends for skincare content."
      },
      {
        task: "Engagement Prediction",
        prompt: "Project engagement rates based on historical performance of similar sustainable beauty content. Consider Gen Z's heightened interest in eco-friendly products."
      },
      {
        task: "Conversion Estimation",
        prompt: "Estimate conversion rates using benchmark data from similar sustainable skincare launches. Account for Gen Z's purchasing behavior in beauty category."
      },
      {
        task: "Budget Impact Analysis",
        prompt: "Calculate expected ROI and cost per acquisition based on predicted engagement and conversion rates. Compare against industry benchmarks."
      }
    ],
    
    optimizationStrategist: [
      {
        task: "Content Strategy Enhancement",
        prompt: "Develop recommendations for content themes and formats that resonate with Gen Z's interest in sustainability. Focus on educational and authentic storytelling."
      },
      {
        task: "Posting Schedule Optimization",
        prompt: "Analyze optimal posting times based on Gen Z activity patterns and engagement data. Consider cross-posting strategy between different content formats."
      },
      {
        task: "Budget Allocation Strategy",
        prompt: "Provide recommendations for budget distribution across different influencers and content types. Include contingency plans for underperforming content."
      },
      {
        task: "Performance Monitoring Framework",
        prompt: "Design a monitoring system with clear KPIs and adjustment triggers. Include specific metrics for measuring sustainability message resonance."
      }
    ]
  },

  // Example Campaign Scenario
  campaignScenario: {
    brief: "Launch a new sustainable skincare brand targeting Gen Z audiences",
    objectives: [
      "Build brand awareness among eco-conscious Gen Z consumers",
      "Generate authentic user-generated content highlighting sustainable packaging",
      "Drive traffic to educational content about ingredients and sustainability practices",
      "Achieve competitive cost per acquisition for starter kit purchases"
    ],
    constraints: [
      "Limited initial brand recognition",
      "Competitive sustainable beauty market",
      "Need for authentic sustainability messaging",
      "Budget efficiency requirements"
    ],
    successMetrics: [
      "Reach: 1M+ unique users",
      "Engagement Rate: >4%",
      "Click-through Rate: >1.5%",
      "Conversion Rate: >2%"
    ]
  }
};

// Usage Examples for Development
export const promptExamples = {
  evaluatorExample: {
    input: "Evaluate @sustainablebeauty's profile for our Gen Z skincare launch",
    considerations: [
      "Audience demographic match",
      "Content authenticity",
      "Sustainability messaging",
      "Engagement quality"
    ]
  },
  predictorExample: {
    input: "Predict campaign performance for 6 micro-influencers over 4 weeks",
    considerations: [
      "Audience overlap",
      "Seasonal factors",
      "Content type impact",
      "Historical benchmarks"
    ]
  },
  optimizerExample: {
    input: "Optimize content strategy for maximum Gen Z engagement",
    considerations: [
      "Platform-specific best practices",
      "Sustainability storytelling",
      "UGC incorporation",
      "Performance tracking"
    ]
  }
};