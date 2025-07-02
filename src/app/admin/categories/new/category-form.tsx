
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Category } from "@/lib/data";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: Category | null;
}

const Heading: React.FC<{title: string, description: string}> = ({ title, description }) => {
    return (
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    );
};

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData ? "Edit an existing category." : "Add a new category to your store";
  const buttonText = initialData ? "Save changes" : "Create Category";
  const toastMessage = initialData ? "Category updated." : "Category created.";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "" },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      
      const categoryData = {
        name: data.name,
        updatedAt: serverTimestamp(),
      };

      if (initialData) {
        // Update existing category
        const categoryRef = doc(firestore, 'categories', initialData.id);
        await updateDoc(categoryRef, categoryData);
      } else {
        // Create new category
        await addDoc(collection(firestore, 'categories'), {
          ...categoryData,
          createdAt: serverTimestamp(),
        });
      }

      toast({ title: "Success", description: toastMessage });
      router.push("/admin/categories");
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Category name"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
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
