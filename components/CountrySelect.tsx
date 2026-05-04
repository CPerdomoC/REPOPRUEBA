"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CountryOption = {
  label: string;
  value: string;
  flagUrl: string;
  nativeName: string;
  spanishName: string;
};

type CountrySelectProps = {
  value?: string;
  onChange?: (iso2: string) => void;
  placeholder?: string;
  label?: string;
};

export const COUNTRY_LIST: Array<{ label: string; value: string }> = [
  { label: "Afghanistan", value: "af" },
  { label: "Åland Islands", value: "ax" },
  { label: "Albania", value: "al" },
  { label: "Algeria", value: "dz" },
  { label: "American Samoa", value: "as" },
  { label: "Andorra", value: "ad" },
  { label: "Angola", value: "ao" },
  { label: "Anguilla", value: "ai" },
  { label: "Antarctica", value: "aq" },
  { label: "Antigua and Barbuda", value: "ag" },
  { label: "Argentina", value: "ar" },
  { label: "Armenia", value: "am" },
  { label: "Aruba", value: "aw" },
  { label: "Australia", value: "au" },
  { label: "Austria", value: "at" },
  { label: "Azerbaijan", value: "az" },
  { label: "Bahamas", value: "bs" },
  { label: "Bahrain", value: "bh" },
  { label: "Bangladesh", value: "bd" },
  { label: "Barbados", value: "bb" },
  { label: "Belarus", value: "by" },
  { label: "Belgium", value: "be" },
  { label: "Belize", value: "bz" },
  { label: "Benin", value: "bj" },
  { label: "Bermuda", value: "bm" },
  { label: "Bhutan", value: "bt" },
  { label: "Bolivia (Plurinational State of)", value: "bo" },
  { label: "Bonaire, Sint Eustatius and Saba", value: "bq" },
  { label: "Bosnia and Herzegovina", value: "ba" },
  { label: "Botswana", value: "bw" },
  { label: "Bouvet Island", value: "bv" },
  { label: "Brazil", value: "br" },
  { label: "British Indian Ocean Territory", value: "io" },
  { label: "Brunei Darussalam", value: "bn" },
  { label: "Bulgaria", value: "bg" },
  { label: "Burkina Faso", value: "bf" },
  { label: "Burundi", value: "bi" },
  { label: "Cabo Verde", value: "cv" },
  { label: "Cambodia", value: "kh" },
  { label: "Cameroon", value: "cm" },
  { label: "Canada", value: "ca" },
  { label: "Cayman Islands", value: "ky" },
  { label: "Central African Republic", value: "cf" },
  { label: "Chad", value: "td" },
  { label: "Chile", value: "cl" },
  { label: "China", value: "cn" },
  { label: "Christmas Island", value: "cx" },
  { label: "Cocos (Keeling) Islands", value: "cc" },
  { label: "Colombia", value: "co" },
  { label: "Comoros", value: "km" },
  { label: "Congo", value: "cg" },
  { label: "Congo, Democratic Republic of the", value: "cd" },
  { label: "Cook Islands", value: "ck" },
  { label: "Costa Rica", value: "cr" },
  { label: "Côte d'Ivoire", value: "ci" },
  { label: "Croatia", value: "hr" },
  { label: "Cuba", value: "cu" },
  { label: "Curaçao", value: "cw" },
  { label: "Cyprus", value: "cy" },
  { label: "Czechia", value: "cz" },
  { label: "Denmark", value: "dk" },
  { label: "Djibouti", value: "dj" },
  { label: "Dominica", value: "dm" },
  { label: "Dominican Republic", value: "do" },
  { label: "Ecuador", value: "ec" },
  { label: "Egypt", value: "eg" },
  { label: "El Salvador", value: "sv" },
  { label: "Equatorial Guinea", value: "gq" },
  { label: "Eritrea", value: "er" },
  { label: "Estonia", value: "ee" },
  { label: "Eswatini", value: "sz" },
  { label: "Ethiopia", value: "et" },
  { label: "Falkland Islands (Malvinas)", value: "fk" },
  { label: "Faroe Islands", value: "fo" },
  { label: "Fiji", value: "fj" },
  { label: "Finland", value: "fi" },
  { label: "France", value: "fr" },
  { label: "French Guiana", value: "gf" },
  { label: "French Polynesia", value: "pf" },
  { label: "French Southern Territories", value: "tf" },
  { label: "Gabon", value: "ga" },
  { label: "Gambia", value: "gm" },
  { label: "Georgia", value: "ge" },
  { label: "Germany", value: "de" },
  { label: "Ghana", value: "gh" },
  { label: "Gibraltar", value: "gi" },
  { label: "Greece", value: "gr" },
  { label: "Greenland", value: "gl" },
  { label: "Grenada", value: "gd" },
  { label: "Guadeloupe", value: "gp" },
  { label: "Guam", value: "gu" },
  { label: "Guatemala", value: "gt" },
  { label: "Guernsey", value: "gg" },
  { label: "Guinea", value: "gn" },
  { label: "Guinea-Bissau", value: "gw" },
  { label: "Guyana", value: "gy" },
  { label: "Haiti", value: "ht" },
  { label: "Heard Island and McDonald Islands", value: "hm" },
  { label: "Holy See", value: "va" },
  { label: "Honduras", value: "hn" },
  { label: "Hong Kong", value: "hk" },
  { label: "Hungary", value: "hu" },
  { label: "Iceland", value: "is" },
  { label: "India", value: "in" },
  { label: "Indonesia", value: "id" },
  { label: "Iran (Islamic Republic of)", value: "ir" },
  { label: "Iraq", value: "iq" },
  { label: "Ireland", value: "ie" },
  { label: "Isle of Man", value: "im" },
  { label: "Israel", value: "il" },
  { label: "Italy", value: "it" },
  { label: "Jamaica", value: "jm" },
  { label: "Japan", value: "jp" },
  { label: "Jersey", value: "je" },
  { label: "Jordan", value: "jo" },
  { label: "Kazakhstan", value: "kz" },
  { label: "Kenya", value: "ke" },
  { label: "Kiribati", value: "ki" },
  { label: "Kuwait", value: "kw" },
  { label: "Kyrgyzstan", value: "kg" },
  { label: "Lao People's Democratic Republic", value: "la" },
  { label: "Latvia", value: "lv" },
  { label: "Lebanon", value: "lb" },
  { label: "Lesotho", value: "ls" },
  { label: "Liberia", value: "lr" },
  { label: "Libya", value: "ly" },
  { label: "Liechtenstein", value: "li" },
  { label: "Lithuania", value: "lt" },
  { label: "Luxembourg", value: "lu" },
  { label: "Macao", value: "mo" },
  { label: "North Macedonia", value: "mk" },
  { label: "Madagascar", value: "mg" },
  { label: "Malawi", value: "mw" },
  { label: "Malaysia", value: "my" },
  { label: "Maldives", value: "mv" },
  { label: "Mali", value: "ml" },
  { label: "Malta", value: "mt" },
  { label: "Marshall Islands", value: "mh" },
  { label: "Martinique", value: "mq" },
  { label: "Mauritania", value: "mr" },
  { label: "Mauritius", value: "mu" },
  { label: "Mayotte", value: "yt" },
  { label: "Mexico", value: "mx" },
  { label: "Micronesia (Federated States of)", value: "fm" },
  { label: "Moldova (Republic of)", value: "md" },
  { label: "Monaco", value: "mc" },
  { label: "Mongolia", value: "mn" },
  { label: "Montenegro", value: "me" },
  { label: "Montserrat", value: "ms" },
  { label: "Morocco", value: "ma" },
  { label: "Mozambique", value: "mz" },
  { label: "Myanmar", value: "mm" },
  { label: "Namibia", value: "na" },
  { label: "Nauru", value: "nr" },
  { label: "Nepal", value: "np" },
  { label: "Netherlands", value: "nl" },
  { label: "New Caledonia", value: "nc" },
  { label: "New Zealand", value: "nz" },
  { label: "Nicaragua", value: "ni" },
  { label: "Niger", value: "ne" },
  { label: "Nigeria", value: "ng" },
  { label: "Niue", value: "nu" },
  { label: "Norfolk Island", value: "nf" },
  { label: "Northern Mariana Islands", value: "mp" },
  { label: "Norway", value: "no" },
  { label: "Oman", value: "om" },
  { label: "Pakistan", value: "pk" },
  { label: "Palau", value: "pw" },
  { label: "Palestine", value: "ps" },
  { label: "Panama", value: "pa" },
  { label: "Papua New Guinea", value: "pg" },
  { label: "Paraguay", value: "py" },
  { label: "Peru", value: "pe" },
  { label: "Philippines", value: "ph" },
  { label: "Pitcairn", value: "pn" },
  { label: "Poland", value: "pl" },
  { label: "Portugal", value: "pt" },
  { label: "Puerto Rico", value: "pr" },
  { label: "Qatar", value: "qa" },
  { label: "Réunion", value: "re" },
  { label: "Romania", value: "ro" },
  { label: "Russian Federation", value: "ru" },
  { label: "Rwanda", value: "rw" },
  { label: "Saint Barthélemy", value: "bl" },
  { label: "Saint Helena, Ascension and Tristan da Cunha", value: "sh" },
  { label: "Saint Kitts and Nevis", value: "kn" },
  { label: "Saint Lucia", value: "lc" },
  { label: "Saint Martin (French part)", value: "mf" },
  { label: "Saint Pierre and Miquelon", value: "pm" },
  { label: "Saint Vincent and the Grenadines", value: "vc" },
  { label: "Samoa", value: "ws" },
  { label: "San Marino", value: "sm" },
  { label: "Sao Tome and Principe", value: "st" },
  { label: "Saudi Arabia", value: "sa" },
  { label: "Senegal", value: "sn" },
  { label: "Serbia", value: "rs" },
  { label: "Seychelles", value: "sc" },
  { label: "Sierra Leone", value: "sl" },
  { label: "Singapore", value: "sg" },
  { label: "Sint Maarten (Dutch part)", value: "sx" },
  { label: "Slovakia", value: "sk" },
  { label: "Slovenia", value: "si" },
  { label: "Solomon Islands", value: "sb" },
  { label: "Somalia", value: "so" },
  { label: "South Africa", value: "za" },
  { label: "South Georgia and the South Sandwich Islands", value: "gs" },
  { label: "South Korea", value: "kr" },
  { label: "South Sudan", value: "ss" },
  { label: "Spain", value: "es" },
  { label: "Sri Lanka", value: "lk" },
  { label: "Sudan", value: "sd" },
  { label: "Suriname", value: "sr" },
  { label: "Svalbard and Jan Mayen", value: "sj" },
  { label: "Sweden", value: "se" },
  { label: "Switzerland", value: "ch" },
  { label: "Syrian Arab Republic", value: "sy" },
  { label: "Taiwan", value: "tw" },
  { label: "Tajikistan", value: "tj" },
  { label: "Tanzania, United Republic of", value: "tz" },
  { label: "Thailand", value: "th" },
  { label: "Timor-Leste", value: "tl" },
  { label: "Togo", value: "tg" },
  { label: "Tokelau", value: "tk" },
  { label: "Tonga", value: "to" },
  { label: "Trinidad and Tobago", value: "tt" },
  { label: "Tunisia", value: "tn" },
  { label: "Turkey", value: "tr" },
  { label: "Turkmenistan", value: "tm" },
  { label: "Turks and Caicos Islands", value: "tc" },
  { label: "Tuvalu", value: "tv" },
  { label: "Uganda", value: "ug" },
  { label: "Ukraine", value: "ua" },
  { label: "United Arab Emirates", value: "ae" },
  { label: "United Kingdom", value: "gb" },
  { label: "United States", value: "us" },
  { label: "United States Minor Outlying Islands", value: "um" },
  { label: "Uruguay", value: "uy" },
  { label: "Uzbekistan", value: "uz" },
  { label: "Vanuatu", value: "vu" },
  { label: "Venezuela (Bolivarian Republic of)", value: "ve" },
  { label: "Viet Nam", value: "vn" },
  { label: "British Virgin Islands", value: "vg" },
  { label: "U.S. Virgin Islands", value: "vi" },
  { label: "Wallis and Futuna", value: "wf" },
  { label: "Western Sahara", value: "eh" },
  { label: "Yemen", value: "ye" },
  { label: "Zambia", value: "zm" },
  { label: "Zimbabwe", value: "zw" },
];

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

