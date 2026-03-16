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
  // 1. HOOKS MUST BE AT THE TOP
  const [step, setStep] = useState("info");
  const [bvn, setBvn] = useState(""); // Changed from nin
  const [verifying, setVerifying] = useState(false);

  const paymentReference = useMemo(() => `REF_${Date.now()}`, [isOpen]);

  const config = useMemo(
    () => ({
      reference: paymentReference,
      email: userEmail,
      amount: 100000, // ₦1,000
      publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
      metadata: { userId, upgradeType: type },
    }),
    [paymentReference, userEmail, userId, type],
  );

  const initializePayment = usePaystackPayment(config);

  // 2. CONDITIONAL RETURN AFTER HOOKS
  if (!isOpen) return null;

  // 3. ACTION HANDLERS
  const handleNext = () => {
    if (type === "verified" && step === "info") {
      setStep("bvn"); // Changed from "nin"
    } else {
      // For "pro" or other types, go straight to the payment confirmation step
      setStep("pay");
    }
  };

  const handleBvnVerify = async () => {
    setVerifying(true);
    try {
      const res = await API.post("/payments/verify-bvn-only", { bvn });
      toast.success(res.data.msg);
      setStep("pay");
    } catch (error) {
      const status = error.response?.status;
      const errorMsg = error.response?.data?.msg || "";

      if (status === 503 || errorMsg.includes("service unavailable")) {
        toast.error(
          "National identity portal is currently down. Please try again in a few minutes.",
        );
      } else {
        toast.error(errorMsg || "Verification Failed");
      }
    } finally {
      setVerifying(false);
    }
  };

  // Explicitly defined success/close handlers to pass into the trigger
  const onSuccessAction = (ref) => {
    onClose();
    onSuccess(ref, bvn); // Changed from nin
  };

  const onCloseAction = () => {
    onClose();
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
                onClick={handleNext}
                className={`w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest transition hover:scale-[1.02] ${active.color}`}
              >
                Continue
              </button>
            </>
          )}

          {step === "bvn" && ( // Changed from "nin"
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase text-gray-400">
                Enter 11-digit BVN
              </label>
              <input
                type="text"
                maxLength="11"
                value={bvn}
                onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))} // Only allow numbers
                className="w-full p-4 border-2 border-gray-100 rounded-2xl font-bold tracking-[0.3em] text-center focus:border-green-500 outline-none transition"
                placeholder="00000000000"
              />
              <p className="text-[10px] text-gray-400 italic text-center">
                *Must exactly match: {userFirstName} {userLastName}
              </p>
              <p className="text-[10px] text-gray-400 italic text-center mt-1">
                Dial *565*0# to check your BVN
              </p>
              <button
                disabled={bvn.length < 11 || verifying}
                onClick={handleBvnVerify}
                className="w-full py-4 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest disabled:bg-gray-200"
              >
                {verifying ? "Checking Identity..." : "Verify Identity"}
              </button>
            </div>
          )}

          {step === "pay" && (
            <div className="text-center">
              <div className="mb-6 p-4 bg-green-50 rounded-2xl text-green-700 text-sm font-bold">
                {type === "verified"
                  ? "✓ Identity Confirmed"
                  : "Ready to Upgrade"}
              </div>
              <button
                onClick={() => {
                  initializePayment({
                    onSuccess: (response) => {
                      console.log("Paystack Success:", response);
                      onClose();
                      onSuccess(response, bvn); // Changed from nin
                    },
                    onClose: () => {
                      console.log("User closed the Paystack window");
                      onClose();
                    },
                  });
                }}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest animate-pulse"
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
