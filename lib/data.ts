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
];

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