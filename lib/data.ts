export type Movie = {
  id: string;
  title: string;
  image: string;
  genre: string[];
  duration: number; // in minutes
  rating: string;
  releaseDate: string;
  director: string;
  cast: string[];
  synopsis: string;
  trailerUrl: string;
  status: 'now-showing' | 'coming-soon';
};

export type Cinema = {
  id: string;
  name: string;
  location: string;
  address: string;
  amenities: string[];
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  email: string;
};

export type Showtime = {
  id: string;
  movieId: string;
  cinemaId: string;
  date: string;
  time: string;
  hall: string;
  price: number;
};

export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: "Admin" | "User" | "Moderator" | "Manager"
  status: "Active" | "Inactive" | "Suspended"
  lastLogin: string
  joinDate: string
  avatar?: string
  department: string
  location: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: "Open" | "In Progress" | "Resolved" | "Closed" | "Pending"
  priority: "Low" | "Medium" | "High" | "Critical"
  assignee: string
  reporter: string
  created: string
  updated: string
  comments: number
  category: "Bug" | "Feature Request" | "Support" | "Technical Issue"
  tags: string[]
}

export interface Role {
  id: number
  name: string
  userCount: number
  createdDate: string
  status: "Active" | "Inactive"
}

export const initialRoles: Role[] = [
  {
    id: 1,
    name: "Administrator",
    userCount: 5,
    createdDate: "2024-01-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Editor",
    userCount: 12,
    createdDate: "2024-02-20",
    status: "Active",
  },
  {
    id: 3,
    name: "Viewer",
    userCount: 25,
    createdDate: "2024-03-10",
    status: "Active",
  },
  {
    id: 4,
    name: "Guest",
    userCount: 0,
    createdDate: "2024-04-05",
    status: "Inactive",
  },
]

export interface Employee {
  id: number
  employeeId: string
  account: string
  password: string
  employeeName: string
  identityCard: string
  email: string
  phoneNumber: string
  address: string
  dateOfBirth: string
  sex: "Male" | "Female"
  image?: string
  role: "Admin" | "Manager" | "Employee"
  status: "Active" | "Inactive";
  createdDate: string
  lastLogin: string
}
// Mock current user for role-based access control
export const currentUser = {
  id: 1,
  role: "Admin" as const,
  name: "John Smith",
}

export const hasEmployeeAccess = (userRole: string): boolean => {
  return userRole === "Admin" || userRole === "Manager"
}
export interface AnalyticsData {
  pageViews: { month: string; views: number }[]
  userGrowth: { month: string; users: number }[]
  ticketStats: { status: string; count: number; color: string }[]
  topPages: { page: string; views: number; change: number }[]
  deviceStats: { device: string; percentage: number; color: string }[]
  revenueData: { month: string; revenue: number }[]
}

