import React from 'react';
import { Heart, Cake, Users, Camera } from 'lucide-react';
import { Service } from './types';

export const SERVICES: Service[] = [
  {
    slug: "weddings-engagements",
    title: "Weddings & Engagements",
    icon: <Heart className="w-6 h-6" />,
    description: "Capturing the eternal bond of love with elegance and style.",
    longDescription: "Your wedding day is a once-in-a-lifetime event, and we are here to ensure every precious moment is preserved forever. From the intimate glances to the grand celebrations, our approach combines artistic storytelling with technical excellence. We specialize in capturing the unique chemistry between couples, creating a visual narrative that you will cherish for generations.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
    portfolio: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1465495910483-0d6745756038?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    slug: "birthday-parties",
    title: "Birthday Parties",
    icon: <Cake className="w-6 h-6" />,
    description: "Preserving the joy and laughter of your special milestones.",
    longDescription: "Whether it's a child's first birthday or a grand 50th celebration, we capture the energy, laughter, and love that make birthdays so special. Our candid style ensures that we catch all the spontaneous moments—the cake cutting, the surprise reactions, and the joy of being surrounded by friends and family.",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=1200",
    portfolio: [
      "https://images.unsplash.com/photo-1530103862676-fa8c91bbe34b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1533294160622-d5fece3e080d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    slug: "events-functions",
    title: "Events & Functions",
    icon: <Users className="w-6 h-6" />,
    description: "Professional coverage for corporate events and family gatherings.",
    longDescription: "From corporate conferences and product launches to large family reunions, we provide professional and unobtrusive event coverage. We focus on the key highlights, the atmosphere, and the important interactions, delivering high-quality images that serve as a perfect record of your event's success.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200",
    portfolio: [
      "https://images.unsplash.com/photo-1475721027785-f74dea327912?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1505373630103-89d00c2a586d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1540575861501-7c90b707a27d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    slug: "professional-photo-shoots",
    title: "Professional Photo Shoots",
    icon: <Camera className="w-6 h-6" />,
    description: "High-quality portraits and creative conceptual photography.",
    longDescription: "Elevate your personal brand or capture your creative vision with our professional studio and outdoor photo shoots. Whether you need corporate headshots, fashion portfolios, or artistic conceptual portraits, we work closely with you to achieve the perfect look, lighting, and mood.",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200",
    portfolio: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
    ]
  }
];
