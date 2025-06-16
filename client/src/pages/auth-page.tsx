import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Leaf, Eye, EyeOff, Github, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";

const loginSchema = insertUserSchema.pick({ username: true, password: true });
type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = Omit<z.infer<typeof insertUserSchema>, 'fullName'> & {
  fullName: string;
  email: string;
  phone: string;
};

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 p-4">
        <motion.div 
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-green-800 flex items-center gap-2">
              <Leaf className="h-8 w-8" />
              AgriAI
            </h1>
            <p className="mt-2 text-lg text-green-700">
              Your AI-powered agricultural assistant
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div 
          className="hidden md:flex flex-col justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Smart Agriculture Platform</CardTitle>
              <CardDescription>
                Leverage AI to optimize your farming decisions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Feature icon="🌱" title="Plant Disease Detection" />
                <Feature icon="🌾" title="Seed Recommendations" />
                <Feature icon="🌞" title="Seasonal Crop Planning" />
                <Feature icon="🤖" title="AI Farming Assistant" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function LoginForm() {
  const { loginMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Login to access your agricultural dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} className="transition-all duration-200 focus:ring-2 focus:ring-green-500" />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        {...field} 
                        className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-green-600 hover:text-green-700">
                Forgot password?
              </a>
            </div>
            <Button 
              type="submit" 
              className="w-full transition-all duration-200 hover:scale-[1.02]" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function RegisterForm() {
  const { registerMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(
      insertUserSchema.extend({
        email: z.string().email("Please enter a valid Gmail address").refine(
          (email) => email.toLowerCase().endsWith("@gmail.com"),
          "Please use a Gmail address"
        ),
        phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long")
      })
    ),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      email: "",
      phone: ""
    }
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  const password = form.watch("password");
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(password);
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Join our smart farming community</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="transition-all duration-200 focus:ring-2 focus:ring-green-500" />
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
                  <FormLabel>Gmail Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="email" 
                        placeholder="example@gmail.com"
                        {...field} 
                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="tel" 
                        placeholder="+1234567890"
                        {...field} 
                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
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
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} className="transition-all duration-200 focus:ring-2 focus:ring-green-500" />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        {...field} 
                        className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <div className="mt-2">
                    <div className="flex gap-1 h-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            i < strength ? strengthColors[strength - 1] : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {strength === 0 && "Enter a password"}
                      {strength === 1 && "Weak"}
                      {strength === 2 && "Fair"}
                      {strength === 3 && "Good"}
                      {strength === 4 && "Strong"}
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full transition-all duration-200 hover:scale-[1.02]" 
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function Feature({ icon, title }: { icon: string; title: string }) {
  return (
    <motion.div 
      className="flex items-center gap-2 p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-200"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-medium text-green-800">{title}</span>
    </motion.div>
  );
}