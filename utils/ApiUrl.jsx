// API Base URL - points to your Render backend
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://junglore-crm-backend.onrender.com/api'
  : 'http://localhost:8000/api';

export const ApiUrl = {
  Blog_POST: 'blog',
  CATEGORY: 'blog/category',
  CRM_BASE: `${API_BASE_URL}/crm`
};

export const UserUrl = {
  USER: 'user',
  USER_CREATE: 'user/create'
};

export const CaseStudy = {
  CASE_STUDY: 'case-study'
};

export const SurveyForm = {
  SURVEY_FORM: 'user-survey',
  SURVEY_FORM_FIELDS: 'user-survey/form-fields',
  BUDGET: 'user-survey/spend-range'
};

export const Event = {
  EVENTS: 'event'
};

export const Destination = {
  DETINATION: 'destination'
};

export const Pages = {
  PAGES: 'pages'
};

export const Resort = {
  RESORT: 'resort'
};

export const Package = {
  PACKAGE: 'package'
};

export const NationalPark = {
  PARK: 'national-park'
};

export const Querie = {
  QUERIE: 'queries'
};

export const Application = {
  APPLICATION: 'application',
  OPENING: 'opening'
};

export const Testimonial = {
  TESTIMONIAL: 'testimonials'
};

export const Links = {
  LINKS: 'links'
};

export const Setting = {
  SETTING: 'setting'
};

export const EmailSubscription = {
  SUBSCRIBE: 'subscribe'
};

export const Notification = {
  NOTIFICATION: 'notification'
};

export const Dashboard = {
  DASHBOARD: 'dashboard',
  GRAPHS: 'graph'
};

export const Admin = {
  LOGIN: 'admin/login'
};

export const Media = {
  MEDIA: 'media',
  CHATBOT: 'media/admin'
};
export const TripsAndSafaries = {
  TRIPS_SAFARI: 'trips-and-safari'
};
export const Expeditions = {
  EXPEDITIONS: 'expedition',
  EXPERIENCE: 'experience',
  SAFETY: 'safety'
};
export const Booking = {
  BOOKING: 'booking'
};
export const Coupon = {
  COUPON: 'coupon'
};
export const HomeMedia = {
    HOMEMEDIA: 'home-media' 
};

export const CRM = {
    CRM_BASE: 'crm',
    DASHBOARD: 'crm/dashboard',
    INBOX: 'crm/inbox',
    CONTACTS: 'crm/contacts',
    CAMPAIGNS: 'crm/campaigns',
    IMPORT: 'crm/import',
    BROADCAST: 'crm/broadcast',
    WEBHOOKS: 'crm/webhooks'
};