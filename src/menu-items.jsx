const menuItems = {
  items: [
    {
      id: 'navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/default'
        }
      ]
    },

    {
      id: 'user-management',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'user-management',
          title: 'User Management',
          type: 'collapse',
          icon: 'feather icon-users',
          children: [
            {
              id: 'users',
              title: 'users',
              type: 'item',
              url: 'user-management/users'
            },
            {
              id: 'users-create',
              title: 'Users Create',
              type: 'item',
              url: 'user-management/create-users'
            }
          ]
        }
      ]
    },

    {
      id: 'bookings',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'bookings',
          title: 'Bookings',
          type: 'collapse',
          icon: 'feather icon-check-square',
          children: [
            {
              id: 'bookings',
              title: 'Bookings',
              type: 'item',
              url: '/user-bookings'
            },
            {
              id: 'coupon',
              title: 'Coupon',
              type: 'item',
              url: '/user-coupons'
            }
          ]
        }
      ]
    },
    {
      id: 'blogs',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'blogs',
          title: 'Blogs',
          type: 'collapse',
          icon: 'feather icon-list',
          children: [
            {
              id: 'blogs-create',
              title: 'Blogs Category',
              type: 'item',
              url: 'blogs/create-blog'
            },
            // {
            //   id: 'blogs-category-create',
            //   title: 'Blogs Category Create',
            //   type: 'item',
            //   url: 'blogs/blog-catagory'
            // },
            {
              id: 'Blogs',
              title: 'Blogs',
              type: 'item',
              url: 'blogs/all-blogs'
            }
          ]
        }
      ]
    },
    {
      id: 'case-study',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'case-study',
          title: 'Case Study',
          type: 'collapse',
          icon: 'feather icon-list',
          children: [
            // {
            //   id: 'case-study-create',
            //   title: 'Case Study Create',
            //   type: 'item',
            //   url: 'create-case-study'
            // },
            {
              id: 'case-study',
              title: 'Case Study',
              type: 'item',
              url: 'case-Study'
            }
          ]
        }
      ]
    },

    {
      id: 'user-survey',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'user-survey',
          title: 'User Survey',
          type: 'collapse',
          icon: 'feather icon-clipboard',
          children: [
            {
              id: 'user-survey-form',
              title: 'User Survey Form',
              type: 'item',
              url: 'survey-form'
            },
            {
              id: 'form-field',
              title: 'Form Fields',
              type: 'item',
              url: 'form-fields'
            },
            {
              id: 'budget-range',
              title: 'Budget Range',
              type: 'item',
              url: 'budget-range'
            }
          ]
        }
      ]
    },
    {
      id: 'events',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'events',
          title: 'Events',
          type: 'collapse',
          icon: 'feather icon-calendar',
          children: [
            {
              id: 'events',
              title: 'Events',
              type: 'item',
              url: 'events'
            }
          ]
        }
      ]
    },
    {
      id: 'pages',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'pages',
          title: 'Pages',
          type: 'collapse',
          icon: 'feather icon-book',
          children: [
            {
              id: 'pages',
              title: 'Pages',
              type: 'item',
              url: 'pages'
            }
          ]
        }
      ]
    },
    // destionation
    // {
    //   id: 'destination',
    //   type: 'group',
    //   icon: 'icon-ui',
    //   children: [
    //     {
    //       id: 'destination',
    //       title: 'National Parks',
    //       type: 'collapse',
    //       icon: 'feather icon-map-pin',
    //       children: [
    //         {
    //           id: 'destination',
    //           title: 'National Parks',
    //           type: 'item',
    //           url: 'destination'
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      id: 'resorts',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'resorts',
          title: 'Resorts',
          type: 'collapse',
          icon: 'feather icon-feather',
          children: [
            {
              id: 'resorts',
              title: 'Resorts',
              type: 'item',
              url: 'resorts'
            }
          ]
        }
      ]
    },
    {
      id: 'trips-safari',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'trips-safari',
          title: 'Trips & Safari',
          type: 'collapse',
          icon: 'feather icon-feather',
          children: [
            {
              id: 'trips-safari',
              title: 'Trips & Safari',
              type: 'item',
              url: 'trips-safari'
            }
          ]
        }
      ]
    },
    {
      id: 'packages',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'packages',
          title: 'Junglore Expeditions',
          type: 'collapse',
          icon: 'feather icon-star',
          children: [
            {
              id: 'packages',
              title: 'Junglore Expeditions',
              type: 'item',
              url: 'packages'
            }
          ]
        }
      ]
    },
    {
      id: 'national-park',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'national-park',
          title: 'National Parks',
          type: 'collapse',
          icon: 'feather icon-globe',
          children: [
            {
              id: 'national-park',
              title: 'National Parks',
              type: 'item',
              url: 'national-parks'
            }
          ]
        }
      ]
    },

    {
      id: 'media',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'media',
          title: 'Media',
          type: 'collapse',
          icon: 'feather icon-camera',
          // url: '/media'
          children: [
            {
              id: 'media',
              title: 'Media',
              type: 'item',
              url: '/media'
            },
            {
              id: 'chat-bot',
              title: 'Chatbot',
              type: 'item',
              url: '/chat-bot'
            }
          ]
        }
      ]
    },
    {
      id: 'queries',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'queries',
          title: 'Queries',
          type: 'item',
          icon: 'feather icon-search',
          url: 'queries'
        }
      ]
    },
    {
      id: 'notification',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'notification',
          title: 'Notification',
          type: 'item',
          icon: 'feather icon-bell',
          url: '/notifications'
        }
      ]
    },
    {
      id: 'application-applied',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'application-applied',
          title: 'Application Applied',
          type: 'item',
          icon: 'feather icon-check-square',
          url: 'application'
        }
      ]
    },
    {
      id: 'current-opening',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'current-opening',
          title: 'Current Opening',
          type: 'item',
          icon: 'feather icon-check-square',
          url: '/current-openings'
        }
      ]
    },
    {
      id: 'testimonials',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'testimonials',
          title: 'Testimonials',
          type: 'item',
          icon: 'feather icon-user',
          url: 'testimonials'
        }
      ]
    },
    // {
    //   id: 'social-links',
    //   type: 'group',
    //   icon: 'icon-navigation',
    //   children: [
    //     {
    //       id: 'social-links',
    //       title: 'Social Links',
    //       type: 'item',
    //       icon: 'feather icon-twitter',
    //       url: 'social-links'
    //     }
    //   ]
    // },
    {
      id: 'email-subscribed',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'email-subscribed',
          title: 'Email Subscribed',
          type: 'item',
          icon: 'feather icon-mail',
          url: 'email-subscribed'
        }
      ]
    },
    {
      id: 'expeditions',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'expeditions',
          title: 'Expeditions',
          // type: 'item',
          type: 'collapse',
          icon: 'feather icon-mail',
          // url: 'jungle-expeditions'
          children: [
            {
              id: 'expeditions',
              title: 'Expeditions',
              type: 'item',
              url: '/jungle-expeditions'
            },
            {
              id: 'wildlife-experience',
              title: 'Wildlie Experience',
              type: 'item',
              url: '/expeditions/wildlife-experience'
            },
            {
              id: 'attraction',
              title: 'Attraction',
              type: 'item',
              url: '/expeditions/attraction'
            },
            {
              id: 'safety-guidelines',
              title: 'Safety guidelines',
              type: 'item',
              url: '/expeditions/safety-guidelines'
            }
          ]
        }
      ]
    },
    {
      id: 'homepage-media',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'homepage-media',
          title: 'Homepage Media',
          type: 'item', // 'item' makes it a direct, clickable link
          icon: 'feather icon-image', // A fitting icon for image management
          url: '/homepage-media' // This must match the path in your routes.js
        }
      ]
    },
    {
      id: 'settings',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'setting',
          title: 'Settings',
          type: 'collapse',
          icon: 'feather icon-settings',
          children: [
            {
              id: 'website-setting',
              title: 'Website Setting',
              type: 'item',
              url: 'settings'
            }
          ]
        }
      ]
    },
    {
      id: 'crm-system',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'crm',
          title: 'CRM System',
          type: 'collapse',
          icon: 'feather icon-headphones',
          children: [
            {
              id: 'crm-dashboard',
              title: 'CRM Dashboard',
              type: 'item',
              url: '/crm/dashboard'
            },
            {
              id: 'contacts',
              title: 'Contact Manager',
              type: 'item',
              url: '/crm/contacts'
            },
            {
              id: 'campaigns',
              title: 'Campaign Manager',
              type: 'item',
              url: '/crm/campaigns'
            },
            {
              id: 'unified-inbox',
              title: 'Unified Inbox',
              type: 'item',
              url: '/crm/inbox'
            },
            {
              id: 'templates',
              title: 'Message Templates',
              type: 'item',
              url: '/crm/templates'
            },
            {
              id: 'automation',
              title: 'Automation',
              type: 'item',
              url: '/crm/automation'
            },
            {
              id: 'analytics',
              title: 'Analytics',
              type: 'item',
              url: '/crm/analytics'
            },
            {
              id: 'crm-settings',
              title: 'CRM Settings',
              type: 'item',
              url: '/crm/settings'
            }
          ]
        }
      ]
    }
    // --------------------------items-------------------
    // {
    //   id: 'ui-element',
    //   title: 'UI ELEMENT',
    //   type: 'group',
    //   icon: 'icon-ui',
    //   children: [
    //     {
    //       id: 'component',
    //       title: 'Component',
    //       type: 'collapse',
    //       icon: 'feather icon-box',
    //       children: [
    //         {
    //           id: 'button',
    //           title: 'Button',
    //           type: 'item',
    //           url: '/basic/button'
    //         },
    //         {
    //           id: 'badges',
    //           title: 'Badges',
    //           type: 'item',
    //           url: '/basic/badges'
    //         },
    //         {
    //           id: 'breadcrumb',
    //           title: 'Breadcrumb & Pagination',
    //           type: 'item',
    //           url: '/basic/breadcrumb-paging'
    //         },
    //         {
    //           id: 'collapse',
    //           title: 'Collapse',
    //           type: 'item',
    //           url: '/basic/collapse'
    //         },
    //         {
    //           id: 'tabs-pills',
    //           title: 'Tabs & Pills',
    //           type: 'item',
    //           url: '/basic/tabs-pills'
    //         },
    //         {
    //           id: 'typography',
    //           title: 'Typography',
    //           type: 'item',
    //           url: '/basic/typography'
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   id: 'ui-forms',
    //   title: 'FORMS & TABLES',
    //   type: 'group',
    //   icon: 'icon-group',
    //   children: [
    //     {
    //       id: 'forms',
    //       title: 'Form Elements',
    //       type: 'item',
    //       icon: 'feather icon-file-text',
    //       url: '/forms/form-basic'
    //     },
    //     {
    //       id: 'table',
    //       title: 'Table',
    //       type: 'item',
    //       icon: 'feather icon-server',
    //       url: '/tables/bootstrap'
    //     }
    //   ]
    // },
    // {
    //   id: 'chart-maps',
    //   title: 'Chart & Maps',
    //   type: 'group',
    //   icon: 'icon-charts',
    //   children: [
    //     {
    //       id: 'charts',
    //       title: 'Charts',
    //       type: 'item',
    //       icon: 'feather icon-pie-chart',
    //       url: '/charts/nvd3'
    //     },
    //     {
    //       id: 'maps',
    //       title: 'Maps',
    //       type: 'item',
    //       icon: 'feather icon-map',
    //       url: '/maps/google-map'
    //     }
    //   ]
    // },
    // {
    //   id: 'pages',
    //   title: 'Pages',
    //   type: 'group',
    //   icon: 'icon-pages',
    //   children: [
    //     {
    //       id: 'auth',
    //       title: 'Authentication',
    //       type: 'collapse',
    //       icon: 'feather icon-lock',
    //       badge: {
    //         title: 'New',
    //         type: 'label-danger'
    //       },
    //       children: [
    //         {
    //           id: 'signup-1',
    //           title: 'Sign up',
    //           type: 'item',
    //           url: '/auth/signup-1',
    //           target: true,
    //           breadcrumbs: false
    //         },
    //         {
    //           id: 'signin-1',
    //           title: 'Sign in',
    //           type: 'item',
    //           url: '/auth/signin-1',
    //           target: true,
    //           breadcrumbs: false
    //         }
    //       ]
    //     },
    //     {
    //       id: 'sample-page',
    //       title: 'Sample Page',
    //       type: 'item',
    //       url: '/sample-page',
    //       classes: 'nav-item',
    //       icon: 'feather icon-sidebar'
    //     },
    //     {
    //       id: 'documentation',
    //       title: 'Documentation',
    //       type: 'item',
    //       icon: 'feather icon-book',
    //       classes: 'nav-item',
    //       url: 'https://codedthemes.gitbook.io/datta/',
    //       target: true,
    //       external: true
    //     },
    //     {
    //       id: 'menu-level',
    //       title: 'Menu Levels',
    //       type: 'collapse',
    //       icon: 'feather icon-menu',
    //       children: [
    //         {
    //           id: 'menu-level-1.1',
    //           title: 'Menu Level 1.1',
    //           type: 'item',
    //           url: '#!'
    //         },
    //         {
    //           id: 'menu-level-1.2',
    //           title: 'Menu Level 2.2',
    //           type: 'collapse',
    //           children: [
    //             {
    //               id: 'menu-level-2.1',
    //               title: 'Menu Level 2.1',
    //               type: 'item',
    //               url: '#'
    //             },
    //             {
    //               id: 'menu-level-2.2',
    //               title: 'Menu Level 2.2',
    //               type: 'collapse',
    //               children: [
    //                 {
    //                   id: 'menu-level-3.1',
    //                   title: 'Menu Level 3.1',
    //                   type: 'item',
    //                   url: '#'
    //                 },
    //                 {
    //                   id: 'menu-level-3.2',
    //                   title: 'Menu Level 3.2',
    //                   type: 'item',
    //                   url: '#'
    //                 }
    //               ]
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       id: 'disabled-menu',
    //       title: 'Disabled Menu',
    //       type: 'item',
    //       url: '#',
    //       classes: 'nav-item disabled',
    //       icon: 'feather icon-power'
    //     }
    //   ]
    // }
  ]
};

export default menuItems;
