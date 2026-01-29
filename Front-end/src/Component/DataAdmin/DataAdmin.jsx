import { useEffect, useState } from "react";
import Sidebar from "../../component/SidebarAdmin/SidebarAdmin";
import LineChart from "../../component/LineChart/LineChart";
import Stat from "../../component/Stat/Stat";
import { axiosClient } from "../../api/axiosClient";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BarChartTopMovies from "../BarChartTopMovies/BarChartTopMovies";

const DataAdmin = () => {
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const { open } = useOutletContext();

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /* MODAL */
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboard();
    fetchOrders();
  }, []);

  const fetchDashboard = async () => {
    const res = await axiosClient.get("api/admin/dashboard");
    setData(res.data);
  };

  const fetchOrders = async () => {
    const res = await axiosClient.get("api/admin/orders");
    setOrders(res.data);
  };

  const openRefundModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const confirmRefund = async () => {
    try {
      setLoading(true);
      await axiosClient.post(`api/admin/refund/${selectedOrder.id}`);
      await fetchOrders();
      closeModal();
    } catch (err) {
      alert("❌ Hoàn tiền thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!data) return null;
  const chartData = [...data.revenueChart].reverse(); // đảo ngược dữ liệu lại do bên backend trả về DESC để dễ xem

  return (
    <main
      className={`flex-1 transition-all ${
        open ? "ml-64" : "ml-16"
      } p-6 space-y-6`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📊 Dashboard</h1>
      </div>
      {/* STAT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat
          title="Doanh thu hôm nay"
          value={data.revenueToday.toLocaleString("vi-VN") + "đ"}
        />
        <Stat title="Vé đã bán" value={data.totalTickets} />
        <Stat title="Lấp đầy ghế" value={data.fillRate + "%"} />
      </div>
      {/* CHART */}

      <LineChart chartData={chartData} />
      {/* TOP MOVIES */}
      <BarChartTopMovies data={data.topMovies} />
      {/* ORDER TABLE */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <h2 className="font-bold mb-4">📦 Giao dịch</h2>

        <div
          className={`overflow-y-auto ${
            orders.length > 10 ? "max-h-[420px]" : ""
          }`}
        >
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Tổng tiền</th>
                <th className="p-2 text-left">Trạng thái</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b">
                  <td className="p-2">{o.id}</td>

                  <td className="p-2">
                    {Number(o.totalAmount).toLocaleString("vi-VN")}đ
                  </td>

                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        o.status === "paid"
                          ? "bg-green-500"
                          : o.status === "refunded"
                            ? "bg-orange-500"
                            : "bg-gray-400"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td className="p-2 text-right">
                    {o.status === "cancelled" && (
                      <button
                        onClick={() => openRefundModal(o)}
                        className="bg-red-500 hover:bg-red-600 
                             text-white px-3 py-1 rounded"
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 
                       flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-[90%] 
                         max-w-md space-y-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-bold text-red-600">
                ⚠ Xác nhận hoàn tiền
              </h2>

              <p>
                Bạn chắc chắn muốn hoàn tiền cho đơn hàng:
                <b> #{selectedOrder?.id}</b> ?
              </p>

              <p className="text-sm text-gray-500">
                Số tiền:{" "}
                <b>
                  {Number(selectedOrder?.totalAmount).toLocaleString("vi-VN")}đ
                </b>
              </p>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded border"
                >
                  Hủy
                </button>

                <button
                  onClick={confirmRefund}
                  disabled={loading}
                  className="px-4 py-2 rounded 
                             bg-red-500 text-white 
                             hover:bg-red-600"
                >
                  {loading ? "Đang xử lý..." : "Xác nhận"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default DataAdmin;
