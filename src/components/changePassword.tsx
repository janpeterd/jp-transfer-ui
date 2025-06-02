import { changePassword } from '@/api/auth';
import { Button } from '@/components/ui/button';
import {
  DialogFooter
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router'; // Assuming this is @tanstack/react-router
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const changePasswordSchema = z.object({
    oldPassword: z.string().nonempty({ message: "Old password is required." }), // Added specific messages
    newPassword: z.string()
      .nonempty({ message: "New password is required." })
      .min(8, { message: "New password must be at least 8 characters." })
      .max(100, { message: "New password must be at most 100 characters." })
  });

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
    try {
      await changePassword({
        password: data.oldPassword,
        newPassword: data.newPassword
      });

      toast.success('Password changed successfully');

      await queryClient.invalidateQueries({ queryKey: ['loggedinUser'] });

      form.reset();
      localStorage.clear();
      setIsAuthenticated(false);
      navigate({ to: '/login' });

    } catch (error: unknown) {
      let errorMessage = 'Failed to update password. Please try again.';
      if (error instanceof Error) {
        errorMessage = `Failed to update password: ${error.message}`;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="oldPassword" className="text-right"> {/* Removed {...field} from Label, not needed */}
                    Previous Password
                  </Label>
                  <FormControl>
                    <Input id="oldPassword" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="newPassword" className="text-right"> {/* Removed {...field} from Label */}
                    New Password
                  </Label>
                  <FormControl>
                    <Input id="newPassword" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" variant={"secondary"} disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Changing..." : "Change password"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </>
  );
}
