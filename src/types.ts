import { ReactNode } from 'react';

export interface Service {
  slug: string;
  title: string;
  icon: ReactNode;
  description: string;
  longDescription: string;
  image: string;
  portfolio: string[];
}

export interface BookingData {
  serviceType: string;
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

export interface TestimonialData {
  id: string;
  clientName: string;
  review: string;
  rating: number;
  createdAt: any;
}
