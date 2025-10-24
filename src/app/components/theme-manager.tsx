/**
 * Theme Manager Component
 * Agency tool for managing client restaurant themes
 */

"use client";

import { useState, useCallback } from "react";
import { Download, Upload, Palette, Moon, Sun, Calendar } from "lucide-react";
import {
  useRestaurantTheme,
  useSeasonalTheme,
} from "../hooks/use-restaurant-theme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ThemeManager() {
  const {
    theme,
    isLoading,
    error,
    isDarkMode,
    setDarkMode,
    exportThemeCSS,
    getThemeInfo,
    loadTheme,
  } = useRestaurantTheme();

  const {
    currentSeason,
    changeSeason,
    autoDetectSeason,
    hasSeasonalSupport,
    availableSeasons,
  } = useSeasonalTheme();

  const [customColors, setCustomColors] = useState({
    primary: "",
    secondary: "",
    accent: "",
  });

  const themeInfo = getThemeInfo();

  const handleColorChange = useCallback(
    (colorType: keyof typeof customColors, value: string) => {
      setCustomColors((prev) => ({
        ...prev,
        [colorType]: value,
      }));
    },
    []
  );

  const handleExportTheme = useCallback(() => {
    const css = exportThemeCSS();
    if (css) {
      const blob = new Blob([css], { type: "text/css" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${themeInfo?.clientId || "restaurant"}-theme.css`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [exportThemeCSS, themeInfo]);

  const handleExportJSON = useCallback(() => {
    if (theme) {
      const blob = new Blob([JSON.stringify(theme, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${theme.clientId}-theme.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [theme]);

  const handleLoadTheme = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const themeData = JSON.parse(text);

          // Create a temporary URL for the theme data
          const blob = new Blob([text], { type: "application/json" });
          const url = URL.createObjectURL(blob);

          await loadTheme(url);
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Failed to load theme file:", error);
        }
      }
    },
    [loadTheme]
  );

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading theme...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto border-destructive">
        <CardContent className="py-8">
          <div className="text-center text-destructive">
            <p className="font-medium">Theme Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Restaurant Theme Manager
        </CardTitle>
        {themeInfo && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge>{themeInfo.category}</Badge>
            <span>
              {themeInfo.name} v{themeInfo.version}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {themeInfo && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">
                    Client Information
                  </Label>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Client ID:</span>
                      <code className="bg-muted px-2 py-1 rounded text-xs">
                        {themeInfo.clientId}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Business Type:
                      </span>
                      <span>{themeInfo.clientSpecific?.businessType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Atmosphere:</span>
                      <span>{themeInfo.clientSpecific?.atmosphere}</span>
                    </div>
                  </div>
                </div>

                {themeInfo.clientSpecific?.brandPersonality && (
                  <div>
                    <Label className="text-sm font-medium">
                      Brand Personality
                    </Label>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {themeInfo.clientSpecific.brandPersonality.map(
                        (trait) => (
                          <Badge key={trait} className="text-xs">
                            {trait}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isDarkMode ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Brand Colors</Label>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  {theme && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs">Primary</Label>
                        <div
                          className="w-full h-10 rounded border"
                          style={{
                            backgroundColor: `hsl(${theme.colors.brand.primary})`,
                          }}
                        />
                        <code className="text-xs bg-muted px-1 rounded">
                          {theme.colors.brand.primary}
                        </code>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Secondary</Label>
                        <div
                          className="w-full h-10 rounded border"
                          style={{
                            backgroundColor: `hsl(${theme.colors.brand.secondary})`,
                          }}
                        />
                        <code className="text-xs bg-muted px-1 rounded">
                          {theme.colors.brand.secondary}
                        </code>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Accent</Label>
                        <div
                          className="w-full h-10 rounded border"
                          style={{
                            backgroundColor: `hsl(${theme.colors.brand.accent})`,
                          }}
                        />
                        <code className="text-xs bg-muted px-1 rounded">
                          {theme.colors.brand.accent}
                        </code>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Restaurant Ambiance
                </Label>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  {theme && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs">Warmth</Label>
                        <div
                          className="w-full h-8 rounded border"
                          style={{
                            backgroundColor: `hsl(${theme.colors.restaurant.warmth})`,
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Fresh</Label>
                        <div
                          className="w-full h-8 rounded border"
                          style={{
                            backgroundColor: `hsl(${theme.colors.restaurant.fresh})`,
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Premium</Label>
                        <div
                          className="w-full h-8 rounded border"
                          style={{
                            backgroundColor: `hsl(${theme.colors.restaurant.premium})`,
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Seasonal Tab */}
          <TabsContent value="seasonal" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <Label className="text-sm font-medium">Seasonal Themes</Label>
                <Badge>
                  {hasSeasonalSupport ? "Supported" : "Not Available"}
                </Badge>
              </div>

              {hasSeasonalSupport && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="season-select">Current Season</Label>
                    <Select value={currentSeason} onValueChange={changeSeason}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSeasons.map((season) => (
                          <SelectItem key={season} value={season}>
                            {season.charAt(0).toUpperCase() + season.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={autoDetectSeason} className="w-full">
                    Auto-Detect Season
                  </Button>
                </div>
              )}

              {!hasSeasonalSupport && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">
                    This theme doesn&apos;t include seasonal variations.
                  </p>
                  <p className="text-xs mt-1">
                    Contact your theme developer to add seasonal support.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Export Options</Label>
                <div className="mt-2 space-y-2">
                  <Button
                    onClick={handleExportTheme}
                    className="w-full justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export as CSS
                  </Button>
                  <Button
                    onClick={handleExportJSON}
                    className="w-full justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export as JSON
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Import Theme</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleLoadTheme}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium"
                  />
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
                <p className="font-medium mb-1">For Agencies:</p>
                <p>• Export JSON themes for client handoff</p>
                <p>• Export CSS for direct implementation</p>
                <p>• Import client themes for modifications</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
