import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import { BASE_URL } from './config/constant';
import Guard from 'views/auth/guard';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    path: '*',
    layout: AdminLayout,
    guard: Guard,
    routes: [
      {
        exact: 'true',
        path: '/app/dashboard/default',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: 'user-management/users',
        element: lazy(() => import('./DashComponents/users/Users'))
      },
      {
        exact: 'true',
        path: 'user-management/create-users',
        element: lazy(() => import('./DashComponents/users/CreateUser'))
      },
      {
        exact: 'true',
        path: '/user-management/edit-create-users/:id',
        element: lazy(() => import('./DashComponents/users/EditUser'))
      },
      {
        exact: 'true',
        path: 'blogs/create-blog',
        element: lazy(() => import('./DashComponents/blogs/BlogCreate'))
      },
      {
        exact: 'true',
        path: '/blogs/blog-catagory',
        element: lazy(() => import('./DashComponents/blogs/CreateBlogCatagory'))
      },
      {
        exact: 'true',
        path: '/blogs/all-blogs',
        element: lazy(() => import('./DashComponents/blogs/Blogs'))
      },
      {
        exact: 'true',
        path: '/edit-blog/:id',
        element: lazy(() => import('./DashComponents/blogs/EditBlog'))
      },
      {
        exact: 'true',
        path: '/edit-blog-category/:id',
        element: lazy(() => import('./DashComponents/blogs/EditCatagory'))
      },
      {
        exact: 'true',
        path: '/addBlog',
        element: lazy(() => import('./DashComponents/blogs/AddBlog'))
      },
      {
        exact: 'true',
        path: '/case-Study',
        element: lazy(() => import('./DashComponents/case-study/CaseStudy'))
      },
      {
        exact: 'true',
        path: 'create-case-study',
        element: lazy(() => import('./DashComponents/case-study/CreateCaseStudy'))
      },
      {
        exact: 'true',
        path: '/edit-case-study/:id',
        element: lazy(() => import('./DashComponents/case-study/EditCaseStudy'))
      },
      {
        exact: 'true',
        path: 'settings',
        element: lazy(() => import('./DashComponents/settings/Settings'))
      },
      {
        exact: 'true',
        path: 'homepage-media',
        element: lazy(() => import('./DashComponents/homemedia/HomeMedia')) 
      },
      {
        exact: 'true',
        path: 'survey-form',
        element: lazy(() => import('./DashComponents/user-survey/UserSurveyForm'))
      },
      {
        exact: 'true',
        path: 'form-fields',
        element: lazy(() => import('./DashComponents/user-survey/FormFields'))
      },
      {
        exact: 'true',
        path: 'budget-range',
        element: lazy(() => import('./DashComponents/user-survey/BudgetRange'))
      },
      {
        exact: 'true',
        path: 'events',
        element: lazy(() => import('./DashComponents/events/Events'))
      },
      {
        exact: 'true',
        path: '/edit-events/:id',
        element: lazy(() => import('./DashComponents/events/EditForm'))
      },
      {
        exact: 'true',
        path: 'pages',
        element: lazy(() => import('./DashComponents/pages/Pages'))
      },
      {
        exact: 'true',
        path: 'pages/add-page',
        element: lazy(() => import('./DashComponents/pages/AddPageModal'))
      },
      {
        exact: 'true',
        path: 'pages/edit-page/:id',
        element: lazy(() => import('./DashComponents/pages/EditPage'))
      },
      {
        exact: 'true',
        path: 'destination',
        element: lazy(() => import('./DashComponents/destination/Destination'))
      },
      {
        exact: 'true',
        path: '/resorts',
        element: lazy(() => import('./DashComponents/resorts/Resort'))
      },
      {
        exact: 'true',
        path: '/trips-safari',
        element: lazy(() => import('./DashComponents/trips-safaries/TripsAndSafaries'))
      },
      {
        exact: 'true',
        path: '/trips-safari/add-trips-safari',
        element: lazy(() => import('./DashComponents/trips-safaries/AddTripSafari'))
      },
      {
        exact: 'true',
        path: '/trips-safari/add-trips-safari/:id',
        element: lazy(() => import('./DashComponents/trips-safaries/EditTripsSafari'))
      },
      {
        exact: 'true',
        path: 'add-resorts',
        element: lazy(() => import('./DashComponents/resorts/AddResort'))
      },
      {
        exact: 'true',
        path: '/edit-resorts/:id',
        element: lazy(() => import('./DashComponents/resorts/EditResort'))
      },
      {
        exact: 'true',
        path: '/packages',
        element: lazy(() => import('./DashComponents/package/Packages'))
      },
      {
        exact: 'true',
        path: '/add-package',
        element: lazy(() => import('./DashComponents/package/AddPackage'))
      },
      {
        exact: 'true',
        path: '/edit-Package/:id',
        element: lazy(() => import('./DashComponents/package/EditPackage'))
      },
      {
        exact: 'true',
        path: 'national-parks',
        element: lazy(() => import('./DashComponents/national-park/NationalPark'))
      },
      {
        exact: 'true',
        path: '/add-national-parks',
        element: lazy(() => import('./DashComponents/national-park/AddPark'))
      },
      {
        exact: 'true',
        path: '/edit-national-parks/:id',
        element: lazy(() => import('./DashComponents/national-park/EditPark'))
      },
      {
        exact: 'true',
        path: 'queries',
        element: lazy(() => import('./DashComponents/Queries'))
      },
      {
        exact: 'true',
        path: 'application',
        element: lazy(() => import('./DashComponents/Application'))
      },
      {
        exact: 'true',
        path: '/current-openings',
        element: lazy(() => import('./DashComponents/current-opening/AllOpenings'))
      },
      {
        exact: 'true',
        path: '/add-current-openings',
        element: lazy(() => import('./DashComponents/current-opening/AddOpening'))
      },
      {
        exact: 'true',
        path: '/edit-current-openings/:id',
        element: lazy(() => import('./DashComponents/current-opening/EditOpening'))
      },
      {
        exact: 'true',
        path: '/testimonials',
        element: lazy(() => import('./DashComponents/testimonials/Testimonials'))
      },
      {
        exact: 'true',
        path: '/add-testimonials',
        element: lazy(() => import('./DashComponents/testimonials/AddTestimonial'))
      },
      {
        exact: 'true',
        path: '/edit-testimonials/:id',
        element: lazy(() => import('./DashComponents/testimonials/EditTestimonial'))
      },
      {
        exact: 'true',
        path: 'email-subscribed',
        element: lazy(() => import('./DashComponents/EmailSubscribed'))
      },
      {
        exact: 'true',
        path: '/social-links',
        element: lazy(() => import('./DashComponents/socialLinks/SocialLink'))
      },
      {
        exact: 'true',
        path: '/expeditions/wildlife-experience',
        element: lazy(() => import('./DashComponents/expedition/experience/Experience'))
      },
      {
        exact: 'true',
        path: '/expeditions/wildlife-experience/add-experience',
        element: lazy(() => import('./DashComponents/expedition/experience/AddExperience'))
      },
      {
        exact: 'true',
        path: '/expeditions/wildlife-experience/edit-experience/:id',
        element: lazy(() => import('./DashComponents/expedition/experience/EditExperience'))
      },
      {
        exact: 'true',
        path: '/expeditions/attraction',
        element: lazy(() => import('./DashComponents/expedition/attraction/Attraction'))
      },
      {
        exact: 'true',
        path: '/expeditions/add-attraction',
        element: lazy(() => import('./DashComponents/expedition/attraction/AddAttraction'))
      },
      {
        exact: 'true',
        path: '/expeditions/edit-attraction/:id',
        element: lazy(() => import('./DashComponents/expedition/attraction/EditAttractions'))
      },
      {
        exact: 'true',
        path: '/expeditions/safety-guidelines',
        element: lazy(() => import('./DashComponents/expedition/safetyGuidelines/SafetyGuidelines'))
      },
      {
        exact: 'true',
        path: '/expeditions/safety-guidelines/add-safety',
        element: lazy(() => import('./DashComponents/expedition/safetyGuidelines/AddSafety'))
      },
      {
        exact: 'true',
        path: '/expeditions/safety-guidelines/edit-safety/:id',
        element: lazy(() => import('./DashComponents/expedition/safetyGuidelines/EditGuidelines'))
      },
      {
        exact: 'true',
        path: '/edit-social-links',
        element: lazy(() => import('./DashComponents/socialLinks/EditSocialLinks'))
      },

      {
        exact: 'true',
        path: '/addfrom',
        element: lazy(() => import('./DashComponents/events/AddForm'))
      },
      {
        exact: 'true',
        path: '/notifications',
        element: lazy(() => import('./DashComponents/notifications/AllNotification'))
      },
      {
        exact: 'true',
        path: '/create-notifications',
        element: lazy(() => import('./DashComponents/notifications/CreateNotification'))
      },

      {
        exact: 'true',
        path: '/media',
        element: lazy(() => import('./DashComponents/media/AllMedia'))
      },
      {
        exact: 'true',
        path: '/add-media',
        element: lazy(() => import('./DashComponents/media/AddMedia'))
      },
      {
        exact: 'true',
        path: '/edit-media/:id',
        element: lazy(() => import('./DashComponents/media/EditMedia'))
      },
      {
        exact: 'true',
        path: '/jungle-expeditions',
        element: lazy(() => import('./DashComponents/expedition/Expeditions'))
      },
      {
        exact: 'true',
        path: '/jungle-expeditions/add-expeditions',
        element: lazy(() => import('./DashComponents/expedition/AddExpeditions'))
      },
      {
        exact: 'true',
        path: '/jungle-expeditions/edit-expeditions/:id',
        element: lazy(() => import('./DashComponents/expedition/EditExpeditions'))
      },
      {
        exact: 'true',
        path: '/user-bookings',
        element: lazy(() => import('./DashComponents/booking/Bookings'))
      },
      {
        exact: 'true',
        path: '/user-coupons',
        element: lazy(() => import('./DashComponents/coupon/CouponList'))
      },
      {
        exact: 'true',
        path: '/user-coupons/add-coupon',
        element: lazy(() => import('./DashComponents/coupon/AddCoupon'))
      },
      {
        exact: 'true',
        path: '/user-coupons/edit-coupon/:id',
        element: lazy(() => import('./DashComponents/coupon/EditCoupon'))
      },
      {
        exact: 'true',
        path: '/chat-bot',
        element: lazy(() => import('./DashComponents/chatbot/Chatbot'))
      },
      {
        exact: 'true',
        path: '/chat-bot/add-chatbot-video',
        element: lazy(() => import('./DashComponents/chatbot/AddVideo'))
      },
      {
        exact: 'true',
        path: '/chat-bot/edit-chatbot-video/:id',
        element: lazy(() => import('./DashComponents/chatbot/EditVideo'))
      },
      // CRM Routes
      {
        exact: 'true',
        path: '/crm/dashboard',
        element: lazy(() => import('./DashComponents/crm/CRMDashboard'))
      },
      {
        exact: 'true',
        path: '/crm/contacts',
        element: lazy(() => import('./DashComponents/crm/ContactManager'))
      },
      {
        exact: 'true',
        path: '/crm/campaigns',
        element: lazy(() => import('./DashComponents/crm/CampaignManager'))
      },
      {
        exact: 'true',
        path: '/crm/campaigns/create',
        element: lazy(() => import('./DashComponents/crm/CampaignBuilder'))
      },
      {
        exact: 'true',
        path: '/crm/campaigns/edit/:id',
        element: lazy(() => import('./DashComponents/crm/CampaignBuilder'))
      },
      {
        exact: 'true',
        path: '/crm/inbox',
        element: lazy(() => import('./DashComponents/crm/CRMInbox'))
      },
      {
        exact: 'true',
        path: '/crm/templates',
        element: lazy(() => import('./DashComponents/crm/MessageTemplates'))
      },
      {
        exact: 'true',
        path: '/crm/automation',
        element: lazy(() => import('./DashComponents/crm/Automation'))
      },
      {
        exact: 'true',
        path: '/crm/analytics',
        element: lazy(() => import('./DashComponents/crm/Analytics'))
      },
      {
        exact: 'true',
        path: '/crm/settings',
        element: lazy(() => import('./DashComponents/crm/CRMSettings'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
      // {
      //   exact: "true",
      //   path:
      // }
      // {
      //   exact: 'true',
      //   path: '/log-out',
      //   element: lazy(() => import('./views/auth/signin/SignIn1'))
      // },
    ]
  }
];

export default routes;
