"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MainLayout } from "@/components/layouts/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { assetRegistrationSchema, AssetFormData } from "@/schemas";
import { useAssetRegistration } from "@/hooks/use-asset-registration";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const steps = [
  { label: "Watch Details", description: "Basic information" },
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

  const {
    register,
    handleSubmit,
    watch,
    control,
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
      estimatedValue: "",
    },
  });

  const formValues = watch();

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
      });

      router.push("/assets/status");
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
      <div className="max-w-5xl mx-auto space-y-8 py-6">
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

                  {/* Optional Fields */}
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-4 text-muted-foreground">
                      Optional Information
                    </h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="estimatedValue">
                          Estimated Value (USD)
                        </Label>
                        <Input
                          id="estimatedValue"
                          placeholder="10000"
                          {...register("estimatedValue")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Step 2: Review & Submit */}
          {currentStep === 1 && (
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
