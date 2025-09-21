import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { App } from "@shared/schema";
import * as Icons from "lucide-react";
import { ArrowLeft, Home, ExternalLink, Mail, FileText, Shield } from "lucide-react";

export default function AppDetail() {
  const params = useParams();
  const appId = params.id;

  // Get app details
  const { data: app, isLoading, error } = useQuery<App>({
    queryKey: ["/api/apps", appId],
    enabled: !!appId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Chargement des détails de l'application...</div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <Button asChild variant="ghost" className="mb-8" data-testid="button-back-home">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
            
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">Application non trouvée</h1>
              <p className="text-muted-foreground mb-6">
                L'application que vous recherchez n'existe pas ou a été supprimée.
              </p>
              <Button asChild data-testid="button-back-to-home">
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  // Parse JSON fields safely
  const specifications = (() => {
    try {
      return app.specifications ? JSON.parse(app.specifications) : [];
    } catch (e) {
      return [];
    }
  })();
  
  const features = (() => {
    try {
      return app.features ? JSON.parse(app.features) : [];
    } catch (e) {
      return [];
    }
  })();
  
  const images = (() => {
    try {
      return app.images ? JSON.parse(app.images) : [];
    } catch (e) {
      return [];
    }
  })();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="ghost" data-testid="button-nav-back">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div className="flex-1" />
            <Button asChild variant="ghost" data-testid="button-nav-home">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Link>
            </Button>
          </div>

          {/* App Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className={`w-20 h-20 bg-gradient-to-br ${app.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-app-title">
                        {app.name}
                      </h1>
                      {app.version && (
                        <Badge variant="secondary" className="mb-3" data-testid="badge-app-version">
                          v{app.version}
                        </Badge>
                      )}
                      <p className="text-lg text-muted-foreground mb-4" data-testid="text-app-description">
                        {app.description}
                      </p>
                      {app.developer && (
                        <p className="text-sm text-muted-foreground mb-4" data-testid="text-app-developer">
                          Développé par <span className="font-medium">{app.developer}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleOpenApp}
                      className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      data-testid="button-open-app"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ouvrir l'application
                    </Button>
                    {app.supportEmail && (
                      <Button variant="outline" asChild data-testid="button-contact-support">
                        <a href={`mailto:${app.supportEmail}`}>
                          <Mail className="w-4 h-4 mr-2" />
                          Support
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Long Description */}
          {app.longDescription && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>À propos de {app.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-app-long-description">
                  {app.longDescription}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {features.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Fonctionnalités principales</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3" data-testid="list-app-features">
                  {features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Screenshots/Images */}
          {images.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Captures d'écran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="gallery-app-images">
                  {images.map((imageUrl: string, index: number) => (
                    <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt={`Capture d'écran ${index + 1} de ${app.name}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technical Specifications */}
          {specifications.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Spécifications techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2" data-testid="list-app-specifications">
                  {specifications.map((spec: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{spec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Legal Links */}
          {(app.privacyPolicy || app.termsOfService) && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Informations légales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {app.privacyPolicy && (
                    <Button variant="outline" size="sm" asChild data-testid="button-privacy-policy">
                      <a href={app.privacyPolicy} target="_blank" rel="noopener noreferrer">
                        <Shield className="w-4 h-4 mr-2" />
                        Politique de confidentialité
                      </a>
                    </Button>
                  )}
                  {app.termsOfService && (
                    <Button variant="outline" size="sm" asChild data-testid="button-terms-of-service">
                      <a href={app.termsOfService} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-2" />
                        Conditions d'utilisation
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* App Info Footer */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  Application ajoutée le {new Date(app.createdAt).toLocaleDateString('fr-FR')}
                </div>
                {app.lastUpdated && (
                  <div>
                    Dernière mise à jour le {new Date(app.lastUpdated).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}