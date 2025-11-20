import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { Thermometer, Droplets, Wind, Bell, Shield, Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import dashboardScreenshot from "@/assets/screenshot-dashboard.png";
import devicesScreenshot from "@/assets/screenshot-devices.png";
import datalogScreenshot from "@/assets/screenshot-datalog.png";
import alertsScreenshot from "@/assets/screenshot-alerts.png";

const LandingPage = () => {
  const features = [
    {
      icon: Thermometer,
      title: "Temperature Monitoring",
      description: "Real-time temperature tracking with instant alerts for any deviations from safe ranges"
    },
    {
      icon: Droplets,
      title: "Humidity Control",
      description: "Monitor humidity levels to ensure optimal storage conditions for sensitive goods"
    },
    {
      icon: Wind,
      title: "Ammonia Detection",
      description: "Advanced sensors detect ammonia gas levels to prevent contamination and ensure safety"
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Automated notifications when critical thresholds are exceeded for immediate action"
    },
    {
      icon: Activity,
      title: "Live Dashboard",
      description: "Comprehensive real-time visualization of all environmental parameters"
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Enterprise-grade security with role-based access control and encrypted data storage"
    }
  ];

  const benefits = [
    "Reduce product spoilage by up to 40%",
    "Ensure compliance with safety regulations",
    "24/7 automated monitoring",
    "Historical data analysis and reporting",
    "Mobile-friendly responsive interface",
    "Quick deployment and easy integration"
  ];

  const screenshots = [
    {
      title: "Real-time Dashboard",
      description: "Monitor temperature, humidity, and ammonia levels with live updates and status indicators",
      image: dashboardScreenshot
    },
    {
      title: "Device Management",
      description: "Easily add, configure, and manage multiple IoT monitoring devices from one interface",
      image: devicesScreenshot
    },
    {
      title: "Data Logging",
      description: "Access comprehensive historical records with filtering and export capabilities",
      image: datalogScreenshot
    },
    {
      title: "Smart Alerts",
      description: "Configure custom alerts and receive instant notifications for threshold violations",
      image: alertsScreenshot
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Cold Chain Monitor</span>
          </div>
          <Link to="/auth">
            <Button variant="default">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 md:py-32 overflow-hidden">
        {/* Gradient Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-float" />
          <div className="absolute top-20 right-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-scale-in">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Real-time IoT Monitoring</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Cold Chain IoT
            </span>
            <br />
            <span className="text-foreground">Monitoring Dashboard</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Comprehensive real-time monitoring system for temperature-sensitive storage facilities with advanced IoT sensors and intelligent alerts
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/auth">
              <Button size="lg" className="text-lg px-10 py-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-2 hover:bg-primary/5">
                <Activity className="mr-2 h-5 w-5" />
                View Live Demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {[
              { icon: Thermometer, label: "Temperature", value: "24/7" },
              { icon: Droplets, label: "Humidity", value: "Live" },
              { icon: Wind, label: "Ammonia", value: "Real-time" },
              { icon: Shield, label: "Security", value: "Protected" }
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all group">
                <stat.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                <div className="text-lg font-bold text-foreground">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Carousel Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See It In Action</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the powerful features of our monitoring dashboard
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {screenshots.map((screenshot, index) => (
                <CarouselItem key={index}>
                  <Card className="border-2">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <img 
                          src={screenshot.image} 
                          alt={screenshot.title}
                          className="w-full rounded-lg shadow-lg border"
                        />
                        <div className="text-center">
                          <h3 className="text-2xl font-semibold mb-2">{screenshot.title}</h3>
                          <p className="text-muted-foreground">{screenshot.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-transparent to-muted/30">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to monitor and maintain optimal conditions in your cold storage facilities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Solution?</h2>
            <p className="text-lg text-muted-foreground">
              Proven benefits for businesses in cold chain management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-card border">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-2 border-primary/20">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Optimize Your Cold Chain?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start monitoring your facilities today with our comprehensive IoT solution
            </p>
            <Link to="/auth">
              <Button size="lg" className="text-lg px-12">
                Start Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 Cold Chain IoT Monitoring Dashboard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;