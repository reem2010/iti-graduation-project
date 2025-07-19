"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Shield,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Calendar,
  MessageCircle,
  BookOpenCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const services = [
    {
      icon: MessageCircle,
      title: "Individual Therapy",
      description:
        "One-on-one sessions with licensed therapists tailored to your specific needs and goals.",
      features: [
        "Personalized treatment plans",
        "Flexible scheduling",
        "Evidence-based approaches",
      ],
    },
    {
      icon: BookOpenCheck,
      title: "Therapist Blogs",
      description:
        "Expert-written blogs by licensed therapists covering mental health, personal growth, and wellness strategies.",
      features: [
        "Professionally written content",
        "Evidence-based insights",
        "Topics on anxiety, depression, relationships, and more",
      ],
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Book Your Session",
      description:
        "Choose from our qualified therapists and schedule at your convenience.",
      icon: Calendar,
    },
    {
      number: "02",
      title: "Connect Securely",
      description:
        "Join your session through our secure, encrypted platform from anywhere.",
      icon: Shield,
    },
    {
      number: "03",
      title: "Begin Your Journey",
      description:
        "Start your path to better mental health with personalized care and support.",
      icon: Heart,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Al-Mansouri",
      role: "Marketing Professional",
      content:
        "Siraj changed my life. The therapists are incredibly professional and understanding. I finally found the support I needed.",
      rating: 5,
    },
    {
      name: "Ahmed Hassan",
      role: "University Student",
      content:
        "The flexibility and accessibility of Siraj made it possible for me to get help while managing my studies. Highly recommended.",
      rating: 5,
    },
    {
      name: "Fatima Al-Zahra",
      role: "Working Mother",
      content:
        "As a busy mom, finding time for therapy seemed impossible. Siraj's online platform made it convenient and effective.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                🌟 Professional Mental Health Support
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Your path to{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-amber-600 bg-clip-text text-transparent">
                  mental wellness
                </span>{" "}
                starts here
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Connect with licensed therapists and mental health professionals
                through our secure, culturally-sensitive platform. Take the
                first step towards a healthier, happier you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => {
                  if (!user) {
                    router.push("/auth");
                  } else {
                    router.push("/doctor");
                  }
                }}
                size="lg"
                className="cursor-pointer bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-emerald-100 text-emerald-800">
              Our Services
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Comprehensive Mental Health Support
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer a range of evidence-based therapeutic services designed
              to meet your unique needs and goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 justify-center">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-emerald-100 hover:border-emerald-200"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-b from-emerald-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-amber-100 text-amber-800">
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Getting Started is Easy
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Begin your mental health journey in just three simple steps. We've
              made it convenient and accessible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="text-center space-y-6 relative">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-emerald-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-emerald-100 text-emerald-800">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Stories of Transformation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from our clients about their journey to better mental health
              with Siraj.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-emerald-100 hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t border-emerald-100 pt-4">
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Start Your Mental Health Journey?
            </h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Take the first step towards better mental health. Our licensed
              professionals are here to support you every step of the way.
            </p>

            <div className="flex items-center justify-center space-x-8 text-emerald-100">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>100% Confidential</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Licensed Therapists</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
