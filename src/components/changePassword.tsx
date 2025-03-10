import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form' // Correct import path for Form components
import { toast } from 'sonner' // Import toast for success/error messages
import { changePassword } from '@/api/auth'
import { useNavigate } from '@tanstack/react-router'

export default function ChangePasswordForm() {
  const navigate = useNavigate()
  const changePasswordSchema = z.object({
    oldPassword: z.string().nonempty(),
    newPassword: z.string().nonempty().min(8).max(100)
  })

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
    try {
      await changePassword({
        password: data.oldPassword,
        newPassword: data.newPassword
      })
      toast.success('Password changed successfully')
      form.reset()
      localStorage.clear()
      navigate({ to: '/login' })
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Failed to update password: ${error.message}`)
      }
      toast.error('Failed to update password')
    }
  }

  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <div>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>Fill out the form below to change your password. </DialogDescription>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="oldPassword" {...field} className="text-right">
                        Previous Password
                      </Label>
                      <FormControl>
                        <Input id="oldPassword" type="oldPassword" {...field} />
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
                      <Label htmlFor="newPassword" {...field} className="text-right">
                        New Password
                      </Label>
                      <FormControl>
                        <Input id="newPassword" type="newPassword" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Change password</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </>
  )
}