const countryDisplayNames = new Intl.DisplayNames(["en"], { type: "region" });
const countrySpanishNames = new Intl.DisplayNames(["es"], { type: "region" });

const buildCountryOptions = (): CountryOption[] =>
  COUNTRY_LIST.map(({ label, value }) => {
    const nativeName = new Intl.DisplayNames([value], { type: "region" }).of(value) || label;
    const spanishName = countrySpanishNames.of(value) || label;
    return {
      label,
      value,
      flagUrl: `https://flagcdn.com/${value}.svg`,
      nativeName,
      spanishName,
    };
  });

const highlightMatch = (text: string, query: string) => {
  if (!query) return <>{text}</>;
  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);
  const index = normalizedText.indexOf(normalizedQuery);
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <span className="font-semibold text-slate-900">{text.slice(index, index + query.length)}</span>
      {text.slice(index + query.length)}
    </>
  );
};

export function CountrySelect({ value, onChange, placeholder, label = "Select a country" }: CountrySelectProps) {
  const allCountries = useMemo(() => buildCountryOptions(), []);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedCountry = useMemo(
    () => allCountries.find((country) => country.value === value),
    [allCountries, value],
  );

  const options = useMemo(() => {
    const search = normalizeText(debouncedQuery);
    if (!search) return allCountries;

    const matches = allCountries.filter((country) => {
      const combined = [country.label, country.nativeName, country.spanishName, country.value].join(" ");
      return normalizeText(combined).includes(search);
    });

    return matches.sort((a, b) => {
      const exactA = normalizeText(a.label) === search;
      const exactB = normalizeText(b.label) === search;
      if (exactA !== exactB) return exactA ? -1 : 1;
      return a.label.localeCompare(b.label);
    });
  }, [allCountries, debouncedQuery]);

  useEffect(() => {
    const handler = window.setTimeout(() => setDebouncedQuery(query), 150);
    return () => window.clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (country: CountryOption) => {
    setQuery(country.label);
    setOpen(false);
    onChange?.(country.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (event.key === "ArrowDown") setOpen(true);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((current) => Math.min(current + 1, options.length - 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((current) => Math.max(current - 1, 0));
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const option = options[highlightedIndex];
      if (option) handleSelect(option);
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={open ? query : selectedCountry?.label ?? query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? "Search country..."}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
          aria-label="Toggle country list"
        >
          ▾
        </button>
      </div>

      {open && (
        <ul className="absolute z-10 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-slate-200 bg-white text-sm shadow-xl">
          {options.length === 0 ? (
            <li className="px-4 py-3 text-slate-500">No countries found</li>
          ) : null}
          {options.map((country, index) => (
            <li
              key={country.value}
              onMouseDown={() => handleSelect(country)}
              className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition ${
                index === highlightedIndex ? "bg-slate-100" : "hover:bg-slate-50"
              }`}
            >
              <img
                src={country.flagUrl}
                alt={`Flag of ${country.label}`}
                className="h-6 w-8 rounded-sm object-cover"
              />
              <div className="min-w-0">
                <div className="truncate font-medium text-slate-900">
                  {highlightMatch(country.label, query)}
                </div>
                <div className="truncate text-xs text-slate-500">
                  {country.nativeName !== country.label ? country.nativeName : country.spanishName}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CountrySelect;
