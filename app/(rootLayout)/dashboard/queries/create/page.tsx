"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { querySchema, QueryFormData } from "@/formschema/querySchema";
import { createQuery } from "@/apiServices/queries/api.queriesServices";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDraft } from "@/hooks/useDraft";
import { Button } from "@/components/ui/button";
import { QueryFormSkeleton } from "../QueryFormSkeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
} from "@/components/ui/select";
import {
      Form,
      FormControl,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function CreateQueryPage() {
      const router = useRouter();
      const { toast } = useToast();
      const [isLoading, setIsLoading] = useState(false);

      const form = useForm<QueryFormData>({
            resolver: zodResolver(querySchema),
            defaultValues: {
                  subject: "",
                  email: "",
                  phoneNumber: "",
                  description: "",
                  status: "new",
            },
      });

      // Use Draft Hook
      // The hook handles loading, resetting, and watching/saving.
      const { clearDraft, isLoading: isDraftLoading } = useDraft<QueryFormData>(form, "create-query-draft");

      const handleSubmit = async (data: QueryFormData) => {
            setIsLoading(true);
            try {
                  const res = await createQuery(data);
                  toast({
                        title: "Success",
                        description: `${res.message}`,
                        variant: "default",
                  });
                  await clearDraft();
                  router.push("/dashboard/queries");
            } catch (error: any) {
                  toast({
                        title: "Error",
                        description: error.message || "Failed to create query",
                        variant: "destructive",
                  });
            } finally {
                  setIsLoading(false);
            }
      };

      if (isDraftLoading) {
            return <QueryFormSkeleton />;
      }

      return (
            <div className="rounded-md mx-auto py-8">
                  <Card className="w-full">
                        <CardHeader>
                              <CardTitle>Create New Query</CardTitle>
                              <p className="text-sm text-muted-foreground">Submit a new customer query or support ticket.</p>
                        </CardHeader>
                        <CardContent>
                              <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                                          <div className="space-y-4">
                                                <FormField
                                                      control={form.control}
                                                      name="subject"
                                                      render={({ field }) => (
                                                            <FormItem>
                                                                  <FormLabel>Subject</FormLabel>
                                                                  <FormControl>
                                                                        <Input placeholder="Enter query subject" {...field} />
                                                                  </FormControl>
                                                                  <FormMessage />
                                                            </FormItem>
                                                      )}
                                                />
                                                <FormField
                                                      control={form.control}
                                                      name="email"
                                                      render={({ field }) => (
                                                            <FormItem>
                                                                  <FormLabel>Email Address</FormLabel>
                                                                  <FormControl>
                                                                        <Input type="email" placeholder="Enter email address" {...field} />
                                                                  </FormControl>
                                                                  <FormMessage />
                                                            </FormItem>
                                                      )}
                                                />
                                                <FormField
                                                      control={form.control}
                                                      name="phoneNumber"
                                                      render={({ field }) => (
                                                            <FormItem>
                                                                  <FormLabel>Phone Number</FormLabel>
                                                                  <FormControl>
                                                                        <Input placeholder="Enter phone number" {...field} />
                                                                  </FormControl>
                                                                  <FormMessage />
                                                            </FormItem>
                                                      )}
                                                />
                                                <FormField
                                                      control={form.control}
                                                      name="description"
                                                      render={({ field }) => (
                                                            <FormItem>
                                                                  <FormLabel>Description</FormLabel>
                                                                  <FormControl>
                                                                        <Textarea placeholder="Enter detailed description" {...field} />
                                                                  </FormControl>
                                                                  <FormMessage />
                                                            </FormItem>
                                                      )}
                                                />
                                                <FormField
                                                      control={form.control}
                                                      name="status"
                                                      render={({ field }) => (
                                                            <FormItem>
                                                                  <FormLabel>Status</FormLabel>
                                                                  <FormControl>
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                              <SelectTrigger>
                                                                                    <SelectValue placeholder="Select status" />
                                                                              </SelectTrigger>
                                                                              <SelectContent>
                                                                                    <SelectItem value="new">New</SelectItem>
                                                                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                                                                    <SelectItem value="resolved">Resolved</SelectItem>
                                                                              </SelectContent>
                                                                        </Select>
                                                                  </FormControl>
                                                                  <p className="text-sm text-muted-foreground">Current status of the query</p>
                                                                  <FormMessage />
                                                            </FormItem>
                                                      )}
                                                />
                                          </div>

                                          <div className="flex justify-end space-x-4 pt-4">
                                                <Button
                                                      type="button"
                                                      variant="outline"
                                                      onClick={async () => {
                                                            await clearDraft();
                                                            router.back();
                                                      }}
                                                      disabled={isLoading}
                                                >
                                                      Cancel
                                                </Button>
                                                <Button type="submit" disabled={isLoading} className="bg-primary-green hover:bg-primary-green/90">
                                                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                      Create Query
                                                </Button>
                                          </div>
                                    </form>
                              </Form>
                        </CardContent>
                  </Card>
            </div>
      );
}