export const sampleEmployees: Employee[] = [
  {
    id: 1,
    employeeId: "EMP001",
    account: "john.admin",
    password: "password123",
    employeeName: "John Smith",
    identityCard: "123456789",
    email: "john.smith@movietheater.com",
    phoneNumber: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    dateOfBirth: "1985-03-15",
    sex: "Male",
    role: "Admin",
    status: "Active",
    createdDate: "2023-01-15",
    lastLogin: "2 hours ago",
  },
  {
    id: 2,
    employeeId: "EMP002",
    account: "jane.manager",
    password: "password123",
    employeeName: "Jane Johnson",
    identityCard: "987654321",
    email: "jane.johnson@movietheater.com",
    phoneNumber: "+1 (555) 987-6543",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    dateOfBirth: "1990-07-22",
    sex: "Female",
    role: "Manager",
    status: "Active",
    createdDate: "2023-02-20",
    lastLogin: "1 day ago",
  },
  {
    id: 3,
    employeeId: "EMP003",
    account: "mike.employee",
    password: "password123",
    employeeName: "Mike Davis",
    identityCard: "456789123",
    email: "mike.davis@movietheater.com",
    phoneNumber: "+1 (555) 456-7890",
    address: "789 Pine St, Chicago, IL 60601",
    dateOfBirth: "1992-11-08",
    sex: "Male",
    role: "Employee",
    status: "Active",
    createdDate: "2023-03-10",
    lastLogin: "3 hours ago",
  },
  {
    id: 4,
    employeeId: "EMP004",
    account: "sarah.employee",
    password: "password123",
    employeeName: "Sarah Wilson",
    identityCard: "789123456",
    email: "sarah.wilson@movietheater.com",
    phoneNumber: "+1 (555) 321-0987",
    address: "321 Elm St, Miami, FL 33101",
    dateOfBirth: "1988-05-14",
    sex: "Female",
    role: "Employee",
    status: "Inactive",
    createdDate: "2023-04-05",
    lastLogin: "1 week ago",
  },
  {
    id: 5,
    employeeId: "EMP005",
    account: "alex.manager",
    password: "password123",
    employeeName: "Alex Brown",
    identityCard: "321654987",
    email: "alex.brown@movietheater.com",
    phoneNumber: "+1 (555) 654-3210",
    address: "654 Cedar Rd, Seattle, WA 98101",
    dateOfBirth: "1987-09-30",
    sex: "Male",
    role: "Manager",
    status: "Active",
    createdDate: "2023-05-12",
    lastLogin: "5 minutes ago",
  },
  {
    id: 6,
    employeeId: "EMP006",
    account: "emily.employee",
    password: "password123",
    employeeName: "Emily Garcia",
    identityCard: "654987321",
    email: "emily.garcia@movietheater.com",
    phoneNumber: "+1 (555) 789-0123",
    address: "987 Maple Dr, Austin, TX 78701",
    dateOfBirth: "1993-12-03",
    sex: "Female",
    role: "Employee",
    status: "Active",
    createdDate: "2023-01-30",
    lastLogin: "30 minutes ago",
  },
]


export const movies: Movie[] = [
  {
    id: "1",
    title: "Dune: Part Two",
    image: "https://images.pexels.com/photos/3131971/pexels-photo-3131971.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    duration: 166,
    rating: "PG-13",
    releaseDate: "2024-03-01",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Josh Brolin"],
    synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    status: "now-showing",
  },
  {
    id: "2",
    title: "Kung Fu Panda 4",
    image: "https://images.pexels.com/photos/1903702/pexels-photo-1903702.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    genre: ["Animation", "Action", "Comedy"],
    duration: 94,
    rating: "PG",
    releaseDate: "2024-03-08",
    director: "Mike Mitchell",
    cast: ["Jack Black", "Awkwafina", "Viola Davis", "Bryan Cranston"],
    synopsis: "Po must train a new warrior when he's chosen to become the spiritual leader of the Valley of Peace.",
    trailerUrl: "https://www.youtube.com/watch?v=_inKs4eeHiI",
    status: "now-showing",
  },
  {
    id: "3",
    title: "Godzilla x Kong: The New Empire",
    image: "https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    genre: ["Action", "Adventure", "Sci-Fi"],
    duration: 115,
    rating: "PG-13",
    releaseDate: "2024-03-29",
    director: "Adam Wingard",
    cast: ["Rebecca Hall", "Brian Tyree Henry", "Dan Stevens"],
    synopsis: "The legends collide as Godzilla and Kong team up against a massive undiscovered threat hidden within our world.",
    trailerUrl: "https://www.youtube.com/watch?v=odM92ap8_c0",
    status: "now-showing",
  },
  {
    id: "4",
    title: "Inside Out 2",
    image: "https://images.pexels.com/photos/12696152/pexels-photo-12696152.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    genre: ["Animation", "Adventure", "Comedy"],
    duration: 107,
    rating: "PG",
    releaseDate: "2024-06-14",
    director: "Kelsey Mann",
    cast: ["Amy Poehler", "Phyllis Smith", "Lewis Black", "Tony Hale"],
    synopsis: "Riley enters adolescence as new emotions join Joy, Sadness, Anger, Fear, and Disgust in Headquarters.",
    trailerUrl: "https://www.youtube.com/watch?v=RGpdfqgaqfQ",
    status: "coming-soon",
  },
  {
    id: "5",
    title: "A Quiet Place: Day One",
    image: "https://images.pexels.com/photos/2346001/pexels-photo-2346001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    genre: ["Horror", "Sci-Fi", "Thriller"],
    duration: 120,
    rating: "PG-13",
    releaseDate: "2024-06-28",
    director: "Michael Sarnoski",
    cast: ["Lupita Nyong'o", "Joseph Quinn", "Alex Wolff"],
    synopsis: "Experience the day the world went quiet in this prequel to the post-apocalyptic horror franchise.",
    trailerUrl: "https://www.youtube.com/watch?v=8rQwxbg1BQ4",
    status: "coming-soon",
  },
  {
    id: "6",
    title: "Deadpool & Wolverine",
    image: "https://images.pexels.com/photos/1342251/pexels-photo-1342251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    genre: ["Action", "Adventure", "Comedy"],
    duration: 135,
    rating: "R",
    releaseDate: "2024-07-26",
    director: "Shawn Levy",
    cast: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin", "Matthew Macfadyen"],
    synopsis: "Wade Wilson teams up with Wolverine in this highly anticipated Marvel crossover.",
    trailerUrl: "https://www.youtube.com/watch?v=X9L_LIhUoVU",
    status: "coming-soon",
  },
  {
    id: "7",
    title: "The Fall Guy",
    image: "https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    genre: ["Action", "Comedy"],
    duration: 125,
    rating: "PG-13",
    releaseDate: "2024-05-03",
    director: "David Leitch",
    cast: ["Ryan Gosling", "Emily Blunt", "Aaron Taylor-Johnson", "Hannah Waddingham"],
    synopsis: "A stuntman is drawn into a dangerous conspiracy while trying to win back his ex-girlfriend.",
    trailerUrl: "https://www.youtube.com/watch?v=0Md63MMsyTY",
    status: "now-showing",
  },
  {
    id: "8",
    title: "Furiosa: A Mad Max Saga",
    image: "https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    genre: ["Action", "Adventure", "Sci-Fi"],
    duration: 148,
    rating: "R",
    releaseDate: "2024-05-24",
    director: "George Miller",
    cast: ["Anya Taylor-Joy", "Chris Hemsworth", "Tom Burke"],
    synopsis: "The origin story of the renegade warrior before her encounter with Max Rockatansky.",
    trailerUrl: "https://www.youtube.com/watch?v=XdYR1_Ml8A0",
    status: "now-showing",
  },
];

