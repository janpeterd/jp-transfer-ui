import { updateUser } from "@/api/users";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"; // Correct import path for Form components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Role, User } from "@/models/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner"; // Import toast for success/error messages
import { z } from "zod";
import ObjectSelect from "./ObjectSelect";

export default function EditUserForm({ editUser, onComplete }: { editUser: User | undefined, onComplete: () => void }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const roles = [
    { value: Role.Admin, label: "Admin" },
    { value: Role.User, label: "User" },
  ];

  const userSchema = z.object({
    email: z.string().email().nonempty().max(100),
    username: z.string().nonempty().max(100),
    role: z.string().nonempty(), // Role should be string value, not Role enum directly if you are sending string in API
  });


  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: editUser?.email ?? "",
      username: editUser?.username ?? "",
      role: editUser?.role ?? Role.User,
    }
  });

  // Reset form values when editUser changes
  useEffect(() => {
    if (editUser) {
      form.reset({
        email: editUser.email,
        username: editUser.username,
        role: editUser.role,
      });
    }
  }, [editUser, form]);
  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    const email = localStorage.getItem("email");
    if (editUser) {
      try {
        await updateUser(editUser.id, {
          ...editUser,
          ...data,
          role: data.role as Role,
        });
        toast.success("User updated successfully");
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["users"] });
        onComplete();
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(`Failed to update user: ${error.message}`);
        }
        toast.error(`Failed to update user: ${editUser.email}`);
      }
    }
    if (email === editUser?.email) {
      // clear local storage if the user updates their own email
      localStorage.clear();
      navigate({ to: "/" });
    }
  };


  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <div>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Fill out the form below to update a user account.
            </DialogDescription>
          </DialogHeader>
          <div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <FormControl>
                        <Input id="email" type="email" {...field} placeholder="example@mail.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="username" className="text-right">
                        Username
                      </Label>
                      <FormControl>
                        <Input id="username" type="username" {...field} placeholder="example@mail.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="role" className="text-right flex">
                        Role
                      </Label>
                      <ObjectSelect objectName="role" objects={roles} value={field.value} onChange={field.onChange} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Edit User</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </>
  )
};
