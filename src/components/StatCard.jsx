const StatCard = ({ icon, title, value, change, isPositive }) => {
  return (
    <div className="relative bg-foreground p-4 rounded-lg shadow-md flex items-center">
      <div className="text-primary text-3xl">{icon}</div>
      <div className="ml-4">
        <h2 className="text-sm font-semibold text-copy pt-1">{title}</h2>
        <p className="text-xl text-secondary font-bold">{value}</p>
        {change && (
          <p
            className={`p-2 text-white absolute top-0 right-0 text-xs font-bold ${
              isPositive !== undefined
                ? isPositive
                  ? "bg-green-600"
                  : "bg-red-600"
                : "text-gray-800"
            }`}
          >
            {change}
          </p>
        )}
      </div>
    </div>
  );
};
export default StatCard;
