interface DynamicDictionary {
    [key: string]: string;
}

export const weddingNavLinksList = [
    { label: 'Home', href: '/', target: '' },
    { label: 'Our Story', href: '/our-story', target: '' },
    { label: 'Accommodations', href: '/accommodations', target: '' },
    { label: 'Venue', href: '/venue', target: '' },
    { label: 'Registry', href: 'https://registry.theknot.com/-december-2026-vt/75002398', target: 'blank' },
    { label: 'RSVP', href: '/rsvp', target: '' },
    { label: 'Q&A', href: '/q&a', target: '' },
  ];

export const navLinksDict: DynamicDictionary = {};
weddingNavLinksList.forEach(link => {
  const key = link.href
  navLinksDict[key] = link.label
});

export const calculateDaysToGo = () => {
    const weddingDate = new Date('2026-09-26');
    const today = new Date();
    const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const weddingUTC = Date.UTC(weddingDate.getFullYear(), weddingDate.getMonth(), weddingDate.getDate());
    const diffTime = Math.abs(weddingUTC - todayUTC);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return `${diffDays} DAYS TO GO!`; 
}

