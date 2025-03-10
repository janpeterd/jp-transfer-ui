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
import { setPassword } from '@/api/auth'
import { useQueryClient } from '@tanstack/react-query'
import { User } from '@/models/User'
import { useNavigate } from '@tanstack/react-router'

export default function SetPasswordForm({
  user,
  closeForm
}: {
  user: User
  closeForm: () => void
}) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const setPasswordSchema = z.object({
    password: z.string().nonempty().min(8).max(100)
  })

  const form = useForm<z.infer<typeof setPasswordSchema>>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof setPasswordSchema>) => {
    const email = localStorage.getItem('email')
    try {
      await setPassword(user.email, data.password)
      toast.success('Password changed successfully')
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['users'] })
      if (user.email === email) {
        localStorage.clear()
        navigate({ to: '/login' })
      }
      closeForm()
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
            <DialogTitle>Set password for {user && user.email}</DialogTitle>
            <DialogDescription>
              Fill out the form below to set the password for {user && user.email}.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

                <DialogFooter>
                  <Button type="submit">Set password</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </>
  )
}
