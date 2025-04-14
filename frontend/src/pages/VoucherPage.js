import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {FaSave} from 'react-icons/fa'

const InventoryDeliveryVoucher = () => {
    const navigate = useNavigate();
    const [voucherDetails, setVoucherDetails] = useState({
        voucherNumber: "",
        dateOfDelivery: "",
        senderDetails: { name: "", mobileNumber: "", warehouse: "", location: "" },
        receiverDetails: { name: "", mobileNumber: "", warehouse: "", location: "" },
        goods: [{ productName: "", quantitySent: 0, boxNumber: "" }],
        remarks: ""
    });

    const [products, setProducts] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchVoucherNumberAndProducts = async () => {
            try {
                const productsResponse = await axios.get('https://ims-3cdk.onrender.com/vouchers/get-products');
                setProducts(productsResponse.data);

                const voucherResponse = await axios.get('https://ims-3cdk.onrender.com/vouchers/generate-voucher-number');
                const currentDate = new Date().toISOString(); // full ISO timestamp

                setVoucherDetails(prevState => ({
                    ...prevState,
                    voucherNumber: voucherResponse.data.voucherNumber,
                     dateOfDelivery: currentDate
                }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchVoucherNumberAndProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes("mobileNumber")) {
            if (!/^\d{0,10}$/.test(value)) return;
        }

        if (name === "remarks") {
            setVoucherDetails(prevState => ({ ...prevState, [name]: value }));
        } else if (name.includes(".")) {
            const [section, key] = name.split('.');
            setVoucherDetails(prevState => ({
                ...prevState,
                [section]: { ...prevState[section], [key]: value }
            }));
        }
    };

    const handleGoodsChange = (index, e) => {
        const { name, value } = e.target;
        const goods = [...voucherDetails.goods];
        goods[index][name] = value;
        setVoucherDetails(prevState => ({ ...prevState, goods }));
    };

    const addGoodsRow = () => {
        setVoucherDetails(prevState => ({
            ...prevState,
            goods: [...prevState.goods, { productName: "", quantitySent: 0, boxNumber: "" }]
        }));
    };

    const removeGoodsRow = (index) => {
        const goods = [...voucherDetails.goods];
        goods.splice(index, 1);
        setVoucherDetails(prevState => ({ ...prevState, goods }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const formattedVoucherDetails = {
                ...voucherDetails,
                dateOfDelivery: new Date().toISOString() // exact time on submission
            };

             await axios.post('https://ims-3cdk.onrender.com/vouchers/create-voucher', formattedVoucherDetails, {
                headers: { 'Content-Type': 'application/json' }
            });

            // console.log('Voucher created:', response.data);

            setVoucherDetails({
                voucherNumber: "",
                dateOfDelivery: new Date().toISOString(),
                senderDetails: { name: "", mobileNumber: "", warehouse: "", location: "" },
                receiverDetails: { name: "", mobileNumber: "", warehouse: "", location: "" },
                goods: [{ productName: "", quantitySent: 0, boxNumber: "" }],
                remarks: ""
            });

            navigate('/delivery-report');
        } catch (error) {
            console.error('Error saving voucher:', error);
            alert("There was an error while saving the voucher. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    

    return (
        <div className="flex flex-col p-6 space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-yellow-600 text-center">Delivery Voucher</h1>

            <form onSubmit={handleSubmit} className="bg-gray-200 p-6 rounded-lg shadow-md border space-y-6">
                {/* Voucher Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="font-semibold text-teal-700">Voucher Number :</label>
                        <input
                            type="text"
                            name="voucherNumber"
                            value={voucherDetails.voucherNumber}
                            readOnly
                            className="border w-full p-2 rounded-md bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="font-semibold text-teal-700">Date of Delivery :</label>
                        <input
                            type="text"
                            name="dateOfDelivery"
                            value={new Date(voucherDetails.dateOfDelivery).toLocaleString('en-GB')}
                            readOnly
                            className="border w-full p-2 rounded-md bg-gray-100"
                        />
                    </div>
                </div>

                {/* Sender Details */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-teal-700">Sender's Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input
                            type="text"
                            name="senderDetails.name"
                            value={voucherDetails.senderDetails.name}
                            onChange={handleChange}
                            placeholder="Sender's Name"
                            className="border w-full p-2 rounded-md"
                        />
                        <input
                            type="text"
                            name="senderDetails.mobileNumber"
                            value={voucherDetails.senderDetails.mobileNumber}
                            onChange={handleChange}
                            placeholder="Sender's Mobile"
                            className="border w-full p-2 rounded-md"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input
                            type="text"
                            name="senderDetails.warehouse"
                            value={voucherDetails.senderDetails.warehouse}
                            onChange={handleChange}
                            placeholder="Sender's Warehouse"
                            className="border w-full p-2 rounded-md"
                        />
                        <input
                            type="text"
                            name="senderDetails.location"
                            value={voucherDetails.senderDetails.location}
                            onChange={handleChange}
                            placeholder="Sender's Location"
                            className="border w-full p-2 rounded-md"
                        />
                    </div>
                </div>

                {/* Receiver Details */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-teal-700">Deliver's Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input
                            type="text"
                            name="receiverDetails.name"
                            value={voucherDetails.receiverDetails.name}
                            onChange={handleChange}
                            placeholder="Receiver's Name"
                            className="border w-full p-2 rounded-md"
                        />
                        <input
                            type="text"
                            name="receiverDetails.mobileNumber"
                            value={voucherDetails.receiverDetails.mobileNumber}
                            onChange={handleChange}
                            placeholder="Receiver's Mobile"
                            className="border w-full p-2 rounded-md"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input
                            type="text"
                            name="receiverDetails.warehouse"
                            value={voucherDetails.receiverDetails.warehouse}
                            onChange={handleChange}
                            placeholder="Receiver's Warehouse"
                            className="border w-full p-2 rounded-md"
                        />
                        <input
                            type="text"
                            name="receiverDetails.location"
                            value={voucherDetails.receiverDetails.location}
                            onChange={handleChange}
                            placeholder="Receiver's Location"
                            className="border w-full p-2 rounded-md"
                        />
                    </div>
                </div>

                {/* Goods Section */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-teal-700">Goods Details</h3>
                    {voucherDetails.goods.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <select
                                name="productName"
                                value={item.productName}
                                onChange={(e) => handleGoodsChange(index, e)}
                                className="border w-full p-2 rounded-md"
                            >
                                <option value="">Select Product</option>
                                {products.map(product => (
                                    <option key={product._id} value={product.name}>{product.name}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                name="quantitySent"
                                value={item.quantitySent}
                                onChange={(e) => handleGoodsChange(index, e)}
                                placeholder="Quantity Sent"
                                className="border w-full p-2 rounded-md"
                            />
                            <input
                                type="text"
                                name="boxNumber"
                                value={item.boxNumber}
                                onChange={(e) => handleGoodsChange(index, e)}
                                placeholder="Box Number"
                                className="border w-full p-2 rounded-md"
                            />
                            {voucherDetails.goods.length > 1 && (
                                <button type="button" onClick={() => removeGoodsRow(index)} className="text-red-600 mt-2">Remove</button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addGoodsRow} className="bg-green-600 text-white px-4 py-2 rounded">Add Goods</button>
                </div>

                {/* Remarks */}
                <div className="mt-4">
                    <label className="font-semibold text-teal-700">Remarks:</label>
                    <textarea
                        name="remarks"
                        value={voucherDetails.remarks}
                        onChange={handleChange}
                        className="border w-full p-2 rounded-md"
                        placeholder="Enter remarks..."
                    />
                </div>

                {/* Submit */}
                <div className="flex justify-end mt-6">
  <button
    type="submit"
    className="flex items-center gap-2 bg-blue-600 hover:bg-yellow-700 text-white font-medium px-5 py-2.5 rounded shadow transition duration-300 ease-in-out"
  >
    <FaSave className="text-lg" />
    Submit
  </button>
</div>

            </form>
        </div>
    );
};

export default InventoryDeliveryVoucher;
