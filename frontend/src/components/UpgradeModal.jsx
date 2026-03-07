import React, { useState, useMemo } from "react";
import { usePaystackPayment } from "react-paystack";
import API from "../api/axios";
import toast from "react-hot-toast";

const UpgradeModal = ({
  isOpen,
  onClose,
  type,
  userEmail,
  onSuccess,
  userId,
  userFirstName,
  userLastName,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState("info");
  const [nin, setNin] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Paystack Configuration
  const config = useMemo(
    () => ({
      reference: `REF_${Math.floor(Math.random() * 1000000000)}`,
      email: userEmail,
      amount: 100000, // ₦1,000 in Kobo
      publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      metadata: {
        userId: userId,
        upgradeType: type,
      },
    }),
    [userEmail, type, userId],
  ); // Only changes if these specific values change

  const initializePayment = usePaystackPayment(config);
  const handlePayClick = () => {
    // Always use the defined Actions to keep it consistent
    initializePayment(onSuccessAction, onCloseAction);
  };

  // Step 2: Verify NIN with Backend BEFORE payment
  const handleNinVerify = async () => {
    setVerifying(true);
    try {
      // We hit a lightweight verification route first
      await API.post("/payments/verify-nin-only", { nin });
      toast.success("Identity Pre-verified! Proceed to payment.");
      setStep("pay");
    } catch (err) {
      toast.error(
        err.response?.data?.msg || "NIN verification failed. Name mismatch.",
      );
    } finally {
      setVerifying(false);
    }
  };

  const onSuccessAction = (reference) => {
    // We pass the reference AND the current nin state to your parent's handlePaymentSuccess
    console.log("PAYMENT SUCCESS SIGNAL RECEIVED!", reference);
    onSuccess(reference, nin);
  };

  // 2. Define the close handler
  const onCloseAction = () => {
    onClose();
  };

  // 3. Update your handleNext and Pay button logic
  const handleNext = () => {
    if (type === "verified" && step === "info") {
      setStep("nin");
    } else {
      // Correct way to call initializePayment
      initializePayment(onSuccessAction, onCloseAction);
    }
  };

  const content = {
    pro: {
      title: "Upgrade to Pro",
      price: "₦1,000",
      color: "bg-blue-600",
      benefits: ["30 Portfolio Slots", "Priority Search", "Pro Badge"],
    },
    verified: {
      title: "Get Verified",
      price: "₦1,000",
      color: "bg-green-600",
      benefits: ["Trust Badge", "Background Check Status", "Protection"],
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
          {step === "info" && (
            <>
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
                onClick={handlePayClick}
                className={`w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest transition hover:scale-[1.02] ${active.color}`}
              >
                Continue
              </button>
            </>
          )}

          {step === "nin" && (
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase text-gray-400">
                Enter 11-digit NIN
              </label>
              <input
                type="text"
                maxLength="11"
                value={nin}
                onChange={(e) => setNin(e.target.value)}
                className="w-full p-4 border-2 border-gray-100 rounded-2xl font-bold tracking-[0.3em] text-center focus:border-green-500 outline-none transition"
                placeholder="00000000000"
              />
              <p className="text-[10px] text-gray-400 italic text-center">
                *Must match: {userFirstName} {userLastName}
              </p>
              <p className="text-[10px] text-gray-400 italic text-center">
                WE DO NOT STORE YOUR NIN
              </p>
              <button
                disabled={nin.length < 11 || verifying}
                onClick={handleNinVerify}
                className="w-full py-4 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest disabled:bg-gray-200"
              >
                {verifying ? "Checking Identity..." : "Verify Identity"}
              </button>
            </div>
          )}

          {step === "pay" && (
            <div className="text-center">
              <div className="mb-6 p-4 bg-green-50 rounded-2xl text-green-700 text-sm font-bold">
                ✓ Identity Confirmed
              </div>
              <button
                onClick={() =>
                  initializePayment(onSuccessAction, onCloseAction)
                }
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest animate-bounce"
              >
                Pay {active.price} Now
              </button>
            </div>
          )}

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
