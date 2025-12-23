import React from 'react';
import { useNavigate } from 'react-router';

function ListProject() {
    const navigate = useNavigate();
  return (
    <div>
      ListProject
      <button onClick={()=>navigate('/crm/projects/add')}> Go to Project List</button>
    </div>
  );
}

export default ListProject;
