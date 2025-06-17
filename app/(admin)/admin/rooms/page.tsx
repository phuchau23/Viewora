"use client";
import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Users,
  Phone,
  Search,
  Filter,
  ChevronRight,
  X,
  Home,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  type: "meeting" | "office" | "conference" | "workspace";
  capacity: number;
  status: "available" | "occupied" | "maintenance";
  amenities: string[];
}

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  employeeCount: number;
  totalRooms: number;
  image: string;
  rooms: Room[];
}

const mockBranches: Branch[] = [
  {
    id: "1",
    name: "Chi nhánh Hà Nội",
    address: "123 Phố Huế, Hoàn Kiếm, Hà Nội",
    phone: "024-3825-1234",
    manager: "Nguyễn Văn Nam",
    employeeCount: 45,
    totalRooms: 12,
    image:
      "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=800",
    rooms: [
      {
        id: "r1",
        name: "Phòng họp A1",
        type: "meeting",
        capacity: 8,
        status: "available",
        amenities: ["Projector", "Whiteboard", "WiFi"],
      },
      {
        id: "r2",
        name: "Phòng họp B1",
        type: "meeting",
        capacity: 12,
        status: "occupied",
        amenities: ["TV Screen", "Video Conference", "WiFi"],
      },
      {
        id: "r3",
        name: "Văn phòng Giám đốc",
        type: "office",
        capacity: 2,
        status: "occupied",
        amenities: ["Private bathroom", "Mini bar"],
      },
      {
        id: "r4",
        name: "Không gian làm việc chung",
        type: "workspace",
        capacity: 20,
        status: "available",
        amenities: ["Hot desk", "WiFi", "Printer"],
      },
    ],
  },
  {
    id: "2",
    name: "Chi nhánh TP.HCM",
    address: "456 Nguyễn Huệ, Quận 1, TP.HCM",
    phone: "028-3914-5678",
    manager: "Trần Thị Mai",
    employeeCount: 62,
    totalRooms: 18,
    image:
      "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=800",
    rooms: [
      {
        id: "r5",
        name: "Hội trường lớn",
        type: "conference",
        capacity: 50,
        status: "available",
        amenities: ["Stage", "Sound system", "Lighting"],
      },
      {
        id: "r6",
        name: "Phòng họp C1",
        type: "meeting",
        capacity: 6,
        status: "maintenance",
        amenities: ["Whiteboard", "WiFi"],
      },
      {
        id: "r7",
        name: "Phòng đào tạo",
        type: "conference",
        capacity: 25,
        status: "available",
        amenities: ["Projector", "Flipchart", "WiFi"],
      },
    ],
  },
  {
    id: "3",
    name: "Chi nhánh Đà Nẵng",
    address: "789 Hàn Thuyên, Hải Châu, Đà Nẵng",
    phone: "0236-3123-9876",
    manager: "Lê Hoàng Minh",
    employeeCount: 28,
    totalRooms: 8,
    image:
      "https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg?auto=compress&cs=tinysrgb&w=800",
    rooms: [
      {
        id: "r8",
        name: "Phòng họp Hướng biển",
        type: "meeting",
        capacity: 10,
        status: "available",
        amenities: ["Ocean view", "Projector", "WiFi"],
      },
      {
        id: "r9",
        name: "Workspace sáng tạo",
        type: "workspace",
        capacity: 15,
        status: "occupied",
        amenities: ["Flexible seating", "Collaboration tools"],
      },
    ],
  },
  {
    id: "4",
    name: "Chi nhánh Cần Thơ",
    address: "321 Trần Hưng Đạo, Ninh Kiều, Cần Thơ",
    phone: "0292-3456-789",
    manager: "Phạm Văn Đức",
    employeeCount: 35,
    totalRooms: 10,
    image:
      "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800",
    rooms: [
      {
        id: "r10",
        name: "Phòng họp Mekong",
        type: "meeting",
        capacity: 14,
        status: "available",
        amenities: ["River view", "Video conference", "WiFi"],
      },
      {
        id: "r11",
        name: "Phòng làm việc nhóm",
        type: "workspace",
        capacity: 8,
        status: "available",
        amenities: ["Whiteboard", "Flexible furniture"],
      },
    ],
  },
];

function App() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRooms, setShowRooms] = useState(false);

  const filteredBranches = mockBranches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBranchClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowRooms(true);
  };

  const closeRoomView = () => {
    setShowRooms(false);
    setSelectedBranch(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-100";
      case "occupied":
        return "text-red-600 bg-red-100";
      case "maintenance":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Trống";
      case "occupied":
        return "Đang sử dụng";
      case "maintenance":
        return "Bảo trì";
      default:
        return status;
    }
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <Users className="h-4 w-4" />;
      case "office":
        return <Home className="h-4 w-4" />;
      case "conference":
        return <Building2 className="h-4 w-4" />;
      case "workspace":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                Quản lý Chi nhánh
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm chi nhánh..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showRooms ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Tổng chi nhánh</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockBranches.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Tổng nhân viên</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockBranches.reduce(
                        (sum, branch) => sum + branch.employeeCount,
                        0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Home className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Tổng phòng</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockBranches.reduce(
                        (sum, branch) => sum + branch.totalRooms,
                        0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Đang hoạt động</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockBranches.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Branch Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handleBranchClick(branch)}
                >
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    <img
                      src={branch.image}
                      alt={branch.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {branch.totalRooms} phòng
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {branch.name}
                      </h3>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{branch.address}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">{branch.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-blue-600" />
                        <span>{branch.employeeCount} nhân viên</span>
                      </div>
                      <div className="text-gray-500">QL: {branch.manager}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Room View */
          <div className="space-y-6">
            {/* Back Button & Branch Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={closeRoomView}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                Quay lại danh sách chi nhánh
              </button>
              <button
                onClick={closeRoomView}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {selectedBranch && (
              <>
                {/* Branch Details */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <img
                      src={selectedBranch.image}
                      alt={selectedBranch.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedBranch.name}
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{selectedBranch.address}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{selectedBranch.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          <span>
                            {selectedBranch.employeeCount} nhân viên • QL:{" "}
                            {selectedBranch.manager}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rooms Grid */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Danh sách phòng ({selectedBranch.rooms.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedBranch.rooms.map((room) => (
                      <div
                        key={room.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            {getRoomTypeIcon(room.type)}
                            <h4 className="ml-2 font-medium text-gray-900">
                              {room.name}
                            </h4>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              room.status
                            )}`}
                          >
                            {getStatusText(room.status)}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>Sức chứa: {room.capacity} người</span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          <p className="font-medium mb-1">Tiện ích:</p>
                          <div className="flex flex-wrap gap-1">
                            {room.amenities.map((amenity, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 px-2 py-1 rounded"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
