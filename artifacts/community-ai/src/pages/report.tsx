import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";
import { useAnalyzeComplaint, useCreateComplaint } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import {
  Upload,
  X,
  Brain,
  Check,
  ShieldAlert,
  Sparkles,
  Loader2,
  MapPin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { id: "pothole", label: "Pothole / Road Damage" },
  { id: "broken_streetlight", label: "Broken Streetlight" },
  { id: "garbage", label: "Garbage / Illegal Dumping" },
  { id: "water_leakage", label: "Water Leakage" },
  { id: "drainage", label: "Drainage / Flooding" },
  { id: "public_safety", label: "Public Safety Hazard" },
  { id: "other", label: "Other" },
];

export default function Report() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    location: "",
    description: "",
    category: "",
    isAnonymous: false,
    reporterName: "",
  });

  const [image, setImage] = useState<{ url: string; mime: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const analyzeMutation = useAnalyzeComplaint();
  const createMutation = useCreateComplaint();

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location unavailable",
        description: "Your browser does not support location access.",
        variant: "destructive",
      });
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setFormData((prev) => ({
          ...prev,
          location: `Current location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`,
        }));

        setGettingLocation(false);

        toast({
          title: "Location detected",
          description: "Your current coordinates have been added to the report.",
        });
      },
      (error) => {
        setGettingLocation(false);

        const message =
          error.code === error.PERMISSION_DENIED
            ? "Please allow location access in your browser."
            : "Could not detect your current location.";

        toast({
          title: "Location unavailable",
          description: message,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      setImage({
        url: event.target?.result as string,
        mime: file.type,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      setImage({
        url: event.target?.result as string,
        mime: file.type,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (!formData.description) {
      toast({
        title: "Description required",
        description: "Please provide a description for the AI to analyze.",
        variant: "destructive",
      });
      return;
    }

    const base64Data = image?.url.split(",")[1];

    analyzeMutation.mutate(
      {
        data: {
          description: formData.description,
          category: formData.category || undefined,
          imageData: base64Data,
          imageMimeType: image?.mime,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Analysis Complete",
            description: "AI has successfully assessed the issue.",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Analysis Failed",
            description: error?.message || "Could not complete AI analysis.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleSubmit = () => {
    if (!formData.location || !formData.description) {
      toast({
        title: "Missing fields",
        description: "Location and description are required.",
        variant: "destructive",
      });
      return;
    }

    const aiData = analyzeMutation.data;

    createMutation.mutate(
      {
        data: {
          ...formData,
          category: aiData?.category || formData.category || undefined,
          imageData: image?.url,
          imageMimeType: image?.mime,
          priority: aiData?.priority || "medium",
          aiAnalyzed: !!aiData,
          aiTitle: aiData?.title,
          aiSummary: aiData?.summary,
          aiCategory: aiData?.category,
          aiSeverityScore: aiData?.severityScore,
          aiUrgency: aiData?.urgency,
          aiDepartment: aiData?.department,
          aiEnvironmentalImpact: aiData?.environmentalImpact,
          aiResolutionEstimate: aiData?.resolutionEstimate,
          aiSuggestedActions: aiData
            ? JSON.stringify(aiData.suggestedActions)
            : undefined,
          aiConfidenceScore: aiData?.confidenceScore,
        },
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Report Submitted",
            description: "Thank you for making our community better!",
          });
          setLocation(`/complaints/${data.id}`);
        },
        onError: (error: any) => {
          toast({
            title: "Submission Failed",
            description:
              error?.message ||
              "The server could not process this report.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const analysis = analyzeMutation.data;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Report an Issue</h1>
        <p className="mt-2 text-muted-foreground">
          Help improve our city by reporting infrastructure and safety issues.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="space-y-6 lg:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div
                className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                } ${image ? "p-2" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                {image ? (
                  <div className="group relative overflow-hidden rounded-lg">
                    <img
                      src={image.url}
                      alt="Preview"
                      className="max-h-[300px] w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setImage(null)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8">
                    <div className="mb-4 rounded-full bg-muted p-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>

                    <p className="mb-1 font-medium">Drag & drop a photo</p>
                    <p className="mb-4 text-sm text-muted-foreground">
                      or click to browse from your device
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />

                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Select Image
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Location <span className="text-destructive">*</span>
                </label>
                            
                <div className="flex gap-2">
                  <Input
                    className="flex-1"
                    placeholder="Enter address or location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
              
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={gettingLocation}
                  >
                    {gettingLocation ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                    <span className="ml-2">
                      {gettingLocation ? "Detecting..." : "Current Location"}
                    </span>
                  </Button>
                </div>
                  
                <p className="mt-1 text-xs text-muted-foreground">
                  Enter a location manually or use your current location.
                </p>
              </div>
                  
                            <div>
                              <label className="mb-1 block text-sm font-medium">
                                Description <span className="text-destructive">*</span>
                              </label>
                  
                              <Textarea
                                placeholder="Describe what you see in detail..."
                                className="min-h-[120px]"
                                value={formData.description}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Category (Optional)
                </label>

                <select
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Select a category or let AI decide
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t pt-4">
                <label className="mb-4 flex cursor-pointer items-center space-x-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                    checked={formData.isAnonymous}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isAnonymous: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm font-medium">
                    Submit Anonymously
                  </span>
                </label>

                {!formData.isAnonymous && (
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Your Name
                    </label>
                    <Input
                      placeholder="Jane Doe"
                      value={formData.reporterName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reporterName: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:w-1/2">
          <Card className="relative flex h-full flex-col overflow-hidden border-accent/30 bg-accent/5">
            {!analysis && !analyzeMutation.isPending && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 p-8 text-center backdrop-blur-[2px]">
                <div className="mb-6 rounded-full border border-accent/20 bg-background p-4 shadow-lg">
                  <Brain className="h-10 w-10 text-accent" />
                </div>

                <h3 className="mb-2 text-xl font-bold">
                  AI Intelligence Analysis
                </h3>

                <p className="mb-8 max-w-sm text-muted-foreground">
                  Our civic AI can automatically categorize this issue, assess
                  its severity, and route it to the right department.
                </p>

                <Button
                  size="lg"
                  variant="ai"
                  onClick={handleAnalyze}
                  disabled={!formData.description}
                  className="px-8"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze Issue Now
                </Button>

                {!formData.description && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    Please provide a description first
                  </p>
                )}
              </div>
            )}

            {analyzeMutation.isPending && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950 p-8 font-mono text-cyan-400">
                <Loader2 className="mb-6 h-12 w-12 animate-spin" />
                <p className="mb-2 text-lg animate-pulse">
                  RUNNING_NEURAL_ANALYSIS...
                </p>
                <div className="space-y-1 text-center text-xs text-cyan-400/50">
                  <p>Processing visual data...</p>
                  <p>Cross-referencing civic infrastructure patterns...</p>
                  <p>Calculating severity metrics...</p>
                </div>
              </div>
            )}

            <CardHeader className="relative z-0 rounded-t-xl border-b border-zinc-800 bg-zinc-950 text-zinc-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-cyan-400" />
                  <CardTitle className="font-mono tracking-tight">
                    INTELLIGENCE_REPORT
                  </CardTitle>
                </div>

                {analysis && (
                  <Badge className="border-emerald-500/30 bg-emerald-500/20 font-mono text-xs text-emerald-400">
                    ANALYSIS_COMPLETE
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="relative z-0 flex-1 bg-zinc-950 p-0 font-mono text-sm text-zinc-300">
              <div className="space-y-6 p-6">
                {!analysis && !analyzeMutation.isPending && (
                  <div className="pointer-events-none space-y-6 opacity-20">
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span>SUBJECT_CLASSIFICATION</span>
                      <span>...</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span>CONFIDENCE_SCORE</span>
                      <span>...</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span>SEVERITY_INDEX</span>
                      <span>...</span>
                    </div>
                  </div>
                )}

                {analysis && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="mb-1 text-xs text-cyan-400">
                        CLASSIFICATION_TITLE
                      </h4>
                      <p className="text-lg font-bold tracking-tight text-zinc-100">
                        {analysis.title}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded border border-zinc-800 bg-zinc-900 p-3">
                        <span className="mb-1 block text-xs text-zinc-500">
                          CATEGORY
                        </span>
                        <span className="capitalize text-zinc-100">
                          {analysis.category.replace("_", " ")}
                        </span>
                      </div>

                      <div className="rounded border border-zinc-800 bg-zinc-900 p-3">
                        <span className="mb-1 block text-xs text-zinc-500">
                          ROUTING_DEPT
                        </span>
                        <span className="text-zinc-100">
                          {analysis.department}
                        </span>
                      </div>

                      <div className="rounded border border-zinc-800 bg-zinc-900 p-3">
                        <span className="mb-1 block text-xs text-zinc-500">
                          PRIORITY
                        </span>
                        <span
                          className={`font-bold capitalize ${
                            analysis.priority === "critical"
                              ? "text-rose-500"
                              : analysis.priority === "high"
                                ? "text-orange-500"
                                : analysis.priority === "medium"
                                  ? "text-amber-400"
                                  : "text-emerald-400"
                          }`}
                        >
                          {analysis.priority}
                        </span>
                      </div>

                      <div className="rounded border border-zinc-800 bg-zinc-900 p-3">
                        <span className="mb-1 block text-xs text-zinc-500">
                          CONFIDENCE
                        </span>
                        <span className="text-cyan-400">
                          {(analysis.confidenceScore * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-end justify-between">
                        <span className="text-xs text-zinc-500">
                          SEVERITY_METRIC [1-10]
                        </span>
                        <span className="text-xl font-bold text-zinc-100">
                          {analysis.severityScore}/10
                        </span>
                      </div>

                      <div className="flex h-3 gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-sm ${
                              i <= analysis.severityScore
                                ? i > 7
                                  ? "bg-rose-500"
                                  : i > 4
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                : "bg-zinc-800"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 rounded border border-zinc-800 bg-zinc-900 p-4">
                      <div className="flex items-start gap-2">
                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <div>
                          <span className="block text-xs text-zinc-500">
                            ENVIRONMENTAL_IMPACT
                          </span>
                          <span className="text-sm leading-tight text-zinc-300">
                            {analysis.environmentalImpact}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="mb-2 block text-xs text-zinc-500">
                        SUGGESTED_PROTOCOLS
                      </span>

                      <ul className="space-y-2">
                        {analysis.suggestedActions.map((action, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-sm text-zinc-300"
                          >
                            <span className="shrink-0 text-cyan-500">→</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-end border-t pt-8">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={createMutation.isPending}
          className="h-14 w-full px-12 text-lg sm:w-auto"
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Check className="mr-2 h-5 w-5" />
              Submit Official Report
            </>
          )}
        </Button>
      </div>
    </div>
  );
}