export const cinemas: Cinema[] = [
  {
    id: "1",
    name: "CinemaTix Diamond Plaza",
    location: "Ho Chi Minh City",
    address: "34 Le Duan, Ben Nghe Ward, District 1, Ho Chi Minh City",
    amenities: ["IMAX", "4DX", "VIP Seats", "Dolby Atmos"],
    image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    coordinates: {
      lat: 10.7814,
      lng: 106.7017
    },
    phone: "(028) 3822 8888",
    email: "diamond@cinematix.com"
  },
  {
    id: "2",
    name: "CinemaTix Vincom Center",
    location: "Ho Chi Minh City",
    address: "72 Le Thanh Ton, Ben Nghe Ward, District 1, Ho Chi Minh City",
    amenities: ["Premium Screens", "Couple Seats", "Gold Class"],
    image: "https://images.pexels.com/photos/7991438/pexels-photo-7991438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    coordinates: {
      lat: 10.7765,
      lng: 106.7021
    },
    phone: "(028) 3821 8888",
    email: "vincom@cinematix.com"
  },
  {
    id: "3",
    name: "CinemaTix Aeon Mall Tan Phu",
    location: "Ho Chi Minh City",
    address: "30 Bo Bao Tan Thang, Son Ky Ward, Tan Phu District, Ho Chi Minh City",
    amenities: ["ScreenX", "Family Rooms", "Dolby Atmos"],
    image: "https://images.pexels.com/photos/3921045/pexels-photo-3921045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    coordinates: {
      lat: 10.8006,
      lng: 106.6283
    },
    phone: "(028) 3824 8888",
    email: "aeonmall@cinematix.com"
  },
  {
    id: "4",
    name: "CinemaTix Crescent Mall",
    location: "Ho Chi Minh City",
    address: "101 Ton Dat Tien, Tan Phu Ward, District 7, Ho Chi Minh City",
    amenities: ["IMAX", "4DX", "Premium Seats"],
    image: "https://images.pexels.com/photos/7991572/pexels-photo-7991572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    coordinates: {
      lat: 10.7287,
      lng: 106.7188
    },
    phone: "(028) 3823 8888",
    email: "crescent@cinematix.com"
  },
  {
    id: "5",
    name: "CinemaTix Saigon Centre",
    location: "Ho Chi Minh City",
    address: "65 Le Loi, Ben Nghe Ward, District 1, Ho Chi Minh City",
    amenities: ["Laser Projection", "Dolby Atmos", "VIP Lounge"],
    image: "https://images.pexels.com/photos/7991438/pexels-photo-7991438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    coordinates: {
      lat: 10.7733,
      lng: 106.7033
    },
    phone: "(028) 3825 8888",
    email: "saigoncentre@cinematix.com"
  },
  {
    id: "6",
    name: "CinemaTix Landmark 81",
    location: "Ho Chi Minh City",
    address: "720A Dien Bien Phu, Ward 22, Binh Thanh District, Ho Chi Minh City",
    amenities: ["IMAX", "4DX", "Gold Class", "Dolby Atmos"],
    image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    coordinates: {
      lat: 10.7952,
      lng: 106.7215
    },
    phone: "(028) 3826 8888",
    email: "landmark81@cinematix.com"
  }
];

