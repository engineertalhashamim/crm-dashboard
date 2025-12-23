// icons
import { IconUsers, IconPlus, IconAddressBook, IconReceipt, IconFileText, IconTarget, IconBriefcase, IconShare3 } from '@tabler/icons-react';

const icons = {
  IconUsers,
  IconPlus,
  IconAddressBook,
  IconReceipt,
  IconFileText,
  IconBriefcase,
  IconTarget,
  IconShare3
};

// ==============================|| CRM MENU ITEMS ||============================== //
const crm = {
  id: 'crm',
  title: 'CRM',
  type: 'group',
  children: [
    {
      id: 'crm-users',
      title: 'Users',
      type: 'item',
      url: '/crm/users/list',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'crm-clients',
      title: 'Clients',
      type: 'collapse',
      icon: icons.IconBriefcase,
      children: [
        {
          id: 'client-list',
          title: 'Client List',
          type: 'item',
          url: '/crm/clients/list',
          breadcrumbs: false
        },
        {
          id: 'add-client',
          title: 'Add Client',
          type: 'item',
          url: '/crm/clients/add',
          breadcrumbs: false,
          icon: icons.IconPlus
        }
      ]
    },
    {
      id: 'crm-contacts',
      title: 'Contacts',
      type: 'collapse',
      icon: icons.IconAddressBook,
      children: [
        {
          id: 'contact-list',
          title: 'Contact List',
          type: 'item',
          url: '/crm/contacts/list',
          breadcrumbs: false
        },
        {
          id: 'add-contact',
          title: 'Add Contact',
          type: 'item',
          url: '/crm/contacts/add',
          breadcrumbs: false,
          icon: icons.IconPlus
        }
      ]
    },
    {
      id: 'crm-lead',
      title: 'Lead',
      type: 'collapse',
      icon: icons.IconTarget,
      children: [
        {
          id: 'lead-statuses',
          title: 'Statuses',
          type: 'item',
          url: '/crm/lead/statuses',
          breadcrumbs: false
        },
        {
          id: 'lead-sources',
          title: 'Sources',
          type: 'item',
          url: '/crm/lead/sources',
          breadcrumbs: false
        },
        {
          id: 'lead',
          title: 'Lead',
          type: 'item',
          url: '/crm/lead',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'crm-contract',
      title: 'Contracts',
      type: 'item',
      url: '/crm/contracts/list',
      icon: icons.IconFileText,
      breadcrumbs: false
    },
    {
      id: 'crm-project',
      title: 'Projects',
      type: 'item',
      url: '/crm/projects/list',
      icon: icons.IconShare3,
      breadcrumbs: false
    }
  ]
};

export default crm;
