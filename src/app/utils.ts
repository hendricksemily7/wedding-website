interface DynamicDictionary {
    [key: string]: string;
}

export const weddingNavLinksList = [
    { label: 'Home', href: '/' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'Travel', href: '/travel' },
    { label: 'Venue', href: '/venue' },
    // { label: 'Wedding Party', href: '/wedding-party' },
    { label: 'Registry', href: '/registry' },
    { label: 'RSVP', href: '/rsvp' },
    { label: 'Things to Do', href: '/things-to-do' },
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

