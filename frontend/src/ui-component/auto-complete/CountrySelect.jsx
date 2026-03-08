import countries from 'world-countries';
import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';

const countryOptions = countries.map((country) => ({
  code: country.cca2,
  label: country.name.common
}));

export default function CountrySelect({name, value, onChange}) {
  // const [selectedCountry, setSelectedCountry] = useState(null);
  const selectedOption = countryOptions.find((option) => option.label === value) || null

  return (
    <Autocomplete
      options={countryOptions}
      getOptionLabel={(option) => option.label}
      value={selectedOption}
      // onChange={(event, newValue) => {
      //   const countryName = newValue ? newValue.label : '';
      //   onChange(name, countryName)
      // }}
      onChange={(event, newValue) => {
        const countryName = newValue ? newValue.label : '';
        onChange({ target: { name, value: countryName } });
      }}

      renderOption={(props, option) => {
        const {key, ...otherProps} = props;
        return (
        <li key={option.code} {...props}>
          {option.label} ({option.code})
        </li>
        );
      }}
      
      renderInput={(params) => <TextField {...params} 
        label="Select Country" 
        autoComplete="new-country"  
        inputProps={{
          ...params.inputProps,
          autoComplete: 'off', // ✅ important
          form: { autoComplete: 'off' }, // ✅ prevent parent form autofill
        }} variant="outlined" size="small" fullWidth />}
    />
  );
}
