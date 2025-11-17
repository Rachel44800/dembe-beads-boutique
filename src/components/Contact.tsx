import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Instagram } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  phone: z.string().trim().min(1, { message: "Phone number is required" }).max(20, { message: "Phone must be less than 20 characters" }),
  message: z.string().trim().min(1, { message: "Message is required" }).max(1000, { message: "Message must be less than 1000 characters" })
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: data.name,
            email: data.email,
            message: `${data.message}\n\nPhone: ${data.phone}`,
          },
        ]);

      if (error) throw error;

      toast.success("Message sent successfully! We'll get back to you soon.");
      form.reset();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-12 sm:py-16 md:py-24 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-blue-200/5 to-cyan-200/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10 text-center">
          <h1 className="mb-3 text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-600 leading-relaxed">
            Have a question or want to place a custom order? We'd love to hear from you! 
            <span className="block mt-2 text-base text-gray-500">
              Our team is here to help you create something beautiful.
            </span>
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information Card */}
            <div className="group relative rounded-2xl border border-white/50 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
                </div>
                <div className="space-y-5">
                  <a 
                    href="mailto:dembemandavha@gmail.com" 
                    className="group/item flex items-start gap-4 p-3 rounded-xl hover:bg-blue-50/50 transition-colors duration-200"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover/item:bg-blue-200 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                      <p className="text-base font-medium text-gray-900 break-all group-hover/item:text-blue-600 transition-colors">
                        dembemandavha@gmail.com
                      </p>
                    </div>
                  </a>
                  <a 
                    href="tel:+27793637793" 
                    className="group/item flex items-start gap-4 p-3 rounded-xl hover:bg-cyan-50/50 transition-colors duration-200"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 group-hover/item:bg-cyan-200 transition-colors">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                      <p className="text-base font-medium text-gray-900 group-hover/item:text-cyan-600 transition-colors">
                        +27 79 363 7793
                      </p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4 p-3 rounded-xl">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Location</p>
                      <p className="text-base font-medium text-gray-900">
                        Handcrafted with love
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="group relative rounded-2xl border border-white/50 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Business Hours</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                    <span className="text-sm font-medium text-gray-600">Monday - Friday</span>
                    <span className="text-sm font-bold text-gray-900">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                    <span className="text-sm font-medium text-gray-600">Saturday</span>
                    <span className="text-sm font-bold text-gray-900">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                    <span className="text-sm font-medium text-gray-600">Sunday</span>
                    <span className="text-sm font-bold text-red-600">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="group relative rounded-2xl border border-white/50 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Follow Us</h3>
                <div className="flex items-center gap-4">
                  <a 
                    href="https://www.instagram.com/dembe_beads?igsh=dDBxOXpmNWp5b285" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className="group relative rounded-2xl border border-white/50 bg-white/80 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                    <Send className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Send Us a Message</h3>
                    <p className="text-sm text-gray-500 mt-1">We typically respond within 24 hours</p>
                  </div>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-700">Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="John Doe" 
                                className="h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
                                {...field} 
                              />
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
                            <FormLabel className="text-base font-semibold text-gray-700">Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="john@example.com" 
                                className="h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-gray-700">Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              type="tel" 
                              placeholder="+27 79 363 7793" 
                              className="h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-gray-700">Your Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your inquiry, custom order request, or any questions you have..." 
                              className="min-h-[160px] bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-2">Sending...</span>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
