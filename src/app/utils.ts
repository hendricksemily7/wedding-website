interface DynamicDictionary {
    [key: string]: string;
}

export const weddingNavLinksList = [
    { label: 'Home', href: '/', target: '' },
    { label: 'Schedule', href: '/schedule', target: '' },
    { label: 'Our Story', href: '/our-story', target: '' },
    { label: 'Travel & Accommodations', href: '/travel', target: '' },
    { label: 'Venue', href: '/venue', target: '' },
    { label: 'RSVP', href: '/rsvp', target: '' },
    { label: 'FAQ', href: '/faq', target: '' },
    { label: 'Registry', href: 'https://registry.theknot.com/-december-2026-vt/75002398', target: 'blank' },
  ];

export const navLinksDict: DynamicDictionary = {};
weddingNavLinksList.forEach(link => {
  const key = link.href
  navLinksDict[key] = link.label
});

