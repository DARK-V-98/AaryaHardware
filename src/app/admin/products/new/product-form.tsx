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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/lib/data";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0),
  image: z.any().refine(files => {
    return files?.[0] ? true : false;
  }, 'Image is required.').or(z.string()),
  featured: z.boolean().default(false),
  imageHint: z.string().min(1, "Image hint is required"),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: Product | null;
}

const Heading: React.FC<{title: string, description: string}> = ({ title, description }) => {
    return (
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    );
};

export const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

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
      image: initialData.imageUrl 
    } : 
    {
      name: "",
      description: "",
      price: 0,
      image: "",
      featured: false,
      imageHint: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("image", e.target.files);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      let imageUrl = initialData?.imageUrl || "";

      // Check if a new image file was uploaded
      if (data.image && typeof data.image !== 'string') {
        const file = data.image[0];
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl,
        featured: data.featured,
        imageHint: data.imageHint,
        updatedAt: serverTimestamp(),
      };

      if (initialData) {
        // Update existing product
        const productRef = doc(firestore, 'products', initialData.id);
        await updateDoc(productRef, productData);
      } else {
        // Create new product
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
           <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                   {imagePreview && (
                    <div className="relative w-48 h-48 my-4">
                      <Image
                        src={imagePreview}
                        alt="Image Preview"
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product name"
                      {...field}
                      disabled={loading}
                    />
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
                    <Input
                      type="number"
                      placeholder="5000.00"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
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
                    <Input
                      placeholder="e.g. 'black faucet'"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                   <FormDescription>
                      AI hint for image replacement (1-2 words).
                    </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem className="md:col-span-2 lg:col-span-3">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="A great description for a great product."
                        {...field}
                        disabled={loading}
                        />
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
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Featured
                    </FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
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
