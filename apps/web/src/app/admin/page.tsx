export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">MYGlamBeauty Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Total Orders</h2>
            <p className="text-2xl font-bold text-blue-600">156</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h2>
            <p className="text-2xl font-bold text-green-600">$45,678</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Active Customers</h2>
            <p className="text-2xl font-bold text-purple-600">89</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Today's Revenue</h2>
            <p className="text-2xl font-bold text-orange-600">$1,234</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-900">customer1@example.com</p>
                <p className="text-sm text-gray-600">HD Lace Frontal</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">$49.99</p>
                <p className="text-sm text-gray-600">pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
