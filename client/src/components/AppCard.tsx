import { Button } from "@/components/ui/button";
import { App } from "@shared/schema";
import { Link } from "wouter";
import * as Icons from "lucide-react";
import { Info } from "lucide-react";

interface AppCardProps {
  app: App;
}

export default function AppCard({ app }: AppCardProps) {
  // Get the icon component dynamically
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Link;
    return IconComponent;
  };

  const IconComponent = getIcon(app.icon);

  const handleOpenApp = () => {
    if (app.url !== "#") {
      window.open(app.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${app.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <IconComponent className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-card-foreground mb-2" data-testid={`text-app-name-${app.id}`}>
            {app.name}
          </h3>
          <p className="text-muted-foreground mb-6" data-testid={`text-app-description-${app.id}`}>
            {app.description}
          </p>
          <div className="flex gap-3">
            <Button 
              onClick={handleOpenApp}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              data-testid={`button-open-app-${app.id}`}
            >
              Open App
            </Button>
            <Button 
              asChild
              variant="outline"
              className="px-6 py-2 rounded-lg font-medium"
              data-testid={`button-app-details-${app.id}`}
            >
              <Link href={`/app/${app.id}`}>
                <Info className="w-4 h-4 mr-2" />
                Détails
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
