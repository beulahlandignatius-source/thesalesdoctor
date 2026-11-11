const countries = [["🇺🇸", "United States"], ["🇬🇧", "United Kingdom"], ["🇨🇦", "Canada"], ["🇳🇬", "Nigeria"], ["🇦🇪", "United Arab Emirates"], ["🇬🇭", "Ghana"], ["🇮🇳", "India"]] as const;

export function CountryFlags() {
  return <span className="mt-3 flex max-w-full flex-wrap items-center gap-1.5 md:gap-2" aria-label="Clients in the US, UK, Canada, Nigeria, UAE, Ghana, India and beyond">
    {countries.map(([flag, name]) => <span key={name} role="img" aria-label={name} title={name} className="text-base leading-none md:text-xl">{flag}</span>)}
  </span>;
}