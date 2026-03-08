import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export const MuiAutoComplete = ({ onSelect, required = false, valueObject }) => {
  const [optionArray, setOptionArray] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  // 🔥 API CALL function
  const fetchSuggestions = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/contract/searchparent?q=' + inputValue);
      const apiData = res.data?.data;
      setOptionArray(apiData);
      console.log('search data....', apiData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (inputValue.length < 1) return;

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    setSelectedOption(valueObject);
    console.log('val object', selectedOption);
  }, [valueObject]);

  const defProp = {
    options: optionArray.map((option) => ({ id: option.id, companyname: option.companyname })),
    getOptionLabel: (options) => options.companyname
  };

  const getData = (data) => {
    setSelectedOption(data);
    console.log('data is...', data);
  };

  // useEffect(() => {
  //   console.log('selected optioon is', selectedOption);
  // }, [selectedOption]);

  return (
    <Autocomplete
      {...defProp}
      // options={country}
      value={selectedOption}
      onInputChange={(event, value) => setInputValue(value)}
      renderInput={(params) => <TextField {...params} label="select options" required={required} />}
      onChange={(event, value) => {
        console.log('teh val is...', value);
        getData(value);
        onSelect(value.id);
      }}
    />
  );
};

export const StatusAutoComplete = ({ onSelect, required = false, valueObject }) => {
  const [optionArray, setOptionArray] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  // 🔥 API CALL function
  const fetchSuggestions = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/lead/searchstatus?q=' + inputValue);
      const apiData = res.data?.data;
      setOptionArray(apiData);
      console.log('search data....', apiData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (inputValue.length < 1) return;

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    setSelectedOption(valueObject);
    console.log('val object', selectedOption);
  }, [valueObject]);

  const defProp = {
    options: optionArray.map((option) => ({ id: option.id, statusname: option.statusname })),
    getOptionLabel: (options) => options.statusname
  };

  const getData = (data) => {
    setSelectedOption(data);
    console.log('data is...', data);
  };

  return (
    <Autocomplete
      {...defProp}
      // options={country}
      value={selectedOption}
      onInputChange={(event, value) => setInputValue(value)}
      renderInput={(params) => <TextField {...params} label="Select Status" required={required} />}
      onChange={(event, value) => {
        console.log('teh val is...', value);
        getData(value);
        onSelect(value.id);
      }}
    />
  );
};

export const SourceAutoComplete = ({ onSelect, required = false, valueObject }) => {
  const [optionArray, setOptionArray] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/lead/searchsource?q=' + inputValue);
      const apiData = res.data?.data;
      setOptionArray(apiData);
      console.log('search data....', apiData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (inputValue.length < 1) return;

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    setSelectedOption(valueObject);
    console.log('val object', selectedOption);
  }, [valueObject]);

  const defProp = {
    options: optionArray.map((option) => ({ id: option.id, sourcename: option.sourcename })),
    getOptionLabel: (options) => options.sourcename
  };

  const getData = (data) => {
    setSelectedOption(data);
    console.log('data is...', data);
  };

  return (
    <Autocomplete
      {...defProp}
      // options={country}
      value={selectedOption}
      onInputChange={(event, value) => setInputValue(value)}
      renderInput={(params) => <TextField {...params} label="Select Source" required={required} />}
      onChange={(event, value) => {
        console.log('teh val is...', value);
        getData(value);
        onSelect(value.id);
      }}
    />
  );
};

export const UserAutoComplete = ({ onSelect, required = false, valueObject }) => {
  const [optionArray, setOptionArray] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/lead/searchuser?q=' + inputValue);
      const apiData = res.data?.data;
      setOptionArray(apiData);
      console.log('search data....', apiData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (inputValue.length < 1) return;

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    setSelectedOption(valueObject);
    console.log('val object', selectedOption);
  }, [valueObject]);

  const defProp = {
    options: optionArray.map((option) => ({ id: option.id, username: option.username })),
    getOptionLabel: (options) => options.username
  };

  const getData = (data) => {
    setSelectedOption(data);
    console.log('data is...', data);
  };

  return (
    <Autocomplete
      {...defProp}
      // options={country}
      value={selectedOption}
      onInputChange={(event, value) => setInputValue(value)}
      renderInput={(params) => <TextField {...params} label="select user" required={required} />}
      onChange={(event, value) => {
        console.log('teh val is...', value);
        getData(value);
        onSelect(value.id);
      }}
    />
  );
};

export const MultiUserAutoComplete = ({ onSelect, required = false, valueObject = [] }) => {
  const [optionArray, setOptionArray] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState([]);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/lead/searchuser?q=' + inputValue);
      setOptionArray(res.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (inputValue.length < 1) return;

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 400);

    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    setSelectedOption(valueObject);
  }, [valueObject]);

  const options = optionArray.map((option) => ({
    id: option.id,
    username: option.username
  }));

  return (
    <Autocomplete
      multiple
      options={options}
      value={selectedOption}
      getOptionLabel={(option) => option.username}
      onInputChange={(event, value) => setInputValue(value)}
      onChange={(event, value) => {
        setSelectedOption(value);

        // sirf ids parent ko bhej rahe hain
        onSelect(value.map((item) => item.id));
      }}
      renderInput={(params) => <TextField {...params} label="Select user" required={required} />}
    />
  );
};

export const ClientAutoComplete = ({ onSelect, required = false, valueObject }) => {
  const [optionArray, setOptionArray] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/project/searchclient?q=' + inputValue);
      const apiData = res.data?.data;
      setOptionArray(apiData);
      console.log('search data....', apiData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (inputValue.length < 1) return;

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    setSelectedOption(valueObject);
    console.log('val object', selectedOption);
  }, [valueObject]);

  const defProp = {
    options: optionArray.map((option) => ({ id: option.id, companyname: option.companyname })),
    getOptionLabel: (options) => options.companyname
  };

  const getData = (data) => {
    setSelectedOption(data);
    console.log('data is...', data);
  };

  return (
    <Autocomplete
      {...defProp}
      value={selectedOption}
      onInputChange={(event, value) => setInputValue(value)}
      renderInput={(params) => <TextField {...params} label="select client" required={required} />}
      onChange={(event, value) => {
        console.log('teh val is...', value);
        getData(value);
        onSelect(value.id);
      }}
    />
  );
};
