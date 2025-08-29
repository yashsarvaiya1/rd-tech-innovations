"use client";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type {
  CareerContent,
  ContactUsContent,
  Content,
  NavbarContent,
} from "@/models/content";
import { ContentService } from "@/services/contentService";
import { useAdminStore } from "@/stores/admin";
import DependentSelect from "./DependentSelect";
import ImageUpload from "./ImageUpload";
import RouteNameEditor from "./RouteNameEditor";

const sections = [
  "navbar",
  "landingPage",
  "companyMarquee",
  "companyBrief",
  "serviceOptions",
  "projects",
  "testimonials",
  "technologies",
  "industries",
  "contactUs",
  "footer",
  "whyUs",
  "vision",
  "eventsPhotoWall",
  "career",
  "jobOpening",
];

interface FieldConfig {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
}

export default function ContentEditor() {
  const {
    selectedSection,
    content,
    updateContentField,
    toggleSectionVisibility,
    fetchContent,
    loading,
    error,
    clearError,
  } = useAdminStore();

  const [localContent, setLocalContent] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [dependencyOptions, setDependencyOptions] = useState<{
    industries: string[];
    technologies: string[];
    techCategories: string[];
  }>({
    industries: [],
    technologies: [],
    techCategories: [],
  });

  // Load dependencies
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [industries, technologies, techCategories] = await Promise.all([
          ContentService.getIndustryOptions(),
          ContentService.getTechnologyOptions(),
          ContentService.getTechCategoryOptions(),
        ]);

        setDependencyOptions({ industries, technologies, techCategories });
      } catch (error) {
        console.error("Error loading dependencies:", error);
      }
    };

    loadDependencies();
  }, []);

  // Load content when section changes
  useEffect(() => {
    if (content && selectedSection) {
      const sectionKey = selectedSection as keyof Omit<
        Content,
        "id" | "seoTitle" | "seoDescription"
      >;
      const sectionContent = content[sectionKey] || {};
      console.log("Initial content for", selectedSection, ":", sectionContent);

      // Type guard and initialize form only for contactUs and career
      const updatedContent = { ...sectionContent } as any;
      if (selectedSection === "contactUs") {
        const contactUsContent = sectionContent as ContactUsContent | undefined;
        updatedContent.form = {
          ...getDefaultForm("contactUs"),
          ...(contactUsContent?.form || {}),
        };
      } else if (selectedSection === "career") {
        const careerContent = sectionContent as CareerContent | undefined;
        updatedContent.form = {
          ...getDefaultForm("career"),
          ...(careerContent?.form || {}),
        };
      }

      // Handle routesList for navbar
      if (selectedSection === "navbar") {
        const navbarContent = sectionContent as NavbarContent | undefined;
        updatedContent.routesList = navbarContent?.routesList || [];
      }

      setLocalContent(updatedContent as Record<string, any>);
      setHasChanges(false);
    }
  }, [content, selectedSection]);

  // Auto-clear success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (!selectedSection || !sections.includes(selectedSection)) {
    return (
      <div className="text-center py-16 bg-white">
        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-heading font-bold text-foreground mb-2">
          No Section Selected
        </h3>
        <p className="text-muted-foreground font-sans">
          Please select a section from the sidebar to edit its content.
        </p>
      </div>
    );
  }

  const getDefaultForm = (section: string): Record<string, any> => {
    switch (section) {
      case "contactUs":
        return {
          title: "Contact Us",
          about: "Get in touch with us",
          name: "Name",
          email: "Email",
          number: "Phone Number",
          requirement: "Requirement",
        };
      case "career":
        return {
          title: "Apply for Position",
          about: "Join our team",
          name: "Name",
          email: "Email",
          number: "Phone Number",
          location: "Location",
          portfolioOrLink: "Portfolio Link",
          ctc: "Expected CTC",
          candidateAbout: "About Yourself",
          resumeUrl: "Resume",
          positions: [],
        };
      default:
        return {};
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setLocalContent((prev: Record<string, any>) => {
      if (field === "form" && typeof value === "object" && value !== null) {
        return {
          ...prev,
          [field]: { ...prev[field], ...value },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    clearError();
    setSuccess("");

    try {
      for (const [field, value] of Object.entries(localContent)) {
        if (field !== "hidden") {
          await updateContentField(
            selectedSection,
            selectedSection,
            field,
            value,
          );
        }
      }

      await fetchContent(selectedSection);

      setHasChanges(false);
      setSuccess("✅ Content saved successfully!");
    } catch (error) {
      console.error("Error saving content:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      clearError();
      await toggleSectionVisibility(selectedSection, selectedSection);
      await fetchContent(selectedSection);

      setSuccess(
        `✅ Section ${localContent.hidden ? "shown" : "hidden"} successfully!`,
      );
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const handleArrayAdd = (field: string) => {
    const currentArray = localContent[field] || [];
    const newItem = getDefaultArrayItem(selectedSection, field);
    handleFieldChange(field, [...currentArray, newItem]);
  };

  const handleArrayUpdate = (field: string, index: number, newValue: any) => {
    const currentArray = localContent[field] || [];
    const updatedArray = [...currentArray];
    updatedArray[index] = newValue;
    handleFieldChange(field, updatedArray);
  };

  const handleArrayRemove = (field: string, index: number) => {
    const currentArray = localContent[field] || [];
    const updatedArray = currentArray.filter(
      (_: any, i: number) => i !== index,
    );
    handleFieldChange(field, updatedArray);
  };

  const getDefaultArrayItem = (section: string, field: string): any => {
    switch (section) {
      case "navbar":
        if (field === "routesList") return { name: "", path: "" };
        break;
      case "companyBrief":
        if (field === "tags") return { text1: "", text2: "" };
        break;
      case "serviceOptions":
        if (field === "cards")
          return {
            imageUrl: "",
            text: "",
            description: "",
            contactButton: "Contact Us",
          };
        break;
      case "projects":
        if (field === "cards")
          return {
            title: "",
            about: "",
            industryTags: [],
            techTags: [],
            links: [],
            imageUrl: "",
          };
        break;
      case "testimonials":
        if (field === "cards")
          return {
            name: "",
            designation: "",
            companyName: "",
            imageUrl: "",
            socialLinks: [],
            message: "",
          };
        break;
      case "technologies":
        if (field === "tech")
          return { imageUrl: "", name: "", techCategory: "" };
        if (field === "techCategories") return "";
        break;
      case "industries":
        if (field === "industries") return { iconUrl: "", name: "" };
        break;
      case "whyUs":
        if (field === "tags") return { text1: "", text2: "" };
        if (field === "text") return "";
        break;
      case "vision":
        if (field === "cards") return { title: "", description: "" };
        break;
      case "jobOpening":
        if (field === "cards")
          return {
            title: "",
            experience: "",
            experienceValue: "",
            position: "",
            positionValue: "",
            viewDetailsButton: "View Details",
            requiredSkillsTitle: "Required Skills",
            requiredSkills: [],
            responsibilityTitle: "Responsibilities",
            responsibilities: [],
          };
        break;
      case "footer":
        if (field === "socialLinks") return { iconUrl: "", name: "", link: "" };
        break;
      case "contactUs":
        if (field === "form") return getDefaultForm("contactUs");
        break;
      case "career":
        if (field === "form") return getDefaultForm("career");
        break;
      default:
        return "";
    }
    return "";
  };

  const renderField = (fieldName: string, fieldType: string) => {
    const value = localContent[fieldName] || (fieldType === "array" ? [] : "");

    switch (fieldType) {
      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={`Enter ${fieldName.replace(/([A-Z])/g, " $1").toLowerCase()}`}
            rows={3}
            className="bg-white border-border"
          />
        );

      case "image":
        return (
          <ImageUpload
            value={value}
            onChange={(url) => handleFieldChange(fieldName, url)}
            label=""
            placeholder="Upload image"
          />
        );

      case "image-array": {
        const imageArray = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-3">
            {imageArray.map((imageUrl: string, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-1">
                  <ImageUpload
                    value={imageUrl}
                    onChange={(url) => handleArrayUpdate(fieldName, index, url)}
                    label=""
                    placeholder="Upload image"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleArrayRemove(fieldName, index)}
                  className="mt-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd(fieldName)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Image
            </Button>
          </div>
        );
      }

      case "route-names":
        return (
          <RouteNameEditor
            value={value}
            onChange={(routes) => handleFieldChange(fieldName, routes)}
          />
        );

      case "dependent-select-industries":
        return (
          <DependentSelect
            options={dependencyOptions.industries}
            value={value}
            onChange={(values) => handleFieldChange(fieldName, values)}
            placeholder="Select industries"
            label=""
            emptyMessage="Create industries first in the Industries section"
          />
        );

      case "dependent-select-technologies":
        return (
          <DependentSelect
            options={dependencyOptions.technologies}
            value={value}
            onChange={(values) => handleFieldChange(fieldName, values)}
            placeholder="Select technologies"
            label=""
            emptyMessage="Create technologies first in the Technologies section"
          />
        );

      case "tech-category-select":
        return (
          <Select
            value={value}
            onValueChange={(newValue) => handleFieldChange(fieldName, newValue)}
          >
            <SelectTrigger className="bg-white border-border">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-white border-border shadow-xl">
              {dependencyOptions.techCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "form-fields": {
        const formValue = (localContent.form ||
          getDefaultForm(selectedSection)) as Record<string, any>;
        return (
          <div className="space-y-4">
            <Label className="text-sm font-heading font-semibold">Form Field Labels</Label>
            {Object.entries(formValue).map(([key, label]) => (
              <div key={key} className="flex flex-col space-y-1">
                <Label className="text-xs text-muted-foreground capitalize font-heading">
                  {key.replace(/([A-Z])/g, " $1")}
                </Label>
                {key === "about" ? (
                  <Textarea
                    value={label as string}
                    onChange={(e) =>
                      handleFieldChange("form", {
                        ...formValue,
                        [key]: e.target.value,
                      })
                    }
                    placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                    rows={3}
                    className="text-xs bg-white"
                  />
                ) : (
                  <Input
                    value={label as string}
                    onChange={(e) =>
                      handleFieldChange("form", {
                        ...formValue,
                        [key]: e.target.value,
                      })
                    }
                    placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                    className="text-xs bg-white"
                  />
                )}
              </div>
            ))}
          </div>
        );
      }

      case "array": {
        const arrayValue = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-3">
            {arrayValue.map((item: any, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-1">
                  {typeof item === "object" && item !== null ? (
                    <Card className="bg-white border-border">
                      <CardContent className="p-4 space-y-3">
                        {Object.entries(item).map(([key, objValue]) => (
                          <div key={key}>
                            <Label className="text-xs font-heading font-semibold capitalize">
                              {key.replace(/([A-Z])/g, " $1")}
                            </Label>
                            {key.includes("Url") ||
                            key.includes("imageUrl") ||
                            key.includes("iconUrl") ? (
                              <ImageUpload
                                value={objValue as string}
                                onChange={(url) => {
                                  const newItem = { ...item, [key]: url };
                                  handleArrayUpdate(fieldName, index, newItem);
                                }}
                                label=""
                                placeholder="Upload image"
                              />
                            ) : key === "techCategory" ? (
                              <Select
                                value={objValue as string}
                                onValueChange={(newValue) => {
                                  const newItem = { ...item, [key]: newValue };
                                  handleArrayUpdate(fieldName, index, newItem);
                                }}
                              >
                                <SelectTrigger className="text-xs bg-white">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-border shadow-xl">
                                  {dependencyOptions.techCategories.map(
                                    (category) => (
                                      <SelectItem key={category} value={category}>
                                        {category}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            ) : key === "industryTags" ? (
                              <DependentSelect
                                options={dependencyOptions.industries}
                                value={objValue as string[]}
                                onChange={(values) => {
                                  const newItem = { ...item, [key]: values };
                                  handleArrayUpdate(fieldName, index, newItem);
                                }}
                                placeholder="Select industries"
                                label=""
                                emptyMessage="Create industries first"
                              />
                            ) : key === "techTags" ? (
                              <DependentSelect
                                options={dependencyOptions.technologies}
                                value={objValue as string[]}
                                onChange={(values) => {
                                  const newItem = { ...item, [key]: values };
                                  handleArrayUpdate(fieldName, index, newItem);
                                }}
                                placeholder="Select technologies"
                                label=""
                                emptyMessage="Create technologies first"
                              />
                            ) : key === "description" &&
                              selectedSection === "serviceOptions" ? (
                              <Textarea
                                value={objValue as string}
                                onChange={(e) => {
                                  const newItem = {
                                    ...item,
                                    [key]: e.target.value,
                                  };
                                  handleArrayUpdate(fieldName, index, newItem);
                                }}
                                placeholder="Service description"
                                className="text-xs bg-white"
                                rows={2}
                              />
                            ) : key === "links" &&
                              selectedSection === "projects" ? (
                              <div className="space-y-2">
                                {((objValue as any[]) || []).map(
                                  (linkItem: any, linkIndex: number) => (
                                    <div
                                      key={linkIndex}
                                      className="flex space-x-2 p-2 border border-border rounded bg-muted/20"
                                    >
                                      <Input
                                        value={linkItem.name || ""}
                                        onChange={(e) => {
                                          const newLinks = [
                                            ...((objValue as any[]) || []),
                                          ];
                                          newLinks[linkIndex] = {
                                            ...linkItem,
                                            name: e.target.value,
                                          };
                                          const newItem = {
                                            ...item,
                                            [key]: newLinks,
                                          };
                                          handleArrayUpdate(
                                            fieldName,
                                            index,
                                            newItem,
                                          );
                                        }}
                                        placeholder="Link name"
                                        className="text-xs flex-1 bg-white"
                                      />
                                      <Input
                                        value={linkItem.url || ""}
                                        onChange={(e) => {
                                          const newLinks = [
                                            ...((objValue as any[]) || []),
                                          ];
                                          newLinks[linkIndex] = {
                                            ...linkItem,
                                            url: e.target.value,
                                          };
                                          const newItem = {
                                            ...item,
                                            [key]: newLinks,
                                          };
                                          handleArrayUpdate(
                                            fieldName,
                                            index,
                                            newItem,
                                          );
                                        }}
                                        placeholder="Link URL"
                                        className="text-xs flex-1 bg-white"
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const newLinks = (
                                            (objValue as any[]) || []
                                          ).filter(
                                            (_: any, i: number) =>
                                              i !== linkIndex,
                                          );
                                          const newItem = {
                                            ...item,
                                            [key]: newLinks,
                                          };
                                          handleArrayUpdate(
                                            fieldName,
                                            index,
                                            newItem,
                                          );
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ),
                                )}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newLinks = [
                                      ...((objValue as any[]) || []),
                                      { name: "", url: "" },
                                    ];
                                    const newItem = { ...item, [key]: newLinks };
                                    handleArrayUpdate(fieldName, index, newItem);
                                  }}
                                  className="text-xs"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Link
                                </Button>
                              </div>
                            ) : key === "socialLinks" &&
                              (selectedSection === "testimonials" ||
                                selectedSection === "footer") ? (
                              <div className="space-y-2">
                                {((objValue as any[]) || []).map(
                                  (socialItem: any, socialIndex: number) => (
                                    <Card
                                      key={socialIndex}
                                      className="bg-muted/20 border-border"
                                    >
                                      <CardContent className="p-3 space-y-2">
                                        <ImageUpload
                                          value={socialItem.iconUrl || ""}
                                          onChange={(url) => {
                                            const newSocials = [
                                              ...((objValue as any[]) || []),
                                            ];
                                            newSocials[socialIndex] = {
                                              ...socialItem,
                                              iconUrl: url,
                                            };
                                            const newItem = {
                                              ...item,
                                              [key]: newSocials,
                                            };
                                            handleArrayUpdate(
                                              fieldName,
                                              index,
                                              newItem,
                                            );
                                          }}
                                          label=""
                                          placeholder="Upload icon"
                                        />
                                        <Input
                                          value={socialItem.name || ""}
                                          onChange={(e) => {
                                            const newSocials = [
                                              ...((objValue as any[]) || []),
                                            ];
                                            newSocials[socialIndex] = {
                                              ...socialItem,
                                              name: e.target.value,
                                            };
                                            const newItem = {
                                              ...item,
                                              [key]: newSocials,
                                            };
                                            handleArrayUpdate(
                                              fieldName,
                                              index,
                                              newItem,
                                            );
                                          }}
                                          placeholder="Platform name (e.g., LinkedIn, Twitter)"
                                          className="text-xs bg-white"
                                        />
                                        <Input
                                          value={socialItem.link || ""}
                                          onChange={(e) => {
                                            const newSocials = [
                                              ...((objValue as any[]) || []),
                                            ];
                                            newSocials[socialIndex] = {
                                              ...socialItem,
                                              link: e.target.value,
                                            };
                                            const newItem = {
                                              ...item,
                                              [key]: newSocials,
                                            };
                                            handleArrayUpdate(
                                              fieldName,
                                              index,
                                              newItem,
                                            );
                                          }}
                                          placeholder="Social media URL"
                                          className="text-xs bg-white"
                                        />
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => {
                                            const newSocials = (
                                              (objValue as any[]) || []
                                            ).filter(
                                              (_: any, i: number) =>
                                                i !== socialIndex,
                                            );
                                            const newItem = {
                                              ...item,
                                              [key]: newSocials,
                                            };
                                            handleArrayUpdate(
                                              fieldName,
                                              index,
                                              newItem,
                                            );
                                          }}
                                          className="w-full"
                                        >
                                          <Trash2 className="h-3 w-3 mr-1" />
                                          Remove Social Link
                                        </Button>
                                      </CardContent>
                                    </Card>
                                  ),
                                )}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newSocials = [
                                      ...((objValue as any[]) || []),
                                      { iconUrl: "", name: "", link: "" },
                                    ];
                                    const newItem = {
                                      ...item,
                                      [key]: newSocials,
                                    };
                                    handleArrayUpdate(fieldName, index, newItem);
                                  }}
                                  className="text-xs w-full"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Social Link
                                </Button>
                              </div>
                            ) : Array.isArray(objValue) ? (
                              <div className="space-y-2">
                                {(objValue as any[]).map(
                                  (arrItem: any, arrIndex: number) => (
                                    <div
                                      key={arrIndex}
                                      className="flex items-center space-x-2"
                                    >
                                      <Input
                                        value={arrItem}
                                        onChange={(e) => {
                                          const newArray = [
                                            ...(objValue as any[]),
                                          ];
                                          newArray[arrIndex] = e.target.value;
                                          const newItem = {
                                            ...item,
                                            [key]: newArray,
                                          };
                                          handleArrayUpdate(
                                            fieldName,
                                            index,
                                            newItem,
                                          );
                                        }}
                                        placeholder={`${key} item`}
                                        className="text-xs bg-white"
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const newArray = (
                                            objValue as any[]
                                          ).filter(
                                            (_: any, i: number) => i !== arrIndex,
                                          );
                                          const newItem = {
                                            ...item,
                                            [key]: newArray,
                                          };
                                          handleArrayUpdate(
                                            fieldName,
                                            index,
                                            newItem,
                                          );
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ),
                                )}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newArray = [...(objValue as any[]), ""];
                                    const newItem = { ...item, [key]: newArray };
                                    handleArrayUpdate(fieldName, index, newItem);
                                  }}
                                  className="text-xs"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add {key.replace(/s$/, "")}
                                </Button>
                              </div>
                            ) : (
                              <Input
                                value={objValue as string}
                                onChange={(e) => {
                                  const newItem = {
                                    ...item,
                                    [key]: e.target.value,
                                  };
                                  handleArrayUpdate(fieldName, index, newItem);
                                }}
                                placeholder={key}
                                className="text-xs bg-white"
                              />
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ) : (
                    <Input
                      value={item}
                      onChange={(e) =>
                        handleArrayUpdate(fieldName, index, e.target.value)
                      }
                      placeholder={`${fieldName} item`}
                      className="bg-white border-border"
                    />
                  )}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleArrayRemove(fieldName, index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd(fieldName)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add {fieldName.replace(/s$/, "")}
            </Button>
          </div>
        );
      }

      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={`Enter ${fieldName.replace(/([A-Z])/g, " $1").toLowerCase()}`}
            className="bg-white border-border"
          />
        );
    }
  };

  const getSectionFields = (section: string): FieldConfig[] => {
    const fieldMaps: Record<string, FieldConfig[]> = {
      navbar: [
        { name: "logoUrl", type: "image", label: "Logo" },
        { name: "routesList", type: "array", label: "Navigation Routes" },
        { name: "contactButton", type: "text", label: "Contact Button Text" },
      ],
      landingPage: [
        { name: "title", type: "text", label: "Title" },
        { name: "description", type: "textarea", label: "Description" },
        { name: "imageUrls", type: "image-array", label: "Images" },
      ],
      companyMarquee: [
        {
          name: "companyLogoUrls",
          type: "image-array",
          label: "Company Logos",
        },
      ],
      companyBrief: [
        { name: "title", type: "text", label: "Title" },
        { name: "description", type: "textarea", label: "Description" },
        { name: "tags", type: "array", label: "Statistics Tags" },
      ],
      serviceOptions: [
        { name: "title", type: "text", label: "Title" },
        { name: "description", type: "textarea", label: "Description" },
        { name: "cards", type: "array", label: "Service Cards" },
      ],
      projects: [
        { name: "title", type: "text", label: "Title" },
        { name: "text", type: "textarea", label: "Description" },
        { name: "cards", type: "array", label: "Project Cards" },
      ],
      testimonials: [
        { name: "title", type: "text", label: "Title" },
        { name: "description", type: "textarea", label: "Description" },
        { name: "cards", type: "array", label: "Testimonials" },
      ],
      technologies: [
        { name: "title", type: "text", label: "Title" },
        { name: "description", type: "textarea", label: "Description" },
        {
          name: "techCategories",
          type: "array",
          label: "Technology Categories",
        },
        { name: "tech", type: "array", label: "Technologies" },
      ],
      industries: [
        { name: "title", type: "text", label: "Title" },
        { name: "description", type: "textarea", label: "Description" },
        { name: "industries", type: "array", label: "Industries" },
      ],
      contactUs: [
        { name: "title", type: "text", label: "Section Title" },
        { name: "description", type: "textarea", label: "Section Description" },
        { name: "form", type: "form-fields", label: "Form Field Labels" },
      ],
      footer: [
        { name: "logoUrl", type: "image", label: "Logo" },
        { name: "address", type: "textarea", label: "Address" },
        { name: "number", type: "text", label: "Phone Number" },
        { name: "companyEmail", type: "text", label: "Company Email" },
        { name: "text", type: "textarea", label: "Footer Text" },
        { name: "socialLinks", type: "array", label: "Social Media Links" },
      ],
      whyUs: [
        { name: "title", type: "text", label: "Title" },
        { name: "tags", type: "array", label: "Statistics" },
        { name: "title2", type: "text", label: "Second Title" },
        { name: "description", type: "textarea", label: "Description" },
        { name: "text", type: "array", label: "Feature Points" },
      ],
      vision: [
        { name: "title", type: "text", label: "Title" },
        { name: "description", type: "textarea", label: "Description" },
        { name: "cards", type: "array", label: "Vision Cards" },
      ],
      eventsPhotoWall: [
        { name: "title", type: "text", label: "Title" },
        { name: "description", type: "textarea", label: "Description" },
        { name: "imageUrls", type: "image-array", label: "Event Photos" },
      ],
      career: [
        { name: "title", type: "text", label: "Section Title" },
        {
          name: "form",
          type: "form-fields",
          label: "Career Form Field Labels",
        },
      ],
      jobOpening: [
        { name: "title", type: "text", label: "Title" },
        { name: "cards", type: "array", label: "Job Openings" },
      ],
    };

    return (
      fieldMaps[section] || [
        { name: "title", type: "text", label: "Title" },
        { name: "description", type: "textarea", label: "Description" },
      ]
    );
  };

  const sectionFields = getSectionFields(selectedSection);

  return (
    <div className="space-y-6 max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-background to-muted/20 p-6 rounded-xl border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Edit{" "}
              {selectedSection
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </h1>
            <p className="text-muted-foreground font-sans">
              Manage content for this section
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {localContent.hidden ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-primary" />
              )}
              <span className="text-sm font-heading">
                {localContent.hidden ? "Hidden" : "Visible"}
              </span>
              <Switch
                checked={!localContent.hidden}
                onCheckedChange={handleToggleVisibility}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-sans font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-emerald-200 bg-emerald-50">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <AlertDescription className="text-emerald-800 font-sans font-medium">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Content Card */}
      <Card className="bg-white border-border shadow-lg">
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="flex items-center justify-between text-foreground font-heading">
            Section Content
            {hasChanges && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                Unsaved Changes
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="space-y-6">
            {sectionFields.map((field) => (
              <div key={field.name}>
                <Label htmlFor={field.name} className="text-foreground font-heading font-semibold">
                  {field.label}
                </Label>
                <div className="mt-2">
                  {renderField(field.name, field.type)}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-6 border-t border-border">
              <div className="text-sm text-muted-foreground font-sans">
                {hasChanges ? (
                  <span className="text-amber-600 font-medium">⚠️ You have unsaved changes</span>
                ) : (
                  <span className="text-emerald-600 font-medium">✅ All changes saved</span>
                )}
              </div>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving || loading}
                className="min-w-[140px] font-heading"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
