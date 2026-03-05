import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDriver } from '../services/api';
import { UserPlus, ArrowLeft, Truck, User, CheckCircle, AlertTriangle } from 'lucide-react';

const AddDriverPage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', vehicle_number: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.vehicle_number.trim()) {
            setError('Both fields are required.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await createDriver(form.name.trim(), form.vehicle_number.trim().toUpperCase());
            setSuccess(res.data);
            setForm({ name: '', vehicle_number: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <button onClick={() => navigate('/drivers')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 font-medium transition-colors">
                <ArrowLeft size={16} /> Back to Driver Roster
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <UserPlus className="text-blue-500" size={32} /> Register New Driver
                </h1>
                <p className="text-gray-400 mt-2">Add a new driver to the fleet. They will immediately be picked up by the simulation engine.</p>
            </div>

            {/* Success Banner */}
            {success && (
                <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-5 flex items-start gap-4">
                    <CheckCircle className="text-green-400 mt-0.5 shrink-0" size={22} />
                    <div>
                        <p className="text-green-400 font-bold">Driver registered successfully!</p>
                        <p className="text-gray-300 text-sm mt-1">
                            <span className="font-mono">{success.name}</span> · <span className="font-mono text-blue-300">{success.vehicle_number}</span> · ID #{success.id}
                        </p>
                        <button
                            onClick={() => navigate(`/drivers/${success.id}`)}
                            className="text-sm text-blue-400 mt-2 hover:underline"
                        >
                            View Driver Profile →
                        </button>
                    </div>
                </div>
            )}

            {/* Form Card */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-blue-500/10 to-transparent">
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Driver Information</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                            Full Name
                        </label>
                        <div className="relative">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                id="driver-name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. James Anderson"
                                className="w-full bg-gray-900 border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-white 
                                           placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 
                                           focus:ring-blue-500/50 transition"
                            />
                        </div>
                    </div>

                    {/* Vehicle Number Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                            Vehicle Number
                        </label>
                        <div className="relative">
                            <Truck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                id="vehicle-number"
                                type="text"
                                name="vehicle_number"
                                value={form.vehicle_number}
                                onChange={handleChange}
                                placeholder="e.g. TRK-104"
                                className="w-full bg-gray-900 border border-gray-600 rounded-xl pl-11 pr-4 py-3 
                                           text-white font-mono placeholder-gray-600 focus:outline-none 
                                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition"
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3 text-red-400 text-sm">
                            <AlertTriangle size={18} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        id="submit-driver"
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 
                                   disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors 
                                   flex items-center justify-center gap-2 text-base shadow-lg shadow-blue-500/20"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Registering...
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} />
                                Register Driver
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddDriverPage;
