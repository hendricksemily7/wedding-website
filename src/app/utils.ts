interface DynamicDictionary {
    [key: string]: string;
}

export const weddingNavLinksList = [
    { label: 'Home', href: '/' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'Things to Do', href: '/things-to-do' },
    { label: 'Wedding Party', href: '/wedding-party' },
    { label: 'Registry', href: '/registry' },
    { label: 'Accommodations', href: '/accommodations' },
    { label: 'RSVP', href: '/rsvp' },
  ];

export const navLinksDict: DynamicDictionary = {};
weddingNavLinksList.forEach(link => {
  const key = link.href
  navLinksDict[key] = link.label
});

export const calculateDaysToGo = () => {
    const weddingDate = new Date('2026-09-26T00:00:00'); // September 26, 2026
    const today = new Date();
    const diffTime = Math.abs(weddingDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} DAYS TO GO!`;
  };