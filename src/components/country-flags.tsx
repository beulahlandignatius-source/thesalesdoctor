const countries = [
  ["🇺🇸", "United States"], ["🇬🇧", "United Kingdom"], ["🇨🇦", "Canada"], ["🇳🇬", "Nigeria"], ["🇦🇪", "United Arab Emirates"], ["🇬🇭", "Ghana"], ["🇮🇳", "India"],
  ["🇰🇪", "Kenya"], ["🇿🇦", "South Africa"], ["🇪🇬", "Egypt"], ["🇷🇼", "Rwanda"], ["🇺🇬", "Uganda"], ["🇹🇿", "Tanzania"], ["🇸🇳", "Senegal"], ["🇲🇦", "Morocco"],
  ["🇫🇷", "France"], ["🇩🇪", "Germany"], ["🇳🇱", "Netherlands"], ["🇪🇸", "Spain"], ["🇮🇹", "Italy"], ["🇮🇪", "Ireland"], ["🇸🇪", "Sweden"], ["🇨🇭", "Switzerland"],
  ["🇸🇬", "Singapore"], ["🇲🇾", "Malaysia"], ["🇯🇵", "Japan"], ["🇰🇷", "South Korea"], ["🇵🇭", "Philippines"], ["🇮🇩", "Indonesia"], ["🇸🇦", "Saudi Arabia"],
] as const;

export function CountryFlags() {
  return <span className="country-flags" tabIndex={0} role="group" aria-label="30 country flags">
    <span className="country-flags-track">
      {[0, 1].map(copy => <span key={copy} className="country-flags-group" aria-hidden={copy === 1 ? true : undefined}>
        {countries.map(([flag, name]) => <span key={name} role={copy === 0 ? "img" : undefined} aria-label={copy === 0 ? name : undefined} title={name} className="country-flag">{flag}</span>)}
      </span>)}
    </span>
  </span>;
}