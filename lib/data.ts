

export interface Showtime {
  id: string;
  movie: string;
  date: string;
  time: string;
  room: "1" | "2" | "3" | "4" | "5" | "6";
  theater: string; // e.g., "Hall A"
}


// Sample showtimes (can be fetched from an API)
export const sampleShowtimes: Showtime[] = [
  {
    id: "1",
    movie: "Biệt Đội Săn Ma: Kỷ Nguyên Băng Giá",
    date: "2025-06-10",
    time: "8:30 PM",
    room: "1",
    theater: "Hall A",
  },
  {
    id: "2",
    movie: "Mufasa: Vua Sư Tử",
    date: "2025-06-10",
    time: "9:00 PM",
    room: "2",
    theater: "Hall B",
  },
  {
    id: "3",
    movie: "Dune: Phần Hai",
    date: "2025-06-10",
    time: "7:30 PM",
    room: "3",
    theater: "Hall C",
  },
  {
    id: "4",
    movie: "Deadpool & Wolverine",
    date: "2025-06-10",
    time: "10:00 PM",
    room: "4",
    theater: "Hall D",
  },
  {
    id: "5",
    movie: "Nhà Bà Nữ 2",
    date: "2025-06-10",
    time: "11:30 PM",
    room: "5",
    theater: "Hall E",
  },
  {
    id: "6",
    movie: "Mission: Impossible – Kẻ Nổi Loạn",
    date: "2025-06-10",
    time: "12:00 PM",
    room: "6",
    theater: "Hall F",
  },
];


export type SeatStatus = "available" | "selected" | "occupied"

export interface Seat {
    id: string
    row: string
    number: number
    type: "regular" | "vip" | "couple"
    status: SeatStatus
    price: number
  }

  export function getSeatLabel(seat: Seat): string {
    return seat.status === "selected" ? "✓" : seat.number.toString()
  }

  export function getSeatStyles(seat: Seat): string {
    let base = "seat";

    if (seat.status === "occupied") return `${base} seat-reserved`;
    if (seat.status === "selected") return `${base} seat-selected`;

    if (seat.type === "couple") {
      return `${base} seat-available couple-seat`;
    }

    return seat.type === "vip"
      ? `${base} seat-available vip`
      : `${base} seat-available`;
  }







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

