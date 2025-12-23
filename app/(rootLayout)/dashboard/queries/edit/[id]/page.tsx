"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { querySchema, QueryFormData } from "@/formschema/querySchema";
import { updateQuery, getQueryById } from "@/apiServices/queries/api.queriesServices";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDraft } from "@/hooks/useDraft";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QueryFormSkeleton } from "../../QueryFormSkeleton";
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
import Link from "next/link";

export default function EditQueryPage() {
      const router = useRouter();
      const params = useParams();
      const queryId = params.id as string;
      const { toast } = useToast();
      const queryClient = useQueryClient();
      const [isLoading, setIsLoading] = useState(false);

      const { data: queryData, isLoading: isFetching } = useQuery({
            queryKey: ["query", queryId],
            queryFn: async () => {
                  const response = await getQueryById(queryId);
                  return response.data;
            },
            enabled: !!queryId,
      });

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

      // Integrate Draft Hook
      // Pass the form instance and server data. UseDraft decides what to load.
      const { clearDraft, isLoading: isDraftLoading } = useDraft<QueryFormData>(form, `edit-query-draft-${queryId}`, {
            serverData: queryData as QueryFormData
      });

      const handleSubmit = async (data: QueryFormData) => {
            setIsLoading(true);
            try {
                  const res = await updateQuery(queryId, data);
                  toast({
                        title: "Success",
                        description: `${res.message}`,
                        variant: "default",
                  });
                  queryClient.invalidateQueries({ queryKey: ["queries"], exact: false });
                  queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
                  await clearDraft();
                  router.push("/dashboard/queries");
            } catch (error: any) {
                  toast({
                        title: "Error",
                        description: error.message || "Failed to update query",
                        variant: "destructive",
                  });
            } finally {
                  setIsLoading(false);
            }
      };

      if (isFetching) {
            return <QueryFormSkeleton />;
      }

      if (!queryData) {
            return <div>Query not found</div>;
      }

      return (
            <div className="space-y-6">
                  <div className="flex items-center gap-4">
                        <Link href="/dashboard/queries">
                              <Button variant="outline" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                              </Button>
                        </Link>
                        <div>
                              <h1 className="text-xl font-bold">Edit Query</h1>
                              <p className="text-muted-foreground mt-1">
                                    Update the query details.
                              </p>
                        </div>
                  </div>

                  <div className=" mx-auto rounded-xs py-8">
                        <Card className="w-full">
                              <CardHeader>
                                    <CardTitle>Edit Query</CardTitle>
                                    <p className="text-sm text-muted-foreground">Update the customer query details.</p>
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
                                                                              <Select onValueChange={field.onChange} value={field.value}>
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
                                                            onClick={() => router.back()}
                                                            disabled={isLoading}
                                                      >
                                                            Cancel
                                                      </Button>
                                                      <Button type="submit" disabled={isLoading} className="bg-primary-green hover:bg-primary-green/90">
                                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                            Update Query
                                                      </Button>
                                                </div>
                                          </form>
                                    </Form>
                              </CardContent>
                        </Card>
                  </div>
            </div>
      );
}