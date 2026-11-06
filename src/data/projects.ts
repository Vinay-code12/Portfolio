// Selected projects. Cards are numbered in this order (01, 02, ...).
// To add a project, add an object here; screenshots live in /public/images.

type BrowserPreview = {
  type: 'browser';
  image: string;
  alt: string;
  displayUrl: string; // shown in the fake browser address bar
  fallback: string; // shown if the image fails to load
};

type PhonePreview = {
  type: 'phone';
  eyebrow: string;
  name: string;
  sub: string;
};

export type Project = {
  title: string;
  tag: string;
  accent: string;
  description: string;
  stack: string[];
  url: string;
  linkLabel?: string; // defaults to "Visit Site"
  mediaLabel: string; // accessible label for the preview link
  preview: BrowserPreview | PhonePreview;
};

export const projects: Project[] = [
  {
    title: 'Mavriq AI',
    tag: 'Full-Stack · AI Voice Agents',
    accent: '#7c6cff',
    description:
      'An AI calling-agent platform that automates inbound and outbound business calls, customer support and lead qualification. Built end to end on the MERN stack with Razorpay payments, including the backend that assigns AI voice agents to phone numbers for outbound calling.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Razorpay', 'ElevenLabs'],
    url: 'https://mavriq.co.in/',
    mediaLabel: 'Open the Mavriq AI website',
    preview: {
      type: 'browser',
      image: '/images/project-mavriq.jpg',
      alt: 'Mavriq AI homepage',
      displayUrl: 'mavriq.co.in',
      fallback: 'Mavriq AI',
    },
  },
  {
    title: 'Ganesha Dining Group',
    tag: 'Mobile App · Client Project',
    accent: '#f59e0b',
    description:
      'A restaurant app for a Mavriq AI client, built end to end on my own: React Native screens backed by Node.js and Express REST APIs, with MongoDB models for outlets, menus, food orders, dine-in reservations, offers and feedback, plus integration with the client’s existing POS system.',
    stack: ['React Native', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'POS APIs'],
    url: 'https://mavriq.co.in/',
    linkLabel: 'Built at Mavriq',
    mediaLabel: 'Open the Mavriq AI website',
    preview: {
      type: 'phone',
      eyebrow: 'Mobile App',
      name: 'Ganesha Dining Group',
      sub: 'Menus · Orders · Reservations · Offers',
    },
  },
  {
    title: 'DaktarZ',
    tag: 'Full-Stack · Healthcare',
    accent: '#26abe3',
    description:
      'A personalised healthcare platform where patients can book an ambulance in an emergency, consult verified doctors online, book lab tests, order medicines with live tracking and keep their medical records in one place. Built end to end on the MERN stack with Razorpay payments.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Razorpay', 'PWA'],
    url: 'https://daktarz.in/',
    mediaLabel: 'Open the DaktarZ website',
    preview: {
      type: 'browser',
      image: '/images/project-daktarz.jpg',
      alt: 'DaktarZ homepage',
      displayUrl: 'daktarz.in',
      fallback: 'DaktarZ',
    },
  },
  {
    title: 'KalaHub',
    tag: 'Full-Stack · Marketplace',
    accent: '#d0603f',
    description:
      'An artist discovery and booking platform. Event organisers can explore singers, bands, poets, comedians, DJs and creators, view their portfolios and book talent. Built end to end on the MERN stack with Razorpay payments, scroll-driven GSAP motion and a light/dark theme.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Razorpay', 'Tailwind CSS', 'GSAP'],
    url: 'https://www.kalahub.live/',
    mediaLabel: 'Open the KalaHub website',
    preview: {
      type: 'browser',
      image: '/images/project-kalahub.jpg',
      alt: 'KalaHub homepage',
      displayUrl: 'kalahub.live',
      fallback: 'KalaHub',
    },
  },
  {
    title: 'Bella Vista Motel',
    tag: 'Full-Stack · Hospitality',
    accent: '#d8c08a',
    description:
      'A booking website for a 25-room motel on the NSW Central Coast, Australia: rooms, local attractions, gallery, an availability check with date and guest pickers, and an AI voice assistant guests can call. Built end to end on the MERN stack with Razorpay payments.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Razorpay', 'ElevenLabs Voice AI'],
    url: 'https://bella-vista-motel.vercel.app/',
    mediaLabel: 'Open the Bella Vista Motel website',
    preview: {
      type: 'browser',
      image: '/images/project-bellavista.jpg',
      alt: 'Bella Vista Motel homepage',
      displayUrl: 'bella-vista-motel.vercel.app',
      fallback: 'Bella Vista',
    },
  },
  {
    title: 'VArch',
    tag: 'Frontend · Website Clone',
    accent: '#3fb39a',
    description:
      'A creative agency website clone built with ReactJS and Tailwind CSS, with smooth GSAP animations, a fully responsive layout and interactive transitions.',
    stack: ['React', 'Tailwind CSS', 'GSAP'],
    url: 'https://motion-eight-lake.vercel.app/',
    mediaLabel: 'Open the VArch website clone',
    preview: {
      type: 'browser',
      image: '/images/img.png',
      alt: 'VArch website clone homepage',
      displayUrl: 'motion-eight-lake.vercel.app',
      fallback: 'VArch',
    },
  },
];