export interface User {
  id: string
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

export type Movie = {
  id: string;
  title: string; // Tên phim
  banner: string; // Ảnh nền to tràn màn hình
  poster: string; // Ảnh phim trên tab
  director: string; // Đạo diễn
  actor: string[]; // Diễn viên
  movieType: string[]; // Thể loại
  duration: number; // Thời lượng (phút)
  startShow: string; // Ngày công chiếu
  createAt: number; // Năm phát hành
  trailer: string; // Demo
  status: 'inComing' | 'nowShowing' | 'Ended'; // Trạng thái
  rate: number; // Điểm 1-5
  age: 'T13' | 'T16' | 'T18'; // Độ tuổi
    detail: string; // Mô tả
};

export const movies: Movie[] = [
  {
    id: "1",
    title: "Biệt Đội Săn Ma: Kỷ Nguyên Băng Giá",
    banner: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5iJsJt8-kWJ6TasjKGnP2lrXgOQutabPbRg&s",
    poster: "https://cinema.momocdn.net/img/35133717027059114-mLYUMv3l8kPZ7K9NUbcCwFXksnS.jpg",
    director: "Gil Kenan",
    actor: ["Paul Rudd", "Carrie Coon", "Finn Wolfhard"],
    movieType: ["Hài hước", "Kinh dị", "Phiêu lưu"],
    duration: 115,
    startShow: "2025-03-21",
    createAt: 2025,
    trailer: "https://www.youtube.com/watch?v=PWioEshJe7k",
    status: "nowShowing",
    rate: 4.2,
    age: "T13",
    detail: "Biệt đội săn ma thế hệ mới đối mặt với mối đe dọa băng giá, đe dọa nhấn chìm cả thế giới trong kỷ băng hà mới."
  },
  {
    id: "2",
    title: "Mufasa: Vua Sư Tử",
    banner: "https://www.elleman.vn/app/uploads/2019/07/21/poster-review-phim-vua-su-tu-2019-elle-man.jpg",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO9fsg2zPXi6Tltr0CphejUU87RBQJ_BSpUQ&s",
    director: "Barry Jenkins",
    actor: ["Aaron Pierre", "Kelvin Harrison Jr.", "Beyoncé"],
    movieType: ["Hoạt hình", "Gia đình", "Phiêu lưu"],
    duration: 120,
    startShow: "2025-12-20",
    createAt: 2025,
    trailer: "https://www.youtube.com/watch?v=c75XRkb2MpQ",
    status: "inComing",
    rate: 0,
    age: "T13",
    detail: "Câu chuyện về hành trình trở thành vua của Mufasa, cha của Simba, với những thử thách và chiến thắng vĩ đại."
  },
  {
    id: "3",
    title: "Dune: Phần Hai",
    banner: "https://starlight.vn/Areas/Admin/Content/Fileuploads/images/Tintuc/dune(1).jpg",
    poster: "https://metiz.vn/media/poster_film/poster_dune_2_bb_3_no_qr_1_.jpg",
    director: "Denis Villeneuve",
    actor: ["Timothée Chalamet", "Zendaya", "Florence Pugh"],
    movieType: ["Khoa học viễn tưởng", "Hành động"],
    duration: 166,
    startShow: "2025-06-20",
    createAt: 2024,
    trailer: "https://www.youtube.com/watch?v=kCO-RO3q7U4",
    status: "nowShowing",
    rate: 4.8,
    age: "T16",
    detail: "Paul Atreides tiếp tục cuộc chiến trên sa mạc Arrakis, đối mặt với các thế lực thù địch để bảo vệ tương lai của vũ trụ."
  },
  {
    id: "4",
    title: "Kung Fu Panda 4",
    banner: "https://images.firstpost.com/uploads/2024/03/Untitled-design-58-2024-03-d80bd9ba368eff2fbb5a6e1f800c770d.jpg?im=FitAndFill=(596,336)",
    poster: "https://preview.redd.it/what-are-your-thoughts-on-kung-fu-panda-4-v0-h07dcvrojaqc1.png?width=640&crop=smart&auto=webp&s=49b722359060b4184301d2bf8088b9e7fac2445b",
    director: "Mike Mitchell",
    actor: ["Jack Black", "Awkwafina", "Viola Davis"],
    movieType: ["Hoạt hình", "Hành động", "Hài hước"],
    duration: 94,
    startShow: "2025-07-15",
    createAt: 2024,
    trailer: "https://www.youtube.com/watch?v=_inKs4eeHiI",
    status: "inComing",
    rate: 4.0,
    age: "T13",
    detail: "Po tiếp tục hành trình trở thành thủ lĩnh tinh thần, đối mặt với một kẻ thù mới có khả năng biến hình đầy nguy hiểm."
  },
  {
    id: "5",
    title: "Inside Out 2: Những Cảm Xúc Hỗn Độn",
    banner: "https://cgvdt.vn/files/ckfinder/images/Article/2015/van%20hoa/so%202020/1.jpg",
    poster: "https://khenphim.com/wp-content/uploads/2024/06/Inside-Out-2-pic1-poster_KP.webp",
    director: "Kelsey Mann",
    actor: ["Amy Poehler", "Phyllis Smith", "Lewis Black"],
    movieType: ["Hoạt hình", "Gia đình", "Hài hước"],
    duration: 100,
    startShow: "2025-06-14",
    createAt: 2025,
    trailer: "https://www.youtube.com/watch?v=LEjhY15eCx0",
    status: "nowShowing",
    rate: 4.5,
    age: "T13",
    detail: "Riley bước vào tuổi thiếu niên với hàng loạt cảm xúc mới lạ, khiến thế giới nội tâm trở nên hỗn loạn hơn bao giờ hết."
  },
  {
    id: "6",
    title: "Deadpool & Wolverine",
    banner: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/846a9086-8a40-43e0-aa10-2fc7d6d73730/dhs4t97-115690fc-572c-409d-be7d-4f109419bcc8.jpg/v1/fill/w_1280,h_540,q_75,strp/deadpool_and_wolverine_poster_banner_textless__01_by_mintmovi3_dhs4t97-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTQwIiwicGF0aCI6IlwvZlwvODQ2YTkwODYtOGE0MC00M2UwLWFhMTAtMmZjN2Q2ZDczNzMwXC9kaHM0dDk3LTExNTY5MGZjLTU3MmMtNDA5ZC1iZTdkLTRmMTA5NDE5YmNjOC5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19._YTMdFYEzXRx3ZQhbzw02V3kGVN9wFbE1Z5jwZ6BHYs",
    poster: "https://preview.redd.it/marvel-studios-deadpool-wolverine-poster-made-by-me-v0-mtyn5q5io2cd1.png?width=1080&crop=smart&auto=webp&s=0ed2b3456615c1d8aa614590958d7768c84d9069",
    director: "Shawn Levy",
    actor: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin"],
    movieType: ["Hành động", "Hài hước", "Siêu anh hùng"],
    duration: 128,
    startShow: "2025-07-26",
    createAt: 2025,
    trailer: "https://www.youtube.com/watch?v=73_1biulkYk",
    status: "inComing",
    rate: 0,
    age: "T16",
    detail: "Deadpool và Wolverine bắt tay trong một cuộc phiêu lưu xuyên không gian và thời gian, đậm chất hỗn loạn và châm biếm."
  },
  {
    id: "7",
    title: "Nhà Bà Nữ 2",
    poster: "https://vb.1cdn.vn/2022/12/03/nbn_teaser-poster_fb.jpg",
    banner: "https://cdn.brvn.vn/editor/2023/02/A42_330082-NBN-1_1675586806.jpeg",
    director: "Trấn Thành",
    actor: ["Trấn Thành", "NSND Ngọc Giàu", "Uyển Ân"],
    movieType: ["Tâm lý", "Gia đình", "Hài hước"],
    duration: 112,
    startShow: "2025-08-01",
    createAt: 2025,
    trailer: "https://www.youtube.com/watch?v=sample1234",
    status: "inComing",
    rate: 0,
    age: "T16",
    detail: "Tiếp nối phần trước, Nhà Bà Nữ lại rơi vào hàng loạt tình huống dở khóc dở cười khi đón chào thành viên mới trong gia đình."
  },
  {
    id: "8",
    title: "Mission: Impossible – Kẻ Nổi Loạn",
    banner: "https://cdnmedia.baotintuc.vn/Upload/DmtgOUlHWBO5POIHzIwr1A/files/2023/07/16/mission-impossible-17072023.jpg",
    poster: "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/3/image/1800x/71252117777b696995f01934522c402d/m/i/mi8_poster_470x700.jpg",
    director: "Christopher McQuarrie",
    actor: ["Tom Cruise", "Rebecca Ferguson", "Simon Pegg"],
    movieType: ["Hành động", "Giật gân", "Điệp viên"],
    duration: 143,
    startShow: "2025-09-10",
    createAt: 2025,
    trailer: "https://www.youtube.com/watch?v=avz06PDqDbM",
    status: "inComing",
    rate: 0,
    age: "T18",
    detail: "Ethan Hunt đối đầu với một tổ chức ngầm mới đe dọa toàn cầu, nơi mọi nhiệm vụ đều trở thành điều không thể."
  },
  {
    id: "9",
    title: "Mission: Impossible – Kẻ Nổi Loạn",
    banner: "https://cdnmedia.baotintuc.vn/Upload/DmtgOUlHWBO5POIHzIwr1A/files/2023/07/16/mission-impossible-17072023.jpg",
    poster: "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/3/image/1800x/71252117777b696995f01934522c402d/m/i/mi8_poster_470x700.jpg",
    director: "Christopher McQuarrie",
    actor: ["Tom Cruise", "Rebecca Ferguson", "Simon Pegg"],
    movieType: ["Hành động", "Giật gân", "Điệp viên"],
    duration: 143,
    startShow: "2025-09-10",
    createAt: 2025,
    trailer: "https://www.youtube.com/watch?v=avz06PDqDbM",
    status: "inComing",
    rate: 0,
    age: "T18",
    detail: "Ethan Hunt đối đầu với một tổ chức ngầm mới đe dọa toàn cầu, nơi mọi nhiệm vụ đều trở thành điều không thể."
  },
  {
    id: "10",
    title: "Mission: Impossible – Kẻ Nổi Loạn",
    banner: "https://cdnmedia.baotintuc.vn/Upload/DmtgOUlHWBO5POIHzIwr1A/files/2023/07/16/mission-impossible-17072023.jpg",
    poster: "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/3/image/1800x/71252117777b696995f01934522c402d/m/i/mi8_poster_470x700.jpg",
    director: "Christopher McQuarrie",
    actor: ["Tom Cruise", "Rebecca Ferguson", "Simon Pegg"],
    movieType: ["Hành động", "Giật gân", "Điệp viên"],
    duration: 143,
    startShow: "2025-09-10",
    createAt: 2025,
    trailer: "https://www.youtube.com/watch?v=avz06PDqDbM",
    status: "nowShowing",
    rate: 0,
    age: "T18",
    detail: "Ethan Hunt đối đầu với một tổ chức ngầm mới đe dọa toàn cầu, nơi mọi nhiệm vụ đều trở thành điều không thể."
  }
  
];

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
  name: "",
  role: "Admin",
  status: "Active",
  lastLogin: "",
  joinDate: "",
  department: "",
  location: ""
};