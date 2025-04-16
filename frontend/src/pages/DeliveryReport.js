import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Format date for displaying
const formatDate = (date) => {
    const newDate = new Date(date);
    const options = {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true,
    };
    return newDate.toLocaleString('en-GB', options);
};

const DeliveryReport = () => {
    const [vouchers, setVouchers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;  // Number of items per page

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axios.get('https://ims-3cdk.onrender.com/vouchers/get-vouchers');
                setVouchers(response.data);
            } catch (error) {
                toast.error('Failed to fetch vouchers.');
            } finally {
                setLoading(false);
            }
        };

        fetchVouchers();
    }, []);

    const handleDelete = async (voucherId) => {
        const confirm = window.confirm('Are you sure you want to delete this voucher?');
        if (!confirm) return;

        try {
            await axios.delete(`https://ims-3cdk.onrender.com/vouchers/delete-voucher/${voucherId}`);
            setVouchers(prev => prev.filter(v => v._id !== voucherId));
            toast.success('Voucher deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete voucher.');
        }
    };

    const handlePrintRow = (voucherId) => {
        const voucher = vouchers.find(v => v._id === voucherId);
        if (!voucher) return;

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.write('<html><head><title>Voucher Print</title>');
        printWindow.document.write(`
            <style>
                body { font-family: Arial; margin: 30px; color: #333; }
                .voucher-container { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
                .voucher-header { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
                .voucher-details p, .voucher-item p { margin: 5px 0; }
                .voucher-item { margin: 10px 0; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; }
                .signature-section { margin-top: 40px; display: flex; justify-content: space-between; }
                .footer { text-align: center; font-size: 12px; margin-top: 40px; }
                @media print { .no-print { display: none; } }
            </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write(`
            <div class="voucher-container">
                <div class="voucher-header">
                    <h1>Delivery Voucher</h1>
                    <p><strong>Voucher Number:</strong> ${voucher.voucherNumber}</p>
                    <p><strong>Date:</strong> ${formatDate(voucher.dateOfDelivery)}</p>
                </div>
                <div class="voucher-details">
                    <div class="voucher-item">
                        <p><strong>Sender:</strong> ${voucher.senderDetails.name} / ${voucher.senderDetails.mobileNumber}</p>
                        <p><strong>Warehouse:</strong> ${voucher.warehouse}</p>
                    </div>
                    <div class="voucher-item">
                        <p><strong>Delivered:</strong> ${voucher.receiverDetails.name} / ${voucher.receiverDetails.mobileNumber}</p>
                        <p><strong>Location:</strong> ${voucher.receiverDetails.location}</p>
                    </div>
                    <div class="voucher-item">
                        <p><strong>Product:</strong> ${voucher.goods[0].productName}</p>
                        <p><strong>Quantity / Box:</strong> ${voucher.goods[0].quantitySent} / ${voucher.goods[0].boxNumber}</p>
                    </div>
                </div>
                <div class="signature-section">
                    <div><p><strong>Signature:</strong></p><hr /></div>
                    <div><p><strong>Company Stamp:</strong></p><hr /></div>
                </div>
                <div class="footer">
                    <p>Thank you for doing business with us!</p>
                    <p class="no-print">This is an automated invoice generated by the system.</p>
                </div>
            </div>
        `);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    // Filter vouchers based on search term (product name or receiver name)
    const filteredVouchers = vouchers.filter((voucher) =>
        voucher.receiverDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.goods.some(item =>
            item.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Pagination logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedVouchers = filteredVouchers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);

    return (
        <div className="flex flex-col p-6 space-y-6">
            <ToastContainer position="top-center" />

            <h1 className="text-3xl font-bold text-teal-700">Delivery Report</h1>

            <input
                type="text"
                placeholder="Search by product or receiver name..."
                className="w-full max-w-md p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-teal-500"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to page 1 when search term changes
                }}
            />

            {loading ? (
                <div className="text-center text-gray-600">Loading...</div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse table-auto shadow-md text-sm">
                            <thead className="bg-teal-600 text-white">
                                <tr>
                                    <th className="border px-4 py-2 text-left">S/N</th>
                                    <th className="border px-4 py-2 text-left">Product Name</th>
                                    <th className="border px-4 py-2 text-left">Quantity / Box</th>
                                    <th className="border px-4 py-2 text-left">Delivered</th>
                                    <th className="border px-4 py-2 text-left">Location</th>
                                    <th className="border px-4 py-2 text-left">Date</th>
                                    <th className="border px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedVouchers.map((voucher, rowIndex) =>
                                    voucher.goods.map((item, index) => (
                                        <tr key={voucher._id + index} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                            <td className="border px-4 py-2">{index + 1}</td>
                                            <td className="border px-4 py-2 uppercase">{item.productName}</td>
                                            <td className="border px-4 py-2">{item.quantitySent} / {item.boxNumber}</td>
                                            <td className="border px-4 py-2 uppercase">{voucher.receiverDetails.name} / {voucher.receiverDetails.mobileNumber}</td>
                                            <td className="border px-4 py-2 uppercase">{voucher.receiverDetails.location}</td>
                                            <td className="border px-4 py-2">{formatDate(voucher.dateOfDelivery)}</td>
                                            <td className="border px-4 py-2">
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <button
                                                        onClick={() => handleDelete(voucher._id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1.5 px-3 rounded"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() => handlePrintRow(voucher._id)}
                                                        className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-1.5 px-3 rounded"
                                                    >
                                                        Print
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <span className="text-sm font-medium">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() =>
                                setCurrentPage(prev =>
                                    prev < totalPages ? prev + 1 : prev
                                )
                            }
                            disabled={currentPage >= totalPages}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default DeliveryReport;
