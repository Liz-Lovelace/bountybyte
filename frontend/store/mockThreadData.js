export const mockThreadData = {
  'id0': {
    id: 'id0',
    parentReplyId: null,
    userId: 'userid0',
    bodyText: `LMAO`,
      createdAt: 1710000000000,
    },
    'id1': {
      id: 'id1',
      parentReplyId: 'id0',
      userId: 'userid1',
      bodyText: `I agree with your points, especially about sustainability. Here's what we could add:
  
  - Better infrastructure
  - More community involvement
  - Long-term planning
  
  Also, check out this [interesting article](https://example.com) on the topic.`,
      createdAt: 1710000100000,
    },
    'id2': {
      id: 'id2',
      parentReplyId: 'id0',
      userId: 'userid2',
      bodyText: `> Better infrastructure
  > More community involvement
  
  These two points really resonated with me. I've seen similar approaches work in other contexts.
  
  \`\`\`
  Here's an example of how it might work:
  Step 1: Plan
  Step 2: Execute
  Step 3: Review
  \`\`\``,
      createdAt: 1710000200000,
    },
    'id3': {
      id: 'id3',
      parentReplyId: null,
      userId: 'userid3',
      bodyText: `Let me play devil's advocate here:
  
  * What about the cost?
  * How long would implementation take?
  * Who would be responsible?
  
  These are crucial questions we need to address before moving forward.`,
      createdAt: 1710000300000,
    },
    'id4': {
      id: 'id4',
      parentReplyId: 'id3',
      userId: 'userid4',
      bodyText: `I can help address some of these concerns:
  
  1. Regarding costs:
     - Initial investment: ~$X
     - Maintenance: ~$Y/year
     - ROI expected within 2 years
  
  2. Timeline:
     - Phase 1: 3 months
     - Phase 2: 6 months
     - Final implementation: 4 months`,
      createdAt: 1710000400000,
    },
    'id5': {
      id: 'id5',
      parentReplyId: 'id0',
      userId: 'userid5',
      bodyText: `Coming back to the original post, I think we're missing something important:
  
  ### Environmental Impact
  
  We need to consider:
  1. Carbon footprint
  2. Resource usage
  3. Long-term sustainability
  
  *These factors could significantly affect our approach.*`,
      createdAt: 1710000500000,
    },
    'id6': {
      id: 'id6',
      parentReplyId: 'id5',
      userId: 'userid6',
      bodyText: `The environmental impact analysis is spot on! 🌱
  
  Here's some data to support this:
  
  | Factor | Current | Target |
  |--------|---------|--------|
  | CO2    | High    | Low    |
  | Waste  | 20%     | 5%     |
  | Energy | 100kWh  | 50kWh  |
  
  We should definitely prioritize this aspect.`,
      createdAt: 1710000600000,
    },
  'id6': {
    id: 'id6',
    parentReplyId: 'id5',
    userId: 'userid6',
    bodyText: `Here's a Python example of implementing that sustainability tracker:

\`\`\`python
class SustainabilityMetrics:
    def __init__(self):
        self.metrics = {
            'energy_usage': [],
            'waste_produced': [],
            'carbon_footprint': []
        }
    
    def add_measurement(self, metric_type, value, timestamp):
        self.metrics[metric_type].append({
            'value': value,
            'timestamp': timestamp
        })
    
    def get_average(self, metric_type, timeframe='week'):
        relevant_data = self._filter_by_timeframe(
            self.metrics[metric_type], 
            timeframe
        )
        return sum(d['value'] for d in relevant_data) / len(relevant_data)
\`\`\`

This class could help us track the metrics we discussed.`,
    createdAt: 1710000600000,
  },
  'id7': {
    id: 'id7',
    parentReplyId: 'id6',
    userId: 'userid7',
    bodyText: `Great idea! We could also add a SQL schema for storing this data:

\`\`\`sql
CREATE TABLE sustainability_metrics (
    id SERIAL PRIMARY KEY,
    metric_type VARCHAR(50) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location_id INTEGER REFERENCES locations(id),
    notes TEXT,
    CHECK (metric_type IN ('energy_usage', 'waste_produced', 'carbon_footprint'))
);

CREATE INDEX idx_metrics_timestamp ON sustainability_metrics(timestamp);
CREATE INDEX idx_metrics_type ON sustainability_metrics(metric_type);
\`\`\`

And here's a quick CSS snippet for the dashboard:

\`\`\`css
.metrics-dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 2rem;
    background: linear-gradient(to right, #1a1a1a, #2d2d2d);
}

.metric-card {
    border-radius: 8px;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    transition: transform 0.2s ease;
}
\`\`\``,
    createdAt: 1710000700000,
  },
  'id8': {
    id: 'id8',
    parentReplyId: 'id7',
    userId: 'userid8',
    bodyText: `We could integrate this with a React component:

\`\`\`jsx
const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/sustainability-metrics', {
          params: { timeframe }
        });
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [timeframe]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="metrics-dashboard">
      {metrics.map(metric => (
        <MetricCard
          key={metric.id}
          data={metric}
          onUpdate={handleMetricUpdate}
        />
      ))}
    </div>
  );
};
\`\`\`

And here's a shell script to automate data collection:

\`\`\`bash
#!/bin/bash

# Collect sustainability metrics
collect_metrics() {
    local metric_type=$1
    local value=$(sensors | grep "$2" | awk '{print $4}')
    
    curl -X POST http://api.example.com/metrics \
        -H "Content-Type: application/json" \
        -d "{
            \"metric_type\": \"$metric_type\",
            \"value\": $value,
            \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"
        }"
}

# Run every hour
while true; do
    collect_metrics "energy_usage" "power"
    collect_metrics "temperature" "temp"
    sleep 3600
done
\`\`\``,
    createdAt: 1710000800000,
  },
  'id9': {
    id: 'id9',
    parentReplyId: 'id8',
    userId: 'userid9',
    bodyText: `Here's a Go service to handle those metrics:

\`\`\`go
package metrics

import (
    "context"
    "time"
    "github.com/jackc/pgx/v4/pgxpool"
)

type MetricsService struct {
    db *pgxpool.Pool
}

type Metric struct {
    ID          int64     \`json:"id"\`
    MetricType  string    \`json:"metric_type"\`
    Value       float64   \`json:"value"\`
    Timestamp   time.Time \`json:"timestamp"\`
    LocationID  int64     \`json:"location_id"\`
}

func (s *MetricsService) StoreMetric(ctx context.Context, m *Metric) error {
    query := \`
        INSERT INTO sustainability_metrics 
        (metric_type, value, timestamp, location_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    \`
    
    return s.db.QueryRow(
        ctx, 
        query,
        m.MetricType,
        m.Value,
        m.Timestamp,
        m.LocationID,
    ).Scan(&m.ID)
}

func (s *MetricsService) GetAverages(
    ctx context.Context,
    timeframe time.Duration,
) (map[string]float64, error) {
    // Implementation here...
}
\`\`\`

And finally, here's some Rust for processing the data:

\`\`\`rust
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use tokio_postgres::{Client, Error};

#[derive(Debug, Serialize, Deserialize)]
struct MetricAnalysis {
    metric_type: String,
    average: f64,
    peak_times: Vec<DateTime<Utc>>,
    trend: TrendDirection,
}

#[derive(Debug, Serialize, Deserialize)]
enum TrendDirection {
    Increasing,
    Decreasing,
    Stable,
}

impl MetricAnalysis {
    async fn analyze_metric(
        client: &Client,
        metric_type: &str,
        days: i32,
    ) -> Result<Self, Error> {
        // Implementation details...
        todo!("Implement metric analysis")
    }

    fn calculate_trend(&self) -> TrendDirection {
        // Implementation details...
        todo!("Implement trend calculation")
    }
}
\`\`\``,
    createdAt: 1710000900000,
  }
};
