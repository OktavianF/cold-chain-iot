import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  status: "normal" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
  subtitle?: string;
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  unit, 
  icon, 
  status, 
  trend, 
  subtitle,
  className 
}: MetricCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-destructive border-destructive/30 bg-destructive/5";
      case "warning":
        return "text-warning border-warning/30 bg-warning/5";
      default:
        return "text-success border-success/30 bg-success/5";
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <Card className={cn(
      "metric-card transition-all duration-300",
      status === "critical" && "metric-card-critical alert-pulse",
      status === "warning" && "metric-card-warning",
      status === "normal" && "metric-card-success",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", getStatusColor(status))}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold text-foreground">
            {value}
          </div>
          {unit && (
            <span className="text-lg text-muted-foreground font-medium">
              {unit}
            </span>
          )}
          {trend && (
            <span className="text-sm text-muted-foreground ml-auto">
              {getTrendIcon(trend)}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        <Badge 
          variant={status === "critical" ? "destructive" : status === "warning" ? "secondary" : "default"}
          className={cn(
            "mt-2 text-xs",
            status === "normal" && "bg-success/10 text-success border-success/20",
            status === "warning" && "bg-warning/10 text-warning border-warning/20"
          )}
        >
          {status === "critical" ? "CRITICAL" : status === "warning" ? "WARNING" : "NORMAL"}
        </Badge>
      </CardContent>
    </Card>
  );
}