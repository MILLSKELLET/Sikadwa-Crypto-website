import prisma from "@/lib/prisma";
import Link from "next/link";

const USERS_PER_PAGE = 10;

const UsersPage = async ({ searchParams }) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const skip = (currentPage - 1) * USERS_PER_PAGE;

  // Total users count for pagination
  const totalUsers = await prisma.user.count();

  // Fetch users for the current page
  const users = await prisma.user.findMany({
    skip,
    take: USERS_PER_PAGE,
    orderBy: { createdAt: "desc" },
  });

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-2xl font-bold mb-4">👥 All Users</h1>

      {/* Users List */}
      <ul className="space-y-4">
        {users.length > 0 ? (
          users.map((user) => (
            <li
              key={user.id}
              className="p-4 border bg-foreground rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">📧 {user.email}</p>
                <p className="text-sm text-gray-500">
                  📱 {user.phone || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  🛡️ Role:{" "}
                  <span
                    className={`font-bold ${
                      user.role === "admin" ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    {user.role.toUpperCase()}
                  </span>
                </p>
              </div>
              <p className="text-sm text-gray-400">
                🕒 Joined: {new Date(user.createdAt).toLocaleDateString()}
              </p>
              {/* <Link
                href={`/users/${user.id}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                View
              </Link> */}
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No users found.</p>
        )}
      </ul>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        {currentPage > 1 && (
          <Link
            href={`/users?page=${currentPage - 1}`}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            ⬅️ Prev
          </Link>
        )}

        <span className="font-bold">
          Page {currentPage} of {totalPages}
        </span>

        {currentPage < totalPages && (
          <Link
            href={`/users?page=${currentPage + 1}`}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Next ➡️
          </Link>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
