import React, { useEffect } from 'react';
import { useOrderStore } from '@/store/orderStore';
import { useParams } from 'next/navigation';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const statusIcons = {
  Pending: ClockIcon,
  Processing: ClockIcon,
  Shipped: TruckIcon,
  Delivered: CheckCircleIcon,
  Cancelled: XCircleIcon,
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { selectedOrder, loading, error, fetchOrderById, updateOrderStatus } = useOrderStore();

  useEffect(() => {
    if (id && token) {
      fetchOrderById(Number(id), token);
    }
  }, [id, token]);

  const handleStatusChange = async (newStatus: string) => {
    if (selectedOrder) {
      await updateOrderStatus(selectedOrder.id, newStatus);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Order not found</div>
      </div>
    );
  }

  const StatusIcon = statusIcons[selectedOrder.status as keyof typeof statusIcons];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Order #{selectedOrder.id}
        </h1>
        <div className="flex items-center space-x-4">
          <span
            className={`px-3 py-1 inline-flex items-center text-sm font-semibold rounded-full ${
              statusColors[selectedOrder.status as keyof typeof statusColors]
            }`}
          >
            <StatusIcon className="h-4 w-4 mr-1" />
            {selectedOrder.status}
          </span>
          <select
            value={selectedOrder.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Customer ID</p>
              <p className="text-base font-medium text-gray-900">{selectedOrder.customerId}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="text-base font-medium text-gray-900">
                {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-base font-medium text-gray-900">
                ${selectedOrder.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedOrder.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={item.product.imageUrl}
                          alt={item.product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage; 