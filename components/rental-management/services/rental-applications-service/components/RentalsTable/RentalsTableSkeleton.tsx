"use client";

export function RentalsTableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <tr
          key={`skeleton-${index}`}
          className={index % 2 === 0 ? "bg-white" : "bg-gray-25"}
        >
          <td className="px-6 py-5">
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
          </td>
          <td className="px-6 py-5">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="h-12 w-12 bg-gray-200 animate-pulse rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          </td>
          <td className="px-6 py-5">
            <div className="h-4 w-40 bg-gray-200 animate-pulse rounded" />
            <div className="h-3 w-28 bg-gray-200 animate-pulse rounded mt-2" />
          </td>
          <td className="px-6 py-5">
            <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
            <div className="h-3 w-24 bg-gray-200 animate-pulse rounded mt-2" />
          </td>
          <td className="px-6 py-5">
            <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
            <div className="h-3 w-28 bg-gray-200 animate-pulse rounded mt-2" />
          </td>
          <td className="px-6 py-5">
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
            <div className="h-3 w-20 bg-gray-200 animate-pulse rounded mt-2" />
          </td>
          <td className="px-6 py-5">
            <div className="h-4 w-28 bg-gray-200 animate-pulse rounded" />
            <div className="h-3 w-24 bg-gray-200 animate-pulse rounded mt-2" />
          </td>
          <td className="px-6 py-5">
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full" />
          </td>
          <td className="px-6 py-5">
            <div className="h-9 w-20 bg-gray-200 animate-pulse rounded" />
          </td>
          <td className="px-6 py-5">
            <div className="h-8 w-8 bg-gray-200 animate-pulse rounded" />
          </td>
        </tr>
      ))}
    </>
  );
}
