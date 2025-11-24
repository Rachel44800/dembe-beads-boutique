import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
// FeaturedProducts removed from Auth page

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  fullName: z.string().trim().min(1, { message: "Full name is required" }),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const Auth = () => {
  usePageTitle("Sign In");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetPasswordField, setShowResetPasswordField] = useState(false);
  const [showConfirmPasswordField, setShowConfirmPasswordField] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Check for password reset token in URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (accessToken && type === 'recovery') {
      setShowResetPassword(true);
      sessionStorage.setItem('isResettingPassword', 'true');
      // Clear the hash from URL
      window.history.replaceState(null, '', window.location.pathname);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setShowResetPassword(true);
          sessionStorage.setItem('isResettingPassword', 'true');
        } else if (session) {
          // Check if user is currently resetting password
          const isResetting = window.location.hash.includes('type=recovery') || 
                             sessionStorage.getItem('isResettingPassword') === 'true';
          
          if (!isResetting) {
            // Check if there's a redirect path stored
            const redirectPath = sessionStorage.getItem("redirectAfterLogin");
            if (redirectPath) {
              sessionStorage.removeItem("redirectAfterLogin");
              navigate(redirectPath);
            } else {
              navigate("/");
            }
          }
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      const isResetting = window.location.hash.includes('type=recovery');
      if (session && !isResetting) {
        const redirectPath = sessionStorage.getItem("redirectAfterLogin");
        if (redirectPath) {
          sessionStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath);
        } else {
          navigate("/");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const onLogin = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password");
        } else if (error.message.includes("Email not confirmed") || error.message.includes("email_not_confirmed")) {
          toast.error("Please check your email and click the confirmation link to verify your account");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Welcome back!");
        // Check if there's a redirect path stored
        const redirectPath = sessionStorage.getItem("redirectAfterLogin");
        if (redirectPath) {
          sessionStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath);
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onSignup = async (data: SignupFormValues) => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("This email is already registered. Please login instead.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Account created! Please check your email and click the confirmation link to verify your account.", {
          duration: 5000,
        });
        // Don't navigate away - user needs to confirm email first
        // They can log in after confirming
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onForgotPassword = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    // Validate email using form validation
    const emailValue = loginForm.getValues("email");
    const emailValidation = await loginForm.trigger("email");
    
    if (!emailValue || !emailValidation) {
      toast.error("Please enter a valid email address");
      loginForm.setFocus("email");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailValue, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setResetEmailSent(true);
        toast.success("Password reset link sent! Check your email.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (data: ResetPasswordFormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated successfully! You can now sign in.");
        sessionStorage.removeItem('isResettingPassword');
        setShowResetPassword(false);
        resetPasswordForm.reset();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="relative flex-1 flex items-center justify-center px-4 py-16 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-background" />

        <Card className="w-full max-w-md border border-border/50 bg-card/95 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-foreground/10 animate-[pop_0.4s_ease-out]">
              <span className="text-2xl font-bold">DB</span>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-foreground">Welcome to Dembe Beads</CardTitle>
              <CardDescription className="text-base">Sign in to your account or create a new one</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {showResetPassword ? (
              <Form {...resetPasswordForm}>
                <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)} className="space-y-5">
                  <div className="text-center mb-6">
                    <CardTitle className="text-2xl font-bold mb-2 text-foreground">Reset Your Password</CardTitle>
                    <CardDescription className="text-base">Enter your new password below</CardDescription>
                  </div>
                  <FormField
                    control={resetPasswordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-foreground">New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground" />
                            <Input 
                              type={showResetPasswordField ? "text" : "password"} 
                              placeholder="Enter your new password" 
                              {...field} 
                              className="pl-11 pr-11 h-11 border-2 focus:border-foreground focus:ring-foreground" 
                            />
                            <button
                              type="button"
                              aria-label={showResetPasswordField ? "Hide password" : "Show password"}
                              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => setShowResetPasswordField((v) => !v)}
                            >
                              {showResetPasswordField ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetPasswordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-foreground">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground" />
                            <Input 
                              type={showConfirmPasswordField ? "text" : "password"} 
                              placeholder="Confirm your new password" 
                              {...field} 
                              className="pl-11 pr-11 h-11 border-2 focus:border-foreground focus:ring-foreground" 
                            />
                            <button
                              type="button"
                              aria-label={showConfirmPasswordField ? "Hide password" : "Show password"}
                              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => setShowConfirmPasswordField((v) => !v)}
                            >
                              {showConfirmPasswordField ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-11 bg-blue-primary text-blue-primary-foreground shadow-md hover:shadow-lg transition-all font-semibold text-base" disabled={loading}>
                    {loading ? "Updating password..." : "Update Password"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => {
                      sessionStorage.removeItem('isResettingPassword');
                      setShowResetPassword(false);
                      resetPasswordForm.reset();
                    }}
                    disabled={loading}
                  >
                    Back to Login
                  </Button>
                </form>
              </Form>
            ) : (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-12 bg-secondary/50 p-1 rounded-lg">
                  <TabsTrigger value="login" className="rounded-md data-[state=active]:bg-blue-primary data-[state=active]:text-blue-primary-foreground font-semibold transition-all">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-md data-[state=active]:bg-blue-primary data-[state=active]:text-blue-primary-foreground font-semibold transition-all">Sign Up</TabsTrigger>
                </TabsList>

              <TabsContent value="login" className="animate-in fade-in-0 slide-in-from-bottom-1 mt-6">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-foreground">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground" />
                              <Input type="email" placeholder="your.email@example.com" {...field} className="pl-11 h-11 border-2 focus:border-foreground focus:ring-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-foreground">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground" />
                              <Input type={showLoginPassword ? "text" : "password"} placeholder="Enter your password" {...field} className="pl-11 pr-11 h-11 border-2 focus:border-foreground focus:ring-foreground" />
                              <button
                                type="button"
                                aria-label={showLoginPassword ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setShowLoginPassword((v) => !v)}
                              >
                                {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center justify-between pt-1">
                      <div></div>
                      <button
                        type="button"
                        onClick={(e) => onForgotPassword(e)}
                        className="text-sm font-medium text-foreground hover:underline transition-colors"
                        disabled={loading}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <Button type="submit" className="w-full h-11 bg-blue-primary text-blue-primary-foreground shadow-md hover:shadow-lg transition-all font-semibold text-base" disabled={loading}>
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup" className="animate-in fade-in-0 slide-in-from-bottom-1 mt-6">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-5">
                    <FormField
                      control={signupForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-foreground">Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground" />
                              <Input placeholder="Enter your full name" {...field} className="pl-11 h-11 border-2 focus:border-foreground focus:ring-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-foreground">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground" />
                              <Input type="email" placeholder="your.email@example.com" {...field} className="pl-11 h-11 border-2 focus:border-foreground focus:ring-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-foreground">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground" />
                              <Input type={showSignupPassword ? "text" : "password"} placeholder="Create a password" {...field} className="pl-11 pr-11 h-11 border-2 focus:border-foreground focus:ring-foreground" />
                              <button
                                type="button"
                                aria-label={showSignupPassword ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setShowSignupPassword((v) => !v)}
                              >
                                {showSignupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full h-11 bg-blue-primary text-blue-primary-foreground shadow-md hover:shadow-lg transition-all font-semibold text-base" disabled={loading}>
                      {loading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
