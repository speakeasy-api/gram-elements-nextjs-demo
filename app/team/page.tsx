"use client";

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  status: "active" | "away" | "offline";
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "George Bluth Sr.",
    role: "Founder & CEO",
    email: "george@nanobanana.com",
    avatar: "👨‍💼",
    status: "away",
  },
  {
    id: "2",
    name: "Lucille Bluth",
    role: "CFO",
    email: "lucille@nanobanana.com",
    avatar: "👩‍💼",
    status: "active",
  },
  {
    id: "3",
    name: "Michael Bluth",
    role: "COO",
    email: "michael@nanobanana.com",
    avatar: "👨‍💻",
    status: "active",
  },
  {
    id: "4",
    name: "Gob Bluth",
    role: "Head of Marketing",
    email: "gob@nanobanana.com",
    avatar: "🎩",
    status: "offline",
  },
  {
    id: "5",
    name: "Lindsay Bluth",
    role: "Head of PR",
    email: "lindsay@nanobanana.com",
    avatar: "👱‍♀️",
    status: "active",
  },
  {
    id: "6",
    name: "Buster Bluth",
    role: "Inventory Manager",
    email: "buster@nanobanana.com",
    avatar: "🧑",
    status: "active",
  },
  {
    id: "7",
    name: "Maeby Fünke",
    role: "Product Manager",
    email: "maeby@nanobanana.com",
    avatar: "👧",
    status: "active",
  },
  {
    id: "8",
    name: "George Michael",
    role: "Software Engineer",
    email: "georgemichael@nanobanana.com",
    avatar: "👦",
    status: "active",
  },
];

const statusColors = {
  active: "bg-green-500",
  away: "bg-yellow-500",
  offline: "bg-gray-400",
};

const statusLabels = {
  active: "Active",
  away: "Away",
  offline: "Offline",
};

export default function TeamPage() {
  const activeCount = teamMembers.filter((m) => m.status === "active").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Team</h1>
              <p className="text-gray-500 mt-1">
                {teamMembers.length} members · {activeCount} active now
              </p>
            </div>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2">
              <span>+</span>
              Invite Member
            </button>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <span className="text-5xl">{member.avatar}</span>
                    <span
                      className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${statusColors[member.status]}`}
                    />
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === "active"
                        ? "bg-green-100 text-green-800"
                        : member.status === "away"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {statusLabels[member.status]}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                <p className="text-sm text-yellow-600 font-medium">{member.role}</p>
                <p className="text-sm text-gray-500 mt-2">{member.email}</p>

                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    Message
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
