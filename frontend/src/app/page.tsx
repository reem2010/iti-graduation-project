"use client";

import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { 
  Heart, 
  Shield, 
  Users, 
  Clock, 
  CheckCircle, 
  Star,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Play,
  Calendar,
  MessageCircle,
  UserCheck,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const [email, setEmail] = useState('');

  const services = [
    {
      icon: MessageCircle,
      title: "Individual Therapy",
      description: "One-on-one sessions with licensed therapists tailored to your specific needs and goals.",
      features: ["Personalized treatment plans", "Flexible scheduling", "Evidence-based approaches"]
    },
    {
      icon: Users,
      title: "Group Therapy",
      description: "Connect with others facing similar challenges in a supportive group environment.",
      features: ["Peer support", "Shared experiences", "Cost-effective treatment"]
    },
    {
      icon: Calendar,
      title: "Crisis Support",
      description: "24/7 immediate support for mental health emergencies and crisis situations.",
      features: ["24/7 availability", "Immediate response", "Emergency interventions"]
    },
    {
      icon: UserCheck,
      title: "Wellness Coaching",
      description: "Holistic approach to mental wellness with lifestyle and mindfulness coaching.",
      features: ["Mindfulness training", "Lifestyle guidance", "Stress management"]
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Book Your Session",
      description: "Choose from our qualified therapists and schedule at your convenience.",
      icon: Calendar
    },
    {
      number: "02", 
      title: "Connect Securely",
      description: "Join your session through our secure, encrypted platform from anywhere.",
      icon: Shield
    },
    {
      number: "03",
      title: "Begin Your Journey",
      description: "Start your path to better mental health with personalized care and support.",
      icon: Heart
    }
  ];

  const testimonials = [
    {
      name: "Sarah Al-Mansouri",
      role: "Marketing Professional",
      content: "Siraj changed my life. The therapists are incredibly professional and understanding. I finally found the support I needed.",
      rating: 5
    },
    {
      name: "Ahmed Hassan",
      role: "University Student", 
      content: "The flexibility and accessibility of Siraj made it possible for me to get help while managing my studies. Highly recommended.",
      rating: 5
    },
    {
      name: "Fatima Al-Zahra",
      role: "Working Mother",
      content: "As a busy mom, finding time for therapy seemed impossible. Siraj's online platform made it convenient and effective.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-emerald-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent">
                Siraj
              </span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-700 hover:text-emerald-700 transition-colors">Services</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-emerald-700 transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-emerald-700 transition-colors">Testimonials</a>
              <a href="#contact" className="text-gray-700 hover:text-emerald-700 transition-colors">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50">
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                  🌟 Professional Mental Health Support
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Your path to{' '}
                  <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-amber-600 bg-clip-text text-transparent">
                    mental wellness
                  </span>{' '}
                  starts here
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with licensed therapists and mental health professionals through our secure, 
                  culturally-sensitive platform. Take the first step towards a healthier, happier you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300">
                  <Play className="mr-2 w-5 h-5" />
                  Watch How It Works
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-700">10K+</div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-700">500+</div>
                  <div className="text-sm text-gray-600">Licensed Therapists</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-700">24/7</div>
                  <div className="text-sm text-gray-600">Support Available</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl p-8 shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/6823509/pexels-photo-6823509.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Mental health counseling session"
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Available Now</span>
                  </div>
                </div>
              </div>
              
              {/* Floating trust indicators */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl p-3 shadow-xl">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-medium">100% Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-emerald-100 text-emerald-800">Our Services</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Comprehensive Mental Health Support
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer a range of evidence-based therapeutic services designed to meet your unique needs and goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-emerald-100 hover:border-emerald-200">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
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
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-amber-100 text-amber-800">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Getting Started is Easy
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Begin your mental health journey in just three simple steps. We've made it convenient and accessible.
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
                  <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
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
            <Badge className="bg-emerald-100 text-emerald-800">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Stories of Transformation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from our clients about their journey to better mental health with Siraj.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-emerald-100 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                  <div className="border-t border-emerald-100 pt-4">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
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
              Take the first step towards better mental health. Our licensed professionals are here to support you every step of the way.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-emerald-200"
              />
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl whitespace-nowrap">
                Get Started Free
              </Button>
            </div>

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

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-emerald-100 text-emerald-800">Get In Touch</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  We're Here to Help
                </h2>
                <p className="text-xl text-gray-600">
                  Have questions about our services? Need immediate support? Our team is available to assist you.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">24/7 Crisis Hotline</div>
                    <div className="text-gray-600">+971 800 SIRAJ (74725)</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email Support</div>
                    <div className="text-gray-600">support@siraj.ae</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Office Location</div>
                    <div className="text-gray-600">Dubai Healthcare City, UAE</div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-emerald-100">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Send us a message</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="border-emerald-200 focus:border-emerald-400" />
                  <Input placeholder="Last Name" className="border-emerald-200 focus:border-emerald-400" />
                </div>
                <Input placeholder="Email Address" type="email" className="border-emerald-200 focus:border-emerald-400" />
                <Input placeholder="Phone Number" type="tel" className="border-emerald-200 focus:border-emerald-400" />
                <Textarea placeholder="How can we help you?" rows={4} className="border-emerald-200 focus:border-emerald-400" />
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">Siraj</span>
              </div>
              <p className="text-gray-400">
                Empowering mental wellness through professional, culturally-sensitive care.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Individual Therapy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Group Therapy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Crisis Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Wellness Coaching</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Mental Health Articles</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Self-Help Tools</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support Groups</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Crisis Resources</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Siraj Mental Health Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}