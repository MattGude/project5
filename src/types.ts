export interface User {
  id: string;
  email: string;
}

export interface ListingType {
  id: string;
  title: string;
  price?: number;
  description: string;
  category: string;
  subcategory: string;
  attributes: Record<string, string | number>;
  createdAt: string;
  location: string;
  contact: string;
}

export interface CategoryType {
  name: string;
  subcategories: {
    name: string;
    attributes: string[];
  }[];
}

export const categories: CategoryType[] = [
  {
    name: 'For Sale',
    subcategories: [
      {
        name: 'Cars + Trucks',
        attributes: ['Year', 'Make/Model', 'Color', 'Type', 'Condition', 'Price', 'Description', 'City', 'Phone']
      },
      {
        name: 'Motorcycles',
        attributes: ['Year', 'Make/Model', 'Color', 'Engine Size', 'Condition', 'Price', 'Description', 'City', 'Phone']
      },
      {
        name: 'Boats',
        attributes: ['Year', 'Make/Model', 'Length', 'Type', 'Condition', 'Price', 'Description', 'City', 'Phone']
      },
      {
        name: 'Books',
        attributes: ['Title', 'Author', 'Genre', 'Condition', 'Price', 'Description', 'City', 'Phone']
      },
      {
        name: 'Furniture',
        attributes: ['Type', 'Material', 'Color', 'Condition', 'Price', 'Description', 'City', 'Phone']
      }
    ]
  },
  {
    name: 'Housing',
    subcategories: [
      {
        name: 'Apartments',
        attributes: ['Bedrooms', 'Bathrooms', 'Rent', 'Square Feet', 'Pets Allowed', 'Available Date', 'Description', 'Address', 'Phone']
      },
      {
        name: 'Houses',
        attributes: ['Bedrooms', 'Bathrooms', 'Price', 'Square Feet', 'Lot Size', 'Year Built', 'Description', 'Address', 'Phone']
      },
      {
        name: 'Roommates',
        attributes: ['Rent', 'Room Type', 'Available Date', 'Duration', 'Utilities Included', 'Description', 'Address', 'Phone']
      },
      {
        name: 'Commercial',
        attributes: ['Type', 'Square Feet', 'Price', 'Available Date', 'Zoning', 'Description', 'Address', 'Phone']
      },
      {
        name: 'Parking/Storage',
        attributes: ['Type', 'Size', 'Price', 'Security', 'Access Hours', 'Description', 'Address', 'Phone']
      }
    ]
  },
  {
    name: 'Services',
    subcategories: [
      {
        name: 'Home Services',
        attributes: ['Service Type', 'Rate', 'Experience', 'Availability', 'Insurance', 'Description', 'Area Served', 'Phone']
      },
      {
        name: 'Professional',
        attributes: ['Service Type', 'Qualifications', 'Rate', 'Availability', 'Insurance', 'Description', 'Area Served', 'Phone']
      },
      {
        name: 'Creative',
        attributes: ['Service Type', 'Portfolio', 'Rate', 'Turnaround Time', 'Experience', 'Description', 'Area Served', 'Phone']
      },
      {
        name: 'Lessons',
        attributes: ['Subject', 'Level', 'Rate', 'Location', 'Experience', 'Description', 'Area Served', 'Phone']
      },
      {
        name: 'Events',
        attributes: ['Service Type', 'Rate', 'Availability', 'Experience', 'Insurance', 'Description', 'Area Served', 'Phone']
      }
    ]
  },
  {
    name: 'Jobs',
    subcategories: [
      {
        name: 'Full Time',
        attributes: ['Title', 'Company', 'Salary', 'Location', 'Requirements', 'Benefits', 'Description', 'How to Apply', 'Contact']
      },
      {
        name: 'Part Time',
        attributes: ['Title', 'Company', 'Hourly Rate', 'Hours', 'Schedule', 'Requirements', 'Description', 'How to Apply', 'Contact']
      },
      {
        name: 'Contract',
        attributes: ['Title', 'Company', 'Rate', 'Duration', 'Location', 'Requirements', 'Description', 'How to Apply', 'Contact']
      },
      {
        name: 'Internship',
        attributes: ['Title', 'Company', 'Compensation', 'Duration', 'Requirements', 'Description', 'How to Apply', 'Contact']
      },
      {
        name: 'Gigs',
        attributes: ['Type', 'Pay', 'Duration', 'Location', 'Requirements', 'Description', 'How to Apply', 'Contact']
      }
    ]
  },
  {
    name: 'Community',
    subcategories: [
      {
        name: 'Events',
        attributes: ['Event Name', 'Date', 'Time', 'Location', 'Cost', 'Age Restriction', 'Description', 'Organizer', 'Contact']
      },
      {
        name: 'Groups',
        attributes: ['Group Name', 'Category', 'Meeting Time', 'Location', 'Size', 'Requirements', 'Description', 'Organizer', 'Contact']
      },
      {
        name: 'Volunteers',
        attributes: ['Organization', 'Cause', 'Time Commitment', 'Location', 'Requirements', 'Description', 'Coordinator', 'Contact']
      },
      {
        name: 'Lost & Found',
        attributes: ['Item Type', 'Date', 'Location', 'Description', 'Reward', 'Category', 'Additional Details', 'Contact']
      },
      {
        name: 'Announcements',
        attributes: ['Title', 'Category', 'Date', 'Location', 'Organization', 'Description', 'Additional Details', 'Contact']
      }
    ]
  }
];