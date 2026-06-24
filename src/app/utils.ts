interface DynamicDictionary {
    [key: string]: string;
}

export const weddingNavLinksList = [
    { label: 'Home', href: '/', target: '' },
    { label: 'Our Story', href: '/our-story', target: '' },
    { label: 'Accommodations', href: '/accommodations', target: '' },
    { label: 'Venue', href: '/venue', target: '' },
    { label: 'Registry', href: 'https://registry.theknot.com/-december-2026-vt/75002398', target: '_blank' },
    { label: 'RSVP', href: '/rsvp', target: '' },
    { label: 'Q&A', href: '/qa', target: '' },
  ];

export const navLinksDict: DynamicDictionary = {};
weddingNavLinksList.forEach(link => {
  const key = link.href
  navLinksDict[key] = link.label
});

export const calculateDaysToGo = () => {
  const weddingDate = new Date(2026, 8, 26, 0, 0, 0); // Month is 0-indexed, so 8 = September
  const now = new Date();
  const diffTime = weddingDate.getTime() - now.getTime();
  const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    return `${diffDays} DAYS TO GO!`; 
}

