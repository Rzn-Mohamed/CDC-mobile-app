// Mock data for CDC documents
export const documentsData = [
  {
    id: 1,
    title: 'CDC - Project Alpha',
    type: 'pdf',
    lastModified: 'Today at 2:30 PM',
    version: 'v1.5',
    contributors: ['John Doe', 'Mary Smith', 'Robert Johnson'],
    description: 'Comprehensive specifications for Project Alpha development and implementation strategy.'
  },
  {
    id: 2,
    title: 'CDC - Marketing Campaign',
    type: 'doc',
    lastModified: 'Yesterday at 10:15 AM',
    version: 'v2.0',
    contributors: ['Alex Williams', 'Sarah Parker'],
    description: 'Marketing campaign requirements for Q3, including targeting strategy and budget allocation.'
  },
  {
    id: 3,
    title: 'CDC - Financial Report',
    type: 'xls',
    lastModified: '2 days ago',
    version: 'v1.0',
    contributors: ['James Wilson', 'Emily Davis', 'Michael Brown', 'Lisa Moore'],
    description: 'Annual financial report with expenditure breakdown and projected costs for upcoming projects.'
  },
  {
    id: 4,
    title: 'CDC - Quarterly Presentation',
    type: 'ppt',
    lastModified: 'Last week',
    version: 'v3.2',
    contributors: ['David Miller', 'Jennifer Garcia'],
    description: 'Quarterly presentation slides for stakeholder meeting, highlighting achievements and roadblocks.'
  },
  {
    id: 5,
    title: 'CDC - User Research',
    type: 'pdf',
    lastModified: '2 weeks ago',
    version: 'v1.1',
    contributors: ['Thomas Anderson', 'Olivia Martin', 'William Taylor'],
    description: 'Findings from user research studies conducted over the last quarter with actionable insights.'
  },
  {
    id: 6,
    title: 'CDC - Product Roadmap',
    type: 'doc',
    lastModified: 'Mar 15, 2023',
    version: 'v2.3',
    contributors: ['Christopher Clark', 'Elizabeth Lewis'],
    description: 'Product roadmap for the next 18 months, including feature releases and milestone targets.'
  },
  {
    id: 7,
    title: 'CDC - Sales Data Analysis',
    type: 'xls',
    lastModified: 'Mar 10, 2023',
    version: 'v1.7',
    contributors: ['Richard Hall', 'Patricia White', 'Daniel Lee'],
    description: 'Analysis of sales data from the previous fiscal year with recommendations for improvements.'
  },
  {
    id: 8,
    title: 'CDC - Brand Guidelines',
    type: 'pdf',
    lastModified: 'Feb 28, 2023',
    version: 'v4.0',
    contributors: ['Joseph Adams', 'Michelle Scott', 'Kevin Young'],
    description: 'Updated brand guidelines including logo usage, color palette, typography, and communication tone.'
  }
];

// Mock user data
export const userData = {
  id: 1,
  fullName: 'Razin Mohamed',
  email: 'razin@example.com',
  phone: '+1 (555) 123-4567',
  jobTitle: 'Senior Product Manager',
  department: 'Product Development',
  company: 'CDC Corp',
  location: 'San Francisco, CA',
  bio: 'Experienced product manager with a focus on user-centric solutions and agile development methodologies.',
  profilePicture: null, // URL would go here if available
  plan: 'Professional',
  memberSince: 'April 2023',
  lastLogin: 'Today at 9:30 AM'
};

// Mock authentication API response
export const mockAuthResponse = {
  token: 'mock-jwt-token',
  user: {
    id: 1,
    email: 'razin@example.com',
    name: 'Razin Mohamed'
  }
};