export const showtimes: Showtime[] = [
  {
    id: "1",
    movieId: "1",
    cinemaId: "1",
    date: "2024-05-25",
    time: "10:30",
    hall: "IMAX 1",
    price: 120000,
  },
  {
    id: "2",
    movieId: "1",
    cinemaId: "1",
    date: "2024-05-25",
    time: "13:45",
    hall: "IMAX 1",
    price: 120000,
  },
  {
    id: "3",
    movieId: "1",
    cinemaId: "1",
    date: "2024-05-25",
    time: "17:00",
    hall: "IMAX 1",
    price: 150000,
  },
  {
    id: "4",
    movieId: "1",
    cinemaId: "1",
    date: "2024-05-25",
    time: "20:15",
    hall: "IMAX 1",
    price: 150000,
  },
  {
    id: "5",
    movieId: "1",
    cinemaId: "2",
    date: "2024-05-25",
    time: "11:00",
    hall: "Hall 3",
    price: 100000,
  },
  {
    id: "6",
    movieId: "1",
    cinemaId: "2",
    date: "2024-05-25",
    time: "14:30",
    hall: "Hall 3",
    price: 100000,
  },
  {
    id: "7",
    movieId: "1",
    cinemaId: "2",
    date: "2024-05-25",
    time: "18:15",
    hall: "Hall 3",
    price: 120000,
  },
  {
    id: "8",
    movieId: "1",
    cinemaId: "2",
    date: "2024-05-25",
    time: "21:30",
    hall: "Hall 3",
    price: 120000,
  },
  {
    id: "9",
    movieId: "2",
    cinemaId: "1",
    date: "2024-05-25",
    time: "09:00",
    hall: "Hall 2",
    price: 90000,
  },
  {
    id: "10",
    movieId: "2",
    cinemaId: "1",
    date: "2024-05-25",
    time: "12:15",
    hall: "Hall 2",
    price: 90000,
  },
  {
    id: "11",
    movieId: "2",
    cinemaId: "1",
    date: "2024-05-25",
    time: "15:30",
    hall: "Hall 2",
    price: 110000,
  },
  {
    id: "12",
    movieId: "2",
    cinemaId: "1",
    date: "2024-05-25",
    time: "18:45",
    hall: "Hall 2",
    price: 110000,
  },
  {
    id: "13",
    movieId: "3",
    cinemaId: "1",
    date: "2024-05-25",
    time: "10:00",
    hall: "4DX",
    price: 150000,
  },
  {
    id: "14",
    movieId: "3",
    cinemaId: "1",
    date: "2024-05-25",
    time: "13:30",
    hall: "4DX",
    price: 150000,
  },
  {
    id: "15",
    movieId: "3",
    cinemaId: "1",
    date: "2024-05-25",
    time: "17:00",
    hall: "4DX",
    price: 180000,
  },
  {
    id: "16",
    movieId: "3",
    cinemaId: "1",
    date: "2024-05-25",
    time: "20:30",
    hall: "4DX",
    price: 180000,
  },
];

