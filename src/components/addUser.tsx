import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"
import { Role, User } from "@/models/User";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"; // Correct import path for Form components
import { toast } from "sonner"; // Import toast for success/error messages
import ObjectSelect from "./ObjectSelect";
import { register } from "@/api/auth";
import { useQueryClient } from "@tanstack/react-query";

// Renamed component to AddUserForm to indicate it's just the form content
export default function AddUserForm({ editUser }: { editUser: User | undefined; }) {
  const queryClient = useQueryClient();
  const roles = [
    { value: Role.Admin, label: "Admin" },
    { value: Role.User, label: "User" },
  ];

  const userSchema = z.object({
    email: z.string().email().nonempty().max(100),
    password: z.string().nonempty().min(8).max(100),
    role: z.string().nonempty(), // Role should be string value, not Role enum directly if you are sending string in API
  });


  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: editUser?.email ?? "",
      password: editUser?.password ?? "",
      role: editUser?.role ?? Role.User,
    }
  });

  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    try {
      await register({
        ...data,
      });
      toast.success("User created successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Failed to create user: ${error.message}`);
      }
      toast.error("Failed to create user");
    }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new user account.
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="password" {...field} className="text-right">
                        Password
                      </Label>
                      <FormControl>
                        <Input id="password" type="password" {...field} />
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
                  <Button type="submit">Add User</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
};
