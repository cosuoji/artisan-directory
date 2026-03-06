// components/UpgradeModal.jsx
import React from "react";
import { usePaystackPayment } from "react-paystack";

const UpgradeModal = ({
  isOpen,
  onClose,
  type,
  userEmail,
  onSuccess,
  userId,
}) => {
  if (!isOpen) return null;

  const config = {
    reference: new Date().getTime().toString(),
    email: userEmail,
    amount: type === "pro" ? 100000 : 100000,
    publicKey: "pk_test_76c26469b5e006e65b7204e66b95e4e283995656",
    // ADD THIS BLOCK:
    metadata: {
      userId: userId, // Pass the actual user ID here
      upgradeType: type, // 'pro' or 'verified'
    },
  };

  const initializePayment = usePaystackPayment(config);

  const content = {
    pro: {
      title: "Upgrade to Pro",
      price: "₦1,000 / month",
      benefits: [
        "Up to 30 Portfolio Slots",
        "Priority Search Placement",
        "Exclusive 'Pro' Badge",
        "Analytics on Profile Views",
      ],
      color: "bg-blue-600",
    },
    verified: {
      title: "Get Verified",
      price: "₦1,000 (One-time)",
      benefits: [
        "Trust Badge on Profile",
        "Higher Customer Conversion",
        "Background Check Status",
        "Protection from Fake Profiles",
      ],
      color: "bg-green-600",
    },
  };

  const active = content[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-popIn">
        <div className={`${active.color} p-8 text-white text-center`}>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            {active.title}
          </h2>
          <p className="text-4xl font-black mt-2">{active.price}</p>
        </div>

        <div className="p-8">
          <ul className="space-y-4 mb-8">
            {active.benefits.map((b, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-gray-600 font-medium"
              >
                <span className="text-green-500 font-bold">✓</span> {b}
              </li>
            ))}
          </ul>

          <button
            onClick={() => {
              initializePayment(onSuccess, onClose);
            }}
            className={`w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg transition hover:scale-[1.02] active:scale-95 ${active.color}`}
          >
            Pay Now
          </button>

          <button
            onClick={onClose}
            className="w-full mt-4 text-gray-400 text-xs font-bold uppercase hover:text-gray-600"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
