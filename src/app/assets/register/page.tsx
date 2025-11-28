"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MainLayout } from "@/components/layouts/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Upload, X, Image as ImageIcon } from "lucide-react";
import { assetRegistrationSchema, AssetFormData } from "@/schemas";
import { useAssetRegistration } from "@/hooks/use-asset-registration";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Watch Details", description: "Basic information" },
  { label: "Upload Photo", description: "Asset image" },
  { label: "Review & Submit", description: "Confirm details" },
];

const conditionOptions: Array<{ value: string; label: string }> = [
  { value: "Excellent", label: "Excellent" },
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" },
  { value: "Poor", label: "Poor" },
];

const booleanOptions: Array<{ value: string; label: string }> = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

export default function RegisterAssetPage() {
  const router = useRouter();
  const { registerAsset, isSubmitting } = useAssetRegistration();
  const [currentStep, setCurrentStep] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetRegistrationSchema),
    mode: "onChange",
    defaultValues: {
      brand: "",
      model: "",
      refNumber: "",
      serialNumber: "",
      productionYear: new Date().getFullYear(),
      conditionRating: "Good",
      hasBox: false,
      hasPapers: false,
      image: null,
    },
  });

  const formValues = watch();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [setValue]);

  const onSubmit = async (data: AssetFormData) => {
    try {
      await registerAsset({
        brand: data.brand,
        model: data.model,
        refNumber: data.refNumber,
        serialNumber: data.serialNumber,
        productionYear: data.productionYear,
        conditionRating: data.conditionRating,
        hasBox: data.hasBox,
        hasPapers: data.hasPapers,
        image: data.image,
      });

      router.push("/assets/my-requests");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const canProceedToReview = () => {
    return (
      formValues.brand &&
      formValues.model &&
      formValues.refNumber &&
      formValues.serialNumber &&
      isValid
    );
  };

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Assets", href: "/assets" },
        { label: "Register New Asset", href: "/assets/register" },
      ]}
    >
      <div className="w-full md:w-4xl mx-auto space-y-8 py-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Register Your Asset
          </h1>
          <p className="text-muted-foreground text-lg">
            Start your journey to tokenized liquidity
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator steps={steps} currentStep={currentStep} />

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Watch Details */}
          {currentStep === 0 && (
            <GlassCard gradient hover className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Asset Information
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Provide detailed information about the asset you wish to
                    tokenize
                  </p>
                </div>

                <div className="grid gap-6">
                  {/* Brand Name */}
                  <div className="space-y-2">
                    <Label htmlFor="brand">
                      Brand Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="brand"
                      placeholder="e.g., Rolex"
                      {...register("brand")}
                    />
                    {errors.brand && (
                      <p className="text-sm text-destructive">
                        {errors.brand.message}
                      </p>
                    )}
                  </div>

                  {/* Model */}
                  <div className="space-y-2">
                    <Label htmlFor="model">
                      Model <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="model"
                      placeholder="e.g., Submariner"
                      {...register("model")}
                    />
                    {errors.model && (
                      <p className="text-sm text-destructive">
                        {errors.model.message}
                      </p>
                    )}
                  </div>

                  {/* Reference Number */}
                  <div className="space-y-2">
                    <Label htmlFor="refNumber">
                      Reference Number{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="refNumber"
                      placeholder="e.g., 116610LN"
                      {...register("refNumber")}
                    />
                    {errors.refNumber && (
                      <p className="text-sm text-destructive">
                        {errors.refNumber.message}
                      </p>
                    )}
                  </div>

                  {/* Serial Number */}
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber">
                      Serial Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="serialNumber"
                      placeholder="Enter serial number"
                      {...register("serialNumber")}
                    />
                    {errors.serialNumber && (
                      <p className="text-sm text-destructive">
                        {errors.serialNumber.message}
                      </p>
                    )}
                  </div>

                  {/* Production Year & Condition */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productionYear">Production Year</Label>
                      <Input
                        id="productionYear"
                        type="number"
                        {...register("productionYear", { valueAsNumber: true })}
                      />
                      {errors.productionYear && (
                        <p className="text-sm text-destructive">
                          {errors.productionYear.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="conditionRating">Condition</Label>
                      <Controller
                        name="conditionRating"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger type="button" className="w-full">
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              {conditionOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  {/* Box & Papers */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hasBox">Do you still have the box?</Label>
                      <Controller
                        name="hasBox"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value ? "true" : "false"}
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                          >
                            <SelectTrigger type="button" className="w-full">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              {booleanOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hasPapers">
                        Do you still have the papers?
                      </Label>
                      <Controller
                        name="hasPapers"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value ? "true" : "false"}
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                          >
                            <SelectTrigger type="button" className="w-full">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              {booleanOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Step 2: Upload Photo */}
          {currentStep === 1 && (
            <GlassCard gradient hover className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Upload Asset Photo
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Upload a high-quality photo of your watch
                  </p>
                </div>

                {/* Drag & Drop Zone */}
                {!formValues.image ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                      "relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer group",
                      dragActive
                        ? "border-accent bg-accent/5 scale-[1.02]"
                        : "border-border hover:border-accent/50 hover:bg-accent/5"
                    )}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setValue("image", file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImagePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                      <div className="p-4 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                        <Upload className="h-8 w-8 text-accent" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">
                          Drop file here or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Supports: JPG, PNG, JPEG (Max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium flex items-center text-success">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Image uploaded successfully
                      </h3>
                    </div>
                    <div className="relative group max-w-md mx-auto">
                      <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Asset preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setValue("image", null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-2 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="font-medium text-sm truncate">{formValues.image.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(formValues.image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 2 && (
            <GlassCard gradient hover className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Review & Submit
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Please review your asset details before submission
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Asset Summary */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Brand</p>
                        <p className="font-medium">{formValues.brand}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Model</p>
                        <p className="font-medium">{formValues.model}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Reference Number
                        </p>
                        <p className="font-medium">{formValues.refNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Serial Number
                        </p>
                        <p className="font-medium">{formValues.serialNumber}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Production Year
                        </p>
                        <p className="font-medium">
                          {formValues.productionYear}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Condition
                        </p>
                        <p className="font-medium">
                          {formValues.conditionRating}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Accessories
                        </p>
                        <p className="font-medium">
                          {formValues.hasBox && "Box"}
                          {formValues.hasBox && formValues.hasPapers && " & "}
                          {formValues.hasPapers && "Papers"}
                          {!formValues.hasBox &&
                            !formValues.hasPapers &&
                            "None"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {formValues.image && imagePreview && (
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-muted-foreground mb-3">
                        Uploaded Photo
                      </p>
                      <div className="max-w-sm">
                        <div className="aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={imagePreview}
                            alt="Asset preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Next Steps Info */}
                  <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-info" />
                      What happens next?
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <span className="mr-2">1.</span>
                        <span>
                          Your asset will be submitted for verification
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">2.</span>
                        <span>
                          Our partner pawnshops will authenticate and appraise
                          your asset
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">3.</span>
                        <span>
                          Once approved, you can proceed to tokenization
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">4.</span>
                        <span>
                          Track your asset status in the Assets dashboard
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between py-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0 || isSubmitting}
            >
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentStep((prev) => prev + 1);
                }}
                disabled={!canProceedToReview()}
                className="bg-accent hover:bg-accent/90"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-accent hover:bg-accent/90"
              >
                {isSubmitting ? "Submitting..." : "Submit Asset"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
