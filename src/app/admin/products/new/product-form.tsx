
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Product, Category } from "@/lib/data";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";
import { Loader2, Trash2, X } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  name_si: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  description_si: z.string().optional(),
  price: z.coerce.number().min(0),
  discountPrice: z.coerce.number().nullable().optional(),
  quantity: z.coerce.number().min(0, "Quantity must be 0 or more."),
  image: z.any().refine(files => {
    // Required only for new products
    return files?.[0] ? true : false;
  }, 'Image is required.').or(z.string()),
  additionalImages: z.any().optional(),
  categoryId: z.string().min(1, "Category is required"),
  featured: z.boolean().default(false),
  imageHint: z.string().min(1, "Image hint is required"),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: Product | null;
  categories: Category[];
}

const Heading: React.FC<{title: string, description: string}> = ({ title, description }) => {
    return (
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    );
};

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>(initialData?.additionalImageUrls || []);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData ? "Edit an existing product." : "Add a new product to your store";
  const buttonText = initialData ? "Save changes" : "Create Product";
  const toastMessage = initialData ? "Product updated." : "Product created.";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? 
    { 
      ...initialData,
      price: Number(initialData.price), 
      discountPrice: initialData.discountPrice ? Number(initialData.discountPrice) : null,
      quantity: Number(initialData.quantity),
      image: initialData.imageUrl,
      additionalImages: []
    } : 
    {
      name: "",
      name_si: "",
      description: "",
      description_si: "",
      price: 0,
      discountPrice: null,
      quantity: 1,
      image: undefined,
      additionalImages: undefined,
      categoryId: "",
      featured: false,
      imageHint: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      form.setValue("image", e.target.files);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const currentPreviews = [...additionalImagePreviews];
      for (const file of Array.from(files)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (!currentPreviews.includes(reader.result as string)) {
             currentPreviews.push(reader.result as string);
             setAdditionalImagePreviews([...currentPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
      form.setValue("additionalImages", files);
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    setImagesToRemove(prev => [...prev, urlToRemove]);
    setAdditionalImagePreviews(prev => prev.filter(url => url !== urlToRemove));
  };


  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      // 1. Delete images marked for removal
      for (const url of imagesToRemove) {
        const imageRef = ref(storage, url);
        await deleteObject(imageRef).catch(err => console.error("Failed to delete removed image:", err));
      }

      // 2. Upload new primary image if provided
      let imageUrl = initialData?.imageUrl || "";
      if (data.image && typeof data.image !== 'string') {
        const file = data.image[0];
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // 3. Upload new additional images
      const newAdditionalUrls: string[] = [];
      if (data.additionalImages && data.additionalImages.length > 0) {
        for (const file of Array.from(data.additionalImages)) {
            const storageRef = ref(storage, `products/${Date.now()}_additional_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(snapshot.ref);
            newAdditionalUrls.push(downloadUrl);
        }
      }

      // 4. Construct final list of additional image URLs
      const finalAdditionalUrls = [
        ...(initialData?.additionalImageUrls || []).filter(url => !imagesToRemove.includes(url)),
        ...newAdditionalUrls
      ];

      const productData = {
        name: data.name,
        name_si: data.name_si || "",
        description: data.description,
        description_si: data.description_si || "",
        price: data.price,
        discountPrice: data.discountPrice || null,
        quantity: data.quantity,
        imageUrl,
        additionalImageUrls: finalAdditionalUrls,
        categoryId: data.categoryId,
        featured: data.featured,
        imageHint: data.imageHint,
        updatedAt: serverTimestamp(),
      };

      if (initialData) {
        const productRef = doc(firestore, 'products', initialData.id);
        await updateDoc(productRef, productData);
      } else {
        await addDoc(collection(firestore, 'products'), {
          ...productData,
          createdAt: serverTimestamp(),
        });
      }

      toast({ title: "Success", description: toastMessage });
      router.push("/admin/products");
      router.refresh(); 
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description}
        />
      </div>
      <Separator className="my-4" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
            <div className="space-y-4">
                <FormLabel>Product Images</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                     <div className="space-y-2">
                        <FormLabel className="text-sm text-muted-foreground">Primary Image</FormLabel>
                        <div className="relative w-full h-32 rounded-md border flex items-center justify-center">
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Primary preview" fill className="object-cover rounded-md"/>
                            ) : (
                                <span className="text-xs text-muted-foreground">No image</span>
                            )}
                        </div>
                         <FormField
                            control={form.control}
                            name="image"
                            render={() => (
                                <FormItem>
                                <FormControl>
                                    <Input type="file" accept="image/*" onChange={handleImageChange} disabled={loading} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </div>
                     {additionalImagePreviews.map((url, index) => (
                         <div key={index} className="space-y-2">
                            <FormLabel className="text-sm text-muted-foreground">Additional Image</FormLabel>
                            <div className="relative w-full h-32 rounded-md border group">
                                <Image src={url} alt={`Preview ${index + 1}`} fill className="object-cover rounded-md"/>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemoveImage(url)}
                                    disabled={loading}
                                >
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                     ))}
                </div>
                 <FormField
                    control={form.control}
                    name="additionalImages"
                    render={() => (
                        <FormItem>
                        <FormLabel>Add More Images</FormLabel>
                        <FormControl>
                            <Input type="file" accept="image/*" multiple onChange={handleAdditionalImagesChange} disabled={loading} />
                        </FormControl>
                        <FormDescription>You can select multiple files.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
             <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (English)</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name_si"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (Sinhala)</FormLabel>
                  <FormControl>
                    <Input placeholder="නිෂ්පාදනයේ නම" {...field} className="font-sinhala" disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (LKR)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5000.00" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="discountPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Price (LKR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="4500.00"
                      {...field}
                      value={field.value === 0 ? 0 : field.value || ""}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        field.onChange(isNaN(value) ? null : value);
                      }}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Leave blank if no discount.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="10" {...field} disabled={loading}/>
                  </FormControl>
                  <FormDescription>Available stock.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Hint</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 'black faucet'" {...field} disabled={loading}/>
                  </FormControl>
                   <FormDescription>AI hint for image replacement (1-2 words).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem className="md:col-span-3">
                    <FormLabel>Description (English)</FormLabel>
                    <FormControl>
                        <Textarea placeholder="A great description for a great product." {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="description_si"
                render={({ field }) => (
                    <FormItem className="md:col-span-3">
                    <FormLabel>Description (Sinhala)</FormLabel>
                    <FormControl>
                        <Textarea placeholder="විස්තරය මෙහි ඇතුලත් කරන්න." {...field} disabled={loading} className="font-sinhala" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={loading}/>
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>This product will appear on the home page</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {buttonText}
          </Button>
        </form>
      </Form>
    </>
  );
};
