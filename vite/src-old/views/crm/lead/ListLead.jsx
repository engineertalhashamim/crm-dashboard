import React from 'react';
import { useNavigate } from 'react-router';

const ListLead = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>List Lead</h1>
      <button onClick={() => navigate('/crm/lead/add')}>go to add lead</button>
    </div>
  );
};

export default ListLead;