export const promotions = [
  {
    id: "1",
    title: "Midweek Special",
    description: "Get 30% off on all movie tickets every Wednesday!",
    image: "https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    validUntil: "2024-06-30",
  },
  {
    id: "2",
    title: "Student Discount",
    description: "Students get 20% off on all movies. Valid student ID required.",
    image: "https://images.pexels.com/photos/8432306/pexels-photo-8432306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    validUntil: "2024-12-31",
  },
  {
    id: "3",
    title: "Family Package",
    description: "Buy 4 tickets and get 1 free popcorn + 2 soft drinks.",
    image: "https://images.pexels.com/photos/7991381/pexels-photo-7991381.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    validUntil: "2024-08-15",
  },
]
export const sampleUsers: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      phone: "+1 (555) 123-4567",
      role: "Admin",
      status: "Active",
      lastLogin: "2 hours ago",
      joinDate: "2023-01-15",
      department: "IT",
      location: "New York, NY",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@company.com",
      phone: "+1 (555) 987-6543",
      role: "Manager",
      status: "Active",
      lastLogin: "1 day ago",
      joinDate: "2023-02-20",
      department: "Marketing",
      location: "Los Angeles, CA",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      phone: "+1 (555) 456-7890",
      role: "Moderator",
      status: "Active",
      lastLogin: "3 hours ago",
      joinDate: "2023-03-10",
      department: "Support",
      location: "Chicago, IL",
    },
    {
      id: 4,
      name: "Sarah Davis",
      email: "sarah.davis@company.com",
      phone: "+1 (555) 321-0987",
      role: "User",
      status: "Inactive",
      lastLogin: "1 week ago",
      joinDate: "2023-04-05",
      department: "Sales",
      location: "Miami, FL",
    },
    {
      id: 5,
      name: "Alex Wilson",
      email: "alex.wilson@company.com",
      phone: "+1 (555) 654-3210",
      role: "User",
      status: "Active",
      lastLogin: "5 minutes ago",
      joinDate: "2023-05-12",
      department: "Design",
      location: "Seattle, WA",
    },
    {
      id: 6,
      name: "Emily Brown",
      email: "emily.brown@company.com",
      phone: "+1 (555) 789-0123",
      role: "Manager",
      status: "Active",
      lastLogin: "30 minutes ago",
      joinDate: "2023-01-30",
      department: "HR",
      location: "Austin, TX",
    },
    {
      id: 7,
      name: "David Lee",
      email: "david.lee@company.com",
      phone: "+1 (555) 234-5678",
      role: "User",
      status: "Suspended",
      lastLogin: "2 weeks ago",
      joinDate: "2023-06-18",
      department: "Finance",
      location: "Boston, MA",
    },
    {
      id: 8,
      name: "Lisa Garcia",
      email: "lisa.garcia@company.com",
      phone: "+1 (555) 876-5432",
      role: "Moderator",
      status: "Active",
      lastLogin: "1 hour ago",
      joinDate: "2023-03-25",
      department: "Operations",
      location: "Denver, CO",
    },
  ]
  
  export const sampleTickets: Ticket[] = [
    {
      id: "TK-001",
      title: "Login Issues with Mobile App",
      description:
        "Users are experiencing difficulties logging into the mobile application. The issue appears to be related to OAuth authentication flow.",
      status: "Open",
      priority: "High",
      assignee: "John Doe",
      reporter: "Jane Smith",
      created: "2 hours ago",
      updated: "30 minutes ago",
      comments: 3,
      category: "Bug",
      tags: ["mobile", "authentication", "urgent"],
    },
    {
      id: "TK-002",
      title: "Feature Request: Dark Mode",
      description:
        "Multiple users have requested the implementation of a dark mode theme across the entire application to improve user experience during night hours.",
      status: "In Progress",
      priority: "Medium",
      assignee: "Mike Johnson",
      reporter: "Alex Wilson",
      created: "1 day ago",
      updated: "4 hours ago",
      comments: 7,
      category: "Feature Request",
      tags: ["ui", "theme", "enhancement"],
    },
    {
      id: "TK-003",
      title: "Database Performance Issues",
      description:
        "Slow query performance affecting user experience, particularly on the dashboard and reporting sections. Response times have increased by 300%.",
      status: "Resolved",
      priority: "Critical",
      assignee: "Sarah Davis",
      reporter: "System Monitor",
      created: "3 days ago",
      updated: "1 day ago",
      comments: 12,
      category: "Technical Issue",
      tags: ["database", "performance", "critical"],
    },
    {
      id: "TK-004",
      title: "Email Notifications Not Working",
      description: "Users report not receiving email notifications for important updates and system alerts.",
      status: "Open",
      priority: "High",
      assignee: "Emily Brown",
      reporter: "David Lee",
      created: "6 hours ago",
      updated: "2 hours ago",
      comments: 2,
      category: "Bug",
      tags: ["email", "notifications", "system"],
    },
    {
      id: "TK-005",
      title: "Add Export Functionality to Reports",
      description:
        "Request to add PDF and Excel export options to all report pages for better data sharing and offline analysis.",
      status: "Pending",
      priority: "Medium",
      assignee: "Lisa Garcia",
      reporter: "Emily Brown",
      created: "2 days ago",
      updated: "1 day ago",
      comments: 5,
      category: "Feature Request",
      tags: ["reports", "export", "pdf", "excel"],
    },
    {
      id: "TK-006",
      title: "Security Vulnerability in File Upload",
      description:
        "Potential security issue discovered in the file upload component that could allow malicious file execution.",
      status: "In Progress",
      priority: "Critical",
      assignee: "John Doe",
      reporter: "Security Team",
      created: "4 hours ago",
      updated: "1 hour ago",
      comments: 8,
      category: "Bug",
      tags: ["security", "upload", "vulnerability"],
    },
    {
      id: "TK-007",
      title: "Improve Search Functionality",
      description:
        "Current search is slow and doesn't provide relevant results. Users want better filtering and sorting options.",
      status: "Open",
      priority: "Low",
      assignee: "Alex Wilson",
      reporter: "Multiple Users",
      created: "1 week ago",
      updated: "3 days ago",
      comments: 4,
      category: "Feature Request",
      tags: ["search", "performance", "ux"],
    },
    {
      id: "TK-008",
      title: "API Rate Limiting Issues",
      description: "Third-party integrations are hitting rate limits causing service disruptions during peak hours.",
      status: "Closed",
      priority: "Medium",
      assignee: "Mike Johnson",
      reporter: "API Monitor",
      created: "5 days ago",
      updated: "2 days ago",
      comments: 6,
      category: "Technical Issue",
      tags: ["api", "rate-limiting", "integration"],
    },
  ]
  
  export const sampleAnalytics: AnalyticsData = {
    pageViews: [
      { month: "Jan", views: 12000 },
      { month: "Feb", views: 15000 },
      { month: "Mar", views: 18000 },
      { month: "Apr", views: 22000 },
      { month: "May", views: 25000 },
      { month: "Jun", views: 28000 },
      { month: "Jul", views: 32000 },
      { month: "Aug", views: 35000 },
      { month: "Sep", views: 38000 },
      { month: "Oct", views: 42000 },
      { month: "Nov", views: 45000 },
      { month: "Dec", views: 48000 },
    ],
    userGrowth: [
      { month: "Jan", users: 1200 },
      { month: "Feb", users: 1350 },
      { month: "Mar", users: 1500 },
      { month: "Apr", users: 1680 },
      { month: "May", users: 1850 },
      { month: "Jun", users: 2020 },
      { month: "Jul", users: 2200 },
      { month: "Aug", users: 2380 },
      { month: "Sep", users: 2550 },
      { month: "Oct", users: 2720 },
      { month: "Nov", users: 2900 },
      { month: "Dec", users: 3100 },
    ],
    ticketStats: [
      { status: "Open", count: 15, color: "#ef4444" },
      { status: "In Progress", count: 8, color: "#3b82f6" },
      { status: "Resolved", count: 45, color: "#10b981" },
      { status: "Closed", count: 32, color: "#6b7280" },
      { status: "Pending", count: 6, color: "#f59e0b" },
    ],
    topPages: [
      { page: "/dashboard", views: 15420, change: 12.5 },
      { page: "/user-profile", views: 12380, change: 8.2 },
      { page: "/reports", views: 9850, change: -2.1 },
      { page: "/settings", views: 7650, change: 15.8 },
      { page: "/analytics", views: 6420, change: 22.3 },
    ],
    deviceStats: [
      { device: "Desktop", percentage: 65, color: "#3b82f6" },
      { device: "Mobile", percentage: 28, color: "#10b981" },
      { device: "Tablet", percentage: 7, color: "#f59e0b" },
    ],
    revenueData: [
      { month: "Jan", revenue: 45000 },
      { month: "Feb", revenue: 52000 },
      { month: "Mar", revenue: 48000 },
      { month: "Apr", revenue: 61000 },
      { month: "May", revenue: 55000 },
      { month: "Jun", revenue: 67000 },
      { month: "Jul", revenue: 72000 },
      { month: "Aug", revenue: 69000 },
      { month: "Sep", revenue: 78000 },
      { month: "Oct", revenue: 85000 },
      { month: "Nov", revenue: 92000 },
      { month: "Dec", revenue: 98000 },
    ],
  }

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  dateOfBirth?: string;
  sex?: "Male" | "Female" | "Other";
  identityCard?: string;
  address?: {
    houseNo?: string; // Thêm trường cho Flat/House No.
    street: string;
    city: string;
    state?: string; // Thêm trường cho State
    pincode?: string; // Thêm trường cho Pincode
    landmark?: string; // Thêm trường cho Landmark
    country: string;
  };
  preferences?: {
    favoriteGenres: string[];
    preferredCinemas: string[];
    notifications: boolean;
  };
  bookingHistory?: BookingHistory[];
}
export interface BookingHistory {
  showtimeId: string
  tickets: number
  totalAmount: number
  bookingDate: string
}
export interface EditLog {
  id: string
  employeeId?: string
  memberId: string
  timestamp: string
  status: "success" | "failed"
  changes: Record<string, { old: any; new: any }>
}

export interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  sex?: string
  identityCard?: string
  password?: string
  confirmPassword?: string
  general?: string
  address?: {
    street?: string
    city?: string
    country?: string
  }
}
export const sampleUser: User = {
  id: "user123",
  firstName: "Vaishnavi",
  lastName: "Baskaran",
  email: "vaishnavibaskaran@gmail.com",
  phone: "+919840524789",
  avatar: "/profile1.png",
  dateOfBirth: "1994-08-16",
  sex: "Female",
  identityCard: "ID123456789", // Không có trong hình, giữ nguyên giá trị mẫu
  address: {
    houseNo: "200", // Thêm trường này để khớp với Flat/House No.
    street: "5th Street, KK Nagar",
    city: "Saidapet",
    state: "Tamilnadu", // Thêm trường này để khớp với State
    pincode: "+600017", // Thêm trường này để khớp với Pincode
    landmark: "Near MedPlus", // Thêm trường này để khớp với Landmark
    country: "India", // Thêm từ thông tin trong hình (Chennai, Tamil Nadu, India)
  },
  preferences: {
    favoriteGenres: ["Action", "Adventure", "Sci-Fi", "Drama"], // Giữ nguyên từ dữ liệu gốc
    preferredCinemas: ["1", "3"], // Giữ nguyên từ dữ liệu gốc
    notifications: true, // Giữ nguyên từ dữ liệu gốc
  },
  bookingHistory: [
    {
      showtimeId: "1",
      tickets: 2,
      totalAmount: 25.0,
      bookingDate: "2024-01-10",
    },
    {
      showtimeId: "2",
      tickets: 1,
      totalAmount: 11.0,
      bookingDate: "2024-01-12",
    },
    {
      showtimeId: "3",
      tickets: 3,
      totalAmount: 39.0,
      bookingDate: "2024-01-08",
    },
  ],
};