import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface AmmoniaGaugeProps {
  value: number; // Current ammonia level in ppm
  maxValue?: number; // Maximum value for the gauge
}

export function AmmoniaGauge({ value, maxValue = 50 }: AmmoniaGaugeProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  // Status based on ammonia levels
  const getStatus = (value: number) => {
    if (value > 25) return { level: "danger", color: "hsl(var(--ammonia-danger))", icon: XCircle };
    if (value > 15) return { level: "caution", color: "hsl(var(--ammonia-caution))", icon: AlertTriangle };
    return { level: "safe", color: "hsl(var(--ammonia-safe))", icon: CheckCircle };
  };

  const status = getStatus(value);
  const StatusIcon = status.icon;

  // Data for the gauge chart
  const data = [
    { name: 'Current', value: percentage },
    { name: 'Remaining', value: 100 - percentage }
  ];

  const COLORS = [status.color, 'hsl(var(--muted))'];

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center justify-between">
          <span>Ammonia Level</span>
          <StatusIcon className={`h-5 w-5`} style={{ color: status.color }} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Gauge Chart */}
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="70%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Value Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
              <div className="text-3xl font-bold text-foreground">
                {value.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">ppm</div>
            </div>
          </div>

          {/* Status Information */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge 
                variant={status.level === "danger" ? "destructive" : status.level === "caution" ? "secondary" : "default"}
                className={`
                  ${status.level === "safe" && "bg-success/10 text-success border-success/20"}
                  ${status.level === "caution" && "bg-warning/10 text-warning border-warning/20"}
                `}
              >
                {status.level.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Threshold:</span>
              <span className="text-sm font-medium text-foreground">25 ppm</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: status.color
                }}
              />
            </div>

            {/* Safety Messages */}
            <div className="text-xs text-muted-foreground text-center mt-2">
              {status.level === "danger" && "⚠️ High ammonia detected! Immediate action required."}
              {status.level === "caution" && "⚡ Elevated ammonia levels. Monitor closely."}
              {status.level === "safe" && "✅ Ammonia levels within safe parameters."}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}