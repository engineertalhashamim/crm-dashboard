import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// CRM invoice routing
const AddClients = Loadable(lazy(() => import('views/crm/clients/AddClients')));
const ListClients = Loadable(lazy(() => import('views/crm/clients/ListClients')));

// CRM invoice routing
const AddContacts = Loadable(lazy(() => import('views/crm/contacts/AddContacts')));
const ListContacts = Loadable(lazy(() => import('views/crm/contacts/ListContacts')));

// CRM Contract
const AddContracts = Loadable(lazy(() => import('views/crm/contracts/AddContracts')));
const ListContracts = Loadable(lazy(() => import('views/crm/contracts/ListContracts')));

// CRM Lead
const AddStatus = Loadable(lazy(() => import('views/crm/lead/AddStatus.jsx')));
const ListStatus = Loadable(lazy(() => import('views/crm/lead/ListStatus.jsx')));

const AddSources = Loadable(lazy(() => import('views/crm/lead/AddSources.jsx')));
const ListSources = Loadable(lazy(() => import('views/crm/lead/ListSources.jsx')));

const AddLead = Loadable(lazy(() => import('views/crm/lead/AddLead.jsx')));
const ListLead = Loadable(lazy(() => import('views/crm/lead/ListLead.jsx')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'typography',
      element: <UtilsTypography />
    },
    {
      path: 'color',
      element: <UtilsColor />
    },
    {
      path: 'shadow',
      element: <UtilsShadow />
    },

    // CRM (💡 new nested section)
    {
      path: 'crm',
      children: [
        {
          path: 'clients',
          children: [
            {
              path: 'list',
              element: <ListClients />
            },
            {
              path: 'add',
              element: <AddClients />
            },
            {
              path: `edit/:id`,
              element: <AddClients />
            }
          ]
        },
        {
          path: 'contacts',
          children: [
            {
              path: 'list',
              element: <ListContacts />
            },
            {
              path: 'add',
              element: <AddContacts />
            },
            {
              path: `edit/:id`,
              element: <AddContacts />
            }
          ]
        },
        {
          path: 'lead',
          children: [
            // STATUS PAGES
            {
              path: 'statuses',
              children: [
                { path: '', element: <ListStatus /> },
                { path: 'add', element: <AddStatus /> }
                // { path: 'edit/:id', element: <AddStatus /> }
              ]
            },
            {
              path: 'sources',
              children: [
                { path: '', element: <ListSources /> },
                { path: 'add', element: <AddSources /> }
              ]
            },

            { path: '', element: <ListLead /> },
            { path: 'add', element: <AddLead /> }

            // {
            //   path: 'lead',
            //   children: [
            //     { path: '', element: <ListLead /> },
            //     { path: 'add', element: <AddLead /> }
            //   ]
            // }
          ]
        },
        {
          path: 'contracts',
          children: [
            { path: 'list', element: <ListContracts /> },
            { path: 'add', element: <AddContracts /> },
            { path: 'edit/:id', element: <AddContracts /> }
          ]
        }
      ]
    },

    {
      path: '/sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
