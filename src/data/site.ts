// Personal details used across the site (nav, footer, contact, marquee).

export const site = {
  name: 'Vinay Khanduri',
  role: 'Full-Stack Engineer',
  email: 'ivinaykhanduri@gmail.com',
  phone: '+91 769 635 61 12',
  github: 'https://github.com/Vinay-code12',
  githubLabel: 'github.com/Vinay-code12',
  address: ['#1483 Sector-22B', 'Chandigarh,INDIA'],
  socials: [
    { label: 'instagram', href: 'https://www.instagram.com/vinny.csv/' },
    { label: 'Github', href: 'https://github.com/Vinay-code12' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vinay-khanduri-' },
  ],
};

export type NavLink = { href: string; label: string };

// Skills strip (marquee). `outline: true` renders the word as outlined text.
export const skills: { label: string; outline?: boolean }[] = [
  { label: 'Node.js' },
  { label: 'Express', outline: true },
  { label: 'React' },
  { label: 'MongoDB', outline: true },
  { label: 'PostgreSQL' },
  { label: 'REST APIs', outline: true },
  { label: 'Razorpay' },
  { label: 'JavaScript' },
  { label: 'React Native', outline: true },
  { label: 'AI Voice Agents' },
